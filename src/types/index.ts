export type Profile = {
  id: string
  username: string
  display_name: string
  bio: string
  avatar_url: string
  website_url: string
  created_at: string
}

export type Category = {
  id: string
  name: string
  created_at: string
}

export type Tag = {
  id: string
  name: string
  created_at: string
}

export type AuthorSummary = {
  id: string
  username: string
  name: string
  avatar_url: string
}

export type SeriesSummary = {
  id: string
  slug: string
  title: string
  category: string
  color_theme: string
}

export type Post = {
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
  author: AuthorSummary
  series: SeriesSummary | null
  tags: Tag[]
}

export type Series = {
  id: string
  author_id: string
  slug: string
  title: string
  description: string
  category: string
  color_theme: string
  created_at: string
  updated_at: string
  author: AuthorSummary
  posts: Post[]
  post_count?: number
  character_count_total?: number
}

export type PostTag = {
  post_id: string
  tag_id: string
  tag: Tag
}
