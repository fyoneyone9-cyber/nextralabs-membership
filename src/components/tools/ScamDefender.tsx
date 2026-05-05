'use client'
import React from 'react'
import { DebugPanel } from './DebugPanel'

export default function Scamdefender() {
  return (
    <div className='p-20 text-center font-bold text-4xl bg-slate-900 text-white min-h-screen'>
      NextraLabs AI Tool: ScamDefender
      <div className='mt-8 text-xl text-slate-400'>System Surgically Restored</div>
      <DebugPanel data={null} toolId="scamdefender" />
    </div>
  )
}