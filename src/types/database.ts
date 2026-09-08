export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Row type for the `events` table. */
export interface EventItem {
  id: string;
  title_en: string;
  title_el: string;
  date_en: string;
  date_el: string;
  location_en: string;
  location_el: string;
  theme_color: string | null;
  images: string[];
  col1_en: string | null;
  col1_el: string | null;
  col2_en: string | null;
  col2_el: string | null;
  order_index: number | null;
  created_at: string | null;
}

/** Row type for the `schools` table. */
export interface SchoolItem {
  id: string;
  name: string;
  city: string;
  founder_info: string | null;
  image_url: string | null;
  order_index: number | null;
  created_at: string | null;
}

/** Supabase Database shape used to type the clients. */
export interface Database {
  public: {
    Tables: {
      events: {
        Row: EventItem;
        Insert: {
          id?: string;
          title_en: string;
          title_el: string;
          date_en: string;
          date_el: string;
          location_en: string;
          location_el: string;
          theme_color?: string | null;
          images?: string[];
          col1_en?: string | null;
          col1_el?: string | null;
          col2_en?: string | null;
          col2_el?: string | null;
          order_index?: number | null;
          created_at?: string | null;
        };
        Update: Partial<{
          title_en: string;
          title_el: string;
          date_en: string;
          date_el: string;
          location_en: string;
          location_el: string;
          theme_color: string | null;
          images: string[];
          col1_en: string | null;
          col1_el: string | null;
          col2_en: string | null;
          col2_el: string | null;
          order_index: number | null;
        }>;
        Relationships: [];
      };
      schools: {
        Row: SchoolItem;
        Insert: {
          id?: string;
          name: string;
          city: string;
          founder_info?: string | null;
          image_url?: string | null;
          order_index?: number | null;
          created_at?: string | null;
        };
        Update: Partial<{
          name: string;
          city: string;
          founder_info: string | null;
          image_url: string | null;
          order_index: number | null;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
