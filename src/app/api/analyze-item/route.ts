import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const diagnosticTrace: any[] = [];
  const log = (step: string, data: any) => diagnosticTrace.push({ time: new Date().toISOString(), step, data });

  try {
    const { image } = await req.json();
    log("1_REQUEST_RECEIVED", { size: image?.length, type: typeof image });

    // 🔑 Key Scan
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    log("2_KEY_SCAN", { 
      found: !!apiKey, 
      prefix: apiKey?.substring(0, 7), 
      length: apiKey?.length,
      all_keys: Object.keys(process.env).filter(k => k.includes("KEY"))
    });

    if (!apiKey) throw new Error("CRITICAL: API_KEY_MISSING_IN_VERCEL");

    const base64Data = image.split(",")[1] || image;
    
    // 🌍 Multi-Strategy Attack (最も成功率の高い順に試行)
    const strategies = [
      { v: "v1", m: "gemini-1.5-flash", desc: "Official V1 Flash" },
      { v: "v1beta", m: "gemini-1.5-flash", desc: "Beta Flash" },
      { v: "v1beta", m: "gemini-pro-vision", desc: "Legacy Vision" }
    ];

    let successResponse = null;
    let errors: any[] = [];

    for (const s of strategies) {
      log(`3_TRYING_${s.desc}`, { url: `/${s.v}/models/${s.m}` });
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/${s.v}/models/${s.m}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Analyze this image. Return JSON ONLY." }, { inline_data: { mime_type: "image/jpeg", data: base64Data } }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        const resData = await response.json();
        if (response.ok) {
          successResponse = resData;
          log(`4_SUCCESS_WITH_${s.desc}`, { status: response.status });
          break;
        } else {
          errors.push({ strategy: s.desc, status: response.status, msg: resData.error?.message });
        }
      } catch (e: any) {
        errors.push({ strategy: s.desc, error: e.message });
      }
    }

    if (successResponse) {
      const text = successResponse.candidates[0].content.parts[0].text;
      return NextResponse.json({ ...JSON.parse(text), _trace: diagnosticTrace });
    }

    return NextResponse.json({ 
      error: "ALL_STRATEGIES_FAILED", 
      details: errors, 
      _trace: diagnosticTrace 
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: "SYSTEM_FATAL", message: error.message, _trace: diagnosticTrace }, { status: 500 });
  }
}
