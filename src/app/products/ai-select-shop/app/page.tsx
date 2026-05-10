'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Loader2, CheckCircle2, Zap, ShoppingCart,
  TrendingUp, Package, RefreshCw, ExternalLink, AlertCircle, Shuffle
} from 'lucide-react'

// ──────────────────────────────────────────────
// デザインスタイル定義（描画ロジック付き）
// ──────────────────────────────────────────────
type StyleDef = {
  id: string
  name: string
  draw: (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, text: string, pw: number, ph: number) => void
}

// テキストが maxWidth に収まるようフォントサイズを自動縮小してから描画するヘルパー
function drawFitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  stroke = false
) {
  let measured = ctx.measureText(text).width
  if (measured > maxWidth) {
    const currentSize = parseFloat(ctx.font)
    if (!isNaN(currentSize) && currentSize > 0) {
      const newSize = Math.max(10, Math.floor(currentSize * (maxWidth / measured)))
      ctx.font = ctx.font.replace(/[\d.]+px/, `${newSize}px`)
    }
  }
  if (stroke) ctx.strokeText(text, x, y)
  ctx.fillText(text, x, y)
}

const STYLES: StyleDef[] = [
  // ── 1. 和風・日の丸 ──────────────────────────────
  {
    id: 'japanese', name: '⛩ 和風',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      // 白地に青海波（和柄）
      ctx.fillStyle = '#fafaf7'; ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph)
      // 青海波パターン
      ctx.strokeStyle = 'rgba(192,57,43,0.15)'; ctx.lineWidth = 1.5
      const sz = 28
      for (let row = 0; row * sz < ph + sz; row++) {
        for (let col = -1; col * sz < pw + sz; col++) {
          const ox = cx - pw/2 + col*sz + (row%2)*sz/2
          const oy = cy - ph/2 + row*sz*0.7
          ctx.beginPath(); ctx.arc(ox, oy, sz*0.55, 0, Math.PI); ctx.stroke()
        }
      }
      // 日の丸
      ctx.fillStyle = '#c0392b'
      ctx.beginPath(); ctx.arc(cx, cy - r*0.15, r*0.62, 0, Math.PI*2); ctx.fill()
      ctx.font = `bold ${Math.floor(r*0.44)}px serif`
      ctx.fillStyle = '#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy - r*0.15, pw * 0.88)
    },
  },
  // ── 2. ストリート ──────────────────────────────
  {
    id: 'street', name: '🏙 ストリート',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle = '#0d0d0d'; ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph)
      // ブリックウォール柄
      const bw=36, bh=18
      for (let row=0; row*bh<ph+bh; row++) {
        const offset = (row%2)*bw/2
        for (let col=-1; col*bw<pw+bw; col++) {
          const bx=cx-pw/2+col*bw+offset, by=cy-ph/2+row*bh
          ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=1
          ctx.strokeRect(bx,by,bw,bh)
        }
      }
      // グラフィティ風大文字
      ctx.shadowColor='#ffdd00'; ctx.shadowBlur=16
      ctx.font=`900 ${Math.floor(r*0.52)}px Impact,sans-serif`
      ctx.fillStyle='#ffdd00'; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.strokeStyle='#000'; ctx.lineWidth=4
      drawFitText(ctx, text, cx, cy, pw * 0.88, true)
      ctx.shadowBlur=0
      ctx.font=`700 ${Math.floor(r*0.17)}px Helvetica,sans-serif`
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText('STREET WEAR', cx, cy+r*0.6)
    },
  },
  // ── 3. レトロ ──────────────────────────────
  {
    id: 'retro', name: '📻 レトロ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#f5e6c8'; ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph)
      // 斜めストライプ
      ctx.strokeStyle='rgba(92,61,30,0.12)'; ctx.lineWidth=6
      for (let i=-ph; i<pw+ph; i+=22) {
        ctx.beginPath()
        ctx.moveTo(cx-pw/2+i, cy-ph/2)
        ctx.lineTo(cx-pw/2+i+ph, cy+ph/2)
        ctx.stroke()
      }
      // レトロバッジ
      ctx.fillStyle='#5c3d1e'
      ctx.beginPath(); ctx.arc(cx, cy-r*0.1, r*0.65, 0, Math.PI*2); ctx.fill()
      ctx.strokeStyle='#f5e6c8'; ctx.lineWidth=3
      ctx.beginPath(); ctx.arc(cx, cy-r*0.1, r*0.58, 0, Math.PI*2); ctx.stroke()
      ctx.font=`bold ${Math.floor(r*0.4)}px Georgia,serif`
      ctx.fillStyle='#f5e6c8'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy - r*0.1, pw * 0.88)
      ctx.font=`${Math.floor(r*0.16)}px Georgia,serif`
      ctx.fillStyle='rgba(245,230,200,0.7)'; ctx.fillText('VINTAGE', cx, cy+r*0.52)
    },
  },
  // ── 4. サイバーパンク ──────────────────────────────
  {
    id: 'cyberpunk', name: '🌃 サイバー',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#000010'; ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph)
      // サーキットボード柄
      ctx.strokeStyle='rgba(0,255,255,0.18)'; ctx.lineWidth=1
      const grid=24
      for (let x=cx-pw/2; x<cx+pw/2; x+=grid) {
        ctx.beginPath(); ctx.moveTo(x, cy-ph/2); ctx.lineTo(x, cy+ph/2); ctx.stroke()
      }
      for (let y=cy-ph/2; y<cy+ph/2; y+=grid) {
        ctx.beginPath(); ctx.moveTo(cx-pw/2, y); ctx.lineTo(cx+pw/2, y); ctx.stroke()
      }
      // 交点ドット
      ctx.fillStyle='rgba(0,255,255,0.3)'
      for (let x=cx-pw/2; x<cx+pw/2; x+=grid) {
        for (let y=cy-ph/2; y<cy+ph/2; y+=grid) {
          ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill()
        }
      }
      // テキスト
      ctx.shadowColor='#00ffff'; ctx.shadowBlur=20
      ctx.font=`bold ${Math.floor(r*0.48)}px monospace`
      ctx.fillStyle='#00ffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
      ctx.strokeStyle='#ff00ff'; ctx.lineWidth=2
      ctx.beginPath(); ctx.moveTo(cx-r*0.7,cy+r*0.42); ctx.lineTo(cx+r*0.7,cy+r*0.42); ctx.stroke()
    },
  },
  // ── 5. かわいい ──────────────────────────────
  {
    id: 'kawaii', name: '🎀 かわいい',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      // ピンクグラデ背景
      const bg=ctx.createLinearGradient(cx-pw/2,cy-ph/2,cx+pw/2,cy+ph/2)
      bg.addColorStop(0,'#ffe4f0'); bg.addColorStop(1,'#ffd6e7')
      ctx.fillStyle=bg; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // ドットパターン
      ctx.fillStyle='rgba(255,105,180,0.18)'
      for (let x=cx-pw/2+10; x<cx+pw/2; x+=20) {
        for (let y=cy-ph/2+10; y<cy+ph/2; y+=20) {
          ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill()
        }
      }
      // ハート装飾
      const hearts=['💕','🌸','✨','🎀','💖']
      hearts.forEach((h,i)=>{
        const angle=(i/hearts.length)*Math.PI*2 - Math.PI/2
        ctx.font=`${Math.floor(r*0.22)}px sans-serif`
        ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText(h, cx+Math.cos(angle)*r*0.78, cy+Math.sin(angle)*r*0.78)
      })
      ctx.font=`bold ${Math.floor(r*0.44)}px "Noto Sans JP",sans-serif`
      ctx.fillStyle='#c2185b'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
    },
  },
  // ── 6. ミニマル ──────────────────────────────
  {
    id: 'minimal', name: '⬜ ミニマル',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#fafafa'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 細いグリッド
      ctx.strokeStyle='rgba(0,0,0,0.05)'; ctx.lineWidth=0.5
      const g=20
      for (let x=cx-pw/2; x<cx+pw/2; x+=g){ctx.beginPath();ctx.moveTo(x,cy-ph/2);ctx.lineTo(x,cy+ph/2);ctx.stroke()}
      for (let y=cy-ph/2; y<cy+ph/2; y+=g){ctx.beginPath();ctx.moveTo(cx-pw/2,y);ctx.lineTo(cx+pw/2,y);ctx.stroke()}
      ctx.font=`200 ${Math.floor(r*0.42)}px Helvetica,sans-serif`
      ctx.fillStyle='#111'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.strokeStyle='#111'; ctx.lineWidth=1.5
      ctx.beginPath(); ctx.moveTo(cx-r*0.45,cy+r*0.38); ctx.lineTo(cx+r*0.45,cy+r*0.38); ctx.stroke()
    },
  },
  // ── 7. ラグジュアリー ──────────────────────────────
  {
    id: 'gold', name: '💎 ラグジュアリー',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#080800'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 菱形柄
      ctx.strokeStyle='rgba(212,175,55,0.2)'; ctx.lineWidth=1
      const d=28
      for (let x=cx-pw/2-d; x<cx+pw/2+d; x+=d) {
        for (let y=cy-ph/2-d; y<cy+ph/2+d; y+=d) {
          ctx.beginPath()
          ctx.moveTo(x,y-d/2); ctx.lineTo(x+d/2,y)
          ctx.lineTo(x,y+d/2); ctx.lineTo(x-d/2,y)
          ctx.closePath(); ctx.stroke()
        }
      }
      // ゴールドテキスト
      const tg=ctx.createLinearGradient(cx,cy-r*0.3,cx,cy+r*0.3)
      tg.addColorStop(0,'#ffe566'); tg.addColorStop(0.5,'#d4af37'); tg.addColorStop(1,'#b8960c')
      ctx.shadowColor='rgba(212,175,55,0.6)'; ctx.shadowBlur=14
      ctx.font=`bold ${Math.floor(r*0.44)}px Georgia,serif`
      ctx.fillStyle=tg; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
      // ゴールドボーダー
      const bg2=ctx.createLinearGradient(cx-r,cy,cx+r,cy)
      bg2.addColorStop(0,'#b8960c'); bg2.addColorStop(0.5,'#ffe566'); bg2.addColorStop(1,'#b8960c')
      ctx.strokeStyle=bg2; ctx.lineWidth=2
      ctx.strokeRect(cx-r*0.88,cy-r*0.6,r*1.76,r*1.2)
    },
  },
  // ── 8. ネオン ──────────────────────────────
  {
    id: 'neon', name: '💡 ネオン',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#000000'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 縦のネオン管風ライン
      const lineColors=['#ff00ff','#00ffff','#ff6600','#39ff14','#ff0066']
      lineColors.forEach((c,i)=>{
        const x = cx-pw/2 + (i+1)*(pw/(lineColors.length+1))
        ctx.strokeStyle=c; ctx.lineWidth=2
        ctx.shadowColor=c; ctx.shadowBlur=8
        ctx.beginPath(); ctx.moveTo(x,cy-ph/2+8); ctx.lineTo(x,cy+ph/2-8); ctx.stroke()
        ctx.shadowBlur=0
      })
      ctx.shadowColor='#39ff14'; ctx.shadowBlur=22
      ctx.font=`bold ${Math.floor(r*0.5)}px monospace`
      ctx.fillStyle='#39ff14'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
      // 外枠
      ctx.strokeStyle='#39ff14'; ctx.lineWidth=2; ctx.shadowColor='#39ff14'; ctx.shadowBlur=10
      ctx.strokeRect(cx-pw/2+4,cy-ph/2+4,pw-8,ph-8)
      ctx.shadowBlur=0
    },
  },
  // ── 9. ボタニカル ──────────────────────────────
  {
    id: 'nature', name: '🌿 ボタニカル',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#f0f7f0'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 葉脈風ライン
      ctx.strokeStyle='rgba(46,204,113,0.2)'; ctx.lineWidth=1
      for (let i=0; i<8; i++) {
        const angle=(i/8)*Math.PI*2
        ctx.beginPath()
        ctx.moveTo(cx,cy)
        ctx.lineTo(cx+Math.cos(angle)*pw*0.6, cy+Math.sin(angle)*ph*0.6)
        ctx.stroke()
      }
      // 葉っぱアイコン
      const leafPos = [[-0.55,-0.5],[0.55,-0.5],[-0.55,0.5],[0.55,0.5],[-0.7,0],[0.7,0]]
      leafPos.forEach(([dx,dy])=>{
        ctx.font=`${Math.floor(r*0.3)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText('🌿', cx+dx*r, cy+dy*r)
      })
      ctx.strokeStyle='#2ecc71'; ctx.lineWidth=2.5
      ctx.beginPath(); ctx.arc(cx,cy,r*0.62,0,Math.PI*2); ctx.stroke()
      ctx.font=`bold ${Math.floor(r*0.4)}px Georgia,serif`
      ctx.fillStyle='#1a6b3a'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
    },
  },
  // ── 10. グラデーション ──────────────────────────────
  {
    id: 'gradient', name: '🌈 グラデーション',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      // 全面グラデ
      const g=ctx.createLinearGradient(cx-pw/2,cy-ph/2,cx+pw/2,cy+ph/2)
      g.addColorStop(0,'#6366f1'); g.addColorStop(0.35,'#a855f7'); g.addColorStop(0.65,'#ec4899'); g.addColorStop(1,'#f59e0b')
      ctx.fillStyle=g; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // ノイズ感
      ctx.fillStyle='rgba(255,255,255,0.06)'
      for (let i=0; i<40; i++) {
        ctx.beginPath()
        ctx.arc(cx-pw/2+Math.random()*pw, cy-ph/2+Math.random()*ph, Math.random()*18+4, 0, Math.PI*2)
        ctx.fill()
      }
      ctx.shadowColor='rgba(255,255,255,0.7)'; ctx.shadowBlur=16
      ctx.font=`700 ${Math.floor(r*0.46)}px sans-serif`
      ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
    },
  },
  // ── 11. 波・和柄 ──────────────────────────────
  {
    id: 'wave', name: '🌊 波・和柄',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#0a2a5e'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 北斎波柄
      for (let row=0; row<6; row++) {
        const y=cy-ph/2+(row+0.5)*(ph/6)
        const amp=ph/18
        for (let x=cx-pw/2; x<cx+pw/2; x+=4) {
          const wy=y+Math.sin((x-cx+pw/2)*0.12+row)*amp
          if (x===cx-pw/2) ctx.moveTo(x,wy); else {}
        }
        ctx.strokeStyle=`rgba(126,200,227,${0.15+row*0.05})`; ctx.lineWidth=1.5
        ctx.beginPath()
        for (let x=cx-pw/2; x<=cx+pw/2; x+=3) {
          const wy=y+Math.sin((x-(cx-pw/2))*0.11+row*1.3)*amp
          x===cx-pw/2 ? ctx.moveTo(x,wy) : ctx.lineTo(x,wy)
        }
        ctx.stroke()
      }
      // 円形バッジ
      ctx.fillStyle='rgba(255,255,255,0.1)'
      ctx.beginPath(); ctx.arc(cx,cy,r*0.68,0,Math.PI*2); ctx.fill()
      ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=2
      ctx.beginPath(); ctx.arc(cx,cy,r*0.68,0,Math.PI*2); ctx.stroke()
      ctx.font=`bold ${Math.floor(r*0.44)}px serif`
      ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
    },
  },
  // ── 12. ポップアート ──────────────────────────────
  {
    id: 'popart', name: '🎨 ポップアート',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#ffff00'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // ベンデイドット
      ctx.fillStyle='rgba(233,30,99,0.22)'
      for (let x=cx-pw/2+6; x<cx+pw/2; x+=16) {
        for (let y=cy-ph/2+6; y<cy+ph/2; y+=16) {
          ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill()
        }
      }
      ctx.strokeStyle='#000'; ctx.lineWidth=4
      ctx.strokeRect(cx-pw/2+4,cy-ph/2+4,pw-8,ph-8)
      ctx.font=`900 ${Math.floor(r*0.5)}px Impact,sans-serif`
      ctx.strokeStyle='#000'; ctx.lineWidth=5
      ctx.fillStyle='#e91e63'
      ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88, true)
    },
  },
  // ── 13. アニメ ──────────────────────────────
  {
    id: 'anime', name: '🌸 アニメ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      const g=ctx.createRadialGradient(cx,cy-ph*0.2,0,cx,cy,ph*0.7)
      g.addColorStop(0,'#1a1a4e'); g.addColorStop(1,'#0d0d2b')
      ctx.fillStyle=g; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 星フィールド
      ctx.fillStyle='rgba(255,255,255,0.7)'
      for (let i=0; i<25; i++) {
        const sx=cx-pw/2+Math.random()*pw, sy=cy-ph/2+Math.random()*ph
        ctx.beginPath(); ctx.arc(sx,sy,Math.random()*1.5+0.5,0,Math.PI*2); ctx.fill()
      }
      // 桜
      const pos=[[-0.6,-0.55],[0.6,-0.55],[-0.65,0.5],[0.65,0.5],[0,-0.7]]
      pos.forEach(([dx,dy])=>{
        ctx.font=`${Math.floor(r*0.25)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText('🌸', cx+dx*r, cy+dy*r)
      })
      ctx.shadowColor='#ff6ec7'; ctx.shadowBlur=14
      ctx.font=`bold ${Math.floor(r*0.45)}px "Noto Sans JP",sans-serif`
      ctx.fillStyle='#ff6ec7'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
    },
  },
  // ── 14. ヴィンテージ ──────────────────────────────
  {
    id: 'vintage', name: '🗿 ヴィンテージ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#e8d5a3'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // クロスハッチ
      ctx.strokeStyle='rgba(92,61,30,0.1)'; ctx.lineWidth=1
      for (let i=-ph; i<pw+ph; i+=18) {
        ctx.beginPath(); ctx.moveTo(cx-pw/2+i,cy-ph/2); ctx.lineTo(cx-pw/2+i+ph*0.8,cy+ph/2); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx-pw/2+i+ph*0.8,cy-ph/2); ctx.lineTo(cx-pw/2+i,cy+ph/2); ctx.stroke()
      }
      ctx.strokeStyle='#5c3d1e'; ctx.lineWidth=4
      ctx.strokeRect(cx-pw/2+6,cy-ph/2+6,pw-12,ph-12)
      ctx.strokeStyle='#5c3d1e'; ctx.lineWidth=1.5
      ctx.strokeRect(cx-pw/2+12,cy-ph/2+12,pw-24,ph-24)
      ctx.font=`bold ${Math.floor(r*0.42)}px Georgia,serif`
      ctx.fillStyle='#3d2610'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy - r*0.08, pw * 0.88)
      ctx.font=`${Math.floor(r*0.17)}px Georgia,serif`
      ctx.fillStyle='#7a5230'; ctx.fillText('EST. 2026', cx, cy+r*0.5)
    },
  },
  // ── 15. タイポグラフィ ──────────────────────────────
  {
    id: 'typo', name: '🔤 タイポ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#ffffff'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 巨大バックグラウンドテキスト
      ctx.font=`900 ${Math.floor(ph*0.9)}px Helvetica,sans-serif`
      ctx.fillStyle='rgba(0,0,0,0.04)'; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText(text.charAt(0), cx, cy)
      // メイン
      ctx.font=`900 ${Math.floor(r*0.5)}px Helvetica,sans-serif`
      ctx.fillStyle='#000000'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.strokeStyle='#ff3300'; ctx.lineWidth=5
      ctx.beginPath(); ctx.moveTo(cx-r*0.75,cy+r*0.42); ctx.lineTo(cx+r*0.75,cy+r*0.42); ctx.stroke()
    },
  },
  // ── 16. モノクロ ──────────────────────────────
  {
    id: 'monochrome', name: '🖤 モノクロ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#111'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // ハーフトーン
      ctx.fillStyle='rgba(255,255,255,0.06)'
      for (let x=cx-pw/2+8; x<cx+pw/2; x+=14) {
        for (let y=cy-ph/2+8; y<cy+ph/2; y+=14) {
          ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill()
        }
      }
      ctx.strokeStyle='#fff'; ctx.lineWidth=3
      ctx.beginPath(); ctx.arc(cx,cy,r*0.7,0,Math.PI*2); ctx.stroke()
      ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1
      ctx.beginPath(); ctx.arc(cx,cy,r*0.6,0,Math.PI*2); ctx.stroke()
      ctx.font=`300 ${Math.floor(r*0.42)}px Helvetica,sans-serif`
      ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
    },
  },
  // ── 17. モチベ ──────────────────────────────
  {
    id: 'motivational', name: '💪 モチベ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#0a0a0a'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 斜めストライプ
      ctx.strokeStyle='rgba(239,68,68,0.18)'; ctx.lineWidth=10
      for (let i=-ph; i<pw+ph; i+=30) {
        ctx.beginPath(); ctx.moveTo(cx-pw/2+i,cy-ph/2); ctx.lineTo(cx-pw/2+i+ph,cy+ph/2); ctx.stroke()
      }
      // 赤帯
      ctx.fillStyle='#ef4444'
      ctx.fillRect(cx-pw/2, cy-ph/2, pw, ph*0.22)
      ctx.font=`900 ${Math.floor(r*0.54)}px Impact,sans-serif`
      ctx.fillStyle='#ffffff'; ctx.strokeStyle='#000'; ctx.lineWidth=2
      ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy+r*0.1, pw * 0.88, true)
      ctx.font=`700 ${Math.floor(r*0.17)}px Helvetica,sans-serif`
      ctx.fillStyle='#ef4444'; ctx.fillText('NEVER GIVE UP', cx, cy+r*0.68)
    },
  },
  // ── 18. エモ系 ──────────────────────────────
  {
    id: 'aesthetic', name: '🌙 エモ系',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      const g=ctx.createLinearGradient(cx-pw/2,cy-ph/2,cx+pw/2,cy+ph/2)
      g.addColorStop(0,'#0f0c29'); g.addColorStop(0.5,'#302b63'); g.addColorStop(1,'#24243e')
      ctx.fillStyle=g; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 星フィールド
      ctx.fillStyle='rgba(255,255,255,0.85)'
      for (let i=0; i<30; i++) {
        const sx=cx-pw/2+Math.random()*pw, sy=cy-ph/2+Math.random()*ph
        ctx.beginPath(); ctx.arc(sx,sy,Math.random()*1.8+0.5,0,Math.PI*2); ctx.fill()
      }
      // 月
      ctx.fillStyle='#fffde7'; ctx.beginPath(); ctx.arc(cx+r*0.5,cy-r*0.5,r*0.22,0,Math.PI*2); ctx.fill()
      ctx.fillStyle='#302b63'; ctx.beginPath(); ctx.arc(cx+r*0.62,cy-r*0.56,r*0.18,0,Math.PI*2); ctx.fill()
      ctx.shadowColor='#a78bfa'; ctx.shadowBlur=12
      ctx.font=`600 ${Math.floor(r*0.42)}px "Noto Sans JP",sans-serif`
      ctx.fillStyle='#e9d5ff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy + r*0.1, pw * 0.88)
      ctx.shadowBlur=0
    },
  },
  // ── 19. サーフ ──────────────────────────────
  {
    id: 'surf', name: '🏄 サーフ',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      const g=ctx.createLinearGradient(cx-pw/2,cy-ph/2,cx+pw/2,cy+ph/2)
      g.addColorStop(0,'#0ea5e9'); g.addColorStop(1,'#0369a1')
      ctx.fillStyle=g; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 波
      for (let row=1; row<=4; row++) {
        const wy=cy-ph/2+row*(ph/5)
        ctx.strokeStyle=`rgba(255,255,255,${0.15+row*0.04})`; ctx.lineWidth=2.5
        ctx.beginPath()
        for (let x=cx-pw/2; x<=cx+pw/2; x+=3) {
          const y=wy+Math.sin((x-(cx-pw/2))*0.1)*8
          x===cx-pw/2 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
        }
        ctx.stroke()
      }
      ctx.fillStyle='#fbbf24'; ctx.beginPath(); ctx.arc(cx+r*0.65,cy-r*0.52,r*0.2,0,Math.PI*2); ctx.fill()
      ctx.font=`900 ${Math.floor(r*0.48)}px Impact,sans-serif`
      ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy - r*0.1, pw * 0.88)
      ctx.font=`600 ${Math.floor(r*0.17)}px Helvetica,sans-serif`
      ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.fillText('SURF VIBES', cx, cy+r*0.52)
    },
  },
  // ── 20. バトル ──────────────────────────────
  {
    id: 'dragonball', name: '⚡ バトル',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,ph*0.65)
      g.addColorStop(0,'#fef08a'); g.addColorStop(0.4,'#f59e0b'); g.addColorStop(1,'#7c2d12')
      ctx.fillStyle=g; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 放射線
      ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1.5
      for (let i=0; i<16; i++) {
        const angle=(i/16)*Math.PI*2
        ctx.beginPath()
        ctx.moveTo(cx+Math.cos(angle)*r*0.4, cy+Math.sin(angle)*r*0.4)
        ctx.lineTo(cx+Math.cos(angle)*pw*0.65, cy+Math.sin(angle)*ph*0.55)
        ctx.stroke()
      }
      ctx.shadowColor='#fbbf24'; ctx.shadowBlur=18
      ctx.font=`900 ${Math.floor(r*0.5)}px Impact,sans-serif`
      ctx.fillStyle='#1a1a1a'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx+2, cy+2, pw * 0.88)
      ctx.fillStyle='#ffffff'; drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
    },
  },
  // ── 21. 山・自然 ──────────────────────────────
  {
    id: 'nature2', name: '🍃 山・自然',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      const sky=ctx.createLinearGradient(cx,cy-ph/2,cx,cy+ph/2)
      sky.addColorStop(0,'#1e3a5f'); sky.addColorStop(0.55,'#3b6aa0'); sky.addColorStop(1,'#1a3a2a')
      ctx.fillStyle=sky; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 山のシルエット
      ctx.fillStyle='#1a3a2a'
      ctx.beginPath()
      ctx.moveTo(cx-pw/2,cy+ph/2)
      ctx.lineTo(cx-pw*0.3,cy-ph*0.05)
      ctx.lineTo(cx-pw*0.1,cy+ph*0.1)
      ctx.lineTo(cx+pw*0.1,cy-ph*0.18)
      ctx.lineTo(cx+pw*0.35,cy+ph*0.05)
      ctx.lineTo(cx+pw/2,cy+ph/2)
      ctx.closePath(); ctx.fill()
      // 雪
      ctx.fillStyle='#e2e8f0'
      ctx.beginPath(); ctx.moveTo(cx+pw*0.1,cy-ph*0.18); ctx.lineTo(cx+pw*0.22,cy-ph*0.02); ctx.lineTo(cx-pw*0.02,cy-ph*0.02); ctx.closePath(); ctx.fill()
      ctx.font=`bold ${Math.floor(r*0.42)}px "Noto Sans JP",serif`
      ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy + ph*0.35, pw * 0.88)
    },
  },
  // ── 22. 猫・動物 ──────────────────────────────
  {
    id: 'cats', name: '🐱 猫・動物',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#fef3c7'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      ctx.fillStyle='rgba(245,158,11,0.1)'
      for (let x=cx-pw/2+6; x<cx+pw/2; x+=24) {
        for (let y=cy-ph/2+6; y<cy+ph/2; y+=24) {
          ctx.beginPath(); ctx.arc(x,y,7,0,Math.PI*2); ctx.fill()
        }
      }
      // 大きな猫顔
      ctx.fillStyle='#f59e0b'
      ctx.beginPath(); ctx.arc(cx, cy-r*0.08, r*0.42, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.moveTo(cx-r*0.3,cy-r*0.4); ctx.lineTo(cx-r*0.46,cy-r*0.65); ctx.lineTo(cx-r*0.12,cy-r*0.4); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(cx+r*0.3,cy-r*0.4); ctx.lineTo(cx+r*0.46,cy-r*0.65); ctx.lineTo(cx+r*0.12,cy-r*0.4); ctx.closePath(); ctx.fill()
      ctx.fillStyle='#1a1a1a'
      ctx.beginPath(); ctx.arc(cx-r*0.15,cy-r*0.12,r*0.06,0,Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx+r*0.15,cy-r*0.12,r*0.06,0,Math.PI*2); ctx.fill()
      ctx.font=`bold ${Math.floor(r*0.36)}px "Noto Sans JP",sans-serif`
      ctx.fillStyle='#92400e'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy + r*0.68, pw * 0.88)
    },
  },
  // ── 23. オールドマネー ──────────────────────────────
  {
    id: 'oldmoney', name: '🎩 オールドマネー',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#f8f4e8'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 千鳥格子風
      ctx.fillStyle='rgba(26,61,43,0.08)'
      for (let x=cx-pw/2; x<cx+pw/2; x+=16) {
        for (let y=cy-ph/2; y<cy+ph/2; y+=16) {
          if (Math.floor((x-(cx-pw/2))/16+y/16)%2===0) ctx.fillRect(x,y,16,16)
        }
      }
      ctx.strokeStyle='#1a3d2b'; ctx.lineWidth=5
      ctx.strokeRect(cx-pw/2+5,cy-ph/2+5,pw-10,ph-10)
      ctx.strokeStyle='#1a3d2b'; ctx.lineWidth=1.5
      ctx.strokeRect(cx-pw/2+11,cy-ph/2+11,pw-22,ph-22)
      ctx.font=`600 ${Math.floor(r*0.42)}px Georgia,serif`
      ctx.fillStyle='#1a3d2b'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.font=`${Math.floor(r*0.16)}px Georgia,serif`
      ctx.fillStyle='#4a7c59'; ctx.fillText('EST. MCMXXI', cx, cy+r*0.54)
    },
  },
  // ── 24. スケート ──────────────────────────────
  {
    id: 'skateboard', name: '🛹 スケート',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#f8fafc'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      const cols=['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899']
      const bw=pw/cols.length
      cols.forEach((c,i)=>{
        ctx.fillStyle=c+'22'
        ctx.fillRect(cx-pw/2+i*bw, cy-ph/2, bw, ph)
        ctx.strokeStyle=c; ctx.lineWidth=3
        ctx.beginPath()
        ctx.moveTo(cx-pw/2+i*bw+bw/2,cy-ph/2+6)
        ctx.lineTo(cx-pw/2+i*bw+bw/2,cy+ph/2-6)
        ctx.stroke()
      })
      ctx.font=`900 ${Math.floor(r*0.5)}px Impact,sans-serif`
      ctx.fillStyle='#0f172a'; ctx.strokeStyle='#fff'; ctx.lineWidth=4
      ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88, true)
    },
  },
  // ── 25. 幾何学 ──────────────────────────────
  {
    id: 'abstract2', name: '🔷 幾何学',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#1e1b4b'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      const shapes=[
        {x:-0.48,y:-0.38,s:0.25,c:'#6366f1',rot:45},
        {x:0.42,y:-0.28,s:0.2,c:'#a855f7',rot:30},
        {x:-0.3,y:0.38,s:0.22,c:'#ec4899',rot:60},
        {x:0.48,y:0.32,s:0.18,c:'#8b5cf6',rot:15},
        {x:0,y:-0.55,s:0.16,c:'#06b6d4',rot:22},
        {x:0,y:0.55,s:0.18,c:'#f59e0b',rot:38},
      ]
      shapes.forEach(s=>{
        ctx.save(); ctx.translate(cx+s.x*pw/2.2,cy+s.y*ph/2.2)
        ctx.rotate(s.rot*Math.PI/180)
        ctx.strokeStyle=s.c; ctx.lineWidth=2; ctx.globalAlpha=0.75
        ctx.strokeRect(-s.s*r,-s.s*r,s.s*r*2,s.s*r*2)
        ctx.restore()
      })
      ctx.globalAlpha=1
      ctx.shadowColor='#a855f7'; ctx.shadowBlur=10
      ctx.font=`700 ${Math.floor(r*0.44)}px sans-serif`
      ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
    },
  },
  // ── 26. Y2K ──────────────────────────────
  {
    id: 'y2k', name: '💿 Y2K',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      const g=ctx.createLinearGradient(cx-pw/2,cy-ph/2,cx+pw/2,cy+ph/2)
      g.addColorStop(0,'#c0c0c0'); g.addColorStop(0.2,'#e8e8ff'); g.addColorStop(0.45,'#ffc0cb')
      g.addColorStop(0.7,'#c0ffee'); g.addColorStop(1,'#c0c0c0')
      ctx.fillStyle=g; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1
      for (let i=1; i<=5; i++) {ctx.beginPath();ctx.arc(cx,cy,r*0.22*i,0,Math.PI*2);ctx.stroke()}
      ctx.fillStyle='rgba(248,248,255,0.9)'; ctx.beginPath(); ctx.arc(cx,cy,r*0.12,0,Math.PI*2); ctx.fill()
      ctx.font=`900 ${Math.floor(r*0.42)}px Impact,sans-serif`
      ctx.fillStyle='#1a1a2e'; ctx.strokeStyle='#ffffff'; ctx.lineWidth=3
      ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88, true)
    },
  },
  // ── 27. 禅・墨 ──────────────────────────────
  {
    id: 'zen', name: '☯ 禅・墨',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#fafaf7'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      // 墨の濃淡
      ctx.fillStyle='rgba(20,20,20,0.04)'
      ctx.beginPath(); ctx.arc(cx-r*0.25,cy+r*0.1,r*0.6,0,Math.PI*2); ctx.fill()
      ctx.fillStyle='rgba(20,20,20,0.03)'
      ctx.beginPath(); ctx.arc(cx+r*0.3,cy-r*0.2,r*0.4,0,Math.PI*2); ctx.fill()
      ctx.strokeStyle='rgba(20,20,20,0.7)'; ctx.lineWidth=2.5
      ctx.setLineDash([8,4]); ctx.beginPath(); ctx.arc(cx,cy,r*0.78,0,Math.PI*2); ctx.stroke()
      ctx.setLineDash([])
      ctx.font=`bold ${Math.floor(r*0.55)}px serif`
      ctx.fillStyle='rgba(20,20,20,0.88)'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx+r*0.03, cy+r*0.03, pw * 0.88)
      ctx.fillStyle='rgba(20,20,20,0.08)'; drawFitText(ctx, text, cx, cy, pw * 0.88)
    },
  },
  // ── 28. ストリート系 ──────────────────────────────
  {
    id: 'toxic', name: '☣ ストリート系',
    draw: (ctx, cx, cy, r, text, pw, ph) => {
      ctx.fillStyle='#050f05'; ctx.fillRect(cx-pw/2,cy-ph/2,pw,ph)
      ctx.fillStyle='rgba(74,222,128,0.08)'
      for (let x=cx-pw/2+6; x<cx+pw/2; x+=18) {
        for (let y=cy-ph/2+6; y<cy+ph/2; y+=18) {
          ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill()
        }
      }
      ctx.shadowColor='#4ade80'; ctx.shadowBlur=25
      ctx.strokeStyle='#4ade80'; ctx.lineWidth=2
      ctx.strokeRect(cx-pw/2+5,cy-ph/2+5,pw-10,ph-10)
      ctx.shadowBlur=12; ctx.shadowColor='#4ade80'
      ctx.font=`900 ${Math.floor(r*0.5)}px monospace`
      ctx.fillStyle='#4ade80'; ctx.textAlign='center'; ctx.textBaseline='middle'
      drawFitText(ctx, text, cx, cy, pw * 0.88)
      ctx.shadowBlur=0
    },
  },
]

