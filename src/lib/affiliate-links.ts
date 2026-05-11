// ============================================================
// NextraLabs アフィリエイトリンク定義
// 憲法：本固定禁止・クリック率重視・ツールと文脈が一致する商品
// タグ：534e3725-22（変更禁止）
// ============================================================

const TAG = '534e3725-22'
const AMZ = (kw: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=${TAG}`

export interface AffiliateLink {
  id: string
  label: string
  desc: string
  url: string
}

// ツールID → リンク定義（最大2件）
export const AFFILIATE_LINKS: Record<string, AffiliateLink[]> = {

  // ── 無料ツール ──────────────────────────────────────────
  'moving-checker': [
    { id: 'moving-storage',  label: '📦 収納・引越しグッズ',   desc: 'ダンボール・梱包材・収納ボックス',     url: AMZ('引越し 収納グッズ ダンボール') },
    { id: 'moving-clean',    label: '🧹 掃除用品セット',       desc: '入居前・退去前の掃除に',               url: AMZ('引越し 掃除用品 セット') },
  ],
  'disaster-guard': [
    { id: 'disaster-kit',    label: '🆘 防災セット',           desc: '家族を守る備蓄・防災グッズ',           url: AMZ('防災セット 非常用持ち出し袋') },
    { id: 'disaster-food',   label: '🍱 備蓄食料・非常食',     desc: '5年保存・長期保存食品',                url: AMZ('備蓄食料 非常食 5年保存') },
  ],
  'loan-advisor': [
    { id: 'loan-book',       label: '💳 借金・家計整理本',     desc: '借金完済・お金の整理術',               url: AMZ('借金完済 家計 お金 整理') },
    { id: 'loan-notebook',   label: '📒 家計簿・収支ノート',   desc: '支出を見える化する家計簿',             url: AMZ('家計簿 収支ノート 節約') },
  ],
  'kdp-guide': [
    { id: 'kdp-kindle',      label: '📱 Kindleデバイス',       desc: '電子書籍をより快適に読む',             url: AMZ('Kindle 電子書籍リーダー') },
    { id: 'kdp-book',        label: '✍️ 電子書籍出版・文章術本', desc: 'KDP出版のノウハウ本',                url: AMZ('電子書籍 出版 Kindle KDP') },
  ],
  'shopping-stopper': [
    { id: 'shopping-minimal',label: '🏡 ミニマリスト・整理本', desc: '物を減らしてスッキリ暮らす',           url: AMZ('ミニマリスト 断捨離 整理') },
    { id: 'shopping-storage',label: '📦 収納・整理グッズ',     desc: '持ち物をスッキリ管理',                 url: AMZ('収納グッズ 整理 スッキリ') },
  ],
  'buy-smart-nav': [
    { id: 'buysmart-gadget', label: '💻 人気ガジェット・家電', desc: 'Amazonベストセラー家電・PC周辺機器',   url: AMZ('ガジェット 家電 おすすめ 人気') },
    { id: 'buysmart-compare',label: '📊 賢い買い物・節約本',   desc: 'お得な買い物術・比較検討のコツ',       url: AMZ('賢い買い物 節約 コスパ') },
  ],
  'ai-recipe': [
    { id: 'recipe-kitchen',  label: '🍳 人気調理器具',         desc: 'フライパン・鍋・時短調理グッズ',       url: AMZ('調理器具 フライパン 鍋 人気') },
    { id: 'recipe-food',     label: '🥗 食材・調味料セット',   desc: '時短・健康食材・ミールキット',         url: AMZ('食材セット ミールキット 時短') },
  ],
  'scam-defender': [
    { id: 'scam-camera',     label: '📷 防犯カメラ・セキュリティ', desc: '自宅・玄関を守る防犯グッズ',       url: AMZ('防犯カメラ 家庭用 セキュリティ') },
    { id: 'scam-lock',       label: '🔒 防犯グッズ・鍵',       desc: 'ドア・窓の防犯対策グッズ',             url: AMZ('防犯グッズ 鍵 補助錠') },
  ],

  // ── 有料ツール ──────────────────────────────────────────
  'money-guard': [
    { id: 'money-book',      label: '💰 家計管理・節約術本',   desc: '支出を減らして資産を増やす',           url: AMZ('家計管理 節約 資産形成') },
    { id: 'money-notebook',  label: '📒 家計簿・貯金ノート',   desc: '書いて管理するお金の習慣',             url: AMZ('家計簿 貯金 ノート') },
  ],
  'ai-sidejob': [
    { id: 'sidejob-pc',      label: '💻 副業向けPC・周辺機器', desc: 'テレワーク・副業を快適にするPC周辺機器', url: AMZ('ノートPC 周辺機器 テレワーク') },
    { id: 'sidejob-book',    label: '📚 副業・フリーランス本', desc: '稼げる副業の始め方・ロードマップ',     url: AMZ('副業 フリーランス 稼ぐ 始め方') },
  ],
  'inbox-organizer': [
    { id: 'inbox-keyboard',  label: '⌨️ 高速タイピンググッズ', desc: 'メール処理を爆速にするキーボード・ガジェット', url: AMZ('メカニカルキーボード 高速 タイピング') },
    { id: 'inbox-book',      label: '📧 仕事効率化・メール術本', desc: '仕事が速くなる時短テクニック',       url: AMZ('仕事術 効率化 メール ビジネス') },
  ],
  'youtube-producer': [
    { id: 'yt-mic',          label: '🎙 動画撮影・マイク',     desc: 'YouTube動画の質を上げる撮影機材',      url: AMZ('YouTube 撮影 マイク 動画') },
    { id: 'yt-light',        label: '💡 照明・リングライト',   desc: '顔映りが格段に上がる照明',             url: AMZ('リングライト 照明 配信 撮影') },
  ],
  'exam-scheduler': [
    { id: 'exam-stationery', label: '📝 受験・勉強グッズ',     desc: '集中力アップの文房具・学習グッズ',     url: AMZ('勉強 文房具 集中 タイマー 資格') },
    { id: 'exam-book',       label: '📖 資格・勉強法の本',     desc: '効率よく合格する勉強法',               url: AMZ('資格試験 勉強法 合格 テクニック') },
  ],
  'ai-exam-generator': [
    { id: 'examgen-tablet',  label: '📱 学習用タブレット',     desc: 'デジタル学習を快適にするタブレット',   url: AMZ('タブレット 学習 勉強 iPad') },
    { id: 'examgen-book',    label: '📚 試験対策・参考書',     desc: '定番資格の参考書・問題集',             url: AMZ('資格 参考書 問題集 試験対策') },
  ],
  'kindle-factory': [
    { id: 'kfactory-kindle', label: '📱 Kindleデバイス',       desc: '自分の本をKindleで読む',               url: AMZ('Kindle Paperwhite 電子書籍') },
    { id: 'kfactory-write',  label: '✍️ 文章術・ライティング本', desc: '読まれる文章の書き方',               url: AMZ('文章術 ライティング 読まれる 書き方') },
  ],
  'prompt-master': [
    { id: 'prompt-tablet',   label: '🎨 デザイン用タブレット・ペン', desc: 'イラスト・デザイン作業を快適に', url: AMZ('液タブ ペンタブレット デザイン イラスト') },
    { id: 'prompt-book',     label: '🖼 AI画像生成・デザイン本', desc: 'Midjourney・StableDiffusion攻略',    url: AMZ('AI 画像生成 Midjourney デザイン 本') },
  ],
  'smart-gardening': [
    { id: 'garden-pot',      label: '🪴 植木鉢・プランター',   desc: 'おしゃれな室内・屋外プランター',       url: AMZ('植木鉢 プランター おしゃれ ガーデニング') },
    { id: 'garden-soil',     label: '🌱 肥料・培養土セット',   desc: '植物が元気に育つ土・肥料',             url: AMZ('培養土 肥料 ガーデニング 観葉植物') },
  ],
  'travel-concierge': [
    { id: 'travel-bag',      label: '🧳 トラベルグッズ・スーツケース', desc: '旅行を快適にするグッズ',       url: AMZ('スーツケース トラベルグッズ 旅行') },
    { id: 'travel-gadget',   label: '🔌 旅行用ガジェット',     desc: '充電器・変換プラグ・旅行必需品',       url: AMZ('旅行 充電器 変換プラグ ガジェット') },
  ],
  'pilgrimage-planner': [
    { id: 'pilgrim-travel',  label: '🗺 トラベルグッズ',       desc: '聖地巡礼の旅を快適にするグッズ',       url: AMZ('旅行グッズ コンパクト 便利') },
    { id: 'pilgrim-guide',   label: '📸 カメラ・撮影グッズ',   desc: '聖地の思い出を最高の写真に',           url: AMZ('コンパクトカメラ 旅行 撮影 一眼') },
  ],
  'location-finder': [
    { id: 'location-biz',    label: '🏙 起業・出店の教科書',   desc: '成功する店舗・拠点選びのノウハウ',     url: AMZ('起業 出店 店舗経営 成功 本') },
    { id: 'location-estate', label: '🏠 不動産投資本',         desc: '物件選びで差がつく不動産投資術',       url: AMZ('不動産投資 物件選び 初心者') },
  ],
  'sns-auto-poster': [
    { id: 'sns-pc',          label: '💻 SNS運用向けPC・機材',  desc: 'コンテンツ制作を効率化するPC周辺機器', url: AMZ('PC周辺機器 コンテンツ制作 SNS') },
    { id: 'sns-book',        label: '📱 SNSマーケティング本',  desc: 'フォロワーを増やすSNS戦略',           url: AMZ('SNSマーケティング Instagram Twitter バズる') },
  ],
  'staysee-ai-finder': [
    { id: 'staysee-estate',  label: '🏨 民泊・不動産投資本',   desc: '民泊ビジネスで稼ぐノウハウ',           url: AMZ('民泊 Airbnb 不動産投資 稼ぐ') },
    { id: 'staysee-amenity', label: '🛁 民泊アメニティ用品',   desc: 'ゲストに喜ばれる備品・アメニティ',     url: AMZ('民泊 アメニティ ホスト 備品') },
  ],
  'kindle-ai-factory': [
    { id: 'kaifactory-kindle',label: '📱 Kindleデバイス',      desc: '自分の本をKindleで読む',               url: AMZ('Kindle Paperwhite 電子書籍') },
    { id: 'kaifactory-write', label: '✍️ AI・文章術本',        desc: 'AIを使った執筆・コンテンツ制作術',     url: AMZ('AI 文章 執筆 コンテンツ ChatGPT') },
  ],
  'youtube-coordinator': [
    { id: 'ytcoord-mic',     label: '🎙 配信機材・マイク',     desc: '動画・配信クオリティを上げる機材',     url: AMZ('配信 マイク ゲーミング YouTube') },
    { id: 'ytcoord-book',    label: '📺 YouTube攻略本',        desc: 'チャンネル登録者を増やす戦略',         url: AMZ('YouTube 攻略 チャンネル登録 増やす') },
  ],
}

// トラッキングURL生成
export function trackUrl(link: AffiliateLink, toolId: string): string {
  const params = new URLSearchParams({
    id:    link.id,
    tool:  toolId,
    label: link.label,
    url:   link.url,
  })
  return `/api/track/click?${params.toString()}`
}
