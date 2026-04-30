import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react'

export const metadata = {
  title: 'YouTuber謦ｮ蠖ｱ蝣ｴ謇迚ｹ螳哂I | NextraLabs',
  description: 'YouTube蜍慕判縺ｮ繧ｵ繝繝阪う繝ｫ繧歎ision AI縺ｧ隗｣譫舌＠縲∵聴蠖ｱ蝣ｴ謇繧竪oogle Maps荳翫↓繝斐Φ繝昴う繝ｳ繝育音螳壹＠縺ｾ縺吶・,
}

export default function LocationFinderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
            <MapPin className="w-3 h-3 mr-1" /> 繝ｭ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ隗｣譫舌す繝ｪ繝ｼ繧ｺ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            YouTuber謦ｮ蠖ｱ蝣ｴ謇迚ｹ螳哂I
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            YouTube URL 繧定ｲｼ繧九□縺・竊・繧ｵ繝繝阪う繝ｫ繧但I縺瑚ｧ｣譫・竊・Google Maps縺ｫ繝斐Φ陦ｨ遉ｺ
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Gemini Vision ﾃ・Google Maps 縺ｧ謦ｮ蠖ｱ繧ｹ繝昴ャ繝医ｒ繝斐Φ繝昴う繝ｳ繝育音螳・          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products/location-finder/app">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">莉翫☆縺蝉ｽｿ縺・竊・/Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">繝励Ξ繝溘い繝繝励Λ繝ｳ・按･1,980/譛茨ｼ・/Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="border-y bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-center mb-6">3繧ｹ繝・ャ繝励〒螳御ｺ・/h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            {[
              { num: '竭', icon: '迫', label: 'URL蜈･蜉・ },
              { num: '竭｡', icon: '､・, label: 'AI隗｣譫・ },
              { num: '竭｢', icon: '桃', label: '繝槭ャ繝苓｡ｨ遉ｺ' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-card border rounded-xl px-6 py-4 text-center min-w-[120px]">
                  <div className="text-xs text-muted-foreground">{s.num}</div>
                  <div className="text-3xl">{s.icon}</div>
                  <div className="text-xs font-medium mt-1">{s.label}</div>
                </div>
                {i < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">讖溯・隧ｳ邏ｰ</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '名・・, title: '繧ｵ繝繝阪う繝ｫ3譫夊ｧ｣譫・, desc: '鬮倡判雉ｪ繝ｻ讓呎ｺ悶・荳ｭ逕ｻ雉ｪ縺ｮ3繝代ち繝ｼ繝ｳ縺ｮ繧ｵ繝繝阪う繝ｫ繧偵∪縺ｨ繧√※AI縺ｫ騾√ｊ縲∬､・焚繧｢繝ｳ繧ｰ繝ｫ縺九ｉ蝣ｴ謇繧呈耳螳壹＠縺ｾ縺吶・ },
            { icon: '､・, title: 'Gemini Vision隗｣譫・, desc: '蟒ｺ迚ｩ縺ｮ螟冶ｦｳ繝ｻ逵区攸繝ｻ蝨ｰ蠖｢繝ｻ譁・ｭ玲ュ蝣ｱ縺ｪ縺ｩ縺ｮ隕冶ｦ夂噪隕∫ｴ繧堤ｷ丞粋逧・↓蛻・梵縲ら音螳壽ｹ諡繧り｡ｨ遉ｺ縺励∪縺吶・ },
            { icon: '桃', title: 'Google Maps繝斐Φ陦ｨ遉ｺ', desc: 'Geocoding + Places API縺ｧ蠎ｧ讓吶ｒ迚ｹ螳壹・oogle Maps縺ｫ逶ｴ謗･繝斐Φ繧堤ｫ九※縺ｦ陦ｨ遉ｺ縺励∪縺吶・ },
            { icon: '投', title: '菫｡鬆ｼ蠎ｦ陦ｨ遉ｺ', desc: 'AI縺後碁ｫ倥・荳ｭ繝ｻ菴弱阪〒菫｡鬆ｼ蠎ｦ繧定・蟾ｱ隧穂ｾ｡縲よｹ諡縺ｮ譏守｢ｺ縺輔ｒ莠句燕縺ｫ謚頑升縺ｧ縺阪∪縺吶・ },
          ].map((f, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Caution */}
      <section className="bg-yellow-500/5 border-y border-yellow-500/20 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            笞・・縺泌茜逕ｨ荳翫・豕ｨ諢・          </h2>
          <ul className="space-y-2">
            {[
              '譛ｬ繝・・繝ｫ縺ｮ隗｣譫千ｵ先棡縺ｯAI縺ｫ繧医ｋ謗ｨ螳壹〒縺ゅｊ縲∝ｿ・★縺励ｂ豁｣遒ｺ縺ｧ縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・,
              '莉冶・・繝励Λ繧､繝舌す繝ｼ萓ｵ螳ｳ繝ｻ繧ｹ繝医・繧ｭ繝ｳ繧ｰ繝ｻ雖後′繧峨○逶ｮ逧・〒縺ｮ菴ｿ逕ｨ縺ｯ蝗ｺ縺冗ｦ∵ｭ｢縺輔ｌ縺ｦ縺・∪縺吶・,
              '蜈ｬ髢九＆繧後※縺・ｋYouTube蜍慕判縺ｮ繧ｵ繝繝阪う繝ｫ縺ｮ縺ｿ繧定ｧ｣譫仙ｯｾ雎｡縺ｨ縺励∪縺吶・,
              '1譌･1蝗槭・蛻ｩ逕ｨ蛻ｶ髯舌′縺ゅｊ縺ｾ縺呻ｼ・PI繧ｳ繧ｹ繝育ｮ｡逅・・縺溘ａ・峨・,
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">譁咎≡</h2>
          <Card className="border-violet-500/30 inline-block">
            <CardContent className="pt-8 pb-8 text-center">
              <Badge className="mb-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">繝励Ξ繝溘い繝繝励Λ繝ｳ髯仙ｮ・/Badge>
              <div className="text-3xl font-bold mb-2">ﾂ･1,980<span className="text-base font-normal text-muted-foreground">/譛・/span></div>
              <p className="text-muted-foreground mb-6">繝励Ξ繝溘い繝蜈ｨ繝・・繝ｫ縺御ｽｿ縺・叛鬘・/p>
              <Link href="/pricing">
                <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white">繝励Ξ繝溘い繝繝励Λ繝ｳ繧定ｦ九ｋ 竊・/Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">繧医￥縺ゅｋ雉ｪ蝠・/h2>
        <div className="space-y-4">
          {[
            { q: '髱槫・髢九・髯仙ｮ壼・髢句虚逕ｻ縺ｯ隗｣譫舌〒縺阪∪縺吶°・・, a: '繧ｵ繝繝阪う繝ｫ縺悟・髢九＆繧後※縺・↑縺・虚逕ｻ縺ｯ隗｣譫舌〒縺阪∪縺帙ｓ縲ょ・髢句虚逕ｻ縺ｮ縺ｿ蟇ｾ蠢懊＠縺ｦ縺・∪縺吶・ },
            { q: '邊ｾ蠎ｦ縺ｯ縺ｩ縺ｮ縺上ｉ縺・〒縺吶°・・, a: '逵区攸繝ｻ繝ｩ繝ｳ繝峨・繝ｼ繧ｯ繝ｻ蟒ｺ迚ｩ縺ｮ迚ｹ蠕ｴ縺梧丐縺｣縺ｦ縺・ｋ蝣ｴ蜷医・鬮倡ｲｾ蠎ｦ・亥ｸょ玄逕ｺ譚代懃分蝨ｰ繝ｬ繝吶Ν・峨〒迚ｹ螳壹〒縺阪∪縺吶ょｱ句・繧・音蠕ｴ縺ｮ縺ｪ縺・ｴ謇縺ｯ邊ｾ蠎ｦ縺御ｸ九′繧翫∪縺吶・ },
            { q: '縺ｪ縺・譌･1蝗槫宛髯舌〒縺吶°・・, a: 'Gemini Vision API縺ｮ蛻ｩ逕ｨ繧ｳ繧ｹ繝医ｒ驕ｩ蛻・↓邂｡逅・☆繧九◆繧√〒縺吶ゅ＃逅・ｧ｣縺上□縺輔＞縲・ },
            { q: '隗｣譫千ｵ先棡縺ｯ菫晏ｭ倥＆繧後∪縺吶°・・, a: '隗｣譫千ｵ先棡縺ｯ繝壹・繧ｸ繧帝屬繧後ｋ縺ｨ豸医∴縺ｾ縺吶ょｿ・ｦ√↑諠・ｱ縺ｯ繧ｹ繧ｯ繝ｪ繝ｼ繝ｳ繧ｷ繝ｧ繝・ヨ遲峨〒菫晏ｭ倥＠縺ｦ縺上□縺輔＞縲・ },
          ].map((faq, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <h3 className="font-bold mb-2">Q. {faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

