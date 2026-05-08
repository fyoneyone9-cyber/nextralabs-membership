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
    try {
      const res = await fetch('/api/user/profile');
      const json = await res.json();
      if (json.rakuten_affiliate_id) {
        setUserAffiliateId(json.rakuten_affiliate_id);
      }
    } catch (e) {
      console.log('Profile fetch failed');
    }
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
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 font-bold">{error}</p>
        <Button onClick={fetchTrendData} className="mt-4">再試行</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="text-emerald-500" />
            Trend Stock
          </h1>
          <p className="text-muted-foreground">SNSトレンド×楽天急上昇から「今売れる」を自動仕入れ</p>
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
        <Card className="border-dashed border-2 border-blue-400 bg-blue-50/30">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                楽天アフィリエイトID
              </label>
              <input 
                type="text" 
                value={userAffiliateId}
                onChange={(e) => setUserAffiliateId(e.target.value)}
                placeholder="例: 3e86f8a8.55831969.3e86f8a9.423985ee"
                className="w-full p-2 border rounded text-sm font-mono"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>キャンセル</Button>
              <Button size="sm" onClick={saveSettings} disabled={saving}>
                {saving ? '保存中...' : '設定を保存して適用'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-emerald-500 bg-emerald-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Sparkles className="w-5 h-5" />
            AI Trend Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-emerald-200 rounded w-full"></div>
              <div className="h-4 bg-emerald-200 rounded w-3/4"></div>
              <div className="h-4 bg-emerald-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="prose prose-emerald max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {data?.insight}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2 pt-4">
          <ShoppingCart className="w-5 h-5 text-slate-600" />
          楽天リアルタイムランキング急上昇
        </h2>
        
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="flex gap-4 p-4 items-center animate-pulse">
              <div className="w-24 h-24 bg-slate-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
              </div>
            </Card>
          ))
        ) : (
          data?.items.map((item: any, index: number) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row p-4 gap-4 items-center">
                <div className="relative">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded border" />
                  <Badge className="absolute -top-2 -left-2 bg-slate-800 text-white w-6 h-6 flex items-center justify-center p-0 rounded-full text-xs">
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-sm line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 italic">{item.catchcopy}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-none gap-1" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ShoppingCart className="w-4 h-4" />
                      楽天
                    </a>
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
