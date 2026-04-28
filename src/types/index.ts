export type UserRole = 'member' | 'admin'

export interface Profile {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  title: string
  slug: string
  body: string
  excerpt: string | null
  cover_image_url: string | null
  is_premium: boolean
  is_published: boolean
  author_id: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan: string
  status: string
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid'
