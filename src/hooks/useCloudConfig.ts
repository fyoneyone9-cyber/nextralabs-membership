/**
 * useCloudConfig
 * DMS/KIOSK共通の設定をSupabase（/api/dms/config）から読み書きするフック
 *
 * - 初回マウント時にSupabaseから取得
 * - save() でSupabaseへ保存
 * - localStorageは一切使わない
 */
'use client'
import { useState, useEffect, useCallback } from 'react'

export type CloudConfig = {
  pms_type: string
  pms_fields: Record<string, string>
  lock_type: string
  lock_fields: Record<string, string>
  daily_api_key: string
  org_name: string
  fixed_password: string
}

const DEFAULT_CONFIG: CloudConfig = {
  pms_type: 'none',
  pms_fields: {},
  lock_type: 'fixed',
  lock_fields: {},
  daily_api_key: '',
  org_name: '',
  fixed_password: '8421',
}

type Status = 'idle' | 'loading' | 'ready' | 'error' | 'saving' | 'saved'

export function useCloudConfig() {
  const [config, setConfig] = useState<CloudConfig>(DEFAULT_CONFIG)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  /* 初回ロード */
  useEffect(() => {
    setStatus('loading')
    fetch('/api/dms/config')
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(data.error)
          setStatus('error')
          return
        }
        setConfig({
          pms_type:       data.pms_type       ?? DEFAULT_CONFIG.pms_type,
          pms_fields:     data.pms_fields      ?? DEFAULT_CONFIG.pms_fields,
          lock_type:      data.lock_type       ?? DEFAULT_CONFIG.lock_type,
          lock_fields:    data.lock_fields     ?? DEFAULT_CONFIG.lock_fields,
          daily_api_key:  data.daily_api_key   ?? DEFAULT_CONFIG.daily_api_key,
          org_name:       data.org_name        ?? DEFAULT_CONFIG.org_name,
          fixed_password: data.fixed_password  ?? DEFAULT_CONFIG.fixed_password,
        })
        setStatus('ready')
      })
      .catch(e => {
        setErrorMsg(e.message)
        setStatus('error')
      })
  }, [])

  /* 保存 */
  const save = useCallback(async (patch: Partial<CloudConfig>): Promise<boolean> => {
    setStatus('saving')
    try {
      const res = await fetch('/api/dms/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMsg(data.error || '保存に失敗しました')
        setStatus('error')
        return false
      }
      // ローカル状態も更新
      setConfig(prev => ({ ...prev, ...patch }))
      setStatus('saved')
      setTimeout(() => setStatus('ready'), 2000)
      return true
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : '保存に失敗しました')
      setStatus('error')
      return false
    }
  }, [])

  return { config, setConfig, save, status, errorMsg }
}
