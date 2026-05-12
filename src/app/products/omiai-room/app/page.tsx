export default function OmiaiRoomAppPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 flex items-center justify-center" style={{ fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>
      <div className="text-center px-4 max-w-lg">
        <div className="text-5xl mb-6">🎵</div>
        <h1 className="text-2xl font-semibold mb-4">オンラインお見合い盛り上げシステム</h1>
        <p className="text-slate-400 leading-relaxed mb-8">
          このシステムはエンタープライズ契約後にご利用いただけます。<br />
          担当者よりルームURLをお送りします。
        </p>
        <a
          href="/products/omiai-room#contact"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200"
        >
          無料デモを申し込む →
        </a>
        {/* マリッジロードジャパンリンク */}
        <div className="mt-10">
          <a href="https://marriage-road-site.vercel.app" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-500/15 transition-all group">
            <span className="text-xl">💒</span>
            <div className="text-left">
              <p className="text-xs font-semibold text-pink-400 group-hover:text-pink-300 transition-colors">結婚相談所をお探しの方はこちら</p>
              <p className="text-[11px] text-slate-400 mt-0.5">マリッジロードジャパン — 婚活のプロ</p>
            </div>
            <span className="text-slate-500 group-hover:text-pink-400 transition-colors text-sm">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