// ──────────────────────────────────────────────
// Tシャツカラー
// ──────────────────────────────────────────────
const TSHIRT_COLORS = [
  { id: 'white',  name: '白',      hex: '#FFFFFF' },
  { id: 'black',  name: '黒',      hex: '#1a1a1a' },
  { id: 'navy',   name: '紺',      hex: '#1e3a5f' },
  { id: 'gray',   name: 'グレー', hex: '#808080' },
  { id: 'red',    name: 'レッド', hex: '#e74c3c' },
  { id: 'beige',  name: 'ベージュ', hex: '#f5e6c8' },
  { id: 'green',  name: 'グリーン', hex: '#2d6a4f' },
  { id: 'purple', name: 'パープル', hex: '#6b21a8' },
  { id: 'pink',   name: 'ピンク', hex: '#f472b6' },
  { id: 'orange', name: 'オレンジ', hex: '#ea580c' },
]

// ──────────────────────────────────────────────
// サイズ定義
// ──────────────────────────────────────────────
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']

// ──────────────────────────────────────────────
// フォールバックトレンド
// ──────────────────────────────────────────────
const FALLBACK_TRENDS = [
  'AI活用術', '副業・在宅ワーク', '節約・投資',
  'ChatGPT最新', '動画制作', '健康・ダイエット',
  '転職・キャリア', 'ガジェット', 'SNSマーケ'
]

