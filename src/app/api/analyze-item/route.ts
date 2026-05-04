import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !image) return NextResponse.json({ error: "Missing Key/Image" }, { status: 400 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    // 試行するモデルの優先順位リスト
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.5-flash-latest", "gemini-1.5-pro-latest"];
    
    let lastError = "";
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
          "Analyze this image. Return ONLY JSON: { \"item\": \"name\", \"color\": \"color\", \"brand\": \"brand\", \"features\": [\"tag\"], \"matchConfidence\": 95 }"
        ]);
        
        const text = result.response.text();
        const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        return NextResponse.json(JSON.parse(cleanJson));
      } catch (e: any) {
        lastError = e.message;
        console.warn(`${modelName} failed: ${e.message}`);
        continue; // 次のモデルを試す
      }
    }

    throw new Error(`All models failed. Last error: ${lastError}`);

  } catch (error: any) {
    return NextResponse.json({ error: "AI解析エラー", message: error.message }, { status: 500 });
  }
}
