'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Droplets, Sprout, Sun, Loader2 } from 'lucide-react'

export default function SmartGardeningAppPage() {
  const [plantName, setPlantName] = useState('')
  const [condition, setCondition] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAdvice(null)

    try {
      const res = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantName, condition, location }),
      })
      const data = await res.json()
      if (data.advice) {
        setAdvice(data.advice)
      } else {
        alert(data.error || 'エラーが発生しました')
      }
    } catch (error) {
      alert('通信エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sprout className="text-emerald-500" />
          スマート・ガーデニング
        </h1>
        <p className="text-muted-foreground">AIがあなたの植物の健康を守ります</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>植物診断</CardTitle>
          <CardDescription>植物の名前と現在の状態を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plantName">植物の名前</Label>
              <Input
                id="plantName"
                placeholder="例: パキラ、モンステラ"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">置き場所</Label>
              <Input
                id="location"
                placeholder="例: リビングの窓際、ベランダ"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">現在の状態・悩み</Label>
              <Textarea
                id="condition"
                placeholder="例: 葉が黄色くなってきた、元気がなくて垂れ下がっている"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  診断中...
                </>
              ) : (
                'AIに相談する'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {advice && (
        <Card className="mt-8 border-emerald-200 bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Sun className="h-5 w-5" />
              AIアドバイス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-emerald-900 leading-relaxed">
              {advice}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
