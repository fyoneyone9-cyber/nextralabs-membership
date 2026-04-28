import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl, item } = await request.json()

    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      return NextResponse.json(
        { success: false, error: '有効なDiscord Webhook URLを入力してください' },
        { status: 400 }
      )
    }

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'アイテム情報が必要です' },
        { status: 400 }
      )
    }

    const discountPercent = item.marketPrice > 0
      ? Math.round((1 - item.price / item.marketPrice) * 100)
      : 0

    const scoreEmoji = item.aiScore >= 80 ? '🔥' : item.aiScore >= 60 ? '✨' : item.aiScore >= 40 ? '👍' : '📊'
    const stars = '★'.repeat(Math.ceil(item.aiScore / 20)) + '☆'.repeat(5 - Math.ceil(item.aiScore / 20))

    const embed = {
      title: `${scoreEmoji} ${item.aiScore >= 80 ? 'お買い得品を発見！' : '注目アイテム'}`,
      color: item.aiScore >= 80 ? 0xff6b00 : item.aiScore >= 60 ? 0x10b981 : 0x6366f1,
      fields: [
        { name: 'ブランド', value: item.brand, inline: true },
        { name: '商品名', value: item.title, inline: true },
        { name: 'カテゴリ', value: item.category || '-', inline: true },
        {
          name: '価格',
          value: `**¥${item.price?.toLocaleString()}**${
            item.marketPrice > item.price
              ? ` (相場: ¥${item.marketPrice?.toLocaleString()} / ${discountPercent}%OFF)`
              : ''
          }`,
          inline: false,
        },
        { name: '状態', value: item.condition, inline: true },
        { name: 'サイズ', value: item.size || '-', inline: true },
        { name: 'AIスコア', value: `${stars} **${item.aiScore}/100**`, inline: false },
      ],
      footer: {
        text: '古着ハンター by NextraLabs',
      },
      timestamp: new Date().toISOString(),
    }

    const discordPayload = {
      username: 'Vintage Hunter',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      embeds: [embed],
    }

    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    })

    if (discordRes.ok || discordRes.status === 204) {
      return NextResponse.json({ success: true })
    } else {
      const errorText = await discordRes.text()
      console.error('Discord webhook error:', discordRes.status, errorText)
      return NextResponse.json(
        { success: false, error: `Discord APIエラー: ${discordRes.status}` },
        { status: 502 }
      )
    }
  } catch (error: any) {
    console.error('Notify error:', error)
    return NextResponse.json(
      { success: false, error: '通知の送信に失敗しました' },
      { status: 500 }
    )
  }
}
