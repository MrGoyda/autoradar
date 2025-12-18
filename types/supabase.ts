export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          created_at: string
          client_phone: string | null
          description: string
          photos: Json
          car_info: Json
          utm_source: string | null
          status: 'new' | 'processing' | 'offers_ready' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: string
          created_at?: string
          client_phone?: string | null
          description: string
          photos?: Json
          car_info?: Json
          utm_source?: string | null
          status?: 'new' | 'processing' | 'offers_ready' | 'completed' | 'cancelled'
        }
        Update: {
          id?: string
          created_at?: string
          client_phone?: string | null
          description?: string
          photos?: Json
          car_info?: Json
          utm_source?: string | null
          status?: 'new' | 'processing' | 'offers_ready' | 'completed' | 'cancelled'
        }
      }
      sellers: {
        Row: {
          id: string
          created_at: string
          telegram_id: number
          name: string
          specialization: string[] | null
          speed_rating: number | null
          is_active: boolean
          last_active_lead_id: string | null // Добавлено
        }
        Insert: {
          id?: string
          created_at?: string
          telegram_id: number
          name: string
          specialization?: string[] | null
          speed_rating?: number | null
          is_active?: boolean
          last_active_lead_id?: string | null // Добавлено
        }
        Update: { // Добавлено для работы .update()
          id?: string
          created_at?: string
          telegram_id?: number
          name?: string
          specialization?: string[] | null
          speed_rating?: number | null
          is_active?: boolean
          last_active_lead_id?: string | null
        }
      }
      offers: {
        Row: {
          id: string
          created_at: string
          lead_id: string
          seller_id: string | null
          price_vendor: number
          comment: string | null
          is_winner: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          lead_id: string
          seller_id: string | null
          price_vendor: number
          comment?: string | null
          is_winner?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          lead_id?: string
          seller_id?: string | null
          price_vendor?: number
          comment?: string | null
          is_winner?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          offer_id: string
          lead_id: string
          final_price: number
          margin: number | null
          payment_status: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          offer_id: string
          lead_id: string
          final_price: number
          margin?: never 
          payment_status?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          offer_id?: string
          lead_id?: string
          final_price?: number
          margin?: never
          payment_status?: string | null
        }
      }
    }
  }
}