// ──────────────────────────────────────────────
// Tシャツ輪郭描画
// ──────────────────────────────────────────────
function drawTshirtShape(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.beginPath()
  ctx.moveTo(w * 0.20, h * 0.08)
  ctx.lineTo(w * 0.35, h * 0.04)
  ctx.quadraticCurveTo(w * 0.50, h * 0.14, w * 0.65, h * 0.04)
  ctx.lineTo(w * 0.80, h * 0.08)
  ctx.lineTo(w * 0.97, h * 0.28)
  ctx.lineTo(w * 0.80, h * 0.34)
  ctx.lineTo(w * 0.80, h * 0.93)
  ctx.lineTo(w * 0.20, h * 0.93)
  ctx.lineTo(w * 0.20, h * 0.34)
  ctx.lineTo(w * 0.03, h * 0.28)
  ctx.closePath()
}

// ──────────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────────
const AISelectShopApp = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([])
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [styleId, setStyleId] = useState('japanese')
  const [tshirtColorId, setTshirtColorId] = useState('black')
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL'])
  const [mockupDataUrl, setMockupDataUrl] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ url?: string; error?: string } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ── トレンド取得 ──
  const fetchTrends = async () => {
    setIsLoadingTrends(true)
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' })
      const d = await r.json()
      if (d.trends && d.trends.length > 0) {
        const fetched: string[] = d.trends.slice(0, 9)
        const padded = fetched.length >= 9
          ? fetched
          : [...fetched, ...FALLBACK_TRENDS.filter(f => !fetched.includes(f))].slice(0, 9)
        setTrends(padded.map((t, i) => ({ id: i, name: t })))
        setIsLive(d.isLive === true)
      } else throw new Error('empty')
    } catch {
      setTrends(FALLBACK_TRENDS.map((t, i) => ({ id: i, name: t })))
      setIsLive(false)
    } finally {
      setIsLoadingTrends(false)
    }
  }

  useEffect(() => { fetchTrends() }, [])

  // ── ランダム生成 ──
  const handleRandom = () => {
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)]
    const randomColor = TSHIRT_COLORS[Math.floor(Math.random() * TSHIRT_COLORS.length)]
    setStyleId(randomStyle.id)
    setTshirtColorId(randomColor.id)
  }

  // ── サイズ選択トグル ──
  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.length > 1 ? prev.filter(s => s !== size) : prev
        : [...prev, size]
    )
  }

  // ── Canvas描画 ──
  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !keyword) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height
    const S = STYLES.find(s => s.id === styleId) || STYLES[0]
    const TC = TSHIRT_COLORS.find(c => c.id === tshirtColorId) || TSHIRT_COLORS[1]

    // ── STEP 1: 全消去＋背景 ──
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, w, h)

    // ── STEP 2: Tシャツ影（offscreen合成で漏れなし） ──
    const offscreen = document.createElement('canvas')
    offscreen.width = w; offscreen.height = h
    const oc = offscreen.getContext('2d')!
    drawTshirtShape(oc, w, h)
    oc.fillStyle = TC.hex
    oc.fill()
    // 光沢
    const shine = oc.createLinearGradient(w * 0.2, h * 0.05, w * 0.75, h * 0.9)
    shine.addColorStop(0,   'rgba(255,255,255,0.22)')
    shine.addColorStop(0.35,'rgba(255,255,255,0.08)')
    shine.addColorStop(1,   'rgba(0,0,0,0.12)')
    oc.fillStyle = shine
    oc.fill()

    // 影として合成
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.35)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 8
    ctx.drawImage(offscreen, 0, 0)
    ctx.restore()

    // ── STEP 3: Tシャツ本体（影なし、クリップ用パス再生成） ──
    ctx.save()
    drawTshirtShape(ctx, w, h)
    ctx.fillStyle = TC.hex
    ctx.fill()
    const shine2 = ctx.createLinearGradient(w * 0.2, h * 0.05, w * 0.75, h * 0.9)
    shine2.addColorStop(0,   'rgba(255,255,255,0.22)')
    shine2.addColorStop(0.35,'rgba(255,255,255,0.08)')
    shine2.addColorStop(1,   'rgba(0,0,0,0.12)')
    ctx.fillStyle = shine2
    ctx.fill()
    ctx.restore()

    // ── STEP 4: 印刷エリア（胸中央）にデザインを描画 ──
    // 印刷エリア: 幅46% / 縦38% / 胸部中央
    const px = Math.round(w * 0.27)
    const py = Math.round(h * 0.33)
    const pw = Math.round(w * 0.46)
    const ph = Math.round(h * 0.36)
    const cx = px + pw / 2
    const cy = py + ph / 2
    const r  = Math.min(pw, ph) * 0.44

    // 印刷エリアでクリップ（arc/lineTo で roundRect互換）
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(px + 8, py)
    ctx.lineTo(px + pw - 8, py)
    ctx.arcTo(px + pw, py, px + pw, py + 8, 8)
    ctx.lineTo(px + pw, py + ph - 8)
    ctx.arcTo(px + pw, py + ph, px + pw - 8, py + ph, 8)
    ctx.lineTo(px + 8, py + ph)
    ctx.arcTo(px, py + ph, px, py + ph - 8, 8)
    ctx.lineTo(px, py + 8)
    ctx.arcTo(px, py, px + 8, py, 8)
    ctx.closePath()
    ctx.clip()

    const shortText = keyword.length > 8 ? keyword.slice(0, 8) + '…' : keyword
    S.draw(ctx, cx, cy, r, shortText, pw, ph)
    ctx.restore()

    // ── STEP 5: 印刷エリア枠（点線） ──
    ctx.save()
    ctx.strokeStyle = 'rgba(0,0,0,0.10)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(px + 8, py)
    ctx.lineTo(px + pw - 8, py)
    ctx.arcTo(px + pw, py, px + pw, py + 8, 8)
    ctx.lineTo(px + pw, py + ph - 8)
    ctx.arcTo(px + pw, py + ph, px + pw - 8, py + ph, 8)
    ctx.lineTo(px + 8, py + ph)
    ctx.arcTo(px, py + ph, px, py + ph - 8, 8)
    ctx.lineTo(px, py + 8)
    ctx.arcTo(px, py, px + 8, py, 8)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()

    setMockupDataUrl(canvas.toDataURL('image/png'))
  }, [keyword, styleId, tshirtColorId])

  useEffect(() => { if (keyword) drawDesign() }, [keyword, styleId, tshirtColorId, drawDesign])

  // ── 出品処理 ──
  const handlePublish = async () => {
    if (!keyword || !mockupDataUrl) return
    setIsPublishing(true)
    setPublishResult(null)
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-product',
          keyword,
          style: styleId,
          mockupUrl: mockupDataUrl,
          tshirtColor: tshirtColorId,
          sizes: selectedSizes,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setPublishResult({ error: data.error })
      } else {
        setPublishResult({ url: data.url || data.shopifyUrl || '#' })
        setStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (e: any) {
      setPublishResult({ error: e.message || '出品に失敗しました' })
    } finally {
      setIsPublishing(false)
    }
  }

  // ──────────────────────────────────────────────
  // UI
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100" style={{ fontFamily: "'Inter','Noto Sans JP',sans-serif" }}>
      <div className="h-1 bg-emerald-500 w-full" />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        {/* ヘッダー */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 tracking-wide">
              {isLive ? 'LIVE TREND DATA' : 'CACHED DATA'}
            </span>
          </div>
          <h1 className="text-4xl font-semibold text-white tracking-tight leading-[1.15]">
            AIセレクトショップ
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            トレンドを選んでデザインを生成。Shopifyへ自動出品して在庫ゼロで販売をはじめましょう。
          </p>
        </div>

        {/* ステップナビ */}
        <div className="flex gap-1 bg-[#1e293b] p-1 rounded-xl max-w-sm border border-slate-700/50">
          {([
            { n: 1, label: 'トレンド選択' },
            { n: 2, label: 'デザイン生成' },
            { n: 3, label: '出品完了' },
          ] as { n: 1|2|3; label: string }[]).map(({ n, label }) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                step === n
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── Step 1: トレンド選択 ─── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">今週のトレンドキーワード</h2>
              <button
                onClick={fetchTrends}
                disabled={isLoadingTrends}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={isLoadingTrends ? 'animate-spin' : ''} />
                更新
              </button>
            </div>

            {isLoadingTrends ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-20 bg-[#1e293b] rounded-xl animate-pulse border border-slate-700/50" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {trends.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setKeyword(t.name); setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="h-20 bg-[#1e293b] border border-slate-700/50 hover:border-emerald-500 hover:bg-[#1e293b]/80 rounded-xl px-5 text-left font-medium text-slate-200 hover:text-emerald-400 transition-all"
                  >
                    <span className="text-xs text-slate-500 block mb-1">TREND</span>
                    <span className="text-base">{t.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 手入力 */}
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
              <p className="text-sm font-medium text-slate-300">または自分でキーワードを入力</p>
              <div className="flex gap-3">
                <input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="例：AI美女、侍、宇宙猫..."
                  className="flex-1 h-11 bg-[#0f172a] border border-slate-700 rounded-lg px-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
                />
                <button
                  onClick={() => { if (keyword) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
                  disabled={!keyword}
                  className="h-11 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  次へ →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: デザイン生成 & 出品 ─── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">デザインを生成して出品</h2>
              <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">← 戻る</button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* 左：設定パネル */}
              <div className="space-y-4">

                {/* キーワード */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">キーワード</label>
                  <input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="w-full h-11 bg-[#0f172a] border border-slate-700 rounded-lg px-4 text-base text-white focus:border-emerald-500 outline-none transition-colors"
                  />
                </div>

                {/* デザインスタイル + ランダムボタン */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">デザインスタイル</label>
                    <button
                      onClick={handleRandom}
                      className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 transition-all"
                    >
                      <Shuffle size={12} />
                      ランダム
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setStyleId(s.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-medium transition-all leading-tight ${
                          styleId === s.id
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-[#0f172a] text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tシャツカラー */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Tシャツカラー</label>
                  <div className="flex flex-wrap gap-2">
                    {TSHIRT_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setTshirtColorId(c.id)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          tshirtColorId === c.id
                            ? 'border-emerald-400 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'border-slate-600 hover:border-slate-400'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* サイズ選択 */}
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">販売サイズ</label>
                    <span className="text-xs text-slate-500">{selectedSizes.length}種選択中</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {ALL_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`h-9 px-4 rounded-lg text-sm font-medium transition-all border ${
                          selectedSizes.includes(size)
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                            : 'bg-[#0f172a] text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">※ 1つ以上選択必須。Printful対応サイズ</p>
                </div>

                {/* エラー表示 */}
                {publishResult?.error && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {publishResult.error}
                  </div>
                )}

                {/* 出品ボタン */}
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !keyword || !mockupDataUrl || selectedSizes.length === 0}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-base rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                >
                  {isPublishing ? (
                    <><Loader2 size={18} className="animate-spin" /> Shopifyへ出品中...</>
                  ) : (
                    <><ShoppingCart size={18} /> Shopifyへ自動出品</>
                  )}
                </button>
              </div>

              {/* 右：プレビュー */}
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">プレビュー</p>
                  {styleId && (
                    <span className="text-xs text-emerald-400 font-medium">
                      {STYLES.find(s => s.id === styleId)?.name}
                    </span>
                  )}
                </div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={500}
                  className="max-w-full rounded-xl"
                />
                {!keyword && (
                  <p className="text-sm text-slate-500 text-center">キーワードを入力するとプレビューが表示されます</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 3: 出品完了 ─── */}
        {step === 3 && (
          <div className="space-y-6">
            {/* 出品完了カード */}
            <div className="bg-[#1e293b] border border-emerald-500/30 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Shopifyへの出品が完了しました</h2>
                  <p className="text-xs text-slate-400 mt-0.5">受注後はPrintfulが自動で生産・発送します</p>
                </div>
              </div>

              {/* 出品詳細 */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">商品名</p>
                  <p className="text-white font-medium">{keyword}</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">デザイン</p>
                  <p className="text-white font-medium">{STYLES.find(s => s.id === styleId)?.name || styleId}</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">出品先</p>
                  <p className="text-emerald-400 font-medium font-mono text-xs">z5ju1n-vs.myshopify.com</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">販売サイズ</p>
                  <p className="text-white font-medium text-xs">{selectedSizes.join(' / ')}</p>
                </div>
              </div>

              {/* Shopifyリンク */}
              <div className="flex gap-3">
                {publishResult?.url && publishResult.url !== '#' ? (
                  <a
                    href={publishResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 h-11 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-xl transition-colors"
                  >
                    <ExternalLink size={16} /> Shopify管理画面で確認
                  </a>
                ) : (
                  <a
                    href="https://z5ju1n-vs.myshopify.com/admin/products"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 h-11 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-xl transition-colors"
                  >
                    <ExternalLink size={16} /> Shopify管理画面を開く
                  </a>
                )}
                <a
                  href="https://z5ju1n-vs.myshopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 px-4 bg-[#0f172a] border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 text-sm rounded-xl transition-colors"
                >
                  <ExternalLink size={14} /> ストア
                </a>
              </div>
            </div>

            {/* 販売ロードマップ */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">販売ロードマップ</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: ShoppingCart, title: '自動出品', desc: 'Shopify × Printful連携。在庫リスクゼロで販売開始。' },
                  { icon: TrendingUp,   title: 'SNS集客',  desc: 'モックアップ画像をXやInstagramでシェアして集客。' },
                  { icon: Zap,          title: '完全自動化', desc: '受注後の生産・配送はシステムが自動で処理。' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <s.icon size={18} className="text-emerald-400" />
                      <span className="text-sm font-semibold text-white">{s.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setStep(1); setPublishResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="h-11 px-6 bg-[#1e293b] hover:bg-[#334155] border border-slate-700/50 text-slate-300 font-medium text-sm rounded-xl transition-colors"
            >
              新しいデザインを作成する
            </button>
          </div>
        )}

        {/* フッター */}
        <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-600">
          <span>© 2026 NextraLabs</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Shopify × Printful Engine v2.1
          </span>
        </div>
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(AISelectShopApp), { ssr: false })
export default function AISelectShopPage() { return <NoSSR /> }
