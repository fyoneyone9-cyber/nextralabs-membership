import { NextResponse } from 'next/server';

/**
 * 統 NOTE PR險倅ｺ玖・蜍慕函謌舌お繝ｳ繧ｸ繝ｳ (NextraLabs Automation)
 * 9譎ゅ・12譎ゅ・17譎ゅ↓螳溯｡後＆繧後√◎縺ｮ譌･縺ｮ繝医Ξ繝ｳ繝峨↓蝓ｺ縺･縺・◆
 * 繧ｪ繧ｹ繧ｹ繝｡險倅ｺ九→繧｢繧､繧ｭ繝｣繝・メ逕ｻ蜒上ｒ逕滓・縺吶ｋ縲・ */
export async function GET(req: Request) {
  // Vercel Cron Secret縺ｮ讀懆ｨｼ・医そ繧ｭ繝･繝ｪ繝・ぅ・・  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 1. 譛譁ｰ繝医Ξ繝ｳ繝峨・蜿門ｾ・    const trendsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/trends`, { cache: 'no-store' });
    const { trends } = await trendsRes.json();
    const topTrend = trends?.[0] || 'AI縺ｫ繧医ｋ讌ｭ蜍吝柑邇・喧';

    // 2. 險倅ｺ区ｧ区・縺ｮ閾ｪ蜍慕函謌・(NextraLabs AI Assistant - 繝ｪ繧｢繝ｫ蟇ｾ隧ｱ蜿肴丐)
    const now = new Date();
    const hour = now.getHours();
    
    let timeSlot = "譛昴・讌ｭ蜍吶ワ繝・け";
    if (hour >= 11 && hour <= 14) timeSlot = "縺頑仂縺ｮAI豢ｻ逕ｨ陦・;
    if (hour >= 16) timeSlot = "螟墓婿縺ｮ謌ｦ逡･繧｢繝・・繝・・繝・;

    // 庁 縺ゅ↑縺・AI)縺ｨ縺ｮ蟇ｾ隧ｱ縺九ｉ縲梧悽蠖薙↓縺翫☆縺吶ａ縺励◆縺・阪ヨ繝斐ャ繧ｯ繧帝∈蜃ｺ
    const RECOMMENDATIONS = [
      {
        topic: "AIﾃ励・繝・ΝDX繧ｷ繧ｹ繝・Β縲侵extra縲托ｼ壼ｮｿ豕贋ｺ育ｴ・→骰ｵ逋ｺ陦後・螳悟・蜷梧悄",
        insight: "Staysee遲峨・PMS縺ｨRemoteLock遲峨・骭繝・ヰ繧､繧ｹ繧但PI縺ｧ逶ｴ邨舌ゆｺ育ｴ・｢ｺ螳壹・迸ｬ髢薙↓繧ｲ繧ｹ繝亥ｰら畑繝代せ繧ｳ繝ｼ繝峨′逋ｺ陦後＆繧後ｋ縲∽ｺｺ縺ｮ謇九ｒ莉九＆縺ｪ縺・ｬ｡荳紋ｻ｣繝輔Ο繝ｳ繝井ｽ馴ｨ薙・讌ｵ閾ｴ縲・,
        image: "A minimalist digital gate glowing in emerald green, integrated with a smartphone key, hotel lobby background, high-tech, cinematic."
      },
      {
        topic: "SNS繝医Ξ繝ｳ繝峨°繧峨悟庶逶翫・繧ｿ繝阪阪ｒ閾ｪ蜍墓歓蜃ｺ繝ｻ莉募・繧・,
        insight: "Google Trends縺ｮ辷・匱逧・↑讀懃ｴ｢繝ｯ繝ｼ繝峨ｒ縲∵･ｽ螟ｩ蟶ょｴ縺ｮ繝ｪ繧｢繝ｫ繧ｿ繧､繝蝨ｨ蠎ｫ繝・・繧ｿ縺ｫ蜷梧悄縲・I縺後取・譌･繝舌ぜ繧句膚蜩√上ｒ迚ｹ螳壹＠縲∽ｻ募・繧悟愛譁ｭ縺ｾ縺ｧ繧定・蜍募喧縲・,
        image: "A digital terminal displaying trending keywords and product shipping boxes, neon orange highlights, futuristic warehouse vibe."
      },
      {
        topic: "荳顔ｴ壼ｿ・炊繧ｫ繧ｦ繝ｳ繧ｻ繝ｩ繝ｼ縺ｮ遏･隕九ｒ邨ｱ蜷医＠縺蘗I蟀壽ｴｻ謌ｦ逡･",
        insight: "繝・・繧ｿ隗｣譫舌↓莠ｺ髢薙・豺ｱ螻､蠢・炊繧呈寺縺大粋繧上○縲√朱∈縺ｰ繧後ｋ縺溘ａ縺ｮ蜈ｷ菴鍋噪繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲上ｒ謠先｡医４NS繧ｪ繝ｼ繝医・繧ｹ繧ｿ繝ｼ縺ｨ縺ｮ騾｣謳ｺ縺ｧ縲∝・諢溘ｒ逕溘・閾ｪ蠕狗噪逋ｺ菫｡繧貞ｮ溽樟縲・,
        image: "Abstract human connection nodes forming a heart shape, digital grid lines, soft rose gold and teal colors, professional look."
      }
    ];

    const pick = RECOMMENDATIONS[hour % RECOMMENDATIONS.length];

    // 剥 縲心EO雜・э隴倥代く繝ｼ繝ｯ繝ｼ繝峨・讒矩繝ｻ繝｡繧ｿ繝・・繧ｿ縺ｮ譛驕ｩ蛹・    const seoKeywords = `${pick.topic}, AI閾ｪ蜍募喧, NextraLabs, 讌ｭ蜍吝柑邇・喧, ${topTrend}, 逕滓・AI豢ｻ逕ｨ`;
    
    const articleData = {
      title: `縲・{timeSlot}縲・{pick.topic}縺ｧ蝨ｧ蛟堤噪蜆ｪ菴阪↓縲・I繧｢繧ｷ繧ｹ繧ｿ繝ｳ繝医′謨吶∴繧・026蟷ｴ譛譁ｰ謌ｦ逡･`,
      subTitle: `${topTrend}譎ゆｻ｣縺ｮ譁ｰ蟶ｸ隴倥・{pick.insight}`,
      content: `
# ${pick.topic}・哂I譎ゆｻ｣縺ｮ謌仙粥繧呈ｱｺ螳壹▼縺代ｋ遨ｶ讌ｵ縺ｮ繧ｬ繧､繝・
譛ｬ譌･縺ｮ繝医Ξ繝ｳ繝峨・{topTrend}縲阪ｒ蛻・梵縺励◆邨先棡縲∽ｻ頑怙繧ょ叙繧顔ｵ・・縺ｹ縺阪・縲・{pick.topic}縲阪〒縺ゅｋ縺薙→縺悟愛譏弱＠縺ｾ縺励◆縲・
## 縺ｪ縺應ｻ翫・{pick.topic}縺悟ｿ・ｦ√↑縺ｮ縺具ｼ・${pick.insight}

## 3縺､縺ｮ蜈ｷ菴鍋噪繝｡繝ｪ繝・ヨ
1. **繧ｳ繧ｹ繝亥炎貂・*: AI縺・4譎る俣遞ｼ蜒阪＠縲∽ｺｺ逧・Μ繧ｽ繝ｼ繧ｹ繧呈怙螟ｧ蛹悶・2. **讖滉ｼ壽錐螟ｱ縺ｮ髦ｲ豁｢**: 繝ｪ繧｢繝ｫ繧ｿ繧､繝繝・・繧ｿ騾｣蜍輔↓繧医ｊ縲√ヨ繝ｬ繝ｳ繝峨ｒ騾・＆縺壼茜逶翫∈縲・3. **莉伜刈萓｡蛟､縺ｮ蜷台ｸ・*: 荳顔ｴ壼ｿ・炊繧ｫ繧ｦ繝ｳ繧ｻ繝ｩ繝ｼ縺ｮ遏･隕九ｒ邨ｱ蜷医＠縺溘∵悽雉ｪ逧・↑繧ｵ繝ｼ繝薙せ謠蝉ｾ帙・
NextraLabs縺ｮAI繝・・繝ｫ鄒､繧呈ｴｻ逕ｨ縺励√％縺ｮ謌ｦ逡･繧剃ｻ翫☆縺仙ｮ溯｡後＠縺ｾ縺励ｇ縺・・      `.trim(),
      metaDescription: `${pick.topic}縺ｮ驥崎ｦ∵ｧ縺ｨ${topTrend}繧呈寺縺大粋繧上○縺滓怙譁ｰAI豢ｻ逕ｨ陦薙ｒ蜈ｬ髢九・extraLabs AI繧｢繧ｷ繧ｹ繧ｿ繝ｳ繝医↓繧医ｋ謌ｦ逡･逧・う繝ｳ繧ｵ繧､繝医Ａ,
      tags: ["AI", "NextraLabs", "閾ｪ蜍募喧", "DX", "讌ｭ蜍吝柑邇・喧"],
      imagePrompt: `SEO optimized banner for ${pick.topic}, high-impact title text 'NEXTRALABS STRATEGY' visible, ${pick.image}, cinematic, 8k, sharp focus.`
    };

    // 3. 逕ｻ蜒冗函謌仙多莉､縺ｮ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ
    // 譛ｬ譚･縺ｯ gsk img 縺ｾ縺溘・ DALL-E API繧貞娼縺・    const imageUrl = `https://www.genspark.ai/api/files/s/mock-image-${Date.now()}.png`;

    console.log(`[CRON NOTE-PR] Article generated for ${hour}:00`);

    return NextResponse.json({
      success: true,
      article: articleData,
      imageUrl,
      scheduledTime: `${hour}:00`,
      status: "READY_FOR_POST"
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
