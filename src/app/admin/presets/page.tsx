import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/tools/CopyButton";

export const dynamic = 'force-dynamic';

export default function AiPresetsPage() {
  const presets = [
    {
      id: 'waterfall',
      title: '自動Waterfall (推奨)',
      description: '複雑な質問だけSonnetに昇格させ、通常はFlashで節約する最強のAPIロジック。',
      code: `import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const result = await nextraAiEngine({
      prompt,
      systemInstruction: "あなたはNextraLabsの専門家です。",
      toolId: "new-tool-id",
      quality: "auto"
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}`
    },
    {
      id: 'cheap',
      title: '激安 (Flash固定)',
      description: 'エンタメや大量消費ツール向け。常に最も安いモデルを使用します。',
      code: `import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const result = await nextraAiEngine({
      prompt,
      toolId: "cheap-tool",
      quality: "cheap" 
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}`
    },
    {
      id: 'note',
      title: 'note PR記事生成プロンプト',
      description: 'ツール完成後、PR記事を書くための特化型プロンプト。',
      code: `あなたはNextraLabsの広報担当です。
新ツール「[ツール名]」のPR記事を書いてください。
1. あるある共感
2. 解決策提示
3. 使い方の3ステップ
を盛り込み、ポジティブなトーンで作成してください。`
    }
  ];

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">AI開発プリセット</h1>
        <p className="text-slate-400">今後の開発はここからコードをコピペして、コストを最小化します。</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {presets.map((preset) => (
          <Card key={preset.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-white">
                <span>{preset.title}</span>
                <CopyButton code={preset.code} id={preset.id} />
              </CardTitle>
              <CardDescription className="text-slate-400">{preset.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-black text-slate-300 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-slate-800">
                <code>{preset.code}</code>
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
