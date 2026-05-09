'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

export default function ReservationSearch({ lang, onFound }: { lang: string, onFound: (data: any) => void }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsProcessing] = useState(false);
  const t = lang === 'ja' ? { title: '予約を検索', placeholder: '予約番号 または 電話番号', btn: '検索する' } : { title: 'Find Reservation', placeholder: 'Reservation ID or Phone', btn: 'Search' };

  const handleSearch = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    onFound({ room_number: '301', name_kanji: 'Nextra Guest' });
    setIsProcessing(false);
  };

  return (
    <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-[3rem] overflow-hidden">
      <CardContent className="p-12 space-y-8">
        <h3 className="text-4xl font-bold text-white uppercase text-center">{t.title}</h3>
        <input 
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full h-20 bg-black border-2 border-white/10 rounded-2xl px-8 text-2xl font-bold text-white focus:border-emerald-500 outline-none transition-all"
          placeholder={t.placeholder}
        />
        <Button onClick={handleSearch} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xl rounded-2xl uppercase ">
          {isSearching ? <Loader2 className="animate-spin h-8 w-8 mx-auto" /> : t.btn}
        </Button>
      </CardContent>
    </Card>
  );
}
