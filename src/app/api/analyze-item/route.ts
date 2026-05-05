import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const trace: any[] = [];
  const logTrace = (action: string, data: any) => trace.push({ time: new Date().toISOString(), action, data });

  try {
    const { image } = await req.json();
    logTrace("REQUEST_RECEIVED", { size: image?.length, type: typeof image });

    // 🔑 キーの超詳細診断
    const env = process.env;
    const apiKey = env.GEMINI_API_KEY || env.GEMINI_API_KEY1;
    logTrace("AUTH_DIAGNOSTIC", {
      has_key: !!apiKey,
      key_length: apiKey?.length || 0,
      key_prefix: apiKey?.substring(0, 8),
      vercel_region: env.VERCEL_REGION || "local",
      available_keys_list: Object.keys(env).filter(k => k.includes("KEY") || k.includes("API"))
    });

    if (!apiKey) throw new Error("CRITICAL_ERROR: API_KEY_MISSING_ON_SERVER");

    const base64Data = image.split(",")[1] || image;
    
    // 🌍 最強のモデル総当たり戦 (v1 & v1beta 混成)
    const targets = [
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: "1.5-Flash-Beta" },
      { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: "1.5-Flash-V1" },
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`, name: "Pro-Vision-Beta" }
    ];

    let finalResult = null;
    let failLogs: any[] = [];

    for (const target of targets) {
      logTrace(`TRYING_TARGET: ${target.name}`, { url: target.url.split("?")[0] });
      try {
        const response = await fetch(target.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Analyze image. Return JSON." }, { inline_data: { mime_type: "image/jpeg", data: base64Data } }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
          })
        });

        const resBody = await response.json();
        if (response.ok) {
          finalResult = { body: resBody, model: target.name };
          logTrace(`SUCCESS_WITH: ${target.name}`, { status: response.status });
          break;
        } else {
          failLogs.push({ model: target.name, status: response.status, error: resBody.error });
          logTrace(`FAIL_WITH: ${target.name}`, { status: response.status, msg: resBody.error?.message });
        }
      } catch (err: any) {
        logTrace(`CRASH_WITH: ${target.name}`, { error: err.message });
      }
    }

    if (finalResult) {
      const text = finalResult.body.candidates[0].content.parts[0].text;
      return NextResponse.json({ ...JSON.parse(text), _trace: trace, _model: finalResult.model });
    }

    return NextResponse.json({ 
      error: "ALL_GATEWAYS_LOCKED", 
      message: "Google APIが全ての扉を閉じました。お支払い反映まで最大24時間かかる場合があります。",
      diagnostics: failLogs, 
      _trace: trace 
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: "FATAL_SYSTEM_CRASH", message: error.message, _trace: trace }, { status: 500 });
  }
}
