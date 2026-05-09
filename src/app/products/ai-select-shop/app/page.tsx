'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Loader2, CheckCircle2, Zap, ShoppingCart,
  TrendingUp, Package, RefreshCw, ExternalLink, AlertCircle, Shuffle
} from 'lucide-react'

// ──────────────────────────────────────────────
// デザインスタイル定義（描画ロジック付き）
// ──────────────────────────────────────────────
type StyleDef = {
  id: string
  name: string
  draw: (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, text: string) => void
}

const STYLES: StyleDef[] = [
  {
    id: 'japanese',
    name: '⛩ 和風',
    draw: (ctx, cx, cy, r, text) => {
      // 赤丸＋白テキスト
      ctx.fillStyle = '#c0392b'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4
      ctx.beginPath(); ctx.arc(cx, cy, r - 6, 0, Math.PI * 2); ctx.stroke()
      ctx.font = `bold ${Math.floor(r * 0.45)}px serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'street',
    name: '🏙 ストリート',
    draw: (ctx, cx, cy, r, text) => {
      // 黒背景＋黄色テキスト＋斜め線
      ctx.fillStyle = '#111111'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.7, r * 2, r * 1.4); ctx.fill()
      ctx.strokeStyle = '#ffdd00'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.rect(cx - r + 4, cy - r * 0.7 + 4, r * 2 - 8, r * 1.4 - 8); ctx.stroke()
      ctx.font = `900 ${Math.floor(r * 0.48)}px Impact,sans-serif`
      ctx.fillStyle = '#ffdd00'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'retro',
    name: '📻 レトロ',
    draw: (ctx, cx, cy, r, text) => {
      // クリーム背景＋アーチ状テキスト風
      ctx.fillStyle = '#f5e6c8'
      ctx.beginPath()
      ctx.roundRect(cx - r, cy - r * 0.8, r * 2, r * 1.6, 16)
      ctx.fill()
      ctx.strokeStyle = '#5c3d1e'; ctx.lineWidth = 5
      ctx.beginPath()
      ctx.roundRect(cx - r + 5, cy - r * 0.8 + 5, r * 2 - 10, r * 1.6 - 10, 12)
      ctx.stroke()
      // 飾り線
      ctx.strokeStyle = '#5c3d1e'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx - r * 0.7, cy + r * 0.3); ctx.lineTo(cx + r * 0.7, cy + r * 0.3); ctx.stroke()
      ctx.font = `bold ${Math.floor(r * 0.42)}px Georgia,serif`
      ctx.fillStyle = '#5c3d1e'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy - r * 0.05)
      ctx.font = `${Math.floor(r * 0.18)}px Georgia,serif`
      ctx.fillStyle = '#a0785a'
      ctx.fillText('VINTAGE COLLECTION', cx, cy + r * 0.5)
    },
  },
  {
    id: 'cyberpunk',
    name: '🌃 サイバー',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#000020'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.75, r * 2, r * 1.5); ctx.fill()
      // グリッド線
      ctx.strokeStyle = 'rgba(0,255,255,0.15)'; ctx.lineWidth = 1
      for (let i = -r; i <= r; i += 20) {
        ctx.beginPath(); ctx.moveTo(cx + i, cy - r * 0.75); ctx.lineTo(cx + i, cy + r * 0.75); ctx.stroke()
      }
      // メインテキスト
      ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 12
      ctx.font = `bold ${Math.floor(r * 0.44)}px monospace`
      ctx.fillStyle = '#00ffff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
      ctx.shadowBlur = 0
      // アンダーライン
      ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx - r * 0.6, cy + r * 0.38); ctx.lineTo(cx + r * 0.6, cy + r * 0.38); ctx.stroke()
    },
  },
  {
    id: 'kawaii',
    name: '🎀 かわいい',
    draw: (ctx, cx, cy, r, text) => {
      // パステルピンク背景
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, '#ffe4f0'); grad.addColorStop(1, '#ffb7c5')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 星の装飾
      ctx.fillStyle = '#ff69b4'
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
        const sx = cx + Math.cos(angle) * r * 0.78
        const sy = cy + Math.sin(angle) * r * 0.78
        ctx.font = `${Math.floor(r * 0.18)}px sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText('★', sx, sy)
      }
      ctx.font = `bold ${Math.floor(r * 0.42)}px "Noto Sans JP",sans-serif`
      ctx.fillStyle = '#c2185b'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'minimal',
    name: '⬜ ミニマル',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#fafafa'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.6, r * 2, r * 1.2); ctx.fill()
      ctx.font = `300 ${Math.floor(r * 0.4)}px Helvetica,sans-serif`
      ctx.fillStyle = '#111111'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
      ctx.strokeStyle = '#111111'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(cx - r * 0.4, cy + r * 0.35); ctx.lineTo(cx + r * 0.4, cy + r * 0.35); ctx.stroke()
    },
  },
  {
    id: 'gold',
    name: '💎 ラグジュアリー',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#0a0a00'
      ctx.beginPath()
      ctx.roundRect(cx - r, cy - r * 0.75, r * 2, r * 1.5, 8)
      ctx.fill()
      // ゴールドボーダー
      const borderGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy)
      borderGrad.addColorStop(0, '#b8960c'); borderGrad.addColorStop(0.5, '#ffe566'); borderGrad.addColorStop(1, '#b8960c')
      ctx.strokeStyle = borderGrad; ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(cx - r + 4, cy - r * 0.75 + 4, r * 2 - 8, r * 1.5 - 8, 6)
      ctx.stroke()
      // テキスト
      const textGrad = ctx.createLinearGradient(cx, cy - r * 0.3, cx, cy + r * 0.3)
      textGrad.addColorStop(0, '#ffe566'); textGrad.addColorStop(1, '#d4af37')
      ctx.font = `bold ${Math.floor(r * 0.42)}px Georgia,serif`
      ctx.fillStyle = textGrad
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'neon',
    name: '💡 ネオン',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#000000'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.7, r * 2, r * 1.4); ctx.fill()
      // ネオングロウ
      ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 20
      ctx.strokeStyle = '#39ff14'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.rect(cx - r + 6, cy - r * 0.7 + 6, r * 2 - 12, r * 1.4 - 12); ctx.stroke()
      ctx.font = `bold ${Math.floor(r * 0.44)}px monospace`
      ctx.fillStyle = '#39ff14'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
      ctx.shadowBlur = 0
    },
  },
  {
    id: 'nature',
    name: '🌿 ボタニカル',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#f1f8f1'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.arc(cx, cy, r - 5, 0, Math.PI * 2); ctx.stroke()
      // 葉っぱ装飾
      ctx.font = `${Math.floor(r * 0.22)}px sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('🌿', cx - r * 0.58, cy - r * 0.58)
      ctx.fillText('🌿', cx + r * 0.58, cy + r * 0.58)
      ctx.font = `bold ${Math.floor(r * 0.4)}px Georgia,serif`
      ctx.fillStyle = '#1a6b3a'
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'gradient',
    name: '🌈 グラデーション',
    draw: (ctx, cx, cy, r, text) => {
      const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
      grad.addColorStop(0, '#6366f1'); grad.addColorStop(0.5, '#a855f7'); grad.addColorStop(1, '#ec4899')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      ctx.shadowColor = 'rgba(168,85,247,0.6)'; ctx.shadowBlur = 16
      ctx.font = `700 ${Math.floor(r * 0.42)}px sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
      ctx.shadowBlur = 0
    },
  },
  {
    id: 'wave',
    name: '🌊 波・和柄',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#1a4a8a'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 波紋
      ctx.strokeStyle = 'rgba(126,200,227,0.4)'; ctx.lineWidth = 2
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.3 * i, 0, Math.PI * 2); ctx.stroke()
      }
      ctx.font = `bold ${Math.floor(r * 0.42)}px serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'popart',
    name: '🎨 ポップアート',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#ffff00'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.75, r * 2, r * 1.5); ctx.fill()
      // ドット
      ctx.fillStyle = 'rgba(233,30,99,0.15)'
      for (let x = cx - r; x <= cx + r; x += 18) {
        for (let y = cy - r * 0.75; y <= cy + r * 0.75; y += 18) {
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill()
        }
      }
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 4
      ctx.beginPath(); ctx.rect(cx - r + 4, cy - r * 0.75 + 4, r * 2 - 8, r * 1.5 - 8); ctx.stroke()
      ctx.font = `900 ${Math.floor(r * 0.46)}px Impact,sans-serif`
      ctx.fillStyle = '#e91e63'
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 3
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.strokeText(text, cx, cy)
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'anime',
    name: '🌸 アニメ',
    draw: (ctx, cx, cy, r, text) => {
      const grad = ctx.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r)
      grad.addColorStop(0, '#1a1a4e'); grad.addColorStop(1, '#0d0d2b')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 桜
      ctx.font = `${Math.floor(r * 0.18)}px sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ;[[-0.65, -0.55], [0.65, -0.55], [-0.65, 0.55], [0.65, 0.55]].forEach(([dx, dy]) => {
        ctx.fillText('🌸', cx + dx * r, cy + dy * r)
      })
      ctx.shadowColor = '#ff6ec7'; ctx.shadowBlur = 10
      ctx.font = `bold ${Math.floor(r * 0.42)}px "Noto Sans JP",sans-serif`
      ctx.fillStyle = '#ff6ec7'
      ctx.fillText(text, cx, cy)
      ctx.shadowBlur = 0
    },
  },
  {
    id: 'vintage',
    name: '🗿 ヴィンテージ',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#e8d5a3'
      ctx.beginPath()
      ctx.roundRect(cx - r, cy - r * 0.8, r * 2, r * 1.6, 20)
      ctx.fill()
      // エイジング効果
      ctx.fillStyle = 'rgba(92,61,30,0.08)'
      ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.6, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#5c3d1e'; ctx.lineWidth = 4
      ctx.beginPath()
      ctx.roundRect(cx - r + 6, cy - r * 0.8 + 6, r * 2 - 12, r * 1.6 - 12, 16)
      ctx.stroke()
      ctx.strokeStyle = '#5c3d1e'; ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(cx - r + 14, cy - r * 0.8 + 14, r * 2 - 28, r * 1.6 - 28, 12)
      ctx.stroke()
      ctx.font = `bold ${Math.floor(r * 0.4)}px Georgia,serif`
      ctx.fillStyle = '#3d2610'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy - r * 0.08)
      ctx.font = `italic ${Math.floor(r * 0.16)}px Georgia,serif`
      ctx.fillStyle = '#7a5230'
      ctx.fillText('EST. 2026', cx, cy + r * 0.5)
    },
  },
  {
    id: 'typo',
    name: '🔤 タイポ',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#ffffff'
      ctx.beginPath(); ctx.rect(cx - r, cy - r, r * 2, r * 2); ctx.fill()
      // 大きく背景テキスト
      ctx.font = `900 ${Math.floor(r * 1.2)}px Helvetica,sans-serif`
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text.charAt(0), cx, cy)
      // メインテキスト
      ctx.font = `900 ${Math.floor(r * 0.46)}px Helvetica,sans-serif`
      ctx.fillStyle = '#000000'
      ctx.fillText(text, cx, cy)
      ctx.strokeStyle = '#ff3300'; ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.7, cy + r * 0.38)
      ctx.lineTo(cx + r * 0.7, cy + r * 0.38)
      ctx.stroke()
    },
  },
  {
    id: 'monochrome',
    name: '🖤 モノクロ',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.arc(cx, cy, r - 8, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = '#888888'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(cx, cy, r - 14, 0, Math.PI * 2); ctx.stroke()
      ctx.font = `300 ${Math.floor(r * 0.4)}px Helvetica,sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
    },
  },
  // ────────────────── 新規追加スタイル ──────────────────
  {
    id: 'motivational',
    name: '💪 モチベ',
    draw: (ctx, cx, cy, r, text) => {
      // 黒地＋太い赤ライン＋英語風インパクト
      ctx.fillStyle = '#0a0a0a'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.85, r * 2, r * 1.7); ctx.fill()
      // 赤の斜めストライプ背景
      ctx.save()
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.85, r * 2, r * 1.7); ctx.clip()
      ctx.strokeStyle = 'rgba(239,68,68,0.15)'; ctx.lineWidth = 12
      for (let i = -r * 2; i <= r * 2; i += 28) {
        ctx.beginPath(); ctx.moveTo(cx + i - r * 0.85, cy - r * 0.85); ctx.lineTo(cx + i + r * 0.85, cy + r * 0.85); ctx.stroke()
      }
      ctx.restore()
      // 上部赤帯
      ctx.fillStyle = '#ef4444'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.85, r * 2, r * 0.28); ctx.fill()
      ctx.font = `900 ${Math.floor(r * 0.5)}px Impact,sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.strokeText(text, cx, cy + r * 0.1)
      ctx.fillText(text, cx, cy + r * 0.1)
      ctx.font = `700 ${Math.floor(r * 0.16)}px Helvetica,sans-serif`
      ctx.fillStyle = '#ef4444'
      ctx.fillText('NEVER GIVE UP', cx, cy + r * 0.62)
    },
  },
  {
    id: 'aesthetic',
    name: '🌙 エモ系',
    draw: (ctx, cx, cy, r, text) => {
      // 夜空グラデ＋月＋星
      const grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r)
      grad.addColorStop(0, '#0f0c29'); grad.addColorStop(0.5, '#302b63'); grad.addColorStop(1, '#24243e')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 星
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      const stars = [[0.3, -0.6], [-0.55, -0.3], [0.6, 0.1], [-0.2, 0.7], [0.5, 0.65], [-0.6, 0.5]]
      stars.forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.arc(cx + dx * r, cy + dy * r, 1.5, 0, Math.PI * 2); ctx.fill()
      })
      // 月
      ctx.fillStyle = '#fffde7'
      ctx.beginPath(); ctx.arc(cx + r * 0.45, cy - r * 0.45, r * 0.2, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#302b63'
      ctx.beginPath(); ctx.arc(cx + r * 0.55, cy - r * 0.5, r * 0.16, 0, Math.PI * 2); ctx.fill()
      // テキスト
      ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 10
      ctx.font = `600 ${Math.floor(r * 0.38)}px "Noto Sans JP",sans-serif`
      ctx.fillStyle = '#e9d5ff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy + r * 0.1)
      ctx.shadowBlur = 0
    },
  },
  {
    id: 'surf',
    name: '🏄 サーフ',
    draw: (ctx, cx, cy, r, text) => {
      // 明るいオレンジ×ターコイズ
      const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
      grad.addColorStop(0, '#0891b2'); grad.addColorStop(1, '#0e7490')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.roundRect(cx - r, cy - r * 0.8, r * 2, r * 1.6, 20); ctx.fill()
      // 波形装飾
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3
      ctx.beginPath()
      for (let x = cx - r; x <= cx + r; x += 8) {
        const y = cy + r * 0.55 + Math.sin((x - cx) * 0.08) * 8
        x === cx - r ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      // 太陽
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath(); ctx.arc(cx + r * 0.6, cy - r * 0.5, r * 0.18, 0, Math.PI * 2); ctx.fill()
      ctx.font = `900 ${Math.floor(r * 0.45)}px Impact,sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
      ctx.font = `600 ${Math.floor(r * 0.15)}px Helvetica,sans-serif`
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillText('SURF VIBES', cx, cy + r * 0.5)
    },
  },
  {
    id: 'dragonball',
    name: '⚡ バトル',
    draw: (ctx, cx, cy, r, text) => {
      // 爆発的なオーラ
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, '#fef08a'); grad.addColorStop(0.4, '#f59e0b'); grad.addColorStop(1, '#92400e')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 放射線
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(angle) * r * 0.5, cy + Math.sin(angle) * r * 0.5)
        ctx.lineTo(cx + Math.cos(angle) * r * 0.95, cy + Math.sin(angle) * r * 0.95)
        ctx.stroke()
      }
      ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 15
      ctx.font = `900 ${Math.floor(r * 0.46)}px Impact,sans-serif`
      ctx.fillStyle = '#1a1a1a'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx + 2, cy + 2)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(text, cx, cy)
      ctx.shadowBlur = 0
    },
  },
  {
    id: 'nature2',
    name: '🍃 山・自然',
    draw: (ctx, cx, cy, r, text) => {
      // 山の稜線シルエット
      const skyGrad = ctx.createLinearGradient(cx, cy - r, cx, cy + r)
      skyGrad.addColorStop(0, '#1e3a5f'); skyGrad.addColorStop(0.6, '#3b6aa0'); skyGrad.addColorStop(1, '#1a3a2a')
      ctx.fillStyle = skyGrad
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 山
      ctx.fillStyle = '#1a3a2a'
      ctx.beginPath()
      ctx.moveTo(cx - r, cy + r * 0.5)
      ctx.lineTo(cx - r * 0.3, cy - r * 0.2)
      ctx.lineTo(cx + r * 0.3, cy + r * 0.1)
      ctx.lineTo(cx + r, cy + r * 0.5)
      ctx.closePath(); ctx.fill()
      // 雪山
      ctx.fillStyle = '#e2e8f0'
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.3, cy - r * 0.2)
      ctx.lineTo(cx - r * 0.18, cy - r * 0.42)
      ctx.lineTo(cx - r * 0.06, cy - r * 0.2)
      ctx.closePath(); ctx.fill()
      ctx.font = `bold ${Math.floor(r * 0.38)}px "Noto Sans JP",serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy + r * 0.7)
    },
  },
  {
    id: 'cats',
    name: '🐱 猫・動物',
    draw: (ctx, cx, cy, r, text) => {
      // パステルベージュ
      ctx.fillStyle = '#fef3c7'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 猫顔シルエット
      ctx.fillStyle = '#f59e0b'
      // 顔
      ctx.beginPath(); ctx.arc(cx, cy - r * 0.1, r * 0.38, 0, Math.PI * 2); ctx.fill()
      // 耳
      ctx.beginPath(); ctx.moveTo(cx - r * 0.28, cy - r * 0.38); ctx.lineTo(cx - r * 0.42, cy - r * 0.62); ctx.lineTo(cx - r * 0.12, cy - r * 0.38); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(cx + r * 0.28, cy - r * 0.38); ctx.lineTo(cx + r * 0.42, cy - r * 0.62); ctx.lineTo(cx + r * 0.12, cy - r * 0.38); ctx.closePath(); ctx.fill()
      // 目
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath(); ctx.arc(cx - r * 0.14, cy - r * 0.14, r * 0.055, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx + r * 0.14, cy - r * 0.14, r * 0.055, 0, Math.PI * 2); ctx.fill()
      // テキスト
      ctx.font = `bold ${Math.floor(r * 0.35)}px "Noto Sans JP",sans-serif`
      ctx.fillStyle = '#92400e'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy + r * 0.6)
    },
  },
  {
    id: 'oldmoney',
    name: '🎩 オールドマネー',
    draw: (ctx, cx, cy, r, text) => {
      // クリーム×ダークグリーン（preppy）
      ctx.fillStyle = '#f8f4e8'
      ctx.beginPath(); ctx.roundRect(cx - r, cy - r * 0.8, r * 2, r * 1.6, 8); ctx.fill()
      // ダークグリーンのボーダー
      ctx.strokeStyle = '#1a3d2b'; ctx.lineWidth = 5
      ctx.beginPath(); ctx.roundRect(cx - r + 5, cy - r * 0.8 + 5, r * 2 - 10, r * 1.6 - 10, 5); ctx.stroke()
      ctx.strokeStyle = '#1a3d2b'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.roundRect(cx - r + 10, cy - r * 0.8 + 10, r * 2 - 20, r * 1.6 - 20, 4); ctx.stroke()
      // クレスト風装飾
      ctx.font = `${Math.floor(r * 0.18)}px serif`
      ctx.fillStyle = '#1a3d2b'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('✦', cx - r * 0.5, cy - r * 0.5)
      ctx.fillText('✦', cx + r * 0.5, cy - r * 0.5)
      ctx.font = `600 ${Math.floor(r * 0.4)}px Georgia,serif`
      ctx.fillStyle = '#1a3d2b'
      ctx.fillText(text, cx, cy)
      ctx.font = `italic ${Math.floor(r * 0.15)}px Georgia,serif`
      ctx.fillStyle = '#4a7c59'
      ctx.fillText('EST. MCMXXI', cx, cy + r * 0.52)
    },
  },
  {
    id: 'skateboard',
    name: '🛹 スケート',
    draw: (ctx, cx, cy, r, text) => {
      // 白地＋カラフルなクラックパターン
      ctx.fillStyle = '#f8fafc'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.8, r * 2, r * 1.6); ctx.fill()
      // カラフルな縦線
      const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
      colors.forEach((c, i) => {
        ctx.strokeStyle = c; ctx.lineWidth = 5
        const x = cx - r * 0.6 + (i * r * 0.3)
        ctx.beginPath(); ctx.moveTo(x, cy - r * 0.8); ctx.lineTo(x + r * 0.1, cy + r * 0.8); ctx.stroke()
      })
      ctx.font = `900 ${Math.floor(r * 0.46)}px Impact,sans-serif`
      ctx.fillStyle = '#0f172a'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
      ctx.font = `700 ${Math.floor(r * 0.15)}px Helvetica,sans-serif`
      ctx.fillStyle = '#64748b'
      ctx.fillText('SKATE • GRIND • REPEAT', cx, cy + r * 0.55)
    },
  },
  {
    id: 'abstract2',
    name: '🔷 幾何学',
    draw: (ctx, cx, cy, r, text) => {
      ctx.fillStyle = '#1e1b4b'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 幾何学図形
      const shapes = [
        { x: -0.5, y: -0.4, size: 0.22, color: '#6366f1', rotate: 45 },
        { x: 0.4,  y: -0.3, size: 0.18, color: '#a855f7', rotate: 30 },
        { x: -0.3, y: 0.4,  size: 0.2,  color: '#ec4899', rotate: 60 },
        { x: 0.5,  y: 0.35, size: 0.15, color: '#8b5cf6', rotate: 15 },
      ]
      shapes.forEach(s => {
        ctx.save()
        ctx.translate(cx + s.x * r, cy + s.y * r)
        ctx.rotate((s.rotate * Math.PI) / 180)
        ctx.strokeStyle = s.color; ctx.lineWidth = 2.5
        ctx.globalAlpha = 0.7
        ctx.beginPath(); ctx.rect(-s.size * r, -s.size * r, s.size * r * 2, s.size * r * 2); ctx.stroke()
        ctx.restore()
      })
      ctx.globalAlpha = 1
      ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 8
      ctx.font = `700 ${Math.floor(r * 0.4)}px sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
      ctx.shadowBlur = 0
    },
  },
  {
    id: 'y2k',
    name: '💿 Y2K',
    draw: (ctx, cx, cy, r, text) => {
      // シルバー×ホログラム風
      const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
      grad.addColorStop(0, '#c0c0c0'); grad.addColorStop(0.25, '#e8e8ff'); grad.addColorStop(0.5, '#ffc0cb'); grad.addColorStop(0.75, '#c0ffee'); grad.addColorStop(1, '#c0c0c0')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // CD反射風
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.2 * i, 0, Math.PI * 2); ctx.stroke()
      }
      ctx.fillStyle = '#f8f8ff'
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.1, 0, Math.PI * 2); ctx.fill()
      ctx.font = `900 ${Math.floor(r * 0.38)}px Impact,sans-serif`
      ctx.fillStyle = '#1a1a2e'
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.strokeText(text, cx, cy)
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'zen',
    name: '☯ 禅・墨',
    draw: (ctx, cx, cy, r, text) => {
      // 白地＋墨絵風
      ctx.fillStyle = '#fafaf7'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      // 墨の円
      ctx.strokeStyle = 'rgba(20,20,20,0.8)'; ctx.lineWidth = 3
      ctx.setLineDash([8, 4])
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2); ctx.stroke()
      ctx.setLineDash([])
      // 薄い墨しみ
      ctx.fillStyle = 'rgba(20,20,20,0.06)'
      ctx.beginPath(); ctx.arc(cx - r * 0.2, cy + r * 0.1, r * 0.5, 0, Math.PI * 2); ctx.fill()
      ctx.font = `bold ${Math.floor(r * 0.5)}px serif`
      ctx.fillStyle = 'rgba(20,20,20,0.88)'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx + r * 0.04, cy + r * 0.04)
      ctx.fillStyle = 'rgba(20,20,20,0.12)'
      ctx.fillText(text, cx, cy)
    },
  },
  {
    id: 'toxic',
    name: '☣ ストリート系',
    draw: (ctx, cx, cy, r, text) => {
      // ハーフトーン＋酸＋グリーン
      ctx.fillStyle = '#0a1a0a'
      ctx.beginPath(); ctx.rect(cx - r, cy - r * 0.8, r * 2, r * 1.6); ctx.fill()
      // グリーングロウ
      ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 20
      ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.rect(cx - r + 5, cy - r * 0.8 + 5, r * 2 - 10, r * 1.6 - 10); ctx.stroke()
      // ドット
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(74,222,128,0.1)'
      for (let x = cx - r; x <= cx + r; x += 16) {
        for (let y = cy - r * 0.8; y <= cy + r * 0.8; y += 16) {
          ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill()
        }
      }
      ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 12
      ctx.font = `900 ${Math.floor(r * 0.46)}px monospace`
      ctx.fillStyle = '#4ade80'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, cy)
      ctx.shadowBlur = 0
    },
  },
]

// ──────────────────────────────────────────────
// Tシャツカラー
// ──────────────────────────────────────────────
const TSHIRT_COLORS = [
  { id: 'white',  name: '白',      hex: '#FFFFFF' },
  { id: 'black',  name: '黒',      hex: '#1a1a1a' },
  { id: 'navy',   name: '紺',      hex: '#1e3a5f' },
  { id: 'gray',   name: 'グレー', hex: '#808080' },
  { id: 'red',    name: 'レッド', hex: '#e74c3c' },
  { id: 'beige',  name: 'ベージュ', hex: '#f5e6c8' },
  { id: 'green',  name: 'グリーン', hex: '#2d6a4f' },
  { id: 'purple', name: 'パープル', hex: '#6b21a8' },
  { id: 'pink',   name: 'ピンク', hex: '#f472b6' },
  { id: 'orange', name: 'オレンジ', hex: '#ea580c' },
]

// ──────────────────────────────────────────────
// サイズ定義
// ──────────────────────────────────────────────
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']

// ──────────────────────────────────────────────
// フォールバックトレンド
// ──────────────────────────────────────────────
const FALLBACK_TRENDS = [
  'AI活用術', '副業・在宅ワーク', '節約・投資',
  'ChatGPT最新', '動画制作', '健康・ダイエット',
  '転職・キャリア', 'ガジェット', 'SNSマーケ'
]

// ──────────────────────────────────────────────
// Tシャツ輪郭描画
// ──────────────────────────────────────────────
function drawTshirtShape(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.beginPath()
  ctx.moveTo(w * 0.20, h * 0.08)
  ctx.lineTo(w * 0.35, h * 0.04)
  ctx.quadraticCurveTo(w * 0.50, h * 0.14, w * 0.65, h * 0.04)
  ctx.lineTo(w * 0.80, h * 0.08)
  ctx.lineTo(w * 0.97, h * 0.28)
  ctx.lineTo(w * 0.80, h * 0.34)
  ctx.lineTo(w * 0.80, h * 0.93)
  ctx.lineTo(w * 0.20, h * 0.93)
  ctx.lineTo(w * 0.20, h * 0.34)
  ctx.lineTo(w * 0.03, h * 0.28)
  ctx.closePath()
}

// ──────────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────────
const AISelectShopApp = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([])
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [styleId, setStyleId] = useState('japanese')
  const [tshirtColorId, setTshirtColorId] = useState('black')
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL'])
  const [mockupDataUrl, setMockupDataUrl] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ url?: string; error?: string } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ── トレンド取得 ──
  const fetchTrends = async () => {
    setIsLoadingTrends(true)
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' })
      const d = await r.json()
      if (d.trends && d.trends.length > 0) {
        const fetched: string[] = d.trends.slice(0, 9)
        const padded = fetched.length >= 9
          ? fetched
          : [...fetched, ...FALLBACK_TRENDS.filter(f => !fetched.includes(f))].slice(0, 9)
        setTrends(padded.map((t, i) => ({ id: i, name: t })))
        setIsLive(d.isLive === true)
      } else throw new Error('empty')
    } catch {
      setTrends(FALLBACK_TRENDS.map((t, i) => ({ id: i, name: t })))
      setIsLive(false)
    } finally {
      setIsLoadingTrends(false)
    }
  }

  useEffect(() => { fetchTrends() }, [])

  // ── ランダム生成 ──
  const handleRandom = () => {
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)]
    const randomColor = TSHIRT_COLORS[Math.floor(Math.random() * TSHIRT_COLORS.length)]
    setStyleId(randomStyle.id)
    setTshirtColorId(randomColor.id)
  }

  // ── サイズ選択トグル ──
  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.length > 1 ? prev.filter(s => s !== size) : prev
        : [...prev, size]
    )
  }

  // ── Canvas描画 ──
  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !keyword) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height
    const S = STYLES.find(s => s.id === styleId) || STYLES[0]
    const TC = TSHIRT_COLORS.find(c => c.id === tshirtColorId) || TSHIRT_COLORS[1]

    // ① 全クリア
    ctx.clearRect(0, 0, w, h)

    // ② 背景（チェッカーボード風 = 透明感を示す）
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, w, h)

    // ③ Tシャツ影（別レイヤーで描く）
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 8
    drawTshirtShape(ctx, w, h)
    ctx.fillStyle = TC.hex
    ctx.fill()
    ctx.restore()

    // ④ Tシャツ本体（影なし）
    ctx.save()
    drawTshirtShape(ctx, w, h)
    ctx.fillStyle = TC.hex
    ctx.fill()
    // 光沢グラデ
    const shineGrad = ctx.createLinearGradient(w * 0.15, h * 0.05, w * 0.85, h * 0.95)
    shineGrad.addColorStop(0,   'rgba(255,255,255,0.18)')
    shineGrad.addColorStop(0.3, 'rgba(255,255,255,0.06)')
    shineGrad.addColorStop(1,   'rgba(0,0,0,0.10)')
    ctx.fillStyle = shineGrad
    ctx.fill()
    ctx.restore()

    // ⑤ デザイン印刷エリア（クリップして胸部中央に配置）
    ctx.save()
    // 印刷エリアをクリップ（胸の中央 = Tシャツ内側の矩形）
    const px = w * 0.27, py = h * 0.32
    const pw = w * 0.46, ph = h * 0.38
    ctx.beginPath()
    ctx.roundRect(px, py, pw, ph, 8)
    ctx.clip()

    const cx = px + pw / 2
    const cy = py + ph / 2
    const r  = Math.min(pw, ph) * 0.46   // 印刷エリアの46%を半径に

    const shortText = keyword.length > 6 ? keyword.slice(0, 6) + '…' : keyword
    S.draw(ctx, cx, cy, r, shortText)
    ctx.restore()

    // ⑥ 印刷エリアの枠線（薄く）
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.roundRect(px, py, pw, ph, 8)
    ctx.stroke()
    ctx.restore()

    setMockupDataUrl(canvas.toDataURL('image/png'))
  }, [keyword, styleId, tshirtColorId])

  useEffect(() => { if (keyword) drawDesign() }, [keyword, styleId, tshirtColorId, drawDesign])

  // ── 出品処理 ──
  const handlePublish = async () => {
    if (!keyword || !mockupDataUrl) return
    setIsPublishing(true)
    setPublishResult(null)
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-product',
          keyword,
          style: styleId,
          mockupUrl: mockupDataUrl,
          tshirtColor: tshirtColorId,
          sizes: selectedSizes,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setPublishResult({ error: data.error })
      } else {
        setPublishResult({ url: data.url || data.shopifyUrl || '#' })
        setStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (e: any) {
      setPublishResult({ error: e.message || '出品に失敗しました' })
    } finally {
      setIsPublishing(false)
    }
  }

  // ──────────────────────────────────────────────
  // UI
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100" style={{ fontFamily: "'Inter','Noto Sans JP',sans-serif" }}>
      <div className="h-1 bg-emerald-500 w-full" />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        {/* ヘッダー */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 tracking-wide">
              {isLive ? 'LIVE TREND DATA' : 'CACHED DATA'}
            </span>
          </div>
          <h1 className="text-4xl font-semibold text-white tracking-tight leading-[1.15]">
            AIセレクトショップ
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            トレンドを選んでデザインを生成。Shopifyへ自動出品して在庫ゼロで販売をはじめましょう。
          </p>
        </div>

        {/* ステップナビ */}
        <div className="flex gap-1 bg-[#1e293b] p-1 rounded-xl max-w-sm border border-slate-700/50">
          {([
            { n: 1, label: 'トレンド選択' },
            { n: 2, label: 'デザイン生成' },
            { n: 3, label: '出品完了' },
          ] as { n: 1|2|3; label: string }[]).map(({ n, label }) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                step === n
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── Step 1: トレンド選択 ─── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">今週のトレンドキーワード</h2>
              <button
                onClick={fetchTrends}
                disabled={isLoadingTrends}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={isLoadingTrends ? 'animate-spin' : ''} />
                更新
              </button>
            </div>

            {isLoadingTrends ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-20 bg-[#1e293b] rounded-xl animate-pulse border border-slate-700/50" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {trends.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setKeyword(t.name); setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="h-20 bg-[#1e293b] border border-slate-700/50 hover:border-emerald-500 hover:bg-[#1e293b]/80 rounded-xl px-5 text-left font-medium text-slate-200 hover:text-emerald-400 transition-all"
                  >
                    <span className="text-xs text-slate-500 block mb-1">TREND</span>
                    <span className="text-base">{t.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 手入力 */}
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
              <p className="text-sm font-medium text-slate-300">または自分でキーワードを入力</p>
              <div className="flex gap-3">
                <input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="例：AI美女、侍、宇宙猫..."
                  className="flex-1 h-11 bg-[#0f172a] border border-slate-700 rounded-lg px-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
                />
                <button
                  onClick={() => { if (keyword) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
                  disabled={!keyword}
                  className="h-11 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  次へ →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: デザイン生成 & 出品 ─── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">デザインを生成して出品</h2>
              <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">← 戻る</button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* 左：設定パネル */}
              <div className="space-y-4">

                {/* キーワード */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">キーワード</label>
                  <input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="w-full h-11 bg-[#0f172a] border border-slate-700 rounded-lg px-4 text-base text-white focus:border-emerald-500 outline-none transition-colors"
                  />
                </div>

                {/* デザインスタイル + ランダムボタン */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">デザインスタイル</label>
                    <button
                      onClick={handleRandom}
                      className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 transition-all"
                    >
                      <Shuffle size={12} />
                      ランダム
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setStyleId(s.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-medium transition-all leading-tight ${
                          styleId === s.id
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-[#0f172a] text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tシャツカラー */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Tシャツカラー</label>
                  <div className="flex flex-wrap gap-2">
                    {TSHIRT_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setTshirtColorId(c.id)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          tshirtColorId === c.id
                            ? 'border-emerald-400 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'border-slate-600 hover:border-slate-400'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* サイズ選択 */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">販売サイズ</label>
                    <span className="text-xs text-slate-500">{selectedSizes.length}種選択中</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {ALL_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`h-9 px-4 rounded-lg text-sm font-medium transition-all border ${
                          selectedSizes.includes(size)
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                            : 'bg-[#0f172a] text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">※ 1つ以上選択必須。Printful対応サイズ</p>
                </div>

                {/* エラー表示 */}
                {publishResult?.error && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {publishResult.error}
                  </div>
                )}

                {/* 出品ボタン */}
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !keyword || !mockupDataUrl || selectedSizes.length === 0}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-base rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                >
                  {isPublishing ? (
                    <><Loader2 size={18} className="animate-spin" /> Shopifyへ出品中...</>
                  ) : (
                    <><ShoppingCart size={18} /> Shopifyへ自動出品</>
                  )}
                </button>
              </div>

              {/* 右：プレビュー */}
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">プレビュー</p>
                  {styleId && (
                    <span className="text-xs text-emerald-400 font-medium">
                      {STYLES.find(s => s.id === styleId)?.name}
                    </span>
                  )}
                </div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={500}
                  className="max-w-full rounded-xl"
                />
                {!keyword && (
                  <p className="text-sm text-slate-500 text-center">キーワードを入力するとプレビューが表示されます</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 3: 出品完了 ─── */}
        {step === 3 && (
          <div className="space-y-6">
            {/* 出品完了カード */}
            <div className="bg-[#1e293b] border border-emerald-500/30 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Shopifyへの出品が完了しました</h2>
                  <p className="text-xs text-slate-400 mt-0.5">受注後はPrintfulが自動で生産・発送します</p>
                </div>
              </div>

              {/* 出品詳細 */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">商品名</p>
                  <p className="text-white font-medium">{keyword}</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">デザイン</p>
                  <p className="text-white font-medium">{STYLES.find(s => s.id === styleId)?.name || styleId}</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">出品先</p>
                  <p className="text-emerald-400 font-medium font-mono text-xs">z5ju1n-vs.myshopify.com</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">販売サイズ</p>
                  <p className="text-white font-medium text-xs">{selectedSizes.join(' / ')}</p>
                </div>
              </div>

              {/* Shopifyリンク */}
              <div className="flex gap-3">
                {publishResult?.url && publishResult.url !== '#' ? (
                  <a
                    href={publishResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 h-11 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-xl transition-colors"
                  >
                    <ExternalLink size={16} /> Shopify管理画面で確認
                  </a>
                ) : (
                  <a
                    href="https://z5ju1n-vs.myshopify.com/admin/products"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 h-11 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-xl transition-colors"
                  >
                    <ExternalLink size={16} /> Shopify管理画面を開く
                  </a>
                )}
                <a
                  href="https://z5ju1n-vs.myshopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 px-4 bg-[#0f172a] border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 text-sm rounded-xl transition-colors"
                >
                  <ExternalLink size={14} /> ストア
                </a>
              </div>
            </div>

            {/* 販売ロードマップ */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">販売ロードマップ</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: ShoppingCart, title: '自動出品', desc: 'Shopify × Printful連携。在庫リスクゼロで販売開始。' },
                  { icon: TrendingUp,   title: 'SNS集客',  desc: 'モックアップ画像をXやInstagramでシェアして集客。' },
                  { icon: Zap,          title: '完全自動化', desc: '受注後の生産・配送はシステムが自動で処理。' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <s.icon size={18} className="text-emerald-400" />
                      <span className="text-sm font-semibold text-white">{s.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setStep(1); setPublishResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="h-11 px-6 bg-[#1e293b] hover:bg-[#334155] border border-slate-700/50 text-slate-300 font-medium text-sm rounded-xl transition-colors"
            >
              新しいデザインを作成する
            </button>
          </div>
        )}

        {/* フッター */}
        <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-600">
          <span>© 2026 NextraLabs</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Shopify × Printful Engine v2.1
          </span>
        </div>
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(AISelectShopApp), { ssr: false })
export default function AISelectShopPage() { return <NoSSR /> }
