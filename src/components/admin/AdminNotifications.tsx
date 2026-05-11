'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Check, Users, CreditCard, X } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Notification {
  id: string
  type: string
  title: string
  message: string
  metadata: any
  read: boolean
  created_at: string
}

const typeIcon: Record<string, any> = {
  new_subscription: CreditCard,
  new_user: Users,
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    setNotifications(data || [])
    setLoading(false)
  }

  const markAsRead = async (id: string) => {
    await supabase
      .from('admin_notifications')
      .update({ read: true })
      .eq('id', id)
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = async () => {
    await supabase
      .from('admin_notifications')
      .update({ read: true })
      .eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  useEffect(() => {
    fetchNotifications()

    // リアルタイム購読
    const channel = supabase
      .channel('admin_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_notifications',
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-white/5 p-6 border-b border-white/5">
        <CardTitle className="text-lg font-bold tracking-tight text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-emerald-400" />
            通知
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-7 px-3 rounded-lg"
            >
              <Check className="h-3 w-3 mr-1" /> 全て既読
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">読み込み中...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">通知はありません</div>
        ) : (
          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
            {notifications.map((notif) => {
              const Icon = typeIcon[notif.type] || Bell
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-5 transition-colors ${
                    notif.read ? 'opacity-50' : 'bg-emerald-500/5'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-xl ${notif.read ? 'bg-white/5' : 'bg-emerald-500/20'}`}>
                    <Icon className={`h-4 w-4 ${notif.read ? 'text-slate-400' : 'text-emerald-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{notif.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      {new Date(notif.created_at).toLocaleString('ja-JP')}
                    </p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="mt-1 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
