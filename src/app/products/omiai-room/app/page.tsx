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
      </div>
    </div>
  )
}
