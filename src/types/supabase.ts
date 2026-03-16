export type DbProfile = {
  id: string
  username: string
  display_name: string
  bio: string
  avatar_url: string
  website_url: string
  created_at: string
}

export type DbCategory = {
  id: string
  name: string
  created_at: string
}

export type DbSeries = {
  id: string
  author_id: string
  slug: string
  title: string
  description: string
  category: string
  color_theme: string
  created_at: string
  updated_at: string
}

export type DbPost = {
  id: string
  author_id: string
  series_id: string | null
  series_order: number | null
  slug: string
  title: string
  content: string
  excerpt: string
  category: string | null
  published: boolean
  character_count: number
  shadow_title: string | null
  shadow_content: string | null
  shadow_updated_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export type DbTag = {
  id: string
  name: string
  created_at: string
}

export type DbPostTag = {
  post_id: string
  tag_id: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: DbProfile
        Insert: {
          id: string
          username: string
          display_name?: string
          bio?: string
          avatar_url?: string
          website_url?: string
          created_at?: string
        }
        Update: Partial<Omit<DbProfile, 'id'>> & { id?: string }
        Relationships: never[]
      }
      categories: {
        Row: DbCategory
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: Partial<DbCategory>
        Relationships: never[]
      }
      series: {
        Row: DbSeries
        Insert: {
          id?: string
          author_id: string
          slug: string
          title: string
          description?: string
          category: string
          color_theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<DbSeries>
        Relationships: never[]
      }
      posts: {
        Row: DbPost
        Insert: {
          id?: string
          author_id: string
          series_id?: string | null
          series_order?: number | null
          slug: string
          title: string
          content?: string
          excerpt?: string
          category?: string | null
          published?: boolean
          character_count?: number
          shadow_title?: string | null
          shadow_content?: string | null
          shadow_updated_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<DbPost>
        Relationships: never[]
      }
      tags: {
        Row: DbTag
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: Partial<DbTag>
        Relationships: never[]
      }
      post_tags: {
        Row: DbPostTag
        Insert: DbPostTag
        Update: Partial<DbPostTag>
        Relationships: never[]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
