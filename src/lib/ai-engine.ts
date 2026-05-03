export interface AICreditConfig {
  plan: 'free' | 'light' | 'standard' | 'premium' | 'admin'
  dailyLimit: number
  monthlyLimit: number
}

export const CREDIT_CONFIGS: Record<AICreditConfig['plan'], AICreditConfig> = {
  free: {
    plan: 'free',
    dailyLimit: 3,
    monthlyLimit: 50,
  },
  light: {
    plan: 'light',
    dailyLimit: 20,
    monthlyLimit: 500,
  },
  standard: {
    plan: 'standard',
    dailyLimit: 100,
    monthlyLimit: 3000,
  },
  premium: {
    plan: 'premium',
    dailyLimit: 500,
    monthlyLimit: 15000,
  },
  admin: {
    plan: 'admin',
    dailyLimit: 9999,
    monthlyLimit: 999999,
  },
}

export class AICreditGuardian {
  private static instance: AICreditGuardian

  private constructor() {}

  public static getInstance(): AICreditGuardian {
    if (!AICreditGuardian.instance) {
      AICreditGuardian.instance = new AICreditGuardian()
    }
    return AICreditGuardian.instance
  }

  /**
   * ユーザーの残りクレジットを確認する
   * 実際の実装ではDB（Supabase等）から取得するが、基盤としてインターフェースを定義
   */
  async checkCredit(userId: string, plan: AICreditConfig['plan'] = 'free'): Promise<{
    allowed: boolean
    remainingDaily: number
    remainingMonthly: number
    reason?: string
  }> {
    const config = CREDIT_CONFIGS[plan]
    
    // TODO: DBから本日の使用量と今月の使用量を取得するロジック
    // 現時点ではモックとして常に許可を返す（基盤実装のため）
    
    return {
      allowed: true,
      remainingDaily: config.dailyLimit,
      remainingMonthly: config.monthlyLimit
    }
  }

  /**
   * クレジットを消費する
   */
  async consumeCredit(userId: string, amount: number = 1): Promise<boolean> {
    // TODO: DBの使用量を更新するロジック
    return true
  }
}

export const aiCreditGuardian = AICreditGuardian.getInstance()
