export type Database = {
  public: {
    Tables: {
      // ...existing code...
      budget_allocations: {
        Row: {
          id: string
          region_type: 'ward' | 'constituency' | 'county'
          region_name: string
          amount: number
          fiscal_year: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          region_type: 'ward' | 'constituency' | 'county'
          region_name: string
          amount: number
          fiscal_year: string
          description?: string | null
          created_by?: string | null
        }
        Update: {
          region_type?: 'ward' | 'constituency' | 'county'
          region_name?: string
          amount?: number
          fiscal_year?: string
          description?: string | null
        }
      }
      // ...existing code...
      budget_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by?: string | null
        }
        Update: {
          name?: string
          description?: string | null
        }
      }
      // ...existing code...
      budget_items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          created_by?: string | null
        }
        Update: {
          category_id?: string
          name?: string
          description?: string | null
        }
      }
      // ...existing code...
      budget_item_allocations: {
        Row: {
          id: string
          item_id: string
          amount: number
          fiscal_year: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          item_id: string
          amount: number
          fiscal_year: string
          description?: string | null
          created_by?: string | null
        }
        Update: {
          item_id?: string
          amount?: number
          fiscal_year?: string
          description?: string | null
        }
      }
      // ...existing code...
      budget_item_expenditures: {
        Row: {
          id: string
          item_id: string
          amount: number
          fiscal_year: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          item_id: string
          amount: number
          fiscal_year: string
          description?: string | null
          created_by?: string | null
        }
        Update: {
          item_id?: string
          amount?: number
          fiscal_year?: string
          description?: string | null
        }
      }
      // ...existing code...
      budget_item_revenues: {
        Row: {
          id: string
          item_id: string
          amount: number
          fiscal_year: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          item_id: string
          amount: number
          fiscal_year: string
          description?: string | null
          created_by?: string | null
        }
        Update: {
          item_id?: string
          amount?: number
          fiscal_year?: string
          description?: string | null
        }
      } 
      
    }
  }
}
