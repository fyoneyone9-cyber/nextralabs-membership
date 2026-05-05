'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import * as Icons from 'lucide-react'
import { DebugPanel } from './DebugPanel'

export default function YoutubeProducer() {
  const [step, setStep] = useState(1)
  const [copied, setCopied] = useState(false)
  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#0a0a0f', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#ef4444', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 20px' }}>
          <Icons.Clapperboard size={40} color="white" />
        </div>
        <h1 style={{ fontSize: '4rem', fontWeight: '900' }}>YouTube Producer</h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto 40px', backgroundColor: '#4f46e5', padding: '40px', borderRadius: '40px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>Step 01: 素材の準備</h2>
        <p style={{ fontSize: '1.2rem', marginTop: '10px', opacity: 0.9 }}>
          動画や音声をアップロードして、AIに渡すための文字起こし指示を作成しましょう。
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#111827', border: '2px solid #1f2937', borderRadius: '50px', padding: '50px' }}>
        <div style={{ marginBottom: '40px' }}>
          <Button 
            onClick={() => handleCopy('詳細に漏れのないように抜き出して下さい。この音声を一字一句正確に文字起こしして下さい。')}
            style={{ width: '100%', height: '100px', fontSize: '2rem', fontWeight: '900', borderRadius: '30px', backgroundColor: copied ? '#10b981' : 'white', color: copied ? 'white' : 'black' }}
          >
            {copied ? '✅ コピー完了！' : '指示（プロンプト）をコピー'}
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <a href="https://gemini.google.com" target="_blank" style={{ padding: '40px', backgroundColor: '#030712', border: '2px solid #374151', borderRadius: '30px', textDecoration: 'none' }}>
            <div style={{ fontSize: '3rem' }}>💎</div>
            <div style={{ fontWeight: '900', color: 'white', marginTop: '10px' }}>GEMINI</div>
          </a>
          <a href="https://chatgpt.com" target="_blank" style={{ padding: '40px', backgroundColor: '#030712', border: '2px solid #374151', borderRadius: '30px', textDecoration: 'none' }}>
            <div style={{ fontSize: '3rem' }}>🟢</div>
            <div style={{ fontWeight: '900', color: 'white', marginTop: '10px' }}>GPT</div>
          </a>
          <a href="https://claude.ai" target="_blank" style={{ padding: '40px', backgroundColor: '#030712', border: '2px solid #ea580c', borderRadius: '30px', textDecoration: 'none', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ea580c', color: 'white', padding: '5px 15px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '900' }}>RECOMMENDED</div>
            <div style={{ fontSize: '3rem' }}>🟠</div>
            <div style={{ fontWeight: '900', color: '#fb923c', marginTop: '10px' }}>CLAUDE</div>
          </a>
        </div>

        <Button 
          onClick={() => setStep(2)}
          style={{ width: '100%', height: '100px', fontSize: '2rem', fontWeight: '900', borderRadius: '30px', backgroundColor: '#ef4444', color: 'white', marginTop: '60px' }}
        >
          結果を貼って Step 02 へ進む →
        </Button>
      </div>
      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}