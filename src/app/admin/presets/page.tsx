'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Code } from "lucide-react";

export default function AiPresetsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const presets = {
    waterfall: `import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Guardian Engine呼び出し（キャッシュ・Waterfall自動処理）
    const result = await nextraAiEngine({
      prompt,
      systemInstruction: "あなたはNextraLabsの専門家です。簡潔かつ的確に回答してください。",
      toolId: "new-tool-id", // ここをツールのIDに変更
      quality: "auto"        // 複雑さにより自動でモデルを切り替え
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}`,
    cheap: `import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // 超節約モード（常にFlashを使用）
    const result = await nextraAiEngine({
      prompt,
      toolId: "entertainment-tool",
      quality: "cheap" 
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}`,
    powerful: `import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // 高品質モード（重要な決断・分析用）
    const result = await nextraAiEngine({
      prompt,
      toolId: "business-tool",
      quality: "powerful" 
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}`,
    note: `/**
 * note PR記事生成プロンプト (ChatGPT/Claude貼り付け用)
 * 以下の内容をAIに投げて、新ツールの紹介記事を作成します。
 */
あなたはNextraLabsの広報担当です。
新しく開発したAIツール「[ツール名]」のPR記事を、以下の構成で書いてください。

【記事トーン】
ポジティブ、ワクワク感、専門的すぎない親しみやすさ。

【構成案】
1. あるある共感：日常の「困った」シーンを具体的に描写
2. 解決策提示：そこで登場するのがこの「[ツール名]」
3. 使い方のステップ：①[入力] ②[解析] ③[解決] の3ステップを解説
4. 開発者の想い：なぜNextraLabsがこのツールを作ったか（AI×個人の拡張）
5. NextraLabsへのリンク：https://membership-site-nextralabos.vercel.app

【制限事項】
ネガティブな表現（監視・特定・悪用）は一切使わず、
「人生を豊かにする」「効率化で自由な時間を作る」という方向でまとめてください。`
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">AI開発プリセット・マネージャー</h1>
        <p className="text-muted-foreground">今後の開発はここからコードをコピペして、コストを最小化します。</p>
      </div>

      <Tabs defaultValue="waterfall" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="waterfall">自動Waterfall (推奨)</TabsTrigger>
          <TabsTrigger value="cheap">激安(Flash固定)</TabsTrigger>
          <TabsTrigger value="powerful">高品質(Sonnet)</TabsTrigger>
          <TabsTrigger value="note">note PR記事生成</TabsTrigger>
        </TabsList>

        {Object.entries(presets).map(([key, code]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{key === 'waterfall' ? '共通APIロジック' : key === 'cheap' ? 'エンタメ・大量消費用' : '重要分析・ビジネス用'}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(code, key)}
                  >
                    {copied === key ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied === key ? 'コピー済み' : 'コードをコピー'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  src/app/api/tools/[id]/route.ts に貼り付けて使用してください。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  <code>{code}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">💡 開発のコツ</h3>
        <ul className="list-disc ml-5 text-blue-700 space-y-1">
          <li>コピペ後、<code>toolId</code> を作成するツールのIDに変更してください。</li>
          <li>キャッシュは <code>prompt</code> と <code>systemInstruction</code> が完全一致する場合に発動します。</li>
          <li><code>quality: "auto"</code> を選ぶと、複雑な質問の時だけ自動でPro/Sonnetに昇格し、通常はFlashで節約します。</li>
        </ul>
      </div>
    </div>
  );
}
