import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey) return NextResponse.json({ error: "No API Key" }, { status: 500 });

    // Googleに「使えるモデルのリスト」を問い合わせる
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`ListModels Error: ${data.error?.message || "Unknown"}`);
    }

    // 利用可能な全モデル名を抽出
    const availableModels = data.models?.map((m: any) => m.name) || [];

    return NextResponse.json({ 
      error: "診断モード: 利用可能なモデルを特定しました",
      message: "以下のリストにある名前以外は404になります",
      availableModels: availableModels,
      recommendation: availableModels.find((m: string) => m.includes("flash")) || "なし"
    }, { status: 500 }); // あえてエラーを返し、画面にリストを表示させます

  } catch (error: any) {
    return NextResponse.json({ error: "診断失敗", message: error.message }, { status: 500 });
  }
}
