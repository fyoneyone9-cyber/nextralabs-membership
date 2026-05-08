'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles, ShoppingCart, Share2, AlertCircle } from 'lucide-react';

export default function TrendStockPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userAffiliateId, setUserAffiliateId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTrendData();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    // 404回避
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({ rakuten_affiliate_id: userAffiliateId }),
      });
      setShowSettings(false);
      fetchTrendData();
    } catch (e) {
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

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
    <div className="container mx-auto p-4 max-w-4xl space-y-6 min-h-screen bg-[#050507]">
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
            <Badge variant="outline" className="text-amber-600 border-amber-200">
              運営ID適用中（無料版）
            </Badge>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="text-[10px] text-blue-500 underline hover:text-blue-700"
            >
              自分のIDを登録して収益化する
            </button>
          </div>
        )}
      </header>

      {showSettings && (
        <Card className="border-dashed border border-blue-400 bg-blue-50/5">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">
                楽天アフィリエイトID
              </label>
              <input 
                type="text" 
                value={userAffiliateId}
                onChange={(e) => setUserAffiliateId(e.target.value)}
                placeholder="例: 3e86f8a8.55831969.3e86f8a9.423985ee"
                className="w-full p-2 bg-slate-900 border border-white/10 rounded text-sm font-mono text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)} className="text-white">キャンセル</Button>
              <Button size="sm" onClick={saveSettings} disabled={saving} className="bg-blue-600 text-white hover:bg-blue-700">
                {saving ? '保存中...' : '設定を保存'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insight Section - 枠線を消して背景のみに */}
      <Card className="border-none bg-emerald-500/10 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-emerald-400 text-lg">
            <Sparkles className="w-5 h-5" />
            AI Trend Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-emerald-400/10 rounded w-full"></div>
              <div className="h-4 bg-emerald-400/10 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-50/80">
                {data?.insight}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2 pt-4 text-white/90">
          <ShoppingCart className="w-5 h-5 text-emerald-500/60" />
          楽天リアルタイムランキング急上昇
        </h2>
        
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="flex gap-4 p-4 items-center bg-[#13141f] border-none animate-pulse">
              <div className="w-24 h-24 bg-slate-800 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
              </div>
            </Card>
          ))
        ) : (
          data?.items.map((item: any, index: number) => (
            <Card key={index} className="overflow-hidden bg-[#13141f] border-white/5 hover:border-white/20 transition-all">
              <div className="flex flex-col sm:flex-row p-4 gap-4 items-center">
                <div className="relative w-24 h-24 shrink-0 bg-slate-800 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <ShoppingCart className="absolute h-8 w-8 text-emerald-500/10" />
                  <Badge className="absolute -top-2 -left-2 bg-emerald-500 text-slate-950 w-6 h-6 flex items-center justify-center p-0 rounded-full text-xs font-bold border-2 border-slate-950 shadow-lg">
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-sm text-white line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-xs text-emerald-400/80 line-clamp-1 italic">{item.catchcopy}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-none gap-1 border-white/10 text-white hover:bg-white/5" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ShoppingCart className="w-4 h-4" />
                      楽天
                    </a>
                  </Button>
                  <Button 
                    className="flex-1 sm:flex-none gap-1 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-bold"
                    onClick={() => {
                      const text = `【今、売れているのはコレ！】\n${item.name}\n\n${item.catchcopy}\n\n売り切れる前にチェックして！👇\n${item.url}\n\n#楽天お買い物マラソン #トレンド #バズりアイテム #NextraLabs`;
                      navigator.clipboard.writeText(text);
                      alert('🔥 SNS紹介文をコピーしました！');
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    紹介文
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
