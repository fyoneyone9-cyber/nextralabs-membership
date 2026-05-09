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
    <div className="max-w-2xl mx-auto border-2 border-emerald-500 rounded-3xl p-6 md:p-10 bg-gradient-to-br from-white to-emerald-50 shadow-2xl relative overflow-hidden">
      {/* MASTER品質の証 */}
      <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full uppercase tracking-widest">
        <ShieldCheck size={12} />
        MASTERMODEL v2.0
      </div>

      <div className="flex justify-between mb-10 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-2 w-full rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-800">副業スタイルを選択</h2>
            <p className="text-sm text-gray-500 mt-2">あなたの「稼ぎ方」の理想はどれですか？</p>
          </div>
          <div className="grid gap-4">
            <StyleButton 
              icon={<Zap className="text-yellow-500" />} 
              title="スピードスター" 
              desc="即金性重視。今日から1円を稼ぎに行く。" 
              active={data.style === 'speed'}
              onClick={() => {setData({...data, style:'speed'}); nextStep();}} 
            />
            <StyleButton 
              icon={<Diamond className="text-blue-500" />} 
              title="スペシャリスト" 
              desc="AIスキル習得。将来的に高単価を狙う。" 
              active={data.style === 'expert'}
              onClick={() => {setData({...data, style:'expert'}); nextStep();}} 
            />
            <StyleButton 
              icon={<Palette className="text-pink-500" />} 
              title="クリエイター" 
              desc="感性重視。AIを相棒に楽しく表現する。" 
              active={data.style === 'creator'}
              onClick={() => {setData({...data, style:'creator'}); nextStep();}} 
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-800">現在の「装備」をチェック</h2>
            <p className="text-sm text-gray-500 mt-2">今できること、興味があるものを選んでください（複数可）</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <SkillTag label="SNS投稿" icon={<Smartphone size={16}/>} active={data.skills.includes('sns')} onClick={() => toggleSkill('sns')} />
            <SkillTag label="文字入力" icon={<Briefcase size={16}/>} active={data.skills.includes('writing')} onClick={() => toggleSkill('writing')} />
            <SkillTag label="画像作成" icon={<Palette size={16}/>} active={data.skills.includes('design')} onClick={() => toggleSkill('design')} />
            <SkillTag label="リサーチ" icon={<Laptop size={16}/>} active={data.skills.includes('research')} onClick={() => toggleSkill('research')} />
            <SkillTag label="お悩み相談" icon={<Calendar size={16}/>} active={data.skills.includes('consulting')} onClick={() => toggleSkill('consulting')} />
            <SkillTag label="ポイ活" icon={<Zap size={16}/>} active={data.skills.includes('points')} onClick={() => toggleSkill('points')} />
          </div>
          <button 
            disabled={data.skills.length === 0}
            onClick={nextStep}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            次へ進む
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-800">活動可能な「時間」</h2>
            <p className="text-sm text-gray-500 mt-2">副業に充てられる時間はどのくらいですか？</p>
          </div>
          <div className="grid gap-4">
            <StyleButton 
              icon={<Clock className="text-emerald-500" />} 
              title="隙間時間（1日30分）" 
              desc="スマホだけでポチポチ作業" 
              active={data.time === 'gap'}
              onClick={() => setData({...data, time:'gap'})} 
            />
            <StyleButton 
              icon={<Calendar className="text-emerald-500" />} 
              title="夜間・休日（1日2時間）" 
              desc="PCで集中して作業" 
              active={data.time === 'daily'}
              onClick={() => setData({...data, time:'daily'})} 
            />
          </div>
          <button 
            disabled={!data.time || isSubmitting}
            onClick={() => onComplete(data)}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg text-lg"
          >
            {isSubmitting ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Rocket size={20} />
                ロードマップを生成する
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
    className={`flex items-center p-4 bg-white border-2 rounded-2xl transition-all text-left shadow-sm group ${active ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-gray-100 hover:border-emerald-300 hover:bg-emerald-50'}`}
  >
    <div className={`p-3 rounded-xl transition-colors ${active ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white'}`}>
      {icon}
    </div>
    <div className="ml-4">
      <div className="font-bold text-gray-800">{title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
    </div>
  </button>
);

const SkillTag = ({ label, icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${active ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50'}`}
  >
    {icon}
    <span className="text-xs font-bold">{label}</span>
  </button>
);