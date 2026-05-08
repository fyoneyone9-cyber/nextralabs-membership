'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles, ShoppingCart, Share2, AlertCircle, Twitter } from 'lucide-react';

export default function TrendStockPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userAffiliateId, setUserAffiliateId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tools/trend-stock');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-slate-950 min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 font-bold">{error}</p>
        <Button onClick={fetchTrendData} className="mt-4 text-white">再試行</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050507] text-slate-100 pb-12 font-sans">
      {/* MASTERMODEL SECURITY LINE */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-emerald-500 z-[100] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />

      <div className="container mx-auto p-4 max-w-4xl space-y-6 pt-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
              <TrendingUp className="text-emerald-500" />
              Trend Stock
            </h1>
            <p className="text-muted-foreground text-sm">SNSトレンド×楽天急上昇から「今売れる」を自動仕入れ</p>
          </div>
          {!loading && data?.isDefaultId && (
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="text-amber-600 border-amber-200">運営ID適用中</Badge>
              <button onClick={() => setShowSettings(!showSettings)} className="text-[10px] text-blue-500 underline">自分のIDを登録</button>
            </div>
          )}
        </header>

        {showSettings && (
          <Card className="border-dashed border border-blue-400 bg-blue-50/5 p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">楽天アフィリエイトID</label>
              <input 
                type="text" 
                value={userAffiliateId} 
                onChange={(e) => setUserAffiliateId(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-white/10 rounded text-white font-mono text-sm"
                placeholder="例: 534e3725..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={() => setShowSettings(false)} variant="ghost">キャンセル</Button>
              <Button size="sm" onClick={() => setShowSettings(false)} className="bg-blue-600">保存</Button>
            </div>
          </Card>
        )}

        <Card className="border-none bg-emerald-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-emerald-400 text-lg">
              <Sparkles className="w-5 h-5" />
              AI Trend Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-emerald-50/80 whitespace-pre-wrap">{data?.insight}</p>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 pt-4 text-white/90">
            <ShoppingCart className="w-5 h-5 text-emerald-500/60" />
            楽天リアルタイムランキング急上昇
          </h2>
          
          {data?.items.map((item: any, index: number) => (
            <Card key={index} className="bg-[#13141f] border-white/5 hover:border-white/20 overflow-hidden">
              <div className="flex flex-col sm:flex-row p-4 gap-4 items-center">
                <div className="relative w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <Badge className="absolute -top-2 -left-2 bg-emerald-500 text-slate-950 w-6 h-6 flex items-center justify-center p-0 rounded-full text-xs font-bold border-2 border-slate-950">
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-sm text-white line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-emerald-400/80 italic">{item.catchcopy}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 border-white/10 text-white" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">楽天</a>
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-bold gap-1"
                    onClick={() => {
                      const text = `【今、売れているのはコレ！】\n${item.name}\n\n${item.catchcopy}\n\n売り切れる前にチェック！👇\n${item.url}\n\n#楽天お買い物マラソン #トレンド #バズりアイテム #NextraLabs`;
                      navigator.clipboard.writeText(text);
                      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                      if (confirm('🔥 紹介文をコピーしました！\n\nこのままX（Twitter）の投稿画面を開きますか？')) {
                        window.open(xUrl, '_blank');
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    紹介文
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
