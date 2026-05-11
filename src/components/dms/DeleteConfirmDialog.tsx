'use client'
import React from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'

interface DeleteConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  warning?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmDialog({
  open, title, description, warning, onConfirm, onCancel
}: DeleteConfirmDialogProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 space-y-5"
        style={{ background: '#0d0f1a', border: '1px solid rgba(239,68,68,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white leading-snug">{title}</p>
            {description && (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
            )}
          </div>
          <button onClick={onCancel} className="text-slate-600 hover:text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <Trash2 size={13} className="text-red-400 shrink-0" />
          <span className="text-red-400 font-medium">
            {warning || 'この操作は元に戻せません。削除すると復元できません。'}
          </span>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl text-xs font-semibold transition-all"
            style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            style={{ background: '#ef4444', color: '#fff' }}
          >
            <Trash2 size={13} /> 削除する
          </button>
        </div>
      </div>
    </div>
  )
}
