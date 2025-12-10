export interface Plan {
  id: string
  name: string
  country: string
  region: string
  data_amount: string
  validity_days: number
  price: number
  currency: string
  description: string | null
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string | null
  plan_id: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  total_amount: number
  currency: string
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  customer_email: string
  customer_name: string | null
  created_at: string
  updated_at: string
  plan?: Plan
  esim_details?: EsimDetail[]
}

export interface EsimDetail {
  id: string
  order_id: string
  qr_code_data: string
  smdp_address: string
  activation_code: string
  iccid: string | null
  status: 'inactive' | 'active' | 'expired' | 'suspended'
  created_at: string
  activated_at: string | null
}

export interface Payment {
  id: string
  order_id: string
  stripe_payment_intent_id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded'
  payment_method: string | null
  stripe_customer_id: string | null
  invoice_url: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  role: 'admin' | 'superadmin' | 'moderator'
  permissions: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WebhookLog {
  id: string
  event_type: string
  payload: any
  status: 'received' | 'processing' | 'processed' | 'failed'
  error_message: string | null
  processed_at: string
}
