'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  CheckCircle2, Lock, Camera, Loader2,
  UserPlus, Search, Key, LogOut, QrCode,
  Monitor, ClipboardList, ArrowRight, PenLine, Phone, Hash, Video,
  Wifi, WifiOff, Settings, ChevronDown, Shield, Trash2
} from 'lucide-react'
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* フロント呼び出しボタンコンポーネント                                         */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CallFrontButton({ t }: { t: Record<string, string> }) {
  const [calling, setCalling] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showError, setShowError] = React.useState(false)

  const handleCall = async () => {
    setError('')
    setShowError(false)
    setCalling(true)
    try {
      // localStorageのキーがあればヘッダーで送る
      // なくてもサーバー側の DAILY_API_KEY 環境変数で処理される（DMS共通設定）
      const localKey = typeof window !== 'undefined' ? localStorage.getItem('dms_org_daily_api_key') || '' : ''
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (localKey.trim()) headers['x-daily-api-key'] = localKey

      const res = await fetch('/api/dms/daily-room', {
        method: 'POST',
        headers,
        body: JSON.stringify({ propertyName: 'フロント' }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        // エラーメッセージを日本語化
        const msg = err.error || ''
        if (msg.includes('DAILY_API_KEY not configured')) {
          setError('Daily.co APIキーが設定されていません。Vercel環境変数 DAILY_API_KEY を設定してください。')
        } else {
          setError(msg || '通話の開始に失敗しました')
        }
        setShowError(true)
        return
      }
      const data = await res.json()
      const history = JSON.parse(localStorage.getItem('dms_call_history') || '[]')
      history.unshift({ id: data.name, roomName: data.name, roomUrl: data.url, propertyName: data.propertyName, createdAt: data.createdAt, status: 'active' })
      localStorage.setItem('dms_call_history', JSON.stringify(history.slice(0, 50)))
      window.open(data.url, '_blank')
    } catch {
      setError('ネットワークエラーが発生しました')
      setShowError(true)
    } finally {
      setCalling(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCall}
        disabled={calling}
        className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all active:scale-95 disabled:opacity-60"
        style={{ background: calling ? '#059669' : '#10b981', boxShadow: '0 0 24px rgba(16,185,129,0.3)' }}
      >
        {calling ? (
          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t.callFront || 'フロントを呼び出す'}</>
        ) : (
          <><Video size={20} />{t.callFront || 'フロントを呼び出す'}</>
        )}
      </button>
      {t.callFrontSub && <p className="text-xs text-slate-600">{t.callFrontSub}</p>}

      {/* エラーモーダル — 消えない、タップで閉じる */}
      {showError && error && (
        <div
          className="fixed inset-0 z-[9997] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setShowError(false)}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4 text-center"
            style={{ background: '#0d1117', border: '1px solid rgba(239,68,68,0.35)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-2xl"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              ⚠️
            </div>
            <p className="text-sm font-semibold text-slate-100">フロント呼び出しエラー</p>
            <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
            <button
              onClick={() => setShowError(false)}
              className="w-full h-10 rounded-xl text-sm font-semibold"
              style={{ background: '#10b981', color: '#fff' }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────── 多言語辞書 ─────────── */
const I18N = {
  '日本語': {
    welcome: 'ようこそ',
    welcomeSub: 'タッチしてチェックインを開始してください',
    checkin: 'チェックイン',
    checkinSub: 'CHECK IN',
    staffMenu: 'スタッフメニュー',
    callFront: 'フロントを呼び出す',
    callFrontSub: 'スタッフにビデオ通話で連絡',
    callFront: 'フロントを呼び出す',
    callFrontSub: 'スタッフにビデオ通話で連絡',
    // STEP 2
    step2Title: '予約の確認',
    step2Sub: 'お名前・予約番号・電話番号で検索できます',
    byReservation: '予約番号', byReservationSub: 'Reservation No.',
    byName: 'お名前', byNameSub: 'Guest Name',
    byPhone: '電話番号', byPhoneSub: 'Phone Number',
    qrScan: 'QRコードをスキャン', qrSub: '予約確認メールのQRコードをご用意ください',
    inputReservation: '予約番号を入力', inputName: 'お名前を入力', inputPhone: '電話番号を入力',
    phReservation: 'NTR-001', phName: '山田 太郎', phPhone: '090-1234-5678',
    search: '検索', found: '件見つかりました', selectBtn: 'この予約で進む',
    notFound: '該当する予約が見つかりませんでした', notFoundSub: '入力内容をご確認ください',
    back: '← 戻る',
    // STEP 3
    scanTitle: '身分証をタップしてスキャン', scanSub: 'QR / 免許証 / パスポートに対応',
    scanning: '読み取り中...', scanned: 'スキャン完了 ✓',
    nextInfo: '台帳入力へ進む', skipScan: 'スキャンしない場合も次に進めます',
    name: '氏名', address: '住所', occupation: '職業', travel: '前泊地・行先地',
    phAddress: '例：東京都渋谷区1-2-3', phTravel: '例：東京',
    nextSign: '署名へ進む',
    signNote: '宿泊約款・個人情報取扱方針に同意の上、ご署名ください。デジタル台帳として保管されます。',
    completeCheckin: 'チェックイン完了 → 鍵発行', signOptional: '署名は任意です · 氏名入力で完了できます',
    // STEP 4
    checkinDone: 'チェックイン完了',
    welcome2: '様、ようこそ',
    roomLabel: 'お部屋番号',
    codeLabel: '固定暗証番号', codeSwitchBot: 'SwitchBot 一時コード', codeTTLock: 'TT Lock 一時コード', codeDefault: 'アクセスコード',
    returnStart: 'スタートに戻る',
    // 進捗
    prog1: 'スタート', prog2: '予約確認', prog3: '受付', prog4: 'チェックイン完了',
    // カメラ
    camCancel: 'キャンセル', camCapture: '手動で撮影',
    // チェックアウト
    checkoutTitle: 'チェックアウト', checkoutSub: '予約番号・お名前・電話番号で予約を検索してください',
  },
  'English': {
    welcome: 'Welcome',
    welcomeSub: 'Touch the screen to begin check-in',
    checkin: 'Check In',
    checkinSub: 'TAP TO START',
    staffMenu: 'Staff Menu',
    callFront: 'Call Front Desk',
    callFrontSub: 'Video call with staff',
    callFront: 'Call Front Desk',
    callFrontSub: 'Video call with staff',
    step2Title: 'Find Your Reservation',
    step2Sub: 'Search by name, reservation number, or phone',
    byReservation: 'Reservation No.', byReservationSub: 'Booking ID',
    byName: 'Guest Name', byNameSub: 'Family / Given Name',
    byPhone: 'Phone Number', byPhoneSub: 'Mobile / Home',
    qrScan: 'Scan QR Code', qrSub: 'Please prepare the QR code from your booking email',
    inputReservation: 'Enter Reservation No.', inputName: 'Enter Guest Name', inputPhone: 'Enter Phone Number',
    phReservation: 'NTR-001', phName: 'Yamada Taro', phPhone: '090-1234-5678',
    search: 'Search', found: 'result(s) found', selectBtn: 'Select & Continue',
    notFound: 'No reservations found', notFoundSub: 'Please check your input and try again',
    back: '← Back',
    scanTitle: 'Tap to Scan ID', scanSub: 'QR / Driver\'s License / Passport',
    scanning: 'Scanning...', scanned: 'Scan Complete ✓',
    nextInfo: 'Enter Guest Details', skipScan: 'You can proceed without scanning',
    name: 'Full Name', address: 'Address', occupation: 'Occupation', travel: 'Previous / Next Destination',
    phAddress: 'e.g. 1-2-3 Shibuya, Tokyo', phTravel: 'e.g. Tokyo',
    nextSign: 'Proceed to Signature',
    signNote: 'By signing, you agree to our terms of stay and privacy policy. Your signature will be stored digitally.',
    completeCheckin: 'Complete Check-In → Get Key', signOptional: 'Signature is optional · Name entry is sufficient',
    checkinDone: 'Check-In Complete',
    welcome2: ', Welcome!',
    roomLabel: 'Room Number',
    codeLabel: 'PIN Code', codeSwitchBot: 'SwitchBot Temp Code', codeTTLock: 'TT Lock Temp Code', codeDefault: 'Access Code',
    returnStart: 'Return to Start',
    prog1: 'Start', prog2: 'Reservation', prog3: 'Check-In', prog4: 'Complete',
    camCancel: 'Cancel', camCapture: 'Capture',
    checkoutTitle: 'Check-Out', checkoutSub: 'Search by reservation number, name, or phone',
  },
  '中文': {
    welcome: '欢迎光临',
    welcomeSub: '请触摸屏幕开始办理入住',
    checkin: '办理入住',
    checkinSub: '点击开始',
    staffMenu: '员工菜单',
    callFront: '呼叫前台',
    callFrontSub: '通过视频通话联系工作人员',
    step2Title: '查找预订',
    step2Sub: '请通过姓名、预订号或电话号码进行搜索',
    byReservation: '预订号', byReservationSub: '订单编号',
    byName: '姓名', byNameSub: '客人姓名',
    byPhone: '电话号码', byPhoneSub: '手机 / 固话',
    qrScan: '扫描二维码', qrSub: '请准备好预订确认邮件中的二维码',
    inputReservation: '输入预订号', inputName: '输入姓名', inputPhone: '输入电话号码',
    phReservation: 'NTR-001', phName: '山田太郎', phPhone: '090-1234-5678',
    search: '搜索', found: '条结果', selectBtn: '选择并继续',
    notFound: '未找到相关预订', notFoundSub: '请确认输入内容后重试',
    back: '← 返回',
    scanTitle: '点击扫描证件', scanSub: '支持二维码 / 驾照 / 护照',
    scanning: '扫描中...', scanned: '扫描完成 ✓',
    nextInfo: '填写登记信息', skipScan: '也可以不扫描直接继续',
    name: '姓名', address: '地址', occupation: '职业', travel: '出发地 / 目的地',
    phAddress: '例：东京都涩谷区1-2-3', phTravel: '例：东京',
    nextSign: '前往签名',
    signNote: '签名即表示您同意住宿条款和隐私政策。您的签名将以数字方式存档。',
    completeCheckin: '完成入住 → 获取房卡', signOptional: '签名为选填项 · 填写姓名即可完成',
    checkinDone: '入住完成',
    welcome2: '，欢迎入住！',
    roomLabel: '房间号码',
    codeLabel: '固定密码', codeSwitchBot: 'SwitchBot临时密码', codeTTLock: 'TT Lock临时密码', codeDefault: '访问密码',
    returnStart: '返回首页',
    prog1: '开始', prog2: '查找预订', prog3: '办理入住', prog4: '获取房卡',
    camCancel: '取消', camCapture: '手动拍照',
    checkoutTitle: '退房', checkoutSub: '请通过预订号、姓名或电话号码搜索',
  },
  '한국어': {
    welcome: '환영합니다',
    welcomeSub: '화면을 터치하여 체크인을 시작하세요',
    checkin: '체크인',
    checkinSub: '터치하여 시작',
    staffMenu: '직원 메뉴',
    callFront: '프론트 호출',
    callFrontSub: '영상통화로 직원에게 연락',
    step2Title: '예약 확인',
    step2Sub: '이름, 예약번호, 전화번호로 검색하세요',
    byReservation: '예약번호', byReservationSub: '예약 ID',
    byName: '성함', byNameSub: '투숙객 이름',
    byPhone: '전화번호', byPhoneSub: '휴대폰 / 일반전화',
    qrScan: 'QR코드 스캔', qrSub: '예약 확인 이메일의 QR코드를 준비해 주세요',
    inputReservation: '예약번호 입력', inputName: '이름 입력', inputPhone: '전화번호 입력',
    phReservation: 'NTR-001', phName: '야마다 타로', phPhone: '090-1234-5678',
    search: '검색', found: '건 검색됨', selectBtn: '선택하고 계속',
    notFound: '예약을 찾을 수 없습니다', notFoundSub: '입력 내용을 확인하고 다시 시도해 주세요',
    back: '← 뒤로',
    scanTitle: '터치하여 신분증 스캔', scanSub: 'QR / 운전면허증 / 여권 지원',
    scanning: '스캔 중...', scanned: '스캔 완료 ✓',
    nextInfo: '투숙 정보 입력', skipScan: '스캔 없이도 다음으로 진행할 수 있습니다',
    name: '성명', address: '주소', occupation: '직업', travel: '출발지 / 목적지',
    phAddress: '예: 도쿄도 시부야구 1-2-3', phTravel: '예: 도쿄',
    nextSign: '서명으로 이동',
    signNote: '서명하면 숙박 약관 및 개인정보처리방침에 동의하는 것입니다. 서명은 디지털로 보관됩니다.',
    completeCheckin: '체크인 완료 → 열쇠 발급', signOptional: '서명은 선택 사항입니다 · 이름 입력으로 완료 가능',
    checkinDone: '체크인 완료',
    welcome2: '님, 환영합니다!',
    roomLabel: '객실 번호',
    codeLabel: '고정 비밀번호', codeSwitchBot: 'SwitchBot 임시 코드', codeTTLock: 'TT Lock 임시 코드', codeDefault: '액세스 코드',
    returnStart: '처음으로 돌아가기',
    prog1: '시작', prog2: '예약 확인', prog3: '체크인', prog4: '열쇠 발급',
    camCancel: '취소', camCapture: '수동 촬영',
    checkoutTitle: '체크아웃', checkoutSub: '예약번호, 성함, 전화번호로 예약을 검색해 주세요',
  },
  'Español': {
    welcome: 'Bienvenido', welcomeSub: 'Toque la pantalla para comenzar el check-in',
    checkin: 'Check-in', checkinSub: 'TOQUE PARA INICIAR', staffMenu: 'Menú Personal',
    callFront: 'Llamar Recepción', callFrontSub: 'Videollamada con el personal',
    step2Title: 'Buscar Reserva', step2Sub: 'Busque por nombre, número de reserva o teléfono',
    byReservation: 'N.º de Reserva', byReservationSub: 'ID de reserva',
    byName: 'Nombre del Huésped', byNameSub: 'Apellido / Nombre',
    byPhone: 'Teléfono', byPhoneSub: 'Móvil / Fijo',
    qrScan: 'Escanear Código QR', qrSub: 'Prepare el código QR de su correo de confirmación',
    inputReservation: 'Ingrese N.º de Reserva', inputName: 'Ingrese Nombre', inputPhone: 'Ingrese Teléfono',
    phReservation: 'NTR-001', phName: 'Juan García', phPhone: '+34-600-000-000',
    search: 'Buscar', found: 'resultado(s) encontrado(s)', selectBtn: 'Seleccionar y Continuar',
    notFound: 'No se encontraron reservas', notFoundSub: 'Verifique su entrada e intente nuevamente',
    back: '← Volver',
    scanTitle: 'Toque para Escanear ID', scanSub: 'QR / Licencia / Pasaporte',
    scanning: 'Escaneando...', scanned: 'Escaneo Completo ✓',
    nextInfo: 'Ingresar Datos del Huésped', skipScan: 'Puede continuar sin escanear',
    name: 'Nombre Completo', address: 'Dirección', occupation: 'Ocupación', travel: 'Destino Anterior / Siguiente',
    phAddress: 'ej. Calle Mayor 1, Madrid', phTravel: 'ej. Madrid',
    nextSign: 'Ir a Firma',
    signNote: 'Al firmar, acepta los términos de estadía y la política de privacidad.',
    completeCheckin: 'Completar Check-in → Obtener Llave', signOptional: 'Firma opcional · El nombre es suficiente',
    checkinDone: 'Check-in Completo', welcome2: ', ¡Bienvenido!',
    roomLabel: 'N.º de Habitación',
    codeLabel: 'Código PIN', codeSwitchBot: 'Código Temp. SwitchBot', codeTTLock: 'Código Temp. TT Lock', codeDefault: 'Código de Acceso',
    returnStart: 'Volver al Inicio',
    prog1: 'Inicio', prog2: 'Reserva', prog3: 'Check-in', prog4: 'Completo',
    camCancel: 'Cancelar', camCapture: 'Capturar',
    checkoutTitle: 'Check-out', checkoutSub: 'Busque por número de reserva, nombre o teléfono',
  },
  'Français': {
    welcome: 'Bienvenue', welcomeSub: 'Touchez l\'écran pour commencer l\'enregistrement',
    checkin: 'Check-in', checkinSub: 'APPUYEZ POUR DÉMARRER', staffMenu: 'Menu Personnel',
    callFront: 'Appeler Réception', callFrontSub: 'Appel vidéo avec le personnel',
    step2Title: 'Trouver Réservation', step2Sub: 'Recherchez par nom, numéro de réservation ou téléphone',
    byReservation: 'N° de Réservation', byReservationSub: 'ID de réservation',
    byName: 'Nom du Client', byNameSub: 'Nom / Prénom',
    byPhone: 'Téléphone', byPhoneSub: 'Mobile / Fixe',
    qrScan: 'Scanner le QR Code', qrSub: 'Préparez le QR code de votre e-mail de confirmation',
    inputReservation: 'Entrez N° de Réservation', inputName: 'Entrez le Nom', inputPhone: 'Entrez le Téléphone',
    phReservation: 'NTR-001', phName: 'Jean Dupont', phPhone: '+33-6-00-00-00-00',
    search: 'Rechercher', found: 'résultat(s) trouvé(s)', selectBtn: 'Sélectionner et Continuer',
    notFound: 'Aucune réservation trouvée', notFoundSub: 'Vérifiez vos informations et réessayez',
    back: '← Retour',
    scanTitle: 'Appuyez pour Scanner la Pièce d\'Identité', scanSub: 'QR / Permis / Passeport',
    scanning: 'Scan en cours...', scanned: 'Scan Terminé ✓',
    nextInfo: 'Saisir les Informations Client', skipScan: 'Vous pouvez continuer sans scanner',
    name: 'Nom Complet', address: 'Adresse', occupation: 'Profession', travel: 'Destination Précédente / Suivante',
    phAddress: 'ex. 1 rue de Rivoli, Paris', phTravel: 'ex. Paris',
    nextSign: 'Passer à la Signature',
    signNote: 'En signant, vous acceptez les conditions de séjour et la politique de confidentialité.',
    completeCheckin: 'Terminer Check-in → Obtenir Clé', signOptional: 'Signature facultative · Le nom suffit',
    checkinDone: 'Check-in Terminé', welcome2: ', Bienvenue !',
    roomLabel: 'N° de Chambre',
    codeLabel: 'Code PIN', codeSwitchBot: 'Code Temp. SwitchBot', codeTTLock: 'Code Temp. TT Lock', codeDefault: 'Code d\'Accès',
    returnStart: 'Retour au Début',
    prog1: 'Début', prog2: 'Réservation', prog3: 'Check-in', prog4: 'Terminé',
    camCancel: 'Annuler', camCapture: 'Capturer',
    checkoutTitle: 'Check-out', checkoutSub: 'Recherchez par numéro de réservation, nom ou téléphone',
  },
  'Deutsch': {
    welcome: 'Willkommen', welcomeSub: 'Berühren Sie den Bildschirm, um den Check-in zu starten',
    checkin: 'Check-in', checkinSub: 'TIPPEN ZUM STARTEN', staffMenu: 'Personalmenü',
    callFront: 'Rezeption Anrufen', callFrontSub: 'Videoanruf mit dem Personal',
    step2Title: 'Reservierung Finden', step2Sub: 'Suchen Sie nach Name, Reservierungsnummer oder Telefon',
    byReservation: 'Reservierungs-Nr.', byReservationSub: 'Buchungs-ID',
    byName: 'Gastname', byNameSub: 'Nachname / Vorname',
    byPhone: 'Telefonnummer', byPhoneSub: 'Mobil / Festnetz',
    qrScan: 'QR-Code Scannen', qrSub: 'Bereiten Sie den QR-Code aus Ihrer Buchungsbestätigung vor',
    inputReservation: 'Reservierungs-Nr. eingeben', inputName: 'Name eingeben', inputPhone: 'Telefon eingeben',
    phReservation: 'NTR-001', phName: 'Max Mustermann', phPhone: '+49-170-0000000',
    search: 'Suchen', found: 'Ergebnis(se) gefunden', selectBtn: 'Auswählen und Weiter',
    notFound: 'Keine Reservierungen gefunden', notFoundSub: 'Überprüfen Sie Ihre Eingabe und versuchen Sie es erneut',
    back: '← Zurück',
    scanTitle: 'Tippen zum Ausweis Scannen', scanSub: 'QR / Führerschein / Reisepass',
    scanning: 'Scannen...', scanned: 'Scan Abgeschlossen ✓',
    nextInfo: 'Gastdaten Eingeben', skipScan: 'Sie können auch ohne Scannen fortfahren',
    name: 'Vollständiger Name', address: 'Adresse', occupation: 'Beruf', travel: 'Vorheriges / Nächstes Ziel',
    phAddress: 'z.B. Musterstr. 1, Berlin', phTravel: 'z.B. Berlin',
    nextSign: 'Zur Unterschrift',
    signNote: 'Mit Ihrer Unterschrift stimmen Sie den Aufenthaltsbedingungen und Datenschutzrichtlinien zu.',
    completeCheckin: 'Check-in Abschließen → Schlüssel Holen', signOptional: 'Unterschrift optional · Name reicht aus',
    checkinDone: 'Check-in Abgeschlossen', welcome2: ', Willkommen!',
    roomLabel: 'Zimmernummer',
    codeLabel: 'PIN-Code', codeSwitchBot: 'SwitchBot Temp-Code', codeTTLock: 'TT Lock Temp-Code', codeDefault: 'Zugangscode',
    returnStart: 'Zurück zum Start',
    prog1: 'Start', prog2: 'Reservierung', prog3: 'Check-in', prog4: 'Fertig',
    camCancel: 'Abbrechen', camCapture: 'Aufnehmen',
    checkoutTitle: 'Check-out', checkoutSub: 'Suchen nach Reservierungsnummer, Name oder Telefon',
  },
  'Português': {
    welcome: 'Bem-vindo', welcomeSub: 'Toque na tela para iniciar o check-in',
    checkin: 'Check-in', checkinSub: 'TOQUE PARA INICIAR', staffMenu: 'Menu da Equipe',
    callFront: 'Chamar Recepção', callFrontSub: 'Videochamada com a equipe',
    step2Title: 'Encontrar Reserva', step2Sub: 'Pesquise por nome, número de reserva ou telefone',
    byReservation: 'N.º de Reserva', byReservationSub: 'ID da reserva',
    byName: 'Nome do Hóspede', byNameSub: 'Sobrenome / Nome',
    byPhone: 'Telefone', byPhoneSub: 'Celular / Fixo',
    qrScan: 'Escanear QR Code', qrSub: 'Prepare o QR code do seu e-mail de confirmação',
    inputReservation: 'Inserir N.º de Reserva', inputName: 'Inserir Nome', inputPhone: 'Inserir Telefone',
    phReservation: 'NTR-001', phName: 'João Silva', phPhone: '+55-11-90000-0000',
    search: 'Pesquisar', found: 'resultado(s) encontrado(s)', selectBtn: 'Selecionar e Continuar',
    notFound: 'Nenhuma reserva encontrada', notFoundSub: 'Verifique suas informações e tente novamente',
    back: '← Voltar',
    scanTitle: 'Toque para Escanear Documento', scanSub: 'QR / CNH / Passaporte',
    scanning: 'Escaneando...', scanned: 'Scan Concluído ✓',
    nextInfo: 'Inserir Dados do Hóspede', skipScan: 'Você pode continuar sem escanear',
    name: 'Nome Completo', address: 'Endereço', occupation: 'Profissão', travel: 'Destino Anterior / Próximo',
    phAddress: 'ex. Av. Paulista, 1 - São Paulo', phTravel: 'ex. São Paulo',
    nextSign: 'Ir para Assinatura',
    signNote: 'Ao assinar, você concorda com os termos de estadia e política de privacidade.',
    completeCheckin: 'Concluir Check-in → Obter Chave', signOptional: 'Assinatura opcional · Nome é suficiente',
    checkinDone: 'Check-in Concluído', welcome2: ', Bem-vindo!',
    roomLabel: 'Número do Quarto',
    codeLabel: 'Código PIN', codeSwitchBot: 'Código Temp. SwitchBot', codeTTLock: 'Código Temp. TT Lock', codeDefault: 'Código de Acesso',
    returnStart: 'Voltar ao Início',
    prog1: 'Início', prog2: 'Reserva', prog3: 'Check-in', prog4: 'Concluído',
    camCancel: 'Cancelar', camCapture: 'Capturar',
    checkoutTitle: 'Check-out', checkoutSub: 'Pesquise por número de reserva, nome ou telefone',
  },
  'Italiano': {
    welcome: 'Benvenuto', welcomeSub: 'Tocca lo schermo per iniziare il check-in',
    checkin: 'Check-in', checkinSub: 'TOCCA PER INIZIARE', staffMenu: 'Menu del Personale',
    callFront: 'Chiama Reception', callFrontSub: 'Videochiamata con il personale',
    step2Title: 'Trova Prenotazione', step2Sub: 'Cerca per nome, numero prenotazione o telefono',
    byReservation: 'N. Prenotazione', byReservationSub: 'ID prenotazione',
    byName: 'Nome Ospite', byNameSub: 'Cognome / Nome',
    byPhone: 'Telefono', byPhoneSub: 'Cellulare / Fisso',
    qrScan: 'Scansiona QR Code', qrSub: 'Prepara il QR code dalla tua email di conferma',
    inputReservation: 'Inserisci N. Prenotazione', inputName: 'Inserisci Nome', inputPhone: 'Inserisci Telefono',
    phReservation: 'NTR-001', phName: 'Mario Rossi', phPhone: '+39-320-0000000',
    search: 'Cerca', found: 'risultato/i trovato/i', selectBtn: 'Seleziona e Continua',
    notFound: 'Nessuna prenotazione trovata', notFoundSub: 'Controlla i dati inseriti e riprova',
    back: '← Indietro',
    scanTitle: 'Tocca per Scansionare Documento', scanSub: 'QR / Patente / Passaporto',
    scanning: 'Scansione...', scanned: 'Scansione Completata ✓',
    nextInfo: 'Inserisci Dati Ospite', skipScan: 'Puoi continuare senza scansionare',
    name: 'Nome Completo', address: 'Indirizzo', occupation: 'Professione', travel: 'Destinazione Precedente / Successiva',
    phAddress: 'es. Via Roma 1, Milano', phTravel: 'es. Milano',
    nextSign: 'Vai alla Firma',
    signNote: 'Firmando, accetti i termini di soggiorno e la politica sulla privacy.',
    completeCheckin: 'Completa Check-in → Prendi Chiave', signOptional: 'Firma opzionale · Il nome è sufficiente',
    checkinDone: 'Check-in Completato', welcome2: ', Benvenuto!',
    roomLabel: 'Numero Camera',
    codeLabel: 'Codice PIN', codeSwitchBot: 'Codice Temp. SwitchBot', codeTTLock: 'Codice Temp. TT Lock', codeDefault: 'Codice di Accesso',
    returnStart: 'Torna all\'Inizio',
    prog1: 'Inizio', prog2: 'Prenotazione', prog3: 'Check-in', prog4: 'Completato',
    camCancel: 'Annulla', camCapture: 'Acquisisci',
    checkoutTitle: 'Check-out', checkoutSub: 'Cerca per numero prenotazione, nome o telefono',
  },
  'Русский': {
    welcome: 'Добро пожаловать', welcomeSub: 'Нажмите на экран для начала регистрации',
    checkin: 'Заезд', checkinSub: 'НАЖМИТЕ ДЛЯ НАЧАЛА', staffMenu: 'Меню Персонала',
    callFront: 'Вызвать Ресепшн', callFrontSub: 'Видеозвонок с персоналом',
    step2Title: 'Найти Бронирование', step2Sub: 'Поиск по имени, номеру бронирования или телефону',
    byReservation: 'Номер Бронирования', byReservationSub: 'ID бронирования',
    byName: 'Имя Гостя', byNameSub: 'Фамилия / Имя',
    byPhone: 'Телефон', byPhoneSub: 'Мобильный / Стационарный',
    qrScan: 'Сканировать QR-код', qrSub: 'Подготовьте QR-код из вашего письма с подтверждением',
    inputReservation: 'Введите Номер Бронирования', inputName: 'Введите Имя', inputPhone: 'Введите Телефон',
    phReservation: 'NTR-001', phName: 'Иван Иванов', phPhone: '+7-900-000-0000',
    search: 'Поиск', found: 'найдено результатов', selectBtn: 'Выбрать и Продолжить',
    notFound: 'Бронирования не найдены', notFoundSub: 'Проверьте введённые данные и попробуйте снова',
    back: '← Назад',
    scanTitle: 'Нажмите для Сканирования Документа', scanSub: 'QR / Права / Паспорт',
    scanning: 'Сканирование...', scanned: 'Сканирование Завершено ✓',
    nextInfo: 'Ввести Данные Гостя', skipScan: 'Можно продолжить без сканирования',
    name: 'Полное Имя', address: 'Адрес', occupation: 'Профессия', travel: 'Откуда / Куда',
    phAddress: 'напр. ул. Арбат 1, Москва', phTravel: 'напр. Москва',
    nextSign: 'Перейти к Подписи',
    signNote: 'Подписывая, вы соглашаетесь с условиями проживания и политикой конфиденциальности.',
    completeCheckin: 'Завершить Заезд → Получить Ключ', signOptional: 'Подпись необязательна · Достаточно имени',
    checkinDone: 'Заезд Завершён', welcome2: ', Добро пожаловать!',
    roomLabel: 'Номер Комнаты',
    codeLabel: 'PIN-код', codeSwitchBot: 'Врем. код SwitchBot', codeTTLock: 'Врем. код TT Lock', codeDefault: 'Код Доступа',
    returnStart: 'Вернуться в Начало',
    prog1: 'Начало', prog2: 'Бронирование', prog3: 'Заезд', prog4: 'Готово',
    camCancel: 'Отмена', camCapture: 'Сфотографировать',
    checkoutTitle: 'Выезд', checkoutSub: 'Поиск по номеру бронирования, имени или телефону',
  },
  'العربية': {
    welcome: 'مرحباً', welcomeSub: 'المس الشاشة لبدء تسجيل الوصول',
    checkin: 'تسجيل الوصول', checkinSub: 'المس للبدء', staffMenu: 'قائمة الموظفين',
    callFront: 'الاتصال بالاستقبال', callFrontSub: 'مكالمة فيديو مع الموظفين',
    step2Title: 'البحث عن الحجز', step2Sub: 'ابحث باسمك أو رقم الحجز أو الهاتف',
    byReservation: 'رقم الحجز', byReservationSub: 'معرف الحجز',
    byName: 'اسم النزيل', byNameSub: 'الاسم الأول / الأخير',
    byPhone: 'رقم الهاتف', byPhoneSub: 'جوال / ثابت',
    qrScan: 'مسح رمز QR', qrSub: 'جهّز رمز QR من بريدك الإلكتروني للتأكيد',
    inputReservation: 'أدخل رقم الحجز', inputName: 'أدخل الاسم', inputPhone: 'أدخل رقم الهاتف',
    phReservation: 'NTR-001', phName: 'محمد علي', phPhone: '+966-50-000-0000',
    search: 'بحث', found: 'نتيجة/نتائج', selectBtn: 'اختر وتابع',
    notFound: 'لم يتم العثور على حجوزات', notFoundSub: 'تحقق من المعلومات وحاول مرة أخرى',
    back: '← رجوع',
    scanTitle: 'المس لمسح الهوية', scanSub: 'QR / رخصة القيادة / جواز السفر',
    scanning: 'جارٍ المسح...', scanned: 'اكتمل المسح ✓',
    nextInfo: 'إدخال بيانات النزيل', skipScan: 'يمكنك المتابعة دون المسح',
    name: 'الاسم الكامل', address: 'العنوان', occupation: 'المهنة', travel: 'الوجهة السابقة / التالية',
    phAddress: 'مثال: شارع الملك فهد، الرياض', phTravel: 'مثال: الرياض',
    nextSign: 'الانتقال إلى التوقيع',
    signNote: 'بالتوقيع، توافق على شروط الإقامة وسياسة الخصوصية.',
    completeCheckin: 'إتمام تسجيل الوصول → الحصول على المفتاح', signOptional: 'التوقيع اختياري · الاسم كافٍ',
    checkinDone: 'اكتمل تسجيل الوصول', welcome2: '، مرحباً!',
    roomLabel: 'رقم الغرفة',
    codeLabel: 'رمز PIN', codeSwitchBot: 'رمز SwitchBot المؤقت', codeTTLock: 'رمز TT Lock المؤقت', codeDefault: 'رمز الوصول',
    returnStart: 'العودة إلى البداية',
    prog1: 'البداية', prog2: 'الحجز', prog3: 'تسجيل الوصول', prog4: 'مكتمل',
    camCancel: 'إلغاء', camCapture: 'التقاط',
    checkoutTitle: 'تسجيل المغادرة', checkoutSub: 'ابحث برقم الحجز أو الاسم أو الهاتف',
  },
  'ภาษาไทย': {
    welcome: 'ยินดีต้อนรับ', welcomeSub: 'แตะหน้าจอเพื่อเริ่มเช็คอิน',
    checkin: 'เช็คอิน', checkinSub: 'แตะเพื่อเริ่ม', staffMenu: 'เมนูพนักงาน',
    callFront: 'เรียกแผนกต้อนรับ', callFrontSub: 'วิดีโอคอลกับพนักงาน',
    step2Title: 'ค้นหาการจอง', step2Sub: 'ค้นหาด้วยชื่อ หมายเลขการจอง หรือโทรศัพท์',
    byReservation: 'หมายเลขการจอง', byReservationSub: 'รหัสการจอง',
    byName: 'ชื่อผู้เข้าพัก', byNameSub: 'นามสกุล / ชื่อ',
    byPhone: 'หมายเลขโทรศัพท์', byPhoneSub: 'มือถือ / บ้าน',
    qrScan: 'สแกน QR Code', qrSub: 'เตรียม QR Code จากอีเมลยืนยันการจอง',
    inputReservation: 'กรอกหมายเลขการจอง', inputName: 'กรอกชื่อ', inputPhone: 'กรอกหมายเลขโทรศัพท์',
    phReservation: 'NTR-001', phName: 'สมชาย ใจดี', phPhone: '080-000-0000',
    search: 'ค้นหา', found: 'ผลลัพธ์ที่พบ', selectBtn: 'เลือกและดำเนินการต่อ',
    notFound: 'ไม่พบการจอง', notFoundSub: 'กรุณาตรวจสอบข้อมูลและลองอีกครั้ง',
    back: '← กลับ',
    scanTitle: 'แตะเพื่อสแกนบัตรประชาชน', scanSub: 'QR / ใบขับขี่ / หนังสือเดินทาง',
    scanning: 'กำลังสแกน...', scanned: 'สแกนเสร็จสิ้น ✓',
    nextInfo: 'กรอกข้อมูลผู้เข้าพัก', skipScan: 'คุณสามารถดำเนินการต่อโดยไม่สแกน',
    name: 'ชื่อเต็ม', address: 'ที่อยู่', occupation: 'อาชีพ', travel: 'จุดหมายก่อนหน้า / ถัดไป',
    phAddress: 'เช่น 1 ถนนสุขุมวิท กรุงเทพฯ', phTravel: 'เช่น กรุงเทพฯ',
    nextSign: 'ไปที่ลายเซ็น',
    signNote: 'การลงลายเซ็นหมายความว่าคุณยอมรับเงื่อนไขการเข้าพักและนโยบายความเป็นส่วนตัว',
    completeCheckin: 'เสร็จสิ้นเช็คอิน → รับกุญแจ', signOptional: 'ลายเซ็นเป็นตัวเลือก · ชื่อเพียงพอแล้ว',
    checkinDone: 'เช็คอินเสร็จสิ้น', welcome2: ' ยินดีต้อนรับ!',
    roomLabel: 'หมายเลขห้อง',
    codeLabel: 'รหัส PIN', codeSwitchBot: 'รหัสชั่วคราว SwitchBot', codeTTLock: 'รหัสชั่วคราว TT Lock', codeDefault: 'รหัสเข้าถึง',
    returnStart: 'กลับไปที่หน้าหลัก',
    prog1: 'เริ่ม', prog2: 'การจอง', prog3: 'เช็คอิน', prog4: 'เสร็จสิ้น',
    camCancel: 'ยกเลิก', camCapture: 'ถ่ายภาพ',
    checkoutTitle: 'เช็คเอาต์', checkoutSub: 'ค้นหาด้วยหมายเลขการจอง ชื่อ หรือโทรศัพท์',
  },
  'Tiếng Việt': {
    welcome: 'Chào mừng', welcomeSub: 'Chạm vào màn hình để bắt đầu nhận phòng',
    checkin: 'Nhận phòng', checkinSub: 'CHẠM ĐỂ BẮT ĐẦU', staffMenu: 'Menu Nhân viên',
    callFront: 'Gọi Lễ tân', callFrontSub: 'Gọi video với nhân viên',
    step2Title: 'Tìm Đặt phòng', step2Sub: 'Tìm theo tên, số đặt phòng hoặc điện thoại',
    byReservation: 'Số Đặt phòng', byReservationSub: 'Mã đặt phòng',
    byName: 'Tên Khách', byNameSub: 'Họ / Tên',
    byPhone: 'Số Điện thoại', byPhoneSub: 'Di động / Cố định',
    qrScan: 'Quét Mã QR', qrSub: 'Chuẩn bị mã QR từ email xác nhận đặt phòng',
    inputReservation: 'Nhập Số Đặt phòng', inputName: 'Nhập Tên', inputPhone: 'Nhập Số Điện thoại',
    phReservation: 'NTR-001', phName: 'Nguyễn Văn A', phPhone: '090-000-0000',
    search: 'Tìm kiếm', found: 'kết quả tìm thấy', selectBtn: 'Chọn và Tiếp tục',
    notFound: 'Không tìm thấy đặt phòng', notFoundSub: 'Vui lòng kiểm tra thông tin và thử lại',
    back: '← Quay lại',
    scanTitle: 'Chạm để Quét Giấy tờ', scanSub: 'QR / Bằng lái / Hộ chiếu',
    scanning: 'Đang quét...', scanned: 'Quét hoàn tất ✓',
    nextInfo: 'Nhập Thông tin Khách', skipScan: 'Bạn có thể tiếp tục mà không cần quét',
    name: 'Họ và Tên', address: 'Địa chỉ', occupation: 'Nghề nghiệp', travel: 'Điểm đến trước / tiếp theo',
    phAddress: 'vd. 1 Phố Hoàn Kiếm, Hà Nội', phTravel: 'vd. Hà Nội',
    nextSign: 'Đến Chữ ký',
    signNote: 'Bằng cách ký, bạn đồng ý với các điều khoản lưu trú và chính sách bảo mật.',
    completeCheckin: 'Hoàn tất Nhận phòng → Lấy Chìa khóa', signOptional: 'Chữ ký tùy chọn · Tên là đủ',
    checkinDone: 'Nhận phòng Hoàn tất', welcome2: ', Chào mừng!',
    roomLabel: 'Số Phòng',
    codeLabel: 'Mã PIN', codeSwitchBot: 'Mã Tạm SwitchBot', codeTTLock: 'Mã Tạm TT Lock', codeDefault: 'Mã Truy cập',
    returnStart: 'Quay về Màn hình Chính',
    prog1: 'Bắt đầu', prog2: 'Đặt phòng', prog3: 'Nhận phòng', prog4: 'Hoàn tất',
    camCancel: 'Hủy', camCapture: 'Chụp ảnh',
    checkoutTitle: 'Trả phòng', checkoutSub: 'Tìm theo số đặt phòng, tên hoặc điện thoại',
  },
  'Bahasa Indonesia': {
    welcome: 'Selamat Datang', welcomeSub: 'Sentuh layar untuk memulai check-in',
    checkin: 'Check-in', checkinSub: 'SENTUH UNTUK MULAI', staffMenu: 'Menu Staf',
    callFront: 'Hubungi Resepsi', callFrontSub: 'Panggilan video dengan staf',
    step2Title: 'Cari Reservasi', step2Sub: 'Cari berdasarkan nama, nomor reservasi, atau telepon',
    byReservation: 'No. Reservasi', byReservationSub: 'ID Reservasi',
    byName: 'Nama Tamu', byNameSub: 'Marga / Nama',
    byPhone: 'Nomor Telepon', byPhoneSub: 'HP / Rumah',
    qrScan: 'Pindai QR Code', qrSub: 'Siapkan QR code dari email konfirmasi Anda',
    inputReservation: 'Masukkan No. Reservasi', inputName: 'Masukkan Nama', inputPhone: 'Masukkan Nomor Telepon',
    phReservation: 'NTR-001', phName: 'Budi Santoso', phPhone: '0812-0000-0000',
    search: 'Cari', found: 'hasil ditemukan', selectBtn: 'Pilih dan Lanjutkan',
    notFound: 'Tidak ada reservasi ditemukan', notFoundSub: 'Periksa input Anda dan coba lagi',
    back: '← Kembali',
    scanTitle: 'Sentuh untuk Pindai ID', scanSub: 'QR / SIM / Paspor',
    scanning: 'Memindai...', scanned: 'Pemindaian Selesai ✓',
    nextInfo: 'Masukkan Data Tamu', skipScan: 'Anda bisa melanjutkan tanpa memindai',
    name: 'Nama Lengkap', address: 'Alamat', occupation: 'Pekerjaan', travel: 'Tujuan Sebelumnya / Berikutnya',
    phAddress: 'mis. Jl. Sudirman No.1, Jakarta', phTravel: 'mis. Jakarta',
    nextSign: 'Lanjut ke Tanda Tangan',
    signNote: 'Dengan menandatangani, Anda menyetujui syarat menginap dan kebijakan privasi.',
    completeCheckin: 'Selesaikan Check-in → Ambil Kunci', signOptional: 'Tanda tangan opsional · Nama sudah cukup',
    checkinDone: 'Check-in Selesai', welcome2: ', Selamat Datang!',
    roomLabel: 'Nomor Kamar',
    codeLabel: 'Kode PIN', codeSwitchBot: 'Kode Sementara SwitchBot', codeTTLock: 'Kode Sementara TT Lock', codeDefault: 'Kode Akses',
    returnStart: 'Kembali ke Awal',
    prog1: 'Mulai', prog2: 'Reservasi', prog3: 'Check-in', prog4: 'Selesai',
    camCancel: 'Batal', camCapture: 'Ambil Gambar',
    checkoutTitle: 'Check-out', checkoutSub: 'Cari berdasarkan nomor reservasi, nama, atau telepon',
  },
} as const
type LangKey = keyof typeof I18N

/* ─────────── 型定義 ─────────── */
// ウィザードステップ（ゲスト導線は必ずこの順番）
// kiosk → search → checkin → lock
// checkout はスタッフPIN経由のみ
const WIZARD_STEPS = ['kiosk', 'search', 'checkin', 'lock'] as const
type WizardStep = typeof WIZARD_STEPS[number] | 'checkout'
const LANGS = ['日本語', 'English', '中文', '한국어', 'Español', 'Français', 'Deutsch', 'Português', 'Italiano', 'Русский', 'العربية', 'ภาษาไทย', 'Tiếng Việt', 'Bahasa Indonesia'] as const

// PMS設定
// local: true → APIキー不要・ローカルのみで完結
const PMS_OPTIONS: {
  id: string; label: string; color: string
  local?: boolean       // ローカルモード（API不要）
  pending?: boolean     // 連携開発中
  region?: string       // 'JP' | 'Global'
  note?: string         // 補足
}[] = [
  // ── 日本向け ──
  { id: 'staysee',        label: 'Staysee',         color: '#10b981', region: 'JP', note: '民泊・旅館向け' },
  { id: 'easyaccounting', label: 'イージー会計',     color: '#6366f1', region: 'JP', note: '宿泊会計特化', pending: true },
  { id: 'bets24',         label: 'BETS24',           color: '#f59e0b', region: 'JP', note: 'ホテル向け', pending: true },
  { id: 'airhost',        label: 'エアホスト',       color: '#3b82f6', region: 'JP', note: 'Airbnb系' },
  { id: 'neppan',         label: 'ねっぱん！',       color: '#ec4899', region: 'JP', note: '旅館・温泉宿向け', pending: true },
  // ── グローバル ──
  { id: 'cloudbeds',      label: 'Cloudbeds',        color: '#8b5cf6', region: 'Global', note: '中規模ホテル向け' },
  { id: 'beds24',         label: 'Beds24',           color: '#14b8a6', region: 'Global', note: '民泊・ゲストハウス' },
  { id: 'apaleo',         label: 'apaleo',           color: '#f97316', region: 'Global', note: 'ヨーロッパ系REST API', pending: true },
  { id: 'hostaway',       label: 'Hostaway',         color: '#06b6d4', region: 'Global', note: '民泊チャンネル管理', pending: true },
  { id: 'little_hotelier',label: 'Little Hotelier',  color: '#84cc16', region: 'Global', note: '小規模ホテル向け', pending: true },
  { id: 'opera',          label: 'Oracle Opera',     color: '#ef4444', region: 'Global', note: '大手ホテルチェーン向け', pending: true },
  // ── ローカル（オフライン） ──
  { id: 'none',           label: 'PMS未接続',        color: '#64748b', local: true, note: 'ローカルで完全動作' },
]

// 錠デバイス設定
// local: true → APIキー不要
const LOCK_OPTIONS: {
  id: string; label: string; color: string
  local?: boolean
  pending?: boolean
  note?: string
  keyLabel?: string     // APIキーの呼び名
  keyHint?: string      // 取得場所のヒント
}[] = [
  // ── API連携型 ──
  {
    id: 'switchbot',   label: 'SwitchBot',      color: '#10b981',
    keyLabel: 'APIトークン',
    keyHint: 'SwitchBotアプリ → プロフィール → 設定 → APIキー',
  },
  {
    id: 'ttlock',      label: 'TT Lock',         color: '#6366f1',
    keyLabel: 'アクセストークン',
    keyHint: 'TT Lockアプリ → プロフィール → APIアクセス',
  },
  {
    id: 'sesame',      label: 'SESAME',          color: '#f59e0b',
    keyLabel: 'APIキー',
    keyHint: 'my.sesame.team → API Keys',
  },
  {
    id: 'igloohome',   label: 'igloohome',       color: '#3b82f6',
    keyLabel: 'Bridge APIトークン',
    keyHint: 'igloohome Bridge API → Access Token',
  },
  {
    id: 'remotelock',  label: 'RemoteLOCK',      color: '#ec4899',
    keyLabel: 'APIキー',
    keyHint: 'RemoteLOCK管理画面 → 設定 → API連携',
    pending: true,
  },
  {
    id: 'nuki',        label: 'Nuki',            color: '#84cc16',
    keyLabel: 'APIトークン',
    keyHint: 'Nuki Web API → https://api.nuki.io',
    pending: true,
  },
  {
    id: 'salto',       label: 'Salto KS',        color: '#8b5cf6',
    keyLabel: 'クライアントID / シークレット',
    keyHint: 'Saltoパートナーポータルで取得',
    pending: true,
  },
  // ── ローカル型（API不要） ──
  {
    id: 'fixed',       label: '固定パスワード',  color: '#f97316',
    local: true,
    keyLabel: 'パスワード（4〜8桁）',
    keyHint: 'チェックイン時に毎回この番号を案内します',
  },
  {
    id: 'offline',     label: 'オフライン（手渡し）', color: '#64748b',
    local: true,
    keyLabel: '—',
    keyHint: 'スタッフが手動で鍵を渡す運用です',
  },
]

type Reservation = {
  id: string
  name_kanji?: string
  name?: string
  tel?: string
  start_date?: string
  end_date?: string
  allocate_rooms?: { room_id: string }[]
  person_number?: number
  billing_amount?: number
  check_in_time?: string
  check_out_time?: string
}

const resName   = (r: Reservation) => r.name_kanji || r.name || '（氏名未設定）'
const resRoom   = (r: Reservation) => r.allocate_rooms?.[0]?.room_id || '—'
const resPhone  = (r: Reservation) => r.tel || '—'
const resAmount = (r: Reservation) => r.billing_amount ? `¥${r.billing_amount.toLocaleString()}` : '—'
const resDate   = (s?: string) => s ? s.substring(5).replace('-', '/') : '—'

const inputCls = `w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors`
const inputStyle: React.CSSProperties = { background: '#13141f', border: '1px solid #334155' }

/* ─────────── ローカルモード用ダミー予約 ─────────── */
const LOCAL_RESERVATIONS: Reservation[] = [
  {
    id: 'LOCAL-001', name_kanji: '山田 太郎', name: '山田 太郎',
    tel: '090-1234-5678', start_date: '2026-05-10', end_date: '2026-05-12',
    allocate_rooms: [{ room_id: '201' }], billing_amount: 18000, person_number: 2,
  },
  {
    id: 'LOCAL-002', name_kanji: '鈴木 花子', name: '鈴木 花子',
    tel: '080-9876-5432', start_date: '2026-05-10', end_date: '2026-05-11',
    allocate_rooms: [{ room_id: '305' }], billing_amount: 12000, person_number: 1,
  },
]

/* ─────────── 電子署名パネル ─────────── */
function SignaturePanel({
  onSigned, onClear
}: {
  onSigned: (dataUrl: string) => void
  onClear: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      const t = e.touches[0]
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current; if (!canvas) return
    const pos = getPos(e, canvas)
    lastPos.current = pos
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const pos = getPos(e, canvas)
    if (lastPos.current) {
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }
    lastPos.current = pos
    setHasSignature(true)
  }

  const stopDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(false)
    lastPos.current = null
    if (hasSignature && canvasRef.current) {
      onSigned(canvasRef.current.toDataURL())
    }
  }

  const clear = () => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    onClear()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
          <PenLine size={11} /> 電子署名（ここに署名してください）
        </label>
        {hasSignature && (
          <button onClick={clear} className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-red-400 transition-colors">
            <Trash2 size={10} /> クリア
          </button>
        )}
      </div>
      <div className="relative rounded-xl overflow-hidden"
        style={{ border: `2px dashed ${hasSignature ? 'rgba(16,185,129,0.6)' : '#334155'}`, background: '#0a0b0f', transition: 'border-color 0.2s' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          className="w-full block touch-none select-none"
          style={{ cursor: 'crosshair', height: '160px' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-slate-600">ここに署名してください</p>
          </div>
        )}
      </div>
      {hasSignature && (
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
          <CheckCircle2 size={11} /> 署名完了
        </div>
      )}
    </div>
  )
}

/* ─────────── CheckoutProcessing ─────────── */
function CheckoutProcessing({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t) }, [onDone])
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-300 font-medium text-sm">精算処理中...</p>
      <p className="text-slate-500 text-xs">PMSと同期しています</p>
    </div>
  )
}

/* ─────────── PMS設定バナー（DMS同期ボタン付き） ─────────── */
function PmsBanner({
  pms, lockType, isOnline, onSync
}: {
  pms: string; lockType: string; isOnline: boolean
  onSync: () => void
}) {
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const pmsInfo  = PMS_OPTIONS.find(p => p.id === pms)  || PMS_OPTIONS[4]
  const lockInfo = LOCK_OPTIONS.find(l => l.id === lockType) || LOCK_OPTIONS[2]

  const handleSync = async () => {
    setSyncing(true)
    setSyncMsg(null)
    await onSync()
    setSyncing(false)
    setSyncMsg('DMSに同期しました')
    setTimeout(() => setSyncMsg(null), 3000)
  }

  return (
    <div className="rounded-lg px-4 py-2.5 flex items-center gap-3 flex-wrap"
      style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
      {/* PMS状態 */}
      <div className="flex items-center gap-1.5 text-[11px]">
        {isOnline
          ? <Wifi size={11} style={{ color: pmsInfo.color }} />
          : <WifiOff size={11} className="text-slate-500" />}
        <span style={{ color: pmsInfo.color }} className="font-semibold">{pmsInfo.label}</span>
        {!isOnline && <span className="text-slate-600">（ローカル）</span>}
      </div>
      <span className="text-slate-700 text-[10px]">|</span>
      {/* 錠状態 */}
      <div className="flex items-center gap-1.5 text-[11px]">
        <Lock size={11} style={{ color: lockInfo.color }} />
        <span style={{ color: lockInfo.color }} className="font-semibold">{lockInfo.label}</span>
      </div>
      {/* 同期ボタン・ステータス */}
      <div className="flex items-center gap-2 ml-auto">
        {syncMsg && (
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={10} /> {syncMsg}
          </span>
        )}
        <button onClick={handleSync} disabled={syncing}
          className="flex items-center gap-1.5 px-3 h-7 rounded-md text-[11px] font-semibold transition-all"
          style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#34d399',
            opacity: syncing ? 0.6 : 1,
          }}>
          {syncing ? <Loader2 size={10} className="animate-spin" /> : <Wifi size={10} />}
          DMSに同期
        </button>
      </div>
    </div>
  )
}

/* ─────────── フロント通話設定（Daily.co APIキー） ─────────── */
function DailyApiKeySection() {
  const [apiKey, setApiKey] = React.useState('')
  const [show, setShow] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/dms/config')
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setApiKey(data.daily_api_key || '')
        }
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    await fetch('/api/dms/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ daily_api_key: apiKey.trim() }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-3 rounded-xl p-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
      <div className="flex items-center gap-2">
        <Video size={13} style={{ color: '#10b981' }} />
        <span className="text-xs font-semibold text-slate-300">フロント通話設定（Daily.co）</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed">
        トップ画面の「フロントを呼び出す」ボタンでビデオ通話を使うには、<br />
        <a href="https://dashboard.daily.co" target="_blank" rel="noreferrer" className="text-emerald-400 underline">dashboard.daily.co</a> で取得したAPIキーを入力してください。<br />
        ※ 無料プランで利用可能。設定後すぐに通話ボタンが有効になります。
      </p>
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-slate-500">Daily.co APIキー</label>
        <p className="text-[10px] text-slate-600">📍 dashboard.daily.co → Developers → API keys → Generate key</p>
        <div className="flex gap-2">
          <input
            type={show ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="flex-1 h-11 px-3 rounded-lg text-xs text-slate-200 font-mono outline-none"
            style={{ background: '#0d1117', border: '1px solid #334155' }}
            onFocus={e => (e.target.style.borderColor = '#10b981')}
            onBlur={e => (e.target.style.borderColor = '#334155')}
          />
          <button onClick={() => setShow(v => !v)}
            className="shrink-0 h-11 px-3 rounded-lg text-xs transition-all"
            style={{ background: '#0d1117', border: '1px solid #334155', color: '#64748b' }}>
            {show ? '🙈' : '👁'}
          </button>
        </div>
      </div>
      <button onClick={handleSave}
        className="w-full h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        style={{ background: apiKey.trim() ? '#10b981' : '#1e293b', color: '#fff', border: '1px solid #334155' }}>
        {saved ? <><CheckCircle2 size={12} /> 保存しました！通話ボタンが有効になりました</> : '💾 APIキーを保存する'}
      </button>
      {!apiKey.trim() && (
        <p className="text-[10px] text-amber-400 flex items-center gap-1">
          ⚠️ APIキー未設定のため、フロント呼び出しボタンは現在使用できません
        </p>
      )}
    </div>
  )
}

/* ─────────── 設定パネル（APIキー入力→保存→接続テスト） ─────────── */
type ConnectStatus = { ok: boolean; message: string } | null

function SettingsPanel({
  pms, setPms, lockType, setLockType, fixedPassword, setFixedPassword,
  onClose, onPmsConnected, onLockConnected,
}: {
  pms: string; setPms: (v: string) => void
  lockType: string; setLockType: (v: string) => void
  fixedPassword: string; setFixedPassword: (v: string) => void
  onClose: () => void
  onPmsConnected: (mode: string) => void
  onLockConnected: (mode: string) => void
}) {
  // PMS フィールド
  const [pmsFields, setPmsFields] = useState<Record<string, string>>({})
  // 錠 フィールド
  const [lockFields, setLockFields] = useState<Record<string, string>>({})

  // /api/dms/config から復元
  useEffect(() => {
    fetch('/api/dms/config').then(r => r.json()).then(data => {
      if (!data.error) {
        if (data.pms_type) setPms(data.pms_type)
        if (data.pms_fields) setPmsFields(data.pms_fields)
        if (data.lock_type) setLockType(data.lock_type)
        if (data.lock_fields) setLockFields(data.lock_fields)
      }
    }).catch(() => {})
  }, [])

  const [pmsStatus,  setPmsStatus]  = useState<ConnectStatus>(null)
  const [lockStatus, setLockStatus] = useState<ConnectStatus>(null)
  const [pmsTesting, setPmsTesting]  = useState(false)
  const [lockTesting, setLockTesting] = useState(false)
  const [showFields, setShowFields] = useState<Record<string, boolean>>({})

  const pmsInfo  = PMS_OPTIONS.find(p => p.id === pms)!
  const lockInfo = LOCK_OPTIONS.find(l => l.id === lockType)!

  // PMS必須フィールド定義
  const PMS_FIELDS: Record<string, { key: string; label: string; ph: string; secret?: boolean; hint?: string }[]> = {
    staysee:        [{ key: 'apiKey',       label: 'APIキー',                      ph: 'sk-xxxxxxxx',              secret: true, hint: 'Staysee管理画面 → 設定 → APIキー' }],
    airhost:        [{ key: 'apiKey',       label: 'APIキー',                      ph: 'ah-xxxxxxxx',              secret: true, hint: 'エアホスト管理画面 → API連携' }],
    easyaccounting: [{ key: 'apiKey',       label: 'APIキー',                      ph: 'ea-xxxxxxxx',              secret: true, hint: 'イージー会計 → 設定 → API連携（開発中）' }],
    bets24:         [{ key: 'apiKey',       label: 'APIキー',                      ph: 'bets-xxxxxxxx',            secret: true, hint: 'BETS24管理画面 → API設定（開発中）' }],
    neppan:         [{ key: 'apiKey',       label: 'APIキー',                      ph: 'np-xxxxxxxx',              secret: true, hint: 'ねっぱん！管理画面 → API設定（開発中）' }],
    cloudbeds:      [
      { key: 'clientId',     label: 'Client ID',     ph: 'cb_client_xxxxxxxx', hint: 'Cloudbeds → Apps → API' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'cb_secret_xxxxxxxx', secret: true, hint: 'Cloudbeds → Apps → API' },
    ],
    beds24:         [
      { key: 'propKey',     label: 'Prop Key (APIトークン)',  ph: 'xxxxxxxxxxxxxxxx', secret: true, hint: 'Beds24 → My Account → Advanced → API Keys' },
      { key: 'inviteCode',  label: 'Invite Code（初回のみ）', ph: 'invite-xxxxxxxx',   hint: 'Beds24アカウントの招待コード（初期設定時のみ必要）' },
    ],
    apaleo:         [
      { key: 'clientId',     label: 'Client ID',     ph: 'APALEO-xxxxxxxx', hint: 'apaleo Developer Portal → Apps' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'xxxxxxxxxxxxxxxx', secret: true },
    ],
    hostaway:       [
      { key: 'accountId',   label: 'Account ID',    ph: '12345',           hint: 'Hostaway → Settings → API' },
      { key: 'apiKey',      label: 'APIキー',        ph: 'ha-xxxxxxxx',    secret: true },
    ],
    little_hotelier: [{ key: 'apiKey', label: 'APIキー', ph: 'lh-xxxxxxxx', secret: true, hint: 'Little Hotelier → Settings → API Access' }],
    opera:           [
      { key: 'clientId',     label: 'Client ID',     ph: 'oracle-client-id',     hint: 'Oracle Cloud → API Gateway' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'oracle-client-secret', secret: true },
      { key: 'propertyCode', label: 'Property Code', ph: 'HOTEL1', hint: 'Operaのプロパティコード（英数字）' },
    ],
    none: [],
  }

  // 錠デバイス必須フィールド定義
  const LOCK_FIELDS: Record<string, { key: string; label: string; ph: string; secret?: boolean; hint?: string }[]> = {
    switchbot: [
      { key: 'token',     label: 'Open Token',  ph: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true,
        hint: 'SwitchBotアプリ → プロフィール → 設定 → アプリ・SwitchBotウェブサービス → APIキー' },
      { key: 'secret',    label: 'Secret Key',  ph: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true,
        hint: 'Open Token取得画面の下に表示されるSecret Key（v1.1必須）' },
    ],
    ttlock: [
      { key: 'clientId',  label: 'Client ID',   ph: 'your_client_id',     hint: 'TTLock開発者ポータル → アプリ作成 → Client ID' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'your_client_secret', secret: true },
      { key: 'username',  label: 'ログインID（メール）', ph: 'your@email.com',  hint: 'TTLockアプリのアカウントメールアドレス' },
      { key: 'password',  label: 'パスワード',   ph: '••••••••',           secret: true, hint: 'TTLockアプリのログインパスワード' },
    ],
    sesame: [
      { key: 'apiKey',    label: 'API Key',      ph: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true,
        hint: 'my.sesame.team → ログイン → API Keys → Generate API Key' },
    ],
    igloohome: [
      { key: 'clientId',     label: 'Client ID',     ph: 'igl-client-xxxxxxxx', hint: 'igloohome Bridge → Developer → API Settings' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'igl-secret-xxxxxxxx', secret: true },
    ],
    remotelock: [
      { key: 'apiKey',    label: 'APIキー',      ph: 'rl-xxxxxxxxxxxxxxxx', secret: true, hint: 'RemoteLOCK管理画面 → 設定 → API連携（開発中）' },
    ],
    nuki: [
      { key: 'apiToken',  label: 'API Token',    ph: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true,
        hint: 'Nuki Web（https://web.nuki.io）→ API → Manage API tokens → Generate API token' },
    ],
    salto: [
      { key: 'clientId',     label: 'Client ID',     ph: 'salto-client-xxxxxxxx', hint: 'Saltoパートナーポータルで取得（開発中）' },
      { key: 'clientSecret', label: 'Client Secret', ph: 'salto-secret-xxxxxxxx', secret: true },
    ],
    fixed: [
      { key: 'password',  label: '固定パスワード（4〜8桁の数字）', ph: '8421', hint: 'チェックイン時にゲストへ案内するコード番号' },
    ],
    offline: [],
  }

  const curPmsFields  = PMS_FIELDS[pms]  || []
  const curLockFields = LOCK_FIELDS[lockType] || []

  const setPmsField  = (k: string, v: string) => setPmsFields(prev => ({ ...prev, [k]: v }))
  const setLockField = (k: string, v: string) => setLockFields(prev => ({ ...prev, [k]: v }))
  const toggleShow = (k: string) => setShowFields(prev => ({ ...prev, [k]: !prev[k] }))

  /* PMS保存 */
  const savePms = async () => {
    await fetch('/api/dms/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pms_type: pms, pms_fields: pmsFields }),
    })
    setPmsStatus({ ok: true, message: '保存しました。「DMS接続テスト」を押してください。' })
  }

  /* 錠設定保存 */
  const saveLock = async () => {
    const pw = curLockFields.find(f => f.key === 'password')?.key
    if (pw) setFixedPassword(lockFields[pw] || fixedPassword)
    await fetch('/api/dms/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lock_type: lockType, lock_fields: lockFields }),
    })
    setLockStatus({ ok: true, message: '保存しました。「錠接続テスト」を押してください。' })
  }

  /* DMS接続テスト */
  const testPms = async () => {
    setPmsTesting(true)
    setPmsStatus(null)
    try {
      const res = await fetch('/api/nextra-ai/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pms', pms, fields: pmsFields }),
      })
      const data = await res.json()
      setPmsStatus({ ok: data.ok, message: data.message })
      if (data.ok) onPmsConnected(data.mode || 'live')
    } catch {
      setPmsStatus({ ok: false, message: 'ネットワークエラーが発生しました' })
    } finally {
      setPmsTesting(false)
    }
  }

  /* 錠接続テスト */
  const testLock = async () => {
    setLockTesting(true)
    setLockStatus(null)
    try {
      const res = await fetch('/api/nextra-ai/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lock', lockType, fields: lockFields }),
      })
      const data = await res.json()
      setLockStatus({ ok: data.ok, message: data.message })
      if (data.ok) onLockConnected(data.mode || 'live')
    } catch {
      setLockStatus({ ok: false, message: 'ネットワークエラーが発生しました' })
    } finally {
      setLockTesting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6 space-y-7 my-4"
        style={{ background: '#0d1117', border: '1px solid #1e293b' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Settings size={16} style={{ color: '#10b981' }} /> DMS システム設定
          </h3>
          <button onClick={onClose} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">✕ 閉じる</button>
        </div>

        {/* ── PMS設定セクション ── */}
        <div className="space-y-4 rounded-xl p-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
          <div className="flex items-center gap-2">
            <Wifi size={13} style={{ color: pmsInfo.color }} />
            <span className="text-xs font-semibold text-slate-300">PMS連携設定</span>
            <span className="text-[10px] text-slate-600 ml-auto">{PMS_OPTIONS.length - 1}種類対応</span>
          </div>

          {/* 日本向けPMS */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">🇯🇵 日本向け</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PMS_OPTIONS.filter(o => o.region === 'JP').map(opt => (
                <button key={opt.id} onClick={() => { setPms(opt.id); setPmsStatus(null) }}
                  className="h-auto py-1.5 px-2 rounded-lg text-left transition-all relative"
                  style={{
                    background: pms === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${pms === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: pms === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600">{opt.note}</span>
                  {opt.pending && (
                    <span className="absolute top-1 right-1 text-[8px] px-1 rounded"
                      style={{ background: '#1e293b', color: '#64748b' }}>開発中</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* グローバルPMS */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">🌐 グローバル</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PMS_OPTIONS.filter(o => o.region === 'Global').map(opt => (
                <button key={opt.id} onClick={() => { setPms(opt.id); setPmsStatus(null) }}
                  className="h-auto py-1.5 px-2 rounded-lg text-left transition-all relative"
                  style={{
                    background: pms === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${pms === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: pms === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600">{opt.note}</span>
                  {opt.pending && (
                    <span className="absolute top-1 right-1 text-[8px] px-1 rounded"
                      style={{ background: '#1e293b', color: '#64748b' }}>開発中</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ローカルモード */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">📴 オフライン</p>
            <div className="grid grid-cols-1 gap-1.5">
              {PMS_OPTIONS.filter(o => o.local).map(opt => (
                <button key={opt.id} onClick={() => { setPms(opt.id); setPmsStatus(null) }}
                  className="h-auto py-1.5 px-3 rounded-lg text-left transition-all"
                  style={{
                    background: pms === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${pms === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold" style={{ color: pms === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600 ml-2">{opt.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PMS動的フィールド入力 */}
          {!pmsInfo.local && curPmsFields.length > 0 && (
            <div className="space-y-3">
              {pmsInfo.pending && (
                <div className="text-[10px] px-2 py-1.5 rounded-lg text-amber-400"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  ⚠️ このPMSは連携開発中です。APIキーを先行保存しておくと、リリース後すぐ使えます。
                </div>
              )}
              {curPmsFields.map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">{f.label}</label>
                  {f.hint && <p className="text-[10px] text-slate-600">📍 {f.hint}</p>}
                  <div className="flex gap-2">
                    <input
                      type={f.secret && !showFields[`pms_${f.key}`] ? 'password' : 'text'}
                      value={pmsFields[f.key] || ''}
                      onChange={e => setPmsField(f.key, e.target.value)}
                      placeholder={f.ph}
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = pmsInfo.color)}
                      onBlur={e => (e.target.style.borderColor = '#334155')}
                    />
                    {f.secret && (
                      <button onClick={() => toggleShow(`pms_${f.key}`)}
                        className="shrink-0 h-11 px-3 rounded-lg text-xs transition-all"
                        style={{ background: '#0d1117', border: '1px solid #334155', color: '#64748b' }}>
                        {showFields[`pms_${f.key}`] ? '🙈' : '👁'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!pmsInfo.local && curPmsFields.length === 0 && (
            <p className="text-[10px] text-slate-600 px-2">このPMSのフィールド定義は準備中です。</p>
          )}

          {/* PMS 保存 + 接続テストボタン */}
          <div className="flex gap-2">
            <button onClick={savePms}
              className="flex-1 h-9 rounded-lg text-xs font-semibold transition-all"
              style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
              💾 保存
            </button>
            <button onClick={testPms} disabled={pmsTesting}
              className="flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              style={{ background: pmsInfo.local ? '#334155' : pmsInfo.color, color: '#fff', opacity: pmsTesting ? 0.7 : 1 }}>
              {pmsTesting ? <Loader2 size={12} className="animate-spin" /> : <Wifi size={12} />}
              {pmsInfo.local ? 'ローカルモードで確認' : 'DMS接続テスト'}
            </button>
          </div>

          {/* PMS ステータス */}
          {pmsStatus && (
            <div className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg"
              style={{
                background: pmsStatus.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${pmsStatus.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: pmsStatus.ok ? '#34d399' : '#f87171',
              }}>
              {pmsStatus.ok ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" /> : <span className="shrink-0">✗</span>}
              {pmsStatus.message}
            </div>
          )}
        </div>

        {/* ── 錠デバイス設定セクション ── */}
        <div className="space-y-4 rounded-xl p-4" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
          <div className="flex items-center gap-2">
            <Lock size={13} style={{ color: lockInfo.color }} />
            <span className="text-xs font-semibold text-slate-300">錠デバイス設定</span>
            <span className="text-[10px] text-slate-600 ml-auto">{LOCK_OPTIONS.length}種類対応</span>
          </div>

          {/* API連携型 */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">🔌 API連携型スマートロック</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {LOCK_OPTIONS.filter(o => !o.local).map(opt => (
                <button key={opt.id} onClick={() => { setLockType(opt.id); setLockStatus(null) }}
                  className="h-auto py-1.5 px-2 rounded-lg text-left transition-all relative"
                  style={{
                    background: lockType === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${lockType === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: lockType === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600">{opt.keyLabel}</span>
                  {opt.pending && (
                    <span className="absolute top-1 right-1 text-[8px] px-1 rounded"
                      style={{ background: '#1e293b', color: '#64748b' }}>開発中</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ローカル型 */}
          <div>
            <p className="text-[10px] font-medium text-slate-600 mb-1.5">📴 ローカル／手動</p>
            <div className="grid grid-cols-2 gap-1.5">
              {LOCK_OPTIONS.filter(o => o.local).map(opt => (
                <button key={opt.id} onClick={() => { setLockType(opt.id); setLockStatus(null) }}
                  className="h-auto py-1.5 px-2 rounded-lg text-left transition-all"
                  style={{
                    background: lockType === opt.id ? `${opt.color}18` : '#0d1117',
                    border: `1px solid ${lockType === opt.id ? opt.color + '70' : '#334155'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: lockType === opt.id ? opt.color : '#94a3b8' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-600">{opt.keyHint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 錠デバイス動的フィールド入力 */}
          {curLockFields.length > 0 && (
            <div className="space-y-3">
              {lockInfo.pending && (
                <div className="text-[10px] px-2 py-1.5 rounded-lg text-amber-400"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  ⚠️ このデバイスは連携開発中です。先行保存しておくとリリース後すぐ使えます。
                </div>
              )}
              {curLockFields.map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">{f.label}</label>
                  {f.hint && <p className="text-[10px] text-slate-600">📍 {f.hint}</p>}
                  <div className="flex gap-2">
                    <input
                      type={f.secret && !showFields[`lock_${f.key}`] ? 'password' : 'text'}
                      value={lockFields[f.key] || ''}
                      onChange={e => {
                        const val = f.key === 'password' && lockType === 'fixed'
                          ? e.target.value.replace(/\D/g, '').slice(0, 8)
                          : e.target.value
                        setLockField(f.key, val)
                        if (f.key === 'password') setFixedPassword(val)
                      }}
                      placeholder={f.ph}
                      className={inputCls} style={inputStyle}
                      maxLength={f.key === 'password' && lockType === 'fixed' ? 8 : undefined}
                      onFocus={e => (e.target.style.borderColor = lockInfo.color)}
                      onBlur={e => (e.target.style.borderColor = '#334155')}
                    />
                    {f.secret && (
                      <button onClick={() => toggleShow(`lock_${f.key}`)}
                        className="shrink-0 h-11 px-3 rounded-lg text-xs transition-all"
                        style={{ background: '#0d1117', border: '1px solid #334155', color: '#64748b' }}>
                        {showFields[`lock_${f.key}`] ? '🙈' : '👁'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {lockType === 'offline' && (
            <p className="text-[10px] text-slate-500 px-2 py-2 rounded-lg"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
              🏠 API不要モード。スタッフが手動で鍵をゲストへ渡す運用です。
            </p>
          )}

          {/* 錠 保存 + 接続テストボタン */}
          <div className="flex gap-2">
            <button onClick={saveLock}
              className="flex-1 h-9 rounded-lg text-xs font-semibold transition-all"
              style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
              💾 保存
            </button>
            <button onClick={testLock} disabled={lockTesting}
              className="flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              style={{
                background: lockInfo.local ? '#334155' : lockInfo.color,
                color: '#fff',
                opacity: lockTesting ? 0.7 : 1,
              }}>
              {lockTesting ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
              {lockInfo.local ? 'ローカルで確認' : '錠接続テスト'}
            </button>
          </div>

          {/* 錠 ステータス */}
          {lockStatus && (
            <div className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg"
              style={{
                background: lockStatus.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${lockStatus.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: lockStatus.ok ? '#34d399' : '#f87171',
              }}>
              {lockStatus.ok ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" /> : <span className="shrink-0">✗</span>}
              {lockStatus.message}
            </div>
          )}
        </div>

        {/* ── フロント通話設定（Daily.co APIキー） ── */}
        <DailyApiKeySection />

        <button onClick={onClose}
          className="w-full h-11 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#10b981', color: '#fff' }}>
          設定を保存して閉じる
        </button>
      </div>
    </div>
  )
}

/* ─────────── メインエンジン ─────────── */
const MasterEngine = () => {
  const [activeTab, setActiveTab]         = useState<string>('kiosk')
  const [isMounted, setIsMounted]         = useState(false)
  const [selectedLang, setSelectedLang]   = useState('日本語')

  // システム設定
  const [pms, setPms]                     = useState<string>('staysee')
  const [lockType, setLockType]           = useState<string>('fixed')
  const [fixedPassword, setFixedPassword] = useState<string>('8421')
  const [showSettings, setShowSettings]   = useState(false)
  const [isOnline, setIsOnline]           = useState(false)

  // 翻訳ショートハンド（selectedLang が変わると自動再レンダー）
  const t = I18N[selectedLang as LangKey] ?? I18N['日本語']

  // スタッフモード（PIN認証済み）
  const [staffMode, setStaffMode]         = useState(false)
  const [showPinOverlay, setShowPinOverlay] = useState(false)
  const [pinInput, setPinInput]           = useState('')
  const [pinError, setPinError]           = useState(false)
  const STAFF_PIN = '1234'   // DMSで設定可能にする想定

  // 全画面
  const containerRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 予約検索
  const [searchMode, setSearchMode]       = useState<'select'|'reservation'|'name'|'phone'>('select')
  const [searchQuery, setSearchQuery]     = useState('')
  const [searchResults, setSearchResults] = useState<Reservation[]>([])
  const [searching, setSearching]         = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  // チェックイン
  const [checkinStatus, setCheckinStatus] = useState<'IDLE'|'SCANNING'|'VERIFIED'>('IDLE')
  const [ledgerName, setLedgerName]       = useState('')
  const [ledgerAddress, setLedgerAddress] = useState('')
  const [ledgerOccupation, setLedgerOccupation] = useState('')
  const [ledgerTravel, setLedgerTravel]   = useState('')
  const [signatureData, setSignatureData] = useState<string>('')
  const [signatureClearedAt, setSignatureClearedAt] = useState(0)

  // カメラ（IDスキャン専用）
  const [isCameraOpen, setIsCameraOpen]   = useState(false)
  const [cameraError, setCameraError]     = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // チェックアウト
  const [checkoutQuery, setCheckoutQuery]     = useState('')
  const [checkoutResults, setCheckoutResults] = useState<Reservation[]>([])
  const [checkoutTarget, setCheckoutTarget]   = useState<Reservation | null>(null)
  const [checkoutSearching, setCheckoutSearching] = useState(false)
  const [checkoutStep, setCheckoutStep]       = useState<'search'|'confirm'|'processing'|'done'>('search')
  const [coMode, setCoMode]                   = useState<'select'|'reservation'|'name'|'phone'>('select')
  const [hasExtraCharge] = useState(false)

  /* ── Fullscreen（初回タッチで全画面） ── */
  const requestFullscreen = () => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
    else if ((el as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
      (el as HTMLElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen()
    }
  }

  /* ── スタッフPIN認証 ── */
  const handlePinSubmit = () => {
    if (pinInput === STAFF_PIN) {
      setStaffMode(true)
      setShowPinOverlay(false)
      setPinInput('')
      setPinError(false)
      setActiveTab('checkout')
    } else {
      setPinError(true)
      setPinInput('')
      setTimeout(() => setPinError(false), 1500)
    }
  }

  const handleStaffLongPress = () => {
    setShowPinOverlay(true)
    setPinInput('')
    setPinError(false)
  }

  useEffect(() => {
    setIsMounted(true)
    // /api/dms/config からクラウド設定を復元
    fetch('/api/dms/config')
      .then(r => r.json())
      .then(data => {
        if (data.error) return
        if (data.pms_type && data.pms_type !== 'none') {
          setPms(data.pms_type)
          setIsOnline(true)
        }
        if (data.lock_type) setLockType(data.lock_type)
        if (data.fixed_password) setFixedPassword(data.fixed_password)
      })
      .catch(() => {})
  }, [])

  /* ─── QRスキャン（BarcodeDetector API） ─── */
  const qrScanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCamera = async () => {
    setCameraError(null)
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        // BarcodeDetector APIでQRを連続検出
        videoRef.current.addEventListener('playing', () => startQrDetection(), { once: true })
      }
    } catch {
      setCameraError('カメラへのアクセスが拒否されました')
      setIsCameraOpen(false)
    }
  }

  const startQrDetection = () => {
    // BarcodeDetector API 非対応ブラウザはスキップ（手動スキャンボタンにフォールバック）
    if (!('BarcodeDetector' in window)) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })

    qrScanTimerRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return
      try {
        const barcodes = await detector.detect(videoRef.current)
        if (barcodes.length > 0) {
          const qrValue: string = barcodes[0].rawValue || ''
          clearInterval(qrScanTimerRef.current!)
          closeCamera()
          handleQrResult(qrValue)
        }
      } catch { /* 検出エラーは無視 */ }
    }, 300)
  }

  const closeCamera = () => {
    if (qrScanTimerRef.current) clearInterval(qrScanTimerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    setIsCameraOpen(false)
    setCameraError(null)
  }

  /* ─── QR読み取り結果処理 ─── */
  const handleQrResult = (qrValue: string) => {
    // 予約IDがQRに含まれているか検索（例: "reservation_id=ABC123" or "ABC123" など）
    const idMatch = qrValue.match(/(?:reservation[_-]?id[=:]?\s*)([A-Za-z0-9-]+)/i)
      || qrValue.match(/([A-Za-z0-9]{6,20})/)
    const extractedId = idMatch?.[1] || qrValue.trim()

    if (extractedId && selectedReservation) {
      // 予約が既に選択済み → チェックイン処理へ
      runCheckin()
    } else if (extractedId) {
      // 予約IDをQRから自動検索
      setSearchQuery(extractedId)
      setSearchMode('reservation')
      doSearchByQuery(extractedId)
    } else {
      setCameraError('QRコードから予約IDを読み取れませんでした')
    }
  }

  const capturePhoto = () => {
    // BarcodeDetector非対応時のフォールバック（手動撮影）
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx?.drawImage(videoRef.current, 0, 0)
      closeCamera()
      runCheckin()
    }
  }

  /* ─── チェックイン処理（予約選択済みが前提） ─── */
  const runCheckin = async () => {
    setCheckinStatus('SCANNING')
    await new Promise(r => setTimeout(r, 800))
    if (selectedReservation) {
      setLedgerName(resName(selectedReservation))
      setLedgerAddress((selectedReservation as Record<string, unknown>).address as string || '')
      setLedgerOccupation('')
      setLedgerTravel('')
    }
    setCheckinStatus('VERIFIED')
  }

  /* ─── 予約検索（クエリ直接指定版） ─── */
  const doSearchByQuery = async (query: string) => {
    if (!query.trim()) return
    setSearching(true)
    setSearchResults([])
    try {
      if (pms === 'none') {
        const q = query.toLowerCase()
        const results = LOCAL_RESERVATIONS.filter(r =>
          r.id.toLowerCase().includes(q) ||
          (r.name_kanji || '').toLowerCase().includes(q) ||
          (r.tel || '').replace(/-/g, '').includes(q.replace(/-/g, ''))
        )
        await new Promise(r => setTimeout(r, 400))
        setSearchResults(results)
      } else {
        const res = await fetch(`/api/staysee/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setSearchResults(data.reservations || [])
      }
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  /* ─── 予約検索（PMS分岐） ─── */
  const doSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearchResults([])
    try {
      if (pms === 'none') {
        // ローカルモード: ダミーデータから検索
        const q = searchQuery.toLowerCase()
        const results = LOCAL_RESERVATIONS.filter(r =>
          r.id.toLowerCase().includes(q) ||
          (r.name_kanji || '').toLowerCase().includes(q) ||
          (r.tel || '').replace(/-/g, '').includes(q.replace(/-/g, ''))
        )
        await new Promise(r => setTimeout(r, 500))
        setSearchResults(results)
        setIsOnline(false)
      } else {
        // PMS API呼び出し
        const apiPath = pms === 'staysee' ? '/api/staysee/search' : `/api/pms/${pms}/search`
        const res = await fetch(`${apiPath}?q=${encodeURIComponent(searchQuery.trim())}`)
        const data = await res.json()
        setSearchResults(data.reservations || [])
        setIsOnline(true)
      }
    } catch {
      // APIエラー時はローカルモードにフォールバック
      const q = searchQuery.toLowerCase()
      setSearchResults(LOCAL_RESERVATIONS.filter(r =>
        r.id.toLowerCase().includes(q) || (r.name_kanji || '').includes(q) || (r.tel || '').includes(q)
      ))
      setIsOnline(false)
    } finally {
      setSearching(false)
    }
  }

  const selectReservation = (r: Reservation) => {
    setSelectedReservation(r)
    setLedgerName(resName(r))
    setCheckinStatus('IDLE')
    setActiveTab('checkin')
  }

  /* ─── チェックアウト検索 ─── */
  const doCheckoutSearch = async () => {
    if (!checkoutQuery.trim()) return
    setCheckoutSearching(true)
    setCheckoutResults([])
    try {
      if (pms === 'none') {
        const q = checkoutQuery.toLowerCase()
        const results = LOCAL_RESERVATIONS.filter(r =>
          r.id.toLowerCase().includes(q) ||
          (r.name_kanji || '').toLowerCase().includes(q) ||
          (r.tel || '').replace(/-/g, '').includes(q.replace(/-/g, ''))
        )
        await new Promise(r => setTimeout(r, 400))
        setCheckoutResults(results)
      } else {
        const apiPath = pms === 'staysee' ? '/api/staysee/search' : `/api/pms/${pms}/search`
        const res = await fetch(`${apiPath}?q=${encodeURIComponent(checkoutQuery.trim())}&mode=checkout`)
        const data = await res.json()
        setCheckoutResults(data.reservations || [])
      }
    } catch {
      const q = checkoutQuery.toLowerCase()
      setCheckoutResults(LOCAL_RESERVATIONS.filter(r =>
        (r.name_kanji || '').includes(q) || (r.tel || '').includes(q)
      ))
    } finally {
      setCheckoutSearching(false)
    }
  }

  const selectCheckoutTarget = (r: Reservation) => {
    setCheckoutTarget(r)
    setCheckoutStep('confirm')
  }

  /* ─── クラウド保存（Supabase経由） ─── */
  const saveToCloud = async (payload: Record<string, unknown>) => {
    try {
      await fetch('/api/nextra-ai/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // サイレントフェイル（UI影響なし）
    }
  }

  /* ─── チェックイン完了通知 ─── */
  const notifyCheckin = async (reservationId: string) => {
    if (pms !== 'none') {
      await fetch('/api/staysee/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId, action: 'checkin',
          ledger: { name: ledgerName, address: ledgerAddress, occupation: ledgerOccupation, travel: ledgerTravel },
        }),
      }).catch(() => null)
    }
    // クラウド保存（常時）
    await saveToCloud({
      type: 'checkin', reservationId, pms,
      ledger: { name: ledgerName, address: ledgerAddress, occupation: ledgerOccupation, travel: ledgerTravel },
      hasSig: !!signatureData,
      timestamp: new Date().toISOString(),
    })
  }

  /* ─── チェックアウト完了通知 ─── */
  const notifyCheckout = async (reservationId: string) => {
    if (pms !== 'none') {
      await fetch('/api/staysee/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, action: 'checkout' }),
      }).catch(() => null)
    }
    await saveToCloud({
      type: 'checkout', reservationId, pms,
      timestamp: new Date().toISOString(),
    })
  }

  /* ─── 錠パスワード生成 ─── */
  const getLockCode = useCallback(() => {
    if (lockType === 'fixed') return fixedPassword || '8421'
    if (lockType === 'switchbot' || lockType === 'ttlock') {
      // 実API連携時はAPIから取得（現在はシミュレーション）
      const base = selectedReservation?.id?.slice(-4) || '0000'
      return base.padStart(4, '0')
    }
    return '—'
  }, [lockType, fixedPassword, selectedReservation])

  /* ─── ウィザードステップ切り替え（ガード付き） ─── */
  const gotoTab = (id: string) => {
    // ガード: checkin / lock は予約選択済みが前提
    if ((id === 'checkin' || id === 'lock') && !selectedReservation) {
      setActiveTab('search')
      setSearchMode('select')
      return
    }
    setActiveTab(id)
    if (id === 'search') { setSearchMode('select'); setSearchQuery(''); setSearchResults([]) }
    if (id === 'checkout') { setCheckoutStep('search'); setCheckoutQuery(''); setCheckoutResults([]); setCheckoutTarget(null); setCoMode('select') }
  }

  if (!isMounted) return null

  return (
    <div
      ref={containerRef}
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
      onClick={requestFullscreen}
    >

      {/* スタッフPINオーバーレイ */}
      {showPinOverlay && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }}>
          <div className="w-full max-w-xs rounded-2xl p-6 space-y-5" style={{ background: '#0d0f1a', border: '1px solid rgba(16,185,129,0.3)' }}>
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl" style={{ background: 'rgba(16,185,129,0.12)' }}>🔐</div>
              <h3 className="text-sm font-semibold text-slate-100 mt-2">スタッフ認証</h3>
              <p className="text-[10px] text-slate-600">スタッフPINを入力してください</p>
            </div>
            {/* PINディスプレイ */}
            <div className="flex gap-3 justify-center">
              {[0,1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
                  style={{ background: '#13141f', border: `1px solid ${pinError ? '#ef4444' : pinInput.length > i ? '#10b981' : '#334155'}` }}>
                  {pinInput.length > i ? '●' : ''}
                </div>
              ))}
            </div>
            {pinError && <p className="text-center text-xs text-red-400">PINが正しくありません</p>}
            {/* テンキー */}
            <div className="grid grid-cols-3 gap-2">
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, idx) => (
                <button key={idx} onClick={() => {
                  if (k === '⌫') setPinInput(p => p.slice(0,-1))
                  else if (k === '') { /* 空 */ }
                  else if (pinInput.length < 4) {
                    const next = pinInput + k
                    setPinInput(next)
                    if (next.length === 4) setTimeout(() => {
                      if (next === STAFF_PIN) {
                        setStaffMode(true); setShowPinOverlay(false); setPinInput(''); setPinError(false); setActiveTab('checkout')
                      } else {
                        setPinError(true); setPinInput(''); setTimeout(() => setPinError(false), 1500)
                      }
                    }, 150)
                  }
                }}
                  disabled={k === ''}
                  className="h-12 rounded-xl text-base font-semibold transition-all active:scale-95"
                  style={{ background: k ? '#1e293b' : 'transparent', color: k === '⌫' ? '#f87171' : '#e2e8f0' }}>
                  {k}
                </button>
              ))}
            </div>
            <button onClick={() => { setShowPinOverlay(false); setPinInput('') }}
              className="w-full h-9 rounded-lg text-xs font-semibold text-slate-500" style={{ background: '#13141f' }}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 画面左上隅 — 長押し5秒でスタッフメニュー起動（不可視） */}
      <div
        className="fixed top-0 left-0 w-16 h-16 z-40"
        onTouchStart={() => { longPressTimer.current = setTimeout(handleStaffLongPress, 5000) }}
        onTouchEnd={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current) }}
        onMouseDown={() => { longPressTimer.current = setTimeout(handleStaffLongPress, 5000) }}
        onMouseUp={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current) }}
      />

      {/* ヘッダー: ロゴ + ステップ表示（全画面タブレット想定） */}
      <div className="w-full px-8 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <Monitor size={16} style={{ color: '#10b981' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Nextra AI KIOSK</p>
              <p className="text-[10px] text-slate-600">スマートチェックインシステム</p>
            </div>
          </div>
          {/* オンライン状態 + スタッフモード */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              {isOnline ? 'PMS接続中' : 'ローカルモード'}
            </span>
            {staffMode && (
              <button onClick={() => { setStaffMode(false); setActiveTab('kiosk') }}
                className="text-[10px] px-2 py-1 rounded-md"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                🔓 スタッフ解除
              </button>
            )}
          </div>
        </div>

        {/* ウィザードプログレス（ゲスト用・kiosk→search→checkin→lock） */}
        {activeTab !== 'checkout' && (
          <div className="flex items-center gap-0">
            {[
              { id: 'kiosk',   label: t.prog1, num: 1 },
              { id: 'search',  label: t.prog2, num: 2 },
              { id: 'checkin', label: t.prog3, num: 3 },
              { id: 'lock',    label: t.prog4, num: 4 },
            ].map((s, i) => {
              const stepIdx = WIZARD_STEPS.indexOf(activeTab as typeof WIZARD_STEPS[number])
              const thisIdx = i
              const isDone   = stepIdx > thisIdx
              const isActive = stepIdx === thisIdx
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: isDone ? '#10b981' : isActive ? 'rgba(16,185,129,0.2)' : '#1e293b',
                        border: `2px solid ${isDone || isActive ? '#10b981' : '#334155'}`,
                        color: isDone ? '#fff' : isActive ? '#10b981' : '#475569',
                      }}>
                      {isDone ? '✓' : s.num}
                    </div>
                    <span className="text-[9px] font-medium whitespace-nowrap"
                      style={{ color: isActive ? '#34d399' : isDone ? '#10b981' : '#475569' }}>
                      {s.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div className="flex-1 h-0.5 mb-4 mx-1 transition-all"
                      style={{ background: isDone ? '#10b981' : '#1e293b' }} />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )}
        {activeTab === 'checkout' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <LogOut size={13} style={{ color: '#818cf8' }} />
            <span className="text-xs font-semibold text-indigo-300">{t.checkoutTitle || 'チェックアウト'}</span>
          </div>
        )}
      </div>

      <div className="w-full px-8 space-y-4">

        {/* ════ STEP 1: スタート ════ */}
        {activeTab === 'kiosk' && (
          <div className="rounded-2xl flex flex-col items-center justify-center gap-8"
            style={{ background: '#0d1117', border: '1px solid #1e293b', minHeight: 'calc(100vh - 200px)' }}>

            {/* ホテル名 + ウェルカム */}
            <div className="text-center space-y-2">
              <p className="text-4xl font-semibold text-slate-100">{t.welcome}</p>
              <p className="text-slate-500 text-sm">{t.welcomeSub}</p>
            </div>

            {/* 言語選択 */}
            <div className="flex gap-3 flex-wrap justify-center">
              {LANGS.map(lang => (
                <button key={lang} onClick={() => setSelectedLang(lang)}
                  className="px-6 py-3 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: selectedLang === lang ? 'rgba(16,185,129,0.15)' : '#13141f',
                    border: selectedLang === lang ? '1px solid rgba(16,185,129,0.6)' : '1px solid #334155',
                    color: selectedLang === lang ? '#34d399' : '#94a3b8',
                  }}>
                  {lang}
                </button>
              ))}
            </div>

            {/* メインCTA — チェックイン & チェックアウト並列 */}
            <div className="flex flex-row gap-8 justify-center flex-wrap">
              {/* チェックイン */}
              <button onClick={() => gotoTab('search')}
                className="w-64 h-64 rounded-[3rem] flex flex-col items-center justify-center gap-5 transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
                  border: '2px solid rgba(16,185,129,0.5)',
                  boxShadow: '0 0 60px rgba(16,185,129,0.12)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#10b981'
                  e.currentTarget.style.boxShadow = '0 0 80px rgba(16,185,129,0.25)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(16,185,129,0.12)'
                }}>
                <UserPlus size={64} style={{ color: '#10b981' }} />
                <div className="text-center">
                  <p className="text-emerald-400 text-2xl font-bold">{t.checkin}</p>
                  <p className="text-slate-600 text-sm mt-1">{t.checkinSub}</p>
                </div>
              </button>

              {/* チェックアウト */}
              <button onClick={() => { setActiveTab('checkout'); setCheckoutStep('search'); setCheckoutQuery(''); setCheckoutResults([]); setCheckoutTarget(null); setCoMode('select') }}
                className="w-64 h-64 rounded-[3rem] flex flex-col items-center justify-center gap-5 transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
                  border: '2px solid rgba(99,102,241,0.4)',
                  boxShadow: '0 0 60px rgba(99,102,241,0.08)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#6366f1'
                  e.currentTarget.style.boxShadow = '0 0 80px rgba(99,102,241,0.22)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(99,102,241,0.08)'
                }}>
                <LogOut size={64} style={{ color: '#818cf8' }} />
                <div className="text-center">
                  <p className="text-indigo-400 text-2xl font-bold">{t.checkoutTitle || 'チェックアウト'}</p>
                  <p className="text-slate-600 text-sm mt-1">CHECK OUT</p>
                </div>
              </button>
            </div>


            {/* フロント呼び出しボタン */}
            <CallFrontButton t={t} />
            {/* スタッフメニュー（目立たない） */}
            <button
              onClick={() => setShowPinOverlay(true)}
              className="text-xs text-slate-700 hover:text-slate-500 transition-colors py-2 px-4 rounded-lg"
              style={{ border: '1px solid transparent' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#334155')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              {t.staffMenu}
            </button>
          </div>
        )}

        {/* ════ STEP 2: 予約検索 ════ */}
        {activeTab === 'search' && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #1e293b', minHeight: 'calc(100vh - 200px)' }}>

            {/* ヘッダー */}
            <div className="px-8 py-6 border-b flex items-center justify-between" style={{ borderColor: '#1e293b' }}>
              <div>
                <h2 className="text-2xl font-semibold text-slate-100">{t.step2Title}</h2>
                <p className="text-slate-500 text-sm mt-1">{t.step2Sub}</p>
              </div>
              <button onClick={() => gotoTab('kiosk')}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors px-3 py-2 rounded-lg"
                style={{ border: '1px solid #1e293b' }}>{t.back}</button>
            </div>

            <div className="p-8 space-y-6">
            {searchMode === 'select' && (
              <div className="grid grid-cols-3 gap-5">
                {[
                  { mode: 'reservation' as const, icon: Hash,         label: t.byReservation, sub: t.byReservationSub, color: '#10b981' },
                  { mode: 'name'        as const, icon: ClipboardList, label: t.byName,        sub: t.byNameSub,        color: '#6366f1' },
                  { mode: 'phone'       as const, icon: Phone,         label: t.byPhone,       sub: t.byPhoneSub,       color: '#f59e0b' },
                ].map(item => (
                  <button key={item.mode} onClick={() => setSearchMode(item.mode)}
                    className="rounded-2xl py-10 flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: '#13141f', border: `2px solid ${item.color}25` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${item.color}80`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = `${item.color}25`)}>
                    <item.icon size={52} style={{ color: item.color }} />
                    <div className="text-center">
                      <p className="text-base font-semibold text-slate-200">{item.label}</p>
                      <p className="text-xs text-slate-600 mt-1">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchMode === 'select' && (
              <div className="rounded-2xl p-6 flex flex-col items-center gap-4"
                style={{ background: '#13141f', border: '1px dashed #334155' }}>
                <button onClick={startCamera}
                  className="flex items-center gap-3 px-8 h-14 rounded-xl text-base font-semibold transition-all"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                  <QrCode size={20} /> {t.qrScan}
                </button>
                <p className="text-sm text-slate-600">{t.qrSub}</p>
              </div>
            )}

            {searchMode !== 'select' && (
              <div className="rounded-2xl p-6 space-y-5" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-200">
                    {searchMode === 'reservation' ? t.inputReservation : searchMode === 'name' ? t.inputName : t.inputPhone}
                  </p>
                  <button onClick={() => { setSearchMode('select'); setSearchResults([]) }}
                    className="text-sm text-slate-600 hover:text-slate-400 transition-colors px-3 py-2 rounded-lg"
                    style={{ border: '1px solid #334155' }}>{t.back}</button>
                </div>
                <div className="flex gap-3">
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doSearch()}
                    placeholder={searchMode === 'reservation' ? t.phReservation : searchMode === 'name' ? t.phName : t.phPhone}
                    className="flex-1 h-14 text-lg rounded-xl px-5"
                    style={{ background: '#0d1117', border: '2px solid #334155', color: '#f1f5f9', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = '#10b981')}
                    onBlur={e => (e.target.style.borderColor = '#334155')}
                  />
                  <button onClick={doSearch} disabled={searching}
                    className="shrink-0 h-14 px-8 rounded-xl text-base font-semibold flex items-center gap-2 transition-all"
                    style={{ background: '#10b981', color: '#fff', opacity: searching ? 0.7 : 1 }}>
                    {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    {t.search}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-sm text-slate-500">{searchResults.length}{t.found}</p>
                    {searchResults.map(r => (
                      <div key={r.id} className="rounded-xl p-5 flex items-center justify-between gap-4"
                        style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
                        <div className="space-y-1.5">
                          <p className="text-lg font-semibold text-slate-100">{resName(r)} 様</p>
                          <p className="text-sm text-slate-400">
                            {resRoom(r)}号室 &nbsp;·&nbsp; {resDate(r.start_date)}〜{resDate(r.end_date)}
                          </p>
                          <p className="text-xs text-slate-600">{r.id} &nbsp;·&nbsp; {resPhone(r)}</p>
                        </div>
                        <button onClick={() => selectReservation(r)}
                          className="shrink-0 h-12 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
                          style={{ background: '#10b981', color: '#fff' }}>
                          {t.selectBtn} <ArrowRight size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && searchQuery && !searching && (
                  <div className="rounded-xl p-8 text-center" style={{ background: '#0d1117' }}>
                    <p className="text-base text-slate-500">{t.notFound}</p>
                    <p className="text-sm text-slate-600 mt-2">{t.notFoundSub}</p>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        )}

        {/* ════ STEP 3: チェックイン（予約選択済みのみ） ════ */}
        {activeTab === 'checkin' && (() => {
          // checkinStep: 'scan' | 'info' | 'sign'
          const step = (checkinStatus === 'IDLE' || checkinStatus === 'SCANNING') && !ledgerName
            ? 'scan'
            : signatureData || checkinStatus === 'VERIFIED'
            ? 'sign'
            : 'info'

          return (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #1e293b', minHeight: 'calc(100vh - 200px)' }}>

            {/* 予約バナー（常時表示） */}
            {selectedReservation && (
              <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: '#1e293b', background: 'rgba(16,185,129,0.05)' }}>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-emerald-400">{resName(selectedReservation)} 様</span>
                  <span className="text-slate-500 ml-3">{resRoom(selectedReservation)}号室 &nbsp;·&nbsp; {resDate(selectedReservation.start_date)}〜{resDate(selectedReservation.end_date)}</span>
                </p>
              </div>
            )}

            {/* ステップタブ（進捗） */}
            <div className="flex border-b" style={{ borderColor: '#1e293b' }}>
              {[
                { id: 'scan', label: `① ${t.byReservationSub !== 'Reservation No.' ? 'ID Scan' : '身分証'}`, icon: Camera },
                { id: 'info', label: `② ${t.name}`, icon: ClipboardList },
                { id: 'sign', label: `③ Sign`, icon: PenLine },
              ].map(s => {
                const done = (s.id === 'scan' && checkinStatus === 'VERIFIED')
                  || (s.id === 'info' && !!ledgerName)
                  || (s.id === 'sign' && !!signatureData)
                const active = step === s.id
                return (
                  <button key={s.id}
                    onClick={() => {
                      if (s.id === 'scan') setCheckinStatus('IDLE')
                      if (s.id === 'info') { /* そのまま */ }
                      if (s.id === 'sign') { /* そのまま */ }
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 text-xs font-semibold transition-all"
                    style={{
                      background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
                      color: done ? '#10b981' : active ? '#34d399' : '#475569',
                      borderBottom: active ? '2px solid #10b981' : '2px solid transparent',
                    }}>
                    {done ? <CheckCircle2 size={11} /> : <s.icon size={11} />}
                    {s.label}
                  </button>
                )
              })}
            </div>

            {/* ── Step 1: 身分証スキャン ── */}
            {step === 'scan' && (
              <div className="p-4 space-y-3">
                {/* カメラビュー or タップエリア */}
                {isCameraOpen ? (
                  <div className="space-y-2">
                    {cameraError ? (
                      <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <span className="text-red-400">⚠️</span>
                        <div className="flex-1">
                          <p className="text-red-400 text-xs font-semibold">{cameraError}</p>
                          <p className="text-slate-600 text-[10px] mt-0.5">設定 → サイトの設定 → カメラ を許可してください</p>
                        </div>
                        <button onClick={closeCamera} className="text-slate-600 text-sm">✕</button>
                      </div>
                    ) : (
                      <div className="relative bg-black rounded-xl overflow-hidden" style={{ height: '220px' }}>
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full" style={{ objectFit: 'cover' }} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-40 h-40 border-2 rounded-xl"
                            style={{ borderColor: '#10b981', boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }} />
                        </div>
                        <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-emerald-400">QRコードを枠内に</p>
                      </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-2">
                      <button onClick={closeCamera} className="flex-1 h-10 rounded-lg text-xs font-semibold text-slate-300" style={{ background: '#1e293b' }}>{t.camCancel}</button>
                      <button onClick={capturePhoto} className="flex-1 h-10 rounded-lg text-xs font-semibold text-white" style={{ background: '#10b981' }}>{t.camCapture}</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={startCamera}
                    disabled={checkinStatus === 'SCANNING'}
                    className="w-full rounded-xl flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.98]"
                    style={{ height: '200px', background: '#13141f', border: `2px dashed ${checkinStatus === 'VERIFIED' ? '#10b981' : '#334155'}` }}>
                    {checkinStatus === 'SCANNING' && <Loader2 size={40} className="text-emerald-400 animate-spin" />}
                    {checkinStatus === 'VERIFIED' && <CheckCircle2 size={40} style={{ color: '#10b981' }} />}
                    {checkinStatus === 'IDLE'     && <Camera size={40} className="text-slate-600" />}
                    <p className="text-sm font-semibold" style={{ color: checkinStatus === 'VERIFIED' ? '#10b981' : '#64748b' }}>
                      {checkinStatus === 'VERIFIED' ? t.scanned : checkinStatus === 'SCANNING' ? t.scanning : t.scanTitle}
                    </p>
                    {checkinStatus === 'IDLE' && <p className="text-[10px] text-slate-700">{t.scanSub}</p>}
                  </button>
                )}

                {/* スキャン済みなら次へ */}
                <button
                  onClick={() => { if (!ledgerName && selectedReservation) setLedgerName(resName(selectedReservation)); setCheckinStatus('VERIFIED') }}
                  className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: '#10b981', color: '#fff' }}>
                  {t.nextInfo} <ArrowRight size={14} />
                </button>
                <p className="text-center text-[10px] text-slate-700">{t.skipScan}</p>
              </div>
            )}

            {/* ── Step 2: 台帳入力 ── */}
            {step === 'info' && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-medium text-slate-600">{t.name} *</label>
                    <input value={ledgerName} onChange={e => setLedgerName(e.target.value)}
                      placeholder={t.phName}
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#10b981')}
                      onBlur={e => (e.target.style.borderColor = '#334155')} />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-medium text-slate-600">{t.address}</label>
                    <input value={ledgerAddress} onChange={e => setLedgerAddress(e.target.value)}
                      placeholder={t.phAddress}
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#10b981')}
                      onBlur={e => (e.target.style.borderColor = '#334155')} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-600">{t.occupation}</label>
                    <select value={ledgerOccupation} onChange={e => setLedgerOccupation(e.target.value)}
                      className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}>
                      <option value="">選択...</option>
                      {['会社員','自営業','公務員','学生','無職','その他'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-600">{t.travel}</label>
                    <input value={ledgerTravel} onChange={e => setLedgerTravel(e.target.value)}
                      placeholder={t.phTravel} list="travel-suggestions"
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#10b981')}
                      onBlur={e => (e.target.style.borderColor = '#334155')} />
                    <datalist id="travel-suggestions">
                      {['自宅','東京','大阪','京都','名古屋','福岡','札幌','海外'].map(v => <option key={v} value={v} />)}
                    </datalist>
                  </div>
                </div>
                <button
                  onClick={() => setSignatureData('')}
                  disabled={!ledgerName}
                  className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: ledgerName ? '#10b981' : '#1e293b', color: ledgerName ? '#fff' : '#475569' }}>
                  {t.nextSign} <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* ── Step 3: 電子署名 ── */}
            {step === 'sign' && (
              <div className="p-4 space-y-3">
                <p className="text-[10px] text-slate-600 leading-relaxed">{t.signNote}</p>
                <div style={{ maxHeight: '260px' }}>
                  <SignaturePanel
                    key={signatureClearedAt}
                    onSigned={setSignatureData}
                    onClear={() => { setSignatureData(''); setSignatureClearedAt(Date.now()) }}
                  />
                </div>
                <button
                  onClick={async () => {
                    if (selectedReservation?.id) await notifyCheckin(selectedReservation.id)
                    setActiveTab('lock')
                  }}
                  disabled={!ledgerName}
                  className="w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: ledgerName ? '#10b981' : '#1e293b', color: ledgerName ? '#fff' : '#475569' }}>
                  {t.completeCheckin} <ArrowRight size={15} />
                </button>
                <p className="text-center text-[10px] text-slate-600">{t.signOptional}</p>
              </div>
            )}
          </div>
          )
        })()}

        {/* ════ STEP 4: 鍵発行 ════ */}
        {activeTab === 'lock' && (
          <div className="rounded-2xl flex flex-col items-center justify-between gap-6 px-8 py-10"
            style={{ background: '#0d1117', border: '1px solid #1e293b', minHeight: 'calc(100vh - 200px)' }}>

            {/* 完了ヘッダー */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.12)' }}>
                <CheckCircle2 size={36} style={{ color: '#10b981' }} />
              </div>
              <p className="text-3xl font-semibold text-slate-100">{t.checkinDone}</p>
              <p className="text-slate-500 text-sm">
                {selectedReservation ? `${resName(selectedReservation)}${t.welcome2}` : t.welcome}
              </p>
            </div>

            {/* 部屋番号 ── 超大 */}
            <div className="w-full rounded-2xl flex flex-col items-center gap-2 py-8"
              style={{ background: '#13141f', border: '1px solid #1e293b' }}>
              <p className="text-base font-medium text-slate-500">{t.roomLabel}</p>
              <p className="font-bold leading-none" style={{ fontSize: '9rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                {selectedReservation ? resRoom(selectedReservation) : '—'}
              </p>
              <p className="text-slate-600 text-sm">
                {selectedReservation
                  ? `${resDate(selectedReservation.start_date)} 〜 ${resDate(selectedReservation.end_date)}`
                  : ''}
              </p>
            </div>

            {/* 暗証番号 ── 超大 */}
            <div className="w-full rounded-2xl flex flex-col items-center gap-3 py-8"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))',
                border: '2px solid rgba(16,185,129,0.4)',
                boxShadow: '0 0 40px rgba(16,185,129,0.1)',
              }}>
              <p className="text-base font-medium" style={{ color: '#6ee7b7' }}>
                {lockType === 'fixed' ? t.codeLabel : lockType === 'switchbot' ? t.codeSwitchBot : lockType === 'ttlock' ? t.codeTTLock : t.codeDefault}
              </p>
              <p className="font-bold tracking-[0.25em] leading-none" style={{ fontSize: '7rem', color: '#10b981' }}>
                {getLockCode()}
              </p>
              <p className="text-sm text-slate-600">
                {LOCK_OPTIONS.find(l => l.id === lockType)?.label ?? '錠デバイス'} 連携
              </p>
            </div>

            {/* スタートへ戻る */}
            <button onClick={() => {
              // 状態リセット
              setSelectedReservation(null)
              setLedgerName(''); setLedgerAddress(''); setLedgerOccupation(''); setLedgerTravel('')
              setSignatureData(''); setCheckinStatus('IDLE')
              gotoTab('kiosk')
            }}
              className="w-full h-16 rounded-2xl text-lg font-semibold transition-all active:scale-[0.98]"
              style={{ background: '#10b981', color: '#fff' }}>
              {t.returnStart}
            </button>
          </div>
        )}

        {/* ════ チェックアウト ════ */}
        {activeTab === 'checkout' && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #1e293b', minHeight: 'calc(100vh - 200px)' }}>

            {/* ヘッダー */}
            <div className="px-8 py-6 border-b flex items-center justify-between" style={{ borderColor: '#1e293b' }}>
              <div>
                <h2 className="text-2xl font-semibold text-slate-100">{t.checkoutTitle || 'チェックアウト'}</h2>
                <p className="text-slate-500 text-sm mt-1">{t.checkoutSub || '予約番号・お名前・電話番号で予約を検索してください'}</p>
              </div>
              <button onClick={() => gotoTab('kiosk')}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors px-3 py-2 rounded-lg"
                style={{ border: '1px solid #1e293b' }}>{t.back || '← 戻る'}</button>
            </div>

            <div className="p-8 space-y-6">

              {/* ── STEP: search（3択カード＋入力） ── */}
              {checkoutStep === 'search' && (
                <>
                  {coMode === 'select' && (
                    <div className="grid grid-cols-3 gap-5">
                      {[
                        { mode: 'reservation' as const, icon: Hash,         label: t.byReservation || '予約番号',  sub: t.byReservationSub || 'Reservation No.', color: '#818cf8' },
                        { mode: 'name'        as const, icon: ClipboardList, label: t.byName        || 'お名前',    sub: t.byNameSub        || 'Guest Name',       color: '#6366f1' },
                        { mode: 'phone'       as const, icon: Phone,         label: t.byPhone       || '電話番号',  sub: t.byPhoneSub       || 'Phone Number',     color: '#a78bfa' },
                      ].map(item => (
                        <button key={item.mode} onClick={() => setCoMode(item.mode)}
                          className="rounded-2xl py-10 flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          style={{ background: '#13141f', border: `2px solid ${item.color}25` }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = `${item.color}80`)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = `${item.color}25`)}>
                          <item.icon size={52} style={{ color: item.color }} />
                          <div className="text-center">
                            <p className="text-base font-semibold text-slate-200">{item.label}</p>
                            <p className="text-xs text-slate-600 mt-1">{item.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {coMode !== 'select' && (
                    <div className="rounded-2xl p-6 space-y-5" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-slate-200">
                          {coMode === 'reservation' ? (t.inputReservation || '予約番号を入力') : coMode === 'name' ? (t.inputName || 'お名前を入力') : (t.inputPhone || '電話番号を入力')}
                        </p>
                        <button onClick={() => { setCoMode('select'); setCheckoutResults([]) }}
                          className="text-sm text-slate-600 hover:text-slate-400 transition-colors px-3 py-2 rounded-lg"
                          style={{ border: '1px solid #334155' }}>{t.back || '← 戻る'}</button>
                      </div>
                      <div className="flex gap-3">
                        <input
                          value={checkoutQuery}
                          onChange={e => setCheckoutQuery(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && doCheckoutSearch()}
                          placeholder={coMode === 'reservation' ? (t.phReservation || 'NTR-001') : coMode === 'name' ? (t.phName || '山田 太郎') : (t.phPhone || '090-1234-5678')}
                          className="flex-1 h-14 text-lg rounded-xl px-5"
                          style={{ background: '#0d1117', border: '2px solid #334155', color: '#f1f5f9', outline: 'none' }}
                          onFocus={e => (e.target.style.borderColor = '#818cf8')}
                          onBlur={e => (e.target.style.borderColor = '#334155')}
                        />
                        <button onClick={doCheckoutSearch} disabled={checkoutSearching}
                          className="shrink-0 h-14 px-8 rounded-xl text-base font-semibold flex items-center gap-2 transition-all"
                          style={{ background: '#6366f1', color: '#fff', opacity: checkoutSearching ? 0.7 : 1 }}>
                          {checkoutSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                          検索
                        </button>
                      </div>

                      {checkoutResults.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <p className="text-sm text-slate-500">{checkoutResults.length}件見つかりました</p>
                          {checkoutResults.map(r => (
                            <div key={r.id} className="rounded-xl p-5 flex items-center justify-between gap-4"
                              style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
                              <div className="space-y-1.5">
                                <p className="text-lg font-semibold text-slate-100">{resName(r)} 様</p>
                                <p className="text-sm text-slate-400">
                                  {resRoom(r)}号室 &nbsp;·&nbsp; {resDate(r.start_date)}〜{resDate(r.end_date)}
                                </p>
                                <p className="text-xs text-slate-600">{r.id} &nbsp;·&nbsp; {resPhone(r)} &nbsp;·&nbsp; {resAmount(r)}</p>
                              </div>
                              <button onClick={() => selectCheckoutTarget(r)}
                                className="shrink-0 h-12 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
                                style={{ background: '#6366f1', color: '#fff' }}>
                                選択 <ArrowRight size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {checkoutResults.length === 0 && checkoutQuery && !checkoutSearching && (
                        <div className="rounded-xl p-8 text-center" style={{ background: '#0d1117' }}>
                          <p className="text-base text-slate-500">該当する予約が見つかりませんでした</p>
                          <p className="text-sm text-slate-600 mt-2">入力内容をご確認ください</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ── STEP: confirm ── */}
              {checkoutStep === 'confirm' && checkoutTarget && (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '2px solid rgba(99,102,241,0.4)' }}>
                    <LogOut size={32} style={{ color: '#818cf8' }} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-slate-100">チェックアウト確認</h3>
                    <p className="text-slate-500 text-sm mt-1">以下の内容でチェックアウトします</p>
                  </div>
                  <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
                    style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                    {[
                      { label: 'お名前',        value: `${resName(checkoutTarget)} 様` },
                      { label: '部屋番号',       value: `${resRoom(checkoutTarget)}号室` },
                      { label: 'チェックイン',   value: resDate(checkoutTarget.start_date) },
                      { label: 'チェックアウト', value: `${resDate(checkoutTarget.end_date)}（本日）` },
                      { label: '宿泊料金',       value: resAmount(checkoutTarget) },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-slate-500">{item.label}</span>
                        <span className="text-slate-100 font-medium">{item.value}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-800 pt-4 flex justify-between text-sm">
                      <span className="text-slate-500">追加料金</span>
                      <span className={hasExtraCharge ? 'text-amber-400 font-semibold' : 'text-emerald-500 font-medium'}>
                        {hasExtraCharge ? '¥3,300（要精算）' : 'なし'}
                      </span>
                    </div>
                  </div>

                  {hasExtraCharge ? (
                    <div className="w-full max-w-md rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
                      style={{ background: '#1a1200', border: '1px solid rgba(251,191,36,0.3)' }}>
                      <p className="text-amber-300 font-semibold">⚠️ 追加料金が発生しています</p>
                      <p className="text-slate-400 text-sm leading-relaxed">スタッフをお呼びして精算の上、チェックアウトをお願いします。</p>
                      <button className="px-8 h-12 rounded-xl text-sm font-semibold transition-all active:scale-95"
                        style={{ background: '#f59e0b', color: '#000' }}
                        onClick={() => alert('スタッフを呼び出しました。しばらくお待ちください。')}>
                        🔔 スタッフを呼ぶ
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        if (checkoutTarget.id) await notifyCheckout(checkoutTarget.id)
                        setCheckoutStep('processing')
                      }}
                      className="w-full max-w-md h-14 rounded-2xl text-base font-semibold transition-all active:scale-[0.98]"
                      style={{ background: '#6366f1', color: '#fff', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
                      チェックアウトする →
                    </button>
                  )}
                  <button onClick={() => setCheckoutStep('search')}
                    className="text-sm text-slate-600 hover:text-slate-400 transition-colors">
                    ← 検索に戻る
                  </button>
                </div>
              )}

              {/* ── STEP: processing ── */}
              {checkoutStep === 'processing' && (
                <CheckoutProcessing onDone={() => setCheckoutStep('done')} />
              )}

              {/* ── STEP: done ── */}
              {checkoutStep === 'done' && (
                <div className="flex flex-col items-center gap-6 py-12 text-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '2px solid #6366f1', boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}>
                    <CheckCircle2 size={48} style={{ color: '#818cf8' }} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-100">チェックアウト完了</h3>
                    <p className="text-slate-400 text-base mt-2">
                      {checkoutTarget ? resName(checkoutTarget) : ''} 様、ご利用ありがとうございました
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 size={14} /> データをクラウドに保存しました
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    鍵カードの返却をお忘れなく。<br />またのご利用をお待ちしております。
                  </p>
                  <button onClick={() => gotoTab('kiosk')}
                    className="px-10 h-12 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
                    スタートへ戻る
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">Nextra AI Autonomous Front System · NextraLabs 2026</p>
      </div>
    </div>
  )
}

/* ─── SSR無効でラップ ─── */
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="staysee-ai-finder" />
</div>
  ),
})

export default function HotelPage() { return <NoSSR /> }
