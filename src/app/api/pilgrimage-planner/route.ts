import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID!

const TOOL_ID = 'pilgrimage-planner'
const DAILY_LIMIT = 5

// ─── プリセット定義（聖地スポットをハードコード） ────────────────────────────

export interface SacredSpot {
  name: string
  address: string
  description: string
  sceneDescription: string
  mapsUrl: string
}

export interface PresetDef {
  id: string
  label: string
  emoji: string
  description: string
  color: string
  hotelArea: string
  spots: SacredSpot[]
}

export const PRESETS: PresetDef[] = [
  {
    id: 'kimetsu', label: '鬼滅の刃', emoji: '🗡️',
    description: '竹林・大正ロマン', color: 'border-red-500/60 hover:border-red-400',
    hotelArea: '福岡県',
    spots: [
      { name: '竹田城跡（天空の城）', address: '兵庫県朝来市和田山町竹田', description: '霧に包まれた天空の城、鬼殺隊の修行地のイメージ', sceneDescription: '炭治郎が霞の中を駆ける山岳シーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=竹田城跡+兵庫県' },
      { name: '吉野山（奈良県）', address: '奈良県吉野郡吉野町吉野山', description: '桜と山岳が織りなす幽玄な風景', sceneDescription: '柱たちの訓練・集合シーンのモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=吉野山+奈良県' },
      { name: '宇治市街地（京都）', address: '京都府宇治市宇治', description: '大正時代の面影が残る街並み', sceneDescription: '炭治郎が育った山里のモデル地', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=宇治市+京都府' },
      { name: '嵯峨野竹林（京都）', address: '京都府京都市右京区嵯峨野', description: '荘厳な竹の道、まさに鬼滅の世界観', sceneDescription: '竹林の中を走るオープニング的シーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=嵯峨野竹林+京都' },
      { name: '明治村（愛知）', address: '愛知県犬山市内山1番地', description: '大正〜明治の建築が200棟以上残る', sceneDescription: '大正時代の建造物・街並みのモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=明治村+愛知県犬山市' },
    ],
  },
  {
    id: 'kiminonawa', label: '君の名は', emoji: '☄️',
    description: '飛騨古川・新宿・諏訪湖', color: 'border-blue-500/60 hover:border-blue-400',
    hotelArea: '岐阜県',
    spots: [
      { name: '飛騨古川駅', address: '岐阜県飛騨市古川町金森町', description: '瀧が三葉を探す感動のシーンの舞台', sceneDescription: '瀧が三葉を探して辿り着く駅', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=飛騨古川駅+岐阜県' },
      { name: '気多若宮神社', address: '岐阜県飛騨市古川町若宮町', description: '三葉が御神体を奉納する神社のモデル', sceneDescription: '三葉が口噛み酒を奉納するシーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=気多若宮神社+飛騨市' },
      { name: '諏訪湖（長野）', address: '長野県諏訪市湖岸通り', description: '糸守湖のモデル、彗星落下の舞台', sceneDescription: '糸守湖（ティアマト彗星が落ちた湖）のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=諏訪湖+長野県' },
      { name: '四ツ谷駅階段（東京）', address: '東京都新宿区四谷1丁目', description: '映画のラストシーンで二人が再会する場所', sceneDescription: 'ラスト「君の名は」と呼び合う感動のシーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=四ツ谷駅+東京都' },
      { name: '須賀神社（東京）', address: '東京都新宿区須賀町5番地', description: '三葉が瀧を見つける階段が有名', sceneDescription: '三葉が瀧を見上げる、作中最も有名な階段', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=須賀神社+新宿区' },
    ],
  },
  {
    id: 'slamdunk', label: 'スラムダンク', emoji: '🏀',
    description: '鎌倉・江ノ電・湘南', color: 'border-orange-500/60 hover:border-orange-400',
    hotelArea: '神奈川県',
    spots: [
      { name: '鎌倉高校前踏切', address: '神奈川県鎌倉市腰越2丁目', description: '世界中のファンが訪れる最も有名な聖地', sceneDescription: 'オープニングで桜木と晴子が出会う踏切', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=鎌倉高校前踏切+神奈川県' },
      { name: '江ノ電 鎌倉高校前駅', address: '神奈川県鎌倉市腰越2丁目', description: '海沿いを走るレトロな電車', sceneDescription: '江ノ電が海沿いを走る印象的なシーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=鎌倉高校前駅+江ノ電' },
      { name: '七里ヶ浜海岸', address: '神奈川県鎌倉市七里ガ浜東', description: '富士山も見える湘南の絶景ビーチ', sceneDescription: '桜木たちが走るビーチシーンのモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=七里ヶ浜海岸+鎌倉' },
      { name: '湘南海岸（茅ヶ崎）', address: '神奈川県茅ヶ崎市', description: '湘南エリアの代表的な海岸', sceneDescription: '作品全体の湘南の雰囲気のベース', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=湘南海岸+茅ヶ崎' },
      { name: '鎌倉市街地', address: '神奈川県鎌倉市小町', description: '小町通りや鶴岡八幡宮が有名', sceneDescription: '湘北メンバーが歩く街並みのモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=鎌倉市小町通り' },
    ],
  },
  {
    id: 'spirited', label: '千と千尋', emoji: '🏮',
    description: '道後温泉・山梨・神戸', color: 'border-purple-500/60 hover:border-purple-400',
    hotelArea: '愛媛県',
    spots: [
      { name: '道後温泉本館', address: '愛媛県松山市道後湯之町5-6', description: '油屋（湯屋）のモデルとして最も有名', sceneDescription: '千尋が働く油屋（湯屋）のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=道後温泉本館+愛媛県松山市' },
      { name: '神戸・北野異人館街', address: '兵庫県神戸市中央区北野町', description: '異国情緒ある洋館が立ち並ぶ', sceneDescription: '千尋家族が歩く廃墟テーマパークのモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=北野異人館街+神戸市' },
      { name: '江ノ電（神奈川）', address: '神奈川県藤沢市江の島', description: '海の中を走る電車が作中に登場', sceneDescription: '海の上を走る幻想的な電車シーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=江ノ電+神奈川県' },
      { name: '台湾・九份老街', address: '台湾新北市瑞芳区九份', description: '赤提灯が幻想的、作品のイメージに直結', sceneDescription: '夜の湯屋・油屋街のイメージのモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=九份+台湾' },
      { name: 'ラピュタの丘（山梨）', address: '山梨県南都留郡山中湖村', description: '霧に包まれた幻想的な湖畔', sceneDescription: '作品の幻想的な風景のイメージ源', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=山中湖+山梨県' },
    ],
  },
  {
    id: 'evangelion', label: 'エヴァンゲリオン', emoji: '🤖',
    description: '箱根・宇部市・鷹取山', color: 'border-green-500/60 hover:border-green-400',
    hotelArea: '神奈川県',
    spots: [
      { name: '箱根湯本駅', address: '神奈川県足柄下郡箱根町湯本', description: 'NERVへの入口、第三新東京市の玄関口', sceneDescription: 'シンジが到着する第三新東京市の入口', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=箱根湯本駅+神奈川県' },
      { name: '芦ノ湖', address: '神奈川県足柄下郡箱根町', description: '第三新東京市の地下に封印された碇', sceneDescription: '第三新東京市（箱根）の象徴的な湖', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=芦ノ湖+箱根' },
      { name: '鷹取山（神奈川）', address: '神奈川県逗子市沼間', description: 'ヤシマ作戦のモデルとなった岩山', sceneDescription: 'ヤシマ作戦で使われた砲台陣地のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=鷹取山+逗子市' },
      { name: '宇部市（山口）', address: '山口県宇部市', description: 'シンジの出身地・庵野秀明監督の地元', sceneDescription: 'シン・エヴァのラストシーンの舞台', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=宇部市+山口県' },
      { name: '大涌谷（箱根）', address: '神奈川県足柄下郡箱根町仙石原', description: '噴煙と火山の荒涼とした景色', sceneDescription: '使徒が出現する第三新東京市近郊のイメージ', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=大涌谷+箱根' },
    ],
  },
  {
    id: 'yuruyuri', label: 'ゆるキャン△', emoji: '⛺',
    description: '山梨・富士山・浜松', color: 'border-yellow-500/60 hover:border-yellow-400',
    hotelArea: '山梨県',
    spots: [
      { name: '本栖湖（山梨）', address: '山梨県南都留郡富士河口湖町', description: '1000円札の富士山のビュースポット', sceneDescription: 'なでしこと凛の出会いの場所・本栖湖キャンプ場', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=本栖湖+山梨県' },
      { name: '富士山（河口湖）', address: '山梨県南都留郡富士河口湖町', description: 'キャンプから見える絶景の富士山', sceneDescription: '各話に登場するシンボル・富士山', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=河口湖+富士山+山梨' },
      { name: '朝霧高原（静岡）', address: '静岡県富士宮市', description: '広大な草原と富士山の絶景キャンプ地', sceneDescription: 'あきの自転車旅ルート・朝霧高原', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=朝霧高原+富士宮市' },
      { name: '身延山久遠寺', address: '山梨県南巨摩郡身延町身延', description: 'しまりんの実家・なでしこと出会いの地周辺', sceneDescription: 'なでしこの祖父母の家がある身延町', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=身延山久遠寺+山梨県' },
      { name: '浜名湖（静岡）', address: '静岡県浜松市西区', description: 'リンがソロキャンプで訪れる湖', sceneDescription: 'リンの伊勢ソロキャンルートの通過地点', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=浜名湖+静岡県浜松市' },
    ],
  },
  {
    id: 'yourname2', label: '天気の子', emoji: '🌦️',
    description: '新宿・代々木・東京各地', color: 'border-cyan-500/60 hover:border-cyan-400',
    hotelArea: '東京都',
    spots: [
      { name: '代々木会館廃ビル跡（新宿）', address: '東京都渋谷区代々木1丁目', description: '陽菜が空を晴れにする"晴れ女の場所"', sceneDescription: '陽菜が"晴れ女"として祈りを捧げる屋上', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=代々木会館跡+新宿' },
      { name: '新宿東口（東京）', address: '東京都新宿区新宿3丁目', description: '帆高と陽菜が出会う街', sceneDescription: '帆高が東京に来て最初に歩く繁華街', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=新宿東口+東京都' },
      { name: '東京湾・お台場', address: '東京都江東区青海', description: '水没した東京の象徴的なシーン', sceneDescription: '東京が水没していくラストの海のシーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=お台場+東京都江東区' },
      { name: '代々木公園', address: '東京都渋谷区代々木神園町', description: '帆高と陽菜の逃避行ルート', sceneDescription: '二人が逃げる追いかけっこのシーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=代々木公園+東京都渋谷区' },
      { name: '西武新宿線・高田馬場駅', address: '東京都新宿区高田馬場', description: '帆高が逃走するシーンの舞台', sceneDescription: '帆高が電車に飛び乗る追跡シーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=高田馬場駅+東京都' },
    ],
  },
  {
    id: 'demonslayer2', label: '呪術廻戦', emoji: '🌀',
    description: '東京・仙台・渋谷', color: 'border-indigo-500/60 hover:border-indigo-400',
    hotelArea: '東京都',
    spots: [
      { name: '渋谷スクランブル交差点', address: '東京都渋谷区道玄坂2丁目', description: '渋谷事変の舞台、作中最大の決戦地', sceneDescription: '渋谷事変・宿儺対漏瑚の決戦シーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=渋谷スクランブル交差点+東京都' },
      { name: '東京都立呪術高等専門学校（東京学芸大学）', address: '東京都小金井市貫井北町4丁目', description: '呪術高専のモデルとされる大学', sceneDescription: '虎杖・伏黒・釘崎が通う呪術高専のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=東京学芸大学+小金井市' },
      { name: '仙台・荒川河川敷（宮城）', address: '宮城県仙台市若林区', description: '野薔薇（釘崎野薔薇）の出身地周辺', sceneDescription: '釘崎が育った田舎のモデル地', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=仙台市+宮城県' },
      { name: '渋谷ヒカリエ付近', address: '東京都渋谷区渋谷2丁目', description: '渋谷事変の主な舞台の中心部', sceneDescription: '領域展開が繰り広げられた渋谷中心部', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=渋谷ヒカリエ+東京都' },
      { name: '高知県・四万十', address: '高知県四万十市', description: '伏黒恵の出身地のモデル', sceneDescription: '伏黒が子供の頃を過ごした地方のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=四万十市+高知県' },
    ],
  },
  {
    id: 'attack', label: '進撃の巨人', emoji: '⚔️',
    description: '軍艦島・岡山・ドイツ', color: 'border-gray-500/60 hover:border-gray-400',
    hotelArea: '長崎県',
    spots: [
      { name: '軍艦島（端島）', address: '長崎県長崎市高島町端島', description: '廃墟の島、壁の中の世界のモデル', sceneDescription: '壁に囲まれた閉塞感ある世界観のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=軍艦島+長崎県' },
      { name: '備中松山城（岡山）', address: '岡山県高梁市内山下', description: '雲海に浮かぶ天空の城', sceneDescription: '壁の上からの絶景、哨戒シーンのモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=備中松山城+岡山県高梁市' },
      { name: '名島城跡（福岡）', address: '福岡県福岡市東区名島', description: '立体機動装置で飛び回るシーンのモデル', sceneDescription: '石積みの城壁を立体機動で移動するシーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=名島城跡+福岡市東区' },
      { name: '五島列島（長崎）', address: '長崎県五島市', description: '孤島の閉塞感が進撃の世界観に類似', sceneDescription: '調査兵団が遠征する外の世界のイメージ', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=五島列島+長崎県' },
      { name: '奈良 飛鳥', address: '奈良県高市郡明日香村', description: '古代の石造り文化が作品の雰囲気と合致', sceneDescription: '古代文明の遺跡・石の壁のイメージ', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=明日香村+奈良県' },
    ],
  },
  {
    id: 'onepunch', label: 'ワンピース', emoji: '🏴‍☠️',
    description: '長崎・熊本・南国エリア', color: 'border-red-500/60 hover:border-amber-400',
    hotelArea: '長崎県',
    spots: [
      { name: 'ハウステンボス（長崎）', address: '長崎県佐世保市ハウステンボス町1-1', description: 'ワンピースの世界観と合致するヨーロッパ建築', sceneDescription: 'シャボンディ諸島・ドレスローザのモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=ハウステンボス+長崎県佐世保市' },
      { name: '熊本城', address: '熊本県熊本市中央区本丸1-1', description: '雄大な天守閣がアラバスタの宮殿を想起', sceneDescription: 'アラバスタ王国の宮殿のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=熊本城+熊本市' },
      { name: '軍艦島（長崎）', address: '長崎県長崎市高島町端島', description: '廃墟の要塞感がエニエスロビーを彷彿', sceneDescription: 'エニエス・ロビーの要塞のイメージ', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=軍艦島+長崎県' },
      { name: '南の島（沖縄・波照間島）', address: '沖縄県八重山郡竹富町波照間', description: '南国の海がまさにグランドライン', sceneDescription: 'グランドライン・南の島々のイメージ', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=波照間島+沖縄県' },
      { name: '宮古島（沖縄）', address: '沖縄県宮古島市', description: '透き通った海と珊瑚礁の絶景', sceneDescription: 'ルフィたちが航海する海のイメージ', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=宮古島+沖縄県' },
    ],
  },
  {
    id: 'totoro', label: 'となりのトトロ', emoji: '🌳',
    description: '埼玉・所沢・狭山丘陵', color: 'border-teal-500/60 hover:border-teal-400',
    hotelArea: '埼玉県',
    spots: [
      { name: '八国山緑地（東京・埼玉）', address: '東京都東村山市野口町4丁目', description: 'トトロの森・くぬぎ山のモデル地', sceneDescription: 'サツキとメイが探検する大きな森', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=八国山緑地+東村山市' },
      { name: '狭山丘陵（所沢）', address: '埼玉県所沢市', description: 'トトロが住む雑木林のモデル', sceneDescription: 'トトロが住む森・神木のモデル地', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=狭山丘陵+所沢市+埼玉県' },
      { name: '所沢市・松郷バス停', address: '埼玉県所沢市', description: 'バス停でトトロが待つ名シーンのモデル', sceneDescription: 'トトロと傘を差して雨を聴くバス停シーン', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=所沢市松郷+埼玉県' },
      { name: '山口貯水池（狭山湖）', address: '埼玉県所沢市上山口', description: '昭和の農村風景が今も残る湖', sceneDescription: 'メイが迷子になった田んぼ道のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=狭山湖+所沢市' },
      { name: '吾妻峡（埼玉）', address: '埼玉県飯能市吾妻峡', description: '武蔵野の自然が広がる渓谷', sceneDescription: 'トトロが住む昔ながらの里山の風景', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=吾妻峡+飯能市+埼玉県' },
    ],
  },
  {
    id: 'demon', label: '鬼太郎誕生（墓場鬼太郎）', emoji: '👁️',
    description: '調布・鳥取・境港', color: 'border-slate-500/60 hover:border-slate-400',
    hotelArea: '鳥取県',
    spots: [
      { name: '水木しげるロード（鳥取）', address: '鳥取県境港市本町', description: '177体の妖怪ブロンズ像が並ぶ聖地', sceneDescription: '鬼太郎・ねずみ男・目玉おやじが町中に', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=水木しげるロード+境港市' },
      { name: '境港市（鳥取）', address: '鳥取県境港市', description: '水木しげる先生の出身地・妖怪の町', sceneDescription: '作品の舞台・妖怪文化の聖地', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=境港市+鳥取県' },
      { name: '調布市（東京）', address: '東京都調布市', description: '水木しげる先生が長年住んだ街', sceneDescription: '鬼太郎が住む墓場のある町のモデル', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=調布市+東京都' },
      { name: '弓ヶ浜（鳥取）', address: '鳥取県境港市外江町', description: '境港の美しい砂浜と夕景', sceneDescription: '怪異が現れる浜辺のイメージ', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=弓ヶ浜+境港市+鳥取県' },
      { name: '鬼太郎茶屋（調布）', address: '東京都調布市深大寺元町5-12-8', description: '鬼太郎グッズ・妖怪グルメが揃う公式ショップ', sceneDescription: '鬼太郎ワールドをリアルに体験できる場所', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=鬼太郎茶屋+調布市' },
    ],
  },
]

// ─── 楽天トラベル 宿泊検索 ────────────────────────────────────────────────────

interface RakutenHotel {
  name: string
  url: string
  imageUrl: string
  rating: number | null
  reviewCount: number
  minCharge: number | null
  address: string
  nearestStation: string
}

async function searchNearbyHotels(
  keyword: string,
  checkinDate: string,
  checkoutDate: string,
  adults: number,
  budget: number
): Promise<RakutenHotel[]> {
  if (!RAKUTEN_APP_ID) return []

  // 日帰り時はチェックアウトを翌日に補正
  const cin = checkinDate
  const cout = checkoutDate === checkinDate
    ? new Date(new Date(checkinDate).getTime() + 86400000).toISOString().split('T')[0]
    : checkoutDate

  try {
    const params = new URLSearchParams({
      applicationId: RAKUTEN_APP_ID,
      affiliateId: RAKUTEN_AFFILIATE_ID,
      format: 'json',
      keyword,
      checkinDate: cin,
      checkoutDate: cout,
      adultNum: adults.toString(),
      maxCharge: budget.toString(),
      hits: '5',
      sort: '+hotelMinCharge',
      responseType: 'small',
    })

    const res = await fetch(
      `https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426?${params}`,
      { headers: { 'User-Agent': 'NextraLabs/1.0' } }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (!data.hotels) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.hotels.slice(0, 5).map((h: any) => {
      const info = h.hotelBasicInfo
      return {
        name: info.hotelName,
        url: info.hotelInformationUrl,
        imageUrl: info.hotelImageUrl,
        rating: info.reviewAverage ?? null,
        reviewCount: info.reviewCount ?? 0,
        minCharge: info.hotelMinCharge ?? null,
        address: `${info.address1}${info.address2}`,
        nearestStation: info.nearestStation ?? '',
      }
    })
  } catch {
    return []
  }
}

// ─── Gemini で旅程プラン生成 ──────────────────────────────────────────────────

async function generatePilgrimageItinerary(
  spots: SacredSpot[],
  hotels: RakutenHotel[],
  tripStyle: string,
  departure: string,
  adults: number,
  workTitle: string
): Promise<string> {
  const spotList = spots
    .map((s, i) => `${i + 1}. ${s.name}（${s.address}）— ${s.sceneDescription}`)
    .join('\n')

  const hotelList = hotels.length > 0
    ? hotels.map((h, i) => `${i + 1}. ${h.name} ¥${(h.minCharge ?? 0).toLocaleString()}/泊 ${h.address}`).join('\n')
    : '（楽天トラベルデータなし — 一般的な宿泊先を提案）'

  const days = tripStyle === '日帰り' ? 0 : tripStyle === '1泊2日' ? 1 : 2

  const daySchedule = days === 0
    ? `#### 📅 当日スケジュール
- 午前（出発〜現地着）：
- 午前〜昼（聖地巡り①②）：
- 午後（聖地巡り③〜）：
- 夕方（帰路）：`
    : days === 1
    ? `#### 📅 1日目
- 午前（出発・現地到着）：
- 午後（聖地巡り①②③）：
- 夜（夕食・宿泊）：

#### 📅 2日目
- 午前（聖地巡り④⑤）：
- 昼（ランチ・土産）：
- 夕方（帰路）：`
    : `#### 📅 1日目
- 午前（出発・現地到着）：
- 午後（聖地巡り①②）：
- 夜（夕食・宿泊）：

#### 📅 2日目
- 午前（聖地巡り③④）：
- 午後（近隣観光）：
- 夜（夕食・宿泊）：

#### 📅 3日目
- 午前（聖地巡り⑤・ショッピング）：
- 昼〜夕方（帰路）：`

  const prompt = `あなたは推し活・聖地巡礼専門のツアープランナーです。
以下の聖地スポットを巡る${tripStyle}の旅程を作成してください。すべての項目に具体的な内容を必ず記入し、プレースホルダーは絶対に残さないこと。

## 作品: ${workTitle}

## 聖地スポット
${spotList}

## 宿泊候補（楽天トラベル）
${hotelList}

## 条件
- 出発地：${departure}
- スタイル：${tripStyle}
- 人数：${adults}名

## 出力フォーマット（必ず守ること）

### 🗾 ${tripStyle}聖地巡礼ルート

${daySchedule}

---

### 🏨 おすすめ宿泊先
（上記宿泊候補から最適を1〜2軒推薦。ホテル名・推薦理由を具体的に）

---

### 🚃 アクセス・移動手段
- ${departure}からのルート（新幹線/特急/バス/車など具体的に）：
- 現地での移動手段（徒歩/バス/電車/レンタサイクルなど）：
- 所要時間の目安：

---

### 🍜 聖地グルメ・お土産
- おすすめグルメ（店名・料理名を含む）：
- 推しグッズ・限定土産（具体的な商品名）：
- 聖地カフェ・コラボ店（あれば）：

---

### 💰 概算予算（${adults}名合計）
- 交通費：¥〇〇〜¥〇〇
- 宿泊費：¥〇〇〜¥〇〇
- 食費：¥〇〇〜¥〇〇
- 観光・体験費：¥〇〇〜¥〇〇
- グッズ・土産：¥〇〇〜¥〇〇
- **合計目安：¥〇〇〜¥〇〇**

---

### 📸 聖地巡礼のコツ
- 混雑回避のベストタイム：
- 写真撮影のポイント（具体的なスポット名）：
- 巡礼マナー・注意事項：
- おすすめ持ち物：`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    )
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '旅程の生成に失敗しました'
  } catch {
    return '旅程の生成に失敗しました'
  }
}

// ─── メインハンドラ ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]
    const { data: usageLogs } = await supabase
      .from('tool_usage_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_id', TOOL_ID)
      .gte('created_at', `${today}T00:00:00.000Z`)

    const usageCount = usageLogs?.length ?? 0
    if (usageCount >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `本日の利用上限（${DAILY_LIMIT}回）に達しました。明日またお試しください。` },
        { status: 429 }
      )
    }

    const { presetId, keyword, tripStyle, departure, adults, budget, checkinDate, checkoutDate } = await req.json()

    if (!presetId && !keyword) {
      return NextResponse.json({ error: '作品を選択してください' }, { status: 400 })
    }

    // プリセット解決
    const preset = PRESETS.find((p) => p.id === presetId)
    const workTitle = preset?.label ?? keyword ?? 'この作品'

    // 聖地スポット: プリセットはハードコード、キーワードのみの場合はGeminiで取得
    let spots: SacredSpot[] = preset?.spots ?? []
    if (spots.length === 0 && keyword) {
      spots = await fetchSpotsFromGemini(keyword)
    }

    // 楽天ホテル検索
    const hotelKeyword = preset?.hotelArea ?? departure ?? '東京'
    const today2 = new Date()
    const defaultCheckin = checkinDate || new Date(today2.getTime() + 7 * 86400000).toISOString().split('T')[0]
    const defaultCheckout = checkoutDate || new Date(today2.getTime() + 8 * 86400000).toISOString().split('T')[0]

    const hotels = await searchNearbyHotels(
      hotelKeyword,
      defaultCheckin,
      defaultCheckout,
      adults || 2,
      budget || 15000
    )

    // 旅程生成
    const itinerary = await generatePilgrimageItinerary(
      spots,
      hotels,
      tripStyle || '1泊2日',
      departure || '東京',
      adults || 2,
      workTitle
    )

    await supabase.from('tool_usage_logs').insert({
      user_id: user.id,
      tool_id: TOOL_ID,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      workTitle,
      spots,
      hotels,
      itinerary,
      tripStyle: tripStyle || '1泊2日',
      departure: departure || '東京',
      remainingToday: DAILY_LIMIT - usageCount - 1,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '処理中にエラーが発生しました' }, { status: 500 })
  }
}

// キーワード入力時のGemini聖地取得（フォールバック）
async function fetchSpotsFromGemini(keyword: string): Promise<SacredSpot[]> {
  const prompt = `アニメ・映画・ドラマのロケ地・聖地巡礼の専門家として、「${keyword}」の実在する聖地を5件教えてください。

JSON配列のみを出力（他テキスト不要）:
[{"name":"スポット名","address":"住所（都道府県から）","description":"見どころ50字以内","sceneDescription":"どのシーンに登場するか50字以内","mapsUrl":"https://www.google.com/maps/search/?api=1&query=スポット名+住所"}]`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
        }),
      }
    )
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return []
    return JSON.parse(match[0]).slice(0, 5)
  } catch {
    return []
  }
}
