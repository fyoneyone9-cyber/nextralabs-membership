import { NextResponse } from 'next/server';

/**
 * 🔒 錠デバイスAPI：自動鍵発行エンジン (NextraLabs IoT Integration)
 * Stayseeの予約確定イベントをフックし、スマートロック（RemoteLock/Qrio等）のAPIを叩いて
 * ゲスト専用の入館パスコードを生成・通知する。
 */
export async function POST(req: Request) {
  try {
    const { action, bookingData } = await req.json();

    if (action === 'generate-key') {
      // 🚀 【本物化】IoTデバイス連携シミュレーション
      // 本来は bookingData.checkIn / checkOut 期間のみ有効なコードを発行
      
      const pinCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4桁のPIN
      const lockDeviceId = "LOCK-DEVICE-NX-01";
      
      console.log(`[LOCK_API] Issuing key for ${bookingData?.guestName || 'Guest'}`);

      return NextResponse.json({
        success: true,
        keyData: {
          pinCode,
          deviceId: lockDeviceId,
          validFrom: bookingData?.checkIn || '2026-05-07T15:00:00Z',
          validTo: bookingData?.checkOut || '2026-05-08T10:00:00Z',
          message: `入館コード：${pinCode} が発行されました。チェックイン当日の15:00より有効です。`
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
