import { nextraAiEngine } from './src/lib/ai-engine';

async function generateNoteDraft() {
  const prompt = `
新ツール「AI水やり守護神」のnote PR記事を生成してください。
【ツールの特徴】
・植物の写真を撮るだけでAIが健康状態を分析。
・Google天気RSSと連動し、雨予報なら「水やり不要」と教えてくれる。
・枯らしがちな初心者でも、AIのアドバイスで安心して育てられる。
`;

  console.log("--- Generating note draft using AI Credit Guardian ---");
  const result = await nextraAiEngine({
    prompt,
    systemInstruction: "あなたはNextraLabsの広報担当です。ポジティブでワクワクするnote記事を書いてください。",
    toolId: "smart-gardening-note",
    quality: "auto"
  });

  console.log("\n--- NOTE DRAFT START ---\n");
  console.log(result.response);
  console.log("\n--- NOTE DRAFT END ---");
  console.log(`\nUsed Model: ${result.model} | Cached: ${result.cached}`);
}

generateNoteDraft();
