export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const LOCAL_API = 'http://127.0.0.1:8000'
const ALLOWED_EMAIL = 'f.yoneyone9@gmail.com'

// ─── ハードコードモデル一覧（Vercelはローカルファイルを読めないため）────
const CHECKPOINTS = [
  'novaAnime3dXL_v70.safetensors',
  'novaAnimeXL_ilV190.safetensors',
  'novaRealityXL_ilV90.safetensors',
  'ponyDiffusionV6XL_v6StartWithThisOne.safetensors',
  'sd_xl_base_1.0.safetensors',
]

const LORAS = [
  'last-000014.safetensors',
  'anmiXL_il_lokr_V53P1.safetensors',
  'eida-rossa-s1-illustriousxl-lora-nochekaiser.safetensors',
  'hinaPonyRealistic_v5-mbp-rev1.safetensors',
  'hinaTuningFaceDetailer_SDXL-v2-rank256-pruned.safetensors',
  'michikingXL_il_loha_V8340.safetensors',
  'undressing_Pony_v1.safetensors',
]

const TEMPLATES = {
  characters: [
    {
      name: 'maid_girl',
      aliases: ['maid', 'girl', 'メイド', '彼女', 'M'],
      outfits: [
        { name: 'maid', prompt: 'black and white maid outfit, frilled apron, lace cuffs' },
        { name: 'black_maid', prompt: 'black maid dress, white apron, lace cuffs' },
        { name: 'night_maid', prompt: 'elegant maid outfit, dark fabric, lace details' },
        { name: 'safety_shorts', prompt: 'modest safety shorts under skirt' },
      ],
    },
    {
      name: 'customer_boy',
      aliases: ['customer', 'boy', '客', '彼', 'C'],
      outfits: [
        { name: 'casual', prompt: 'casual shirt, relaxed expression' },
        { name: 'jacket', prompt: 'smart jacket, neat casual clothes' },
      ],
    },
    {
      name: 'catgirl',
      aliases: ['cat', '猫', 'N'],
      outfits: [
        { name: 'cat', prompt: 'cat ears, cute accessories, playful expression' },
        { name: 'dress', prompt: 'cute dress, cat accessories' },
      ],
    },
  ],
  expression: [
    { name: 'smile', text: 'big eyes, soft smile, cute blush' },
    { name: 'shy', text: 'big eyes, shy smile, cute blush' },
    { name: 'gentle', text: 'big eyes, gentle smile, bright expression' },
    { name: 'surprised', text: 'big eyes, surprised expression, slight blush' },
  ],
  pose: [
    { name: 'hands_together', text: 'slightly tilted head, hands together' },
    { name: 'look_viewer', text: 'looking at viewer, gentle pose' },
    { name: 'look_back', text: 'looking back over shoulder, slight hip tilt' },
    { name: 'sitting', text: 'sitting pose, knees together, hands on lap' },
  ],
  background: [
    { name: 'warm_room', text: 'soft lighting, warm room, cozy atmosphere' },
    { name: 'cafe', text: 'maid cafe interior, tea set, polished table' },
    { name: 'bedroom', text: 'bedroom interior, soft lamp light, warm shadows' },
    { name: 'window_night', text: 'night window, moonlight through curtains' },
  ],
}

// ─── 認証 ──────────────────────────────────────────────────────────────────
async function checkAuth() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ALLOWED_EMAIL) return null
  return user
}

// ─── ローカルAPI中継 ────────────────────────────────────────────────────────
async function proxyLocal(path: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${LOCAL_API}${path}`, {
      ...options,
      signal: AbortSignal.timeout(600_000),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    if (e?.name === 'TimeoutError' || e?.code === 'ECONNREFUSED' || e?.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'ローカルAPIサーバーに接続できません。api_server.py を起動してください。' },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// ─── GET ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action') || 'status'

  if (action === 'models') {
    return NextResponse.json({ checkpoints: CHECKPOINTS, loras: LORAS })
  }
  if (action === 'templates') {
    return NextResponse.json(TEMPLATES)
  }
  if (action === 'status') {
    return proxyLocal('/api/status')
  }
  if (action === 'pages') {
    return proxyLocal('/api/pages')
  }
  if (action === 'download') {
    const prefix = searchParams.get('prefix') || 'manga_preview'
    try {
      const res = await fetch(`${LOCAL_API}/api/download/pdf?prefix=${prefix}`, {
        signal: AbortSignal.timeout(30_000),
      })
      if (!res.ok) return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
      const blob = await res.blob()
      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${prefix}.pdf"`,
        },
      })
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 })
    }
  }
  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}

// ─── POST ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const action = body.action

  if (action === 'generate') {
    return proxyLocal('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        script: body.script,
        page_prefix: body.page_prefix || 'manga',
        panels_per_page: body.panels_per_page || 3,
        checkpoint: body.checkpoint,
        lora: body.lora,
        lora_strength: body.lora_strength ?? 1.0,
      }),
    })
  }
  if (action === 'update_prompt') {
    return proxyLocal('/api/pages/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_name: body.page_name,
        panel: body.panel,
        prompt: body.prompt,
        dialogue: body.dialogue,
      }),
    })
  }
  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
