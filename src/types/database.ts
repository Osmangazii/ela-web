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
  // legacy columns (kept for backwards compatibility / fallback)
  name: string;
  city: string;
  founder_info: string | null;
  image_url: string | null;
  order_index: number | null;
  created_at: string | null;
  // bilingual columns
  name_en: string | null;
  name_el: string | null;
  subtitle_en: string | null;
  subtitle_el: string | null;
  city_en: string | null;
  city_el: string | null;
  member_status_en: string | null;
  member_status_el: string | null;
  description_en: string | null;
  description_el: string | null;
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
          name_en?: string | null;
          name_el?: string | null;
          subtitle_en?: string | null;
          subtitle_el?: string | null;
          city_en?: string | null;
          city_el?: string | null;
          member_status_en?: string | null;
          member_status_el?: string | null;
          description_en?: string | null;
          description_el?: string | null;
        };
        Update: Partial<{
          name: string;
          city: string;
          founder_info: string | null;
          image_url: string | null;
          order_index: number | null;
          name_en: string | null;
          name_el: string | null;
          subtitle_en: string | null;
          subtitle_el: string | null;
          city_en: string | null;
          city_el: string | null;
          member_status_en: string | null;
          member_status_el: string | null;
          description_en: string | null;
          description_el: string | null;
        }>;
        Relationships: [];
      };
      announcements: {
        Row: AnnouncementItem;
        Insert: {
          id?: string;
          title_en: string;
          title_el: string;
          category?: string | null;
          date?: string | null;
          blocks?: AnnouncementBlock[] | null;
          order_index?: number | null;
          created_at?: string | null;
        };
        Update: Partial<{
          title_en: string;
          title_el: string;
          category: string | null;
          date: string | null;
          blocks: AnnouncementBlock[] | null;
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

export type AnnouncementCategory =
  | "Official Notice"
  | "General Assembly"
  | "Article"
  | "News";

export type AnnouncementBlock =
  | {
      id: string;
      type: "text";
      content_en: string;
      content_el: string;
    }
  | {
      id: string;
      type: "image";
      url: string;
      width: "full" | "md" | "sm";
    }
  | {
      id: string;
      type: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      id: string;
      type: "pdf";
      title: string;
      url: string;
    };

/** Row type for the `announcements` table. */
export interface AnnouncementItem {
  id: string;
  title_en: string;
  title_el: string;
  category: AnnouncementCategory | string | null;
  date: string | null;
  blocks: AnnouncementBlock[] | null;
  order_index: number | null;
  created_at: string | null;
}
