'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Search, Loader2, Mail, CheckCircle2, Building2, PackageSearch, HelpCircle, Zap } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

export default function StayseeFinderEngine() {
  const [image, setImage] = useState(null)
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center mb-12"><h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Staysee AI Finder</h1></div>
      <Card className="border-0 shadow-2xl overflow-hidden bg-[#1a1b23] rounded-[3rem]">
        <CardHeader className="bg-blue-600 p-10 text-white">
          <CardTitle className="text-4xl font-black tracking-tight">忘れ物特定エンジン</CardTitle>
          <CardDescription className="text-blue-100 text-lg mt-2 font-medium italic uppercase tracking-widest">B2B Professional Suite</Badge>
        </CardHeader>
        <CardContent className="p-16 text-center">
          <div className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 hover:bg-slate-800/30 transition-all cursor-pointer group">
            <Camera className="h-24 w-24 mx-auto mb-6 text-blue-500" />
            <h3 className="text-3xl font-black text-white">撮影を開始する</h3>
          </div>
        </CardContent>
      </Card>
      <DebugPanel data={null} toolId="staysee-ai-finder" />
    </div>
  )
}