import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7);
  const debugLogs: any[] = [];
  
  const addLog = (tag: string, content: any) => {
    debugLogs.push({ timestamp: new Date().toISOString(), tag, content });
    console.log(`[${requestId}] ${tag}:`, JSON.stringify(content));
  };

  try {
    const { image } = await req.json();
    addLog("REQUEST_DATA_SIZE", `${(image?.length / 1024).toFixed(2)} KB`);

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    addLog("API_KEY_CHECK", apiKey ? `PRESENT (Ends with: ...${apiKey.slice(-4)})` : "MISSING");

    if (!apiKey || !image) throw new Error("Missing params");

    const base64Data = image.split(",")[1] || image;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Respond ONLY with raw JSON: { \"item\": \"name\", \"color\": \"color\", \"brand\": \"brand\", \"features\": [\"tag\"], \"matchConfidence\": 95 }" },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }]
    };

    addLog("SENDING_TO_GOOGLE", { url: apiUrl.split("?")[0] + "?key=HIDDEN", model: "gemini-1.5-flash" });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    addLog("GOOGLE_RESPONSE_RAW", data);

    if (!response.ok) {
      return NextResponse.json({ 
        error: "Google API Rejected Request", 
        google_status: response.status,
        google_error: data.error,
        debug_trace: debugLogs 
      }, { status: response.status });
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    
    return NextResponse.json({
      ...JSON.parse(cleanJson),
      _debug: debugLogs // 成功時もデバッグ情報を付与
    });

  } catch (error: any) {
    addLog("FATAL_ERROR", error.message);
    return NextResponse.json({ error: "System Failure", message: error.message, debug_trace: debugLogs }, { status: 500 });
  }
}
