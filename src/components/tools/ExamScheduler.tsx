'use client'
import React from 'react'
import { DebugPanel } from './DebugPanel'

export default function Examscheduler() {
  return (
    <div className='p-20 text-center font-bold text-4xl bg-slate-900 text-white min-h-screen'>
      NextraLabs AI Tool: ExamScheduler
      <div className='mt-8 text-xl text-slate-400'>System Surgically Restored</div>
      <DebugPanel data={null} toolId="examscheduler" />
    </div>
  )
}