'use client';

import React, { useState } from 'react';
import { Zap, Diamond, Palette, Smartphone, Laptop, Briefcase, Clock, Calendar, Rocket, ShieldCheck } from 'lucide-react';

interface CharacterMakeProps {
  onComplete: (data: any) => void;
  isSubmitting: boolean;
}

export const CharacterMake: React.FC<CharacterMakeProps> = ({ onComplete, isSubmitting }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    style: '',
    skills: [] as string[],
    time: '',
  });

  const nextStep = () => setStep(step + 1);

  const toggleSkill = (skill: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto border-4 border-emerald-500 rounded-[3rem] p-8 md:p-12 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.2)] relative overflow-hidden">
      {/* MASTER品質の証 */}
      <div className="absolute top-6 right-8 flex items-center gap-2 text-xs font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-emerald-500/20">
        <ShieldCheck size={16} />
        MASTERMODEL v2.0
      </div>

      <div className="flex justify-between mb-12 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-3 w-full rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="text-center">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">副業スタイルを選択</h2>
            <p className="text-lg text-emerald-400/80 font-bold mt-3 italic">理想の「稼ぎ方」を直感で選べ ➔</p>
          </div>
          <div className="grid gap-5">
            <StyleButton 
              icon={<Zap size={32} className="text-yellow-400" />} 
              title="スピードスター" 
              desc="【即金重視】今日から1円を稼ぎに行く。" 
              active={data.style === 'speed'}
              onClick={() => {setData({...data, style:'speed'}); nextStep();}} 
            />
            <StyleButton 
              icon={<Diamond size={32} className="text-blue-400" />} 
              title="スペシャリスト" 
              desc="【成長重視】AIスキルで高単価を狙う。" 
              active={data.style === 'expert'}
              onClick={() => {setData({...data, style:'expert'}); nextStep();}} 
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
          <div className="text-center">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">現在の「装備」を選択</h2>
            <p className="text-lg text-emerald-400/80 font-bold mt-3 italic">あなたの武器を全て選べ（複数可） ➔</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {/* デジタル・SNS系 */}
            <SkillTag label="SNS投稿" icon={<Smartphone size={20}/>} active={data.skills.includes('sns')} onClick={() => toggleSkill('sns')} />
            <SkillTag label="フリマ出品" icon={<ShoppingCart size={20}/>} active={data.skills.includes('mercari')} onClick={() => toggleSkill('mercari')} />
            <SkillTag label="ポイ活" icon={<Zap size={20}/>} active={data.skills.includes('points')} onClick={() => toggleSkill('points')} />
            <SkillTag label="リサーチ" icon={<Search size={20}/>} active={data.skills.includes('research')} onClick={() => toggleSkill('research')} />
            
            {/* クリエイティブ系 */}
            <SkillTag label="画像作成" icon={<Palette size={20}/>} active={data.skills.includes('design')} onClick={() => toggleSkill('design')} />
            <SkillTag label="動画編集" icon={<Video size={20}/>} active={data.skills.includes('video')} onClick={() => toggleSkill('video')} />
            <SkillTag label="文章作成" icon={<Pen size={20}/>} active={data.skills.includes('writing')} onClick={() => toggleSkill('writing')} />
            <SkillTag label="お悩み相談" icon={<MessageSquare size={20}/>} active={data.skills.includes('consulting')} onClick={() => toggleSkill('consulting')} />

            {/* AI・IT系 */}
            <SkillTag label="ChatGPT" icon={<Sparkles size={20}/>} active={data.skills.includes('chatgpt')} onClick={() => toggleSkill('chatgpt')} />
            <SkillTag label="画像生成AI" icon={<ImageIcon size={20}/>} active={data.skills.includes('stable_diffusion')} onClick={() => toggleSkill('stable_diffusion')} />
            <SkillTag label="データ入力" icon={<Laptop size={20}/>} active={data.skills.includes('data_entry')} onClick={() => toggleSkill('data_entry')} />
            <SkillTag label="翻訳" icon={<Scale size={20}/>} active={data.skills.includes('translation')} onClick={() => toggleSkill('translation')} />

            {/* リアル・生活系 */}
            <SkillTag label="運転" icon={<Briefcase size={20}/>} active={data.skills.includes('driving')} onClick={() => toggleSkill('driving')} />
            <SkillTag label="掃除・家事" icon={<CheckCircle2 size={20}/>} active={data.skills.includes('housework')} onClick={() => toggleSkill('housework')} />
            <SkillTag label="接客・販売" icon={<UserCircle size={20}/>} active={data.skills.includes('sales')} onClick={() => toggleSkill('sales')} />
            <SkillTag label="商品梱包" icon={<Download size={20}/>} active={data.skills.includes('packing')} onClick={() => toggleSkill('packing')} />
          </div>

          <button 
            disabled={data.skills.length === 0}
            onClick={nextStep}
            className="w-full py-6 bg-emerald-600 text-slate-950 text-2xl font-black rounded-[2rem] hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] italic uppercase"
          >
            次へ進む ➔
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
          <div className="text-center">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">活動可能な「時間」</h2>
            <p className="text-lg text-emerald-400/80 font-bold mt-3 italic">あなたのペースを決定せよ ➔</p>
          </div>
          <div className="grid gap-5">
            <StyleButton 
              icon={<Clock size={32} className="text-emerald-400" />} 
              title="隙間時間（1日30分）" 
              desc="【スマホのみ】ポチポチ作業で着実に。" 
              active={data.time === 'gap'}
              onClick={() => setData({...data, time:'gap'})} 
            />
            <StyleButton 
              icon={<Calendar size={32} className="text-emerald-400" />} 
              title="集中稼働（1日2時間）" 
              desc="【PC推奨】腰を据えて収益を最大化。" 
              active={data.time === 'daily'}
              onClick={() => setData({...data, time:'daily'})} 
            />
          </div>
          <button 
            disabled={!data.time || isSubmitting}
            onClick={() => onComplete(data)}
            className="w-full py-8 bg-emerald-600 text-slate-950 text-3xl font-black rounded-[2.5rem] hover:bg-emerald-400 disabled:opacity-50 flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.4)] italic uppercase group"
          >
            {isSubmitting ? (
              <div className="animate-spin h-8 w-8 border-4 border-slate-950 border-t-transparent rounded-full" />
            ) : (
              <>
                <Rocket size={32} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                ロードマップを生成せよ 🚀
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Powered by NextraLabs AI Engine</p>
      </div>
    </div>
  );
};

const StyleButton = ({ icon, title, desc, onClick, active }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center p-6 border-2 rounded-[2rem] transition-all text-left group shadow-lg ${active ? 'bg-emerald-500 border-emerald-400 ring-4 ring-emerald-500/20 scale-[1.02]' : 'bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10'}`}
  >
    <div className={`p-4 rounded-2xl transition-all ${active ? 'bg-white shadow-xl' : 'bg-white/5 group-hover:bg-white/10'}`}>
      {icon}
    </div>
    <div className="ml-6">
      <div className={`text-2xl font-black italic uppercase tracking-tighter ${active ? 'text-slate-950' : 'text-white'}`}>{title}</div>
      <div className={`text-sm font-bold mt-1 italic ${active ? 'text-slate-800' : 'text-slate-400'}`}>{desc}</div>
    </div>
  </button>
);

const SkillTag = ({ label, icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all shadow-lg ${active ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-[1.05]' : 'bg-white/5 border-white/10 text-slate-300 hover:border-emerald-500/50'}`}
  >
    <div className={active ? 'text-slate-950' : 'text-emerald-400'}>{icon}</div>
    <span className="text-lg font-black italic uppercase tracking-tighter">{label}</span>
  </button>
);