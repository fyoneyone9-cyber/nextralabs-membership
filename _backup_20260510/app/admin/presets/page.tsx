'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Bot, Save, Plus, Trash2, Play } from 'lucide-react'

interface Preset {
  id: string
  name: string
  model: string
  systemPrompt: string
  temperature: number
  status: 'active' | 'draft'
}

export default function AdminPresetsPage() {
  const [presets, setPresets] = useState<Preset[]>([
    {
      id: '1',
      name: 'ガーデニングAI基本',
      model: 'gpt-4o',
      systemPrompt: 'あなたはプロのガーデニングアドバイザーです。',
      temperature: 0.7,
      status: 'active',
    },
    {
      id: '2',
      name: '詐欺判定エンジン',
      model: 'gpt-4o-mini',
      systemPrompt: '入力されたテキストが詐欺の可能性があるか分析してください。',
      temperature: 0,
      status: 'active',
    },
  ])

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">開発プリセット管理</h1>
          <p className="text-muted-foreground">各AIツールのエンジン設定とプロンプトを管理します。</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          新規プリセット
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>登録済みプリセット</CardTitle>
          <CardDescription>稼働中のAI設定一覧</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
                <TableHead>モデル</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presets.map((preset) => (
                <TableRow key={preset.id}>
                  <TableCell className="font-medium">{preset.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{preset.model}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={preset.status === 'active' ? 'default' : 'secondary'}>
                      {preset.status === 'active' ? '稼働中' : '下書き'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AIクレジット守護神 (Guardian) 状態</CardTitle>
          <CardDescription>リアルタイム・レート制限監視</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">本日の総リクエスト</div>
              <div className="text-2xl font-bold">1,234</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">エラー率</div>
              <div className="text-2xl font-bold text-emerald-500">0.02%</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">平均応答速度</div>
              <div className="text-2xl font-bold">450ms</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
