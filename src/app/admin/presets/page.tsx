import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/tools/CopyButton";

export const dynamic = 'force-dynamic';

export default function AiPresetsPage() {
  const presets = [
    {
      id: 'waterfall',
      title: '自動Waterfall (推奨)',
      description: '複雑な質問だけProに昇格させ、通常はFlashで節約するAPIロジック。',
      code: `import { NextResponse } from 'next/server';
import { nextraAiEngine } from '@/lib/ai-engine';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = await nextraAiEngine({
      prompt,
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
      id: 'note',
      title: 'note PR記事生成プロンプト',
      description: 'ツール完成後、広報担当として記事を書くための特化型プロンプト。',
      code: `あなたはNextraLabsの広報担当です。
新ツール「[ツール名]」のPR記事を書いてください。
1. あるある共感
2. 解決策提示
3. 使い方の3ステップ
ポジティブなトーンで作成してください。`
    }
  ];

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">AI開発プリセット</h1>
        <p className="text-slate-400">NextraLabsの開発コストを最小化するコード片ライブラリです。</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {presets.map((preset) => (
          <Card key={preset.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-white">
                <span>{preset.title}</span>
                <CopyButton code={preset.code} />
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
