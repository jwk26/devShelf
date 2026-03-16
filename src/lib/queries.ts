import { cache } from 'react'

import { createClient } from '@/lib/supabase/server'
import type { Category, Post, Series, Tag } from '@/types/index'
import type { Database } from '@/types/supabase'

type DbProfile = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'username' | 'display_name' | 'avatar_url'
>

type DbSeriesRow = Database['public']['Tables']['series']['Row']
type DbPostRow = Database['public']['Tables']['posts']['Row']
type DbTagRow = Database['public']['Tables']['tags']['Row']
type DbCategoryRow = Database['public']['Tables']['categories']['Row']

type JoinedRecord<T> = T | T[] | null

type RawSeriesRow = DbSeriesRow & {
  profiles: JoinedRecord<DbProfile>
}

type RawSeriesSummaryRow = Pick<
  Database['public']['Tables']['series']['Row'],
  'id' | 'slug' | 'title' | 'category' | 'color_theme'
>

type RawPostTagRow = {
  tag_id: string
  tags: JoinedRecord<DbTagRow>
}

type RawPostRow = DbPostRow & {
  profiles: JoinedRecord<DbProfile>
  series: JoinedRecord<RawSeriesSummaryRow>
  post_tags: RawPostTagRow[] | null
}

type SeriesAggregation = {
  postCount: number
  characterCountTotal: number
  latestUpdatedAt: string
}

export type SeriesWithCounts = Series & {
  post_count: number
  character_count_total: number
}

export type SeriesDetail = SeriesWithCounts

export type PostWithSiblings = {
  post: Post
  siblingPosts: {
    prev: Post | null
    next: Post | null
  }
}

const authorSelect =
  'profiles!posts_author_id_fkey(id, username, display_name, avatar_url)'

const seriesAuthorSelect =
  'profiles!series_author_id_fkey(id, username, display_name, avatar_url)'

const seriesSummarySelect = 'series!posts_series_id_fkey(id, slug, title, category, color_theme)'

const postTagSelect =
  'post_tags(tag_id, tags!post_tags_tag_id_fkey(id, name, created_at))'

const postSelect = `*, ${authorSelect}, ${seriesSummarySelect}, ${postTagSelect}`

function normalizeJoinedRecord<T>(value: JoinedRecord<T>) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function normalizeAuthor(rawAuthor: JoinedRecord<DbProfile>) {
  const author = normalizeJoinedRecord(rawAuthor)

  if (!author) {
    return {
      id: '',
      username: '',
      name: '',
      avatar_url: '',
    }
  }

  return {
    id: author.id,
    username: author.username,
    name: author.display_name.trim() || author.username,
    avatar_url: author.avatar_url,
  }
}

function normalizeSeriesSummary(rawSeries: JoinedRecord<RawSeriesSummaryRow>) {
  const series = normalizeJoinedRecord(rawSeries)

  if (!series) {
    return null
  }

  return {
    id: series.id,
    slug: series.slug,
    title: series.title,
    category: series.category,
    color_theme: series.color_theme,
  }
}

function normalizeTags(rawPostTags: RawPostTagRow[] | null) {
  const tags = new Map<string, Tag>()

  rawPostTags?.forEach((rawPostTag) => {
    const tag = normalizeJoinedRecord(rawPostTag.tags)

    if (!tag || tags.has(tag.id)) {
      return
    }

    tags.set(tag.id, {
      id: tag.id,
      name: tag.name,
      created_at: tag.created_at,
    })
  })

  return [...tags.values()].sort((left, right) => left.name.localeCompare(right.name))
}

function transformPost(rawPost: RawPostRow): Post {
  return {
    id: rawPost.id,
    author_id: rawPost.author_id,
    series_id: rawPost.series_id,
    series_order: rawPost.series_order,
    slug: rawPost.slug,
    title: rawPost.title,
    content: rawPost.content,
    excerpt: rawPost.excerpt,
    category: rawPost.category,
    published: rawPost.published,
    character_count: rawPost.character_count,
    shadow_title: rawPost.shadow_title,
    shadow_content: rawPost.shadow_content,
    shadow_updated_at: rawPost.shadow_updated_at,
    published_at: rawPost.published_at,
    created_at: rawPost.created_at,
    updated_at: rawPost.updated_at,
    author: normalizeAuthor(rawPost.profiles),
    series: normalizeSeriesSummary(rawPost.series),
    tags: normalizeTags(rawPost.post_tags),
  }
}

function transformSeries(rawSeries: RawSeriesRow, posts: Post[] = []): Series {
  return {
    id: rawSeries.id,
    author_id: rawSeries.author_id,
    slug: rawSeries.slug,
    title: rawSeries.title,
    description: rawSeries.description,
    category: rawSeries.category,
    color_theme: rawSeries.color_theme,
    created_at: rawSeries.created_at,
    updated_at: rawSeries.updated_at,
    author: normalizeAuthor(rawSeries.profiles),
    posts,
  }
}

function aggregateSeriesPosts(
  rows: Array<Pick<DbPostRow, 'series_id' | 'character_count' | 'updated_at'>>
) {
  return rows.reduce<Map<string, SeriesAggregation>>((aggregations, row) => {
    if (!row.series_id) {
      return aggregations
    }

    const previous = aggregations.get(row.series_id)

    if (!previous) {
      aggregations.set(row.series_id, {
        postCount: 1,
        characterCountTotal: row.character_count,
        latestUpdatedAt: row.updated_at,
      })

      return aggregations
    }

    aggregations.set(row.series_id, {
      postCount: previous.postCount + 1,
      characterCountTotal: previous.characterCountTotal + row.character_count,
      latestUpdatedAt:
        new Date(row.updated_at).getTime() > new Date(previous.latestUpdatedAt).getTime()
          ? row.updated_at
          : previous.latestUpdatedAt,
    })

    return aggregations
  }, new Map())
}

async function getSeriesSiblings(seriesId: string, currentPostId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(postSelect)
    .eq('series_id', seriesId)
    .eq('published', true)
    .order('series_order', { ascending: true })
    .order('published_at', { ascending: true, nullsFirst: false })

  if (error) {
    throw new Error(error.message)
  }

  const siblings = ((data ?? []) as unknown as RawPostRow[]).map(transformPost)
  const currentIndex = siblings.findIndex((post) => post.id === currentPostId)

  return {
    prev: currentIndex > 0 ? siblings[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null,
  }
}

export const getAllSeriesWithPostCounts = cache(async (): Promise<SeriesWithCounts[]> => {
  const supabase = await createClient()

  const [{ data: seriesData, error: seriesError }, { data: postData, error: postError }] =
    await Promise.all([
      supabase
        .from('series')
        .select(`*, ${seriesAuthorSelect}`)
        .order('updated_at', { ascending: false }),
      supabase
        .from('posts')
        .select('series_id, character_count, updated_at')
        .eq('published', true)
        .not('series_id', 'is', null),
    ])

  if (seriesError) {
    throw new Error(seriesError.message)
  }

  if (postError) {
    throw new Error(postError.message)
  }

  const aggregations = aggregateSeriesPosts(
    (postData ?? []) as Array<Pick<DbPostRow, 'series_id' | 'character_count' | 'updated_at'>>
  )

  return ((seriesData ?? []) as unknown as RawSeriesRow[])
    .map((rawSeries) => {
      const aggregation = aggregations.get(rawSeries.id)
      const baseSeries = transformSeries(rawSeries)
      const latestUpdatedAt =
        aggregation &&
        new Date(aggregation.latestUpdatedAt).getTime() > new Date(baseSeries.updated_at).getTime()
          ? aggregation.latestUpdatedAt
          : baseSeries.updated_at

      return {
        ...baseSeries,
        updated_at: latestUpdatedAt,
        post_count: aggregation?.postCount ?? 0,
        character_count_total: aggregation?.characterCountTotal ?? 0,
      }
    })
    .sort((left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime())
})

export const getRecentPosts = cache(async (limit = 6): Promise<Post[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(postSelect)
    .eq('published', true)
    .is('series_id', null)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as unknown as RawPostRow[]).map(transformPost)
})

export const getRecentStandalonePosts = getRecentPosts

export const getSeriesBySlug = cache(async (slug: string): Promise<SeriesDetail | null> => {
  const supabase = await createClient()
  const { data: seriesData, error: seriesError } = await supabase
    .from('series')
    .select(`*, ${seriesAuthorSelect}`)
    .eq('slug', slug)
    .order('updated_at', { ascending: false })
    .limit(1)

  if (seriesError) {
    throw new Error(seriesError.message)
  }

  const rawSeries = ((seriesData ?? []) as unknown as RawSeriesRow[])[0]

  if (!rawSeries) {
    return null
  }

  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select(postSelect)
    .eq('series_id', rawSeries.id)
    .eq('published', true)
    .order('series_order', { ascending: true })
    .order('published_at', { ascending: true, nullsFirst: false })

  if (postError) {
    throw new Error(postError.message)
  }

  const posts = ((postData ?? []) as unknown as RawPostRow[]).map(transformPost)
  const characterCountTotal = posts.reduce((total, post) => total + post.character_count, 0)
  const latestPostUpdatedAt = posts.reduce((latest, post) => {
    return new Date(post.updated_at).getTime() > new Date(latest).getTime() ? post.updated_at : latest
  }, rawSeries.updated_at)

  return {
    ...transformSeries(rawSeries, posts),
    updated_at: latestPostUpdatedAt,
    post_count: posts.length,
    character_count_total: characterCountTotal,
  }
})

export const getPostBySlug = cache(async (slug: string): Promise<PostWithSiblings | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(postSelect)
    .eq('slug', slug)
    .eq('published', true)
    .is('series_id', null)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(1)

  if (error) {
    throw new Error(error.message)
  }

  const rawPost = ((data ?? []) as unknown as RawPostRow[])[0]

  if (!rawPost) {
    return null
  }

  return {
    post: transformPost(rawPost),
    siblingPosts: {
      prev: null,
      next: null,
    },
  }
})

export const getPostInSeries = cache(
  async (seriesSlug: string, postSlug: string): Promise<PostWithSiblings | null> => {
    const supabase = await createClient()
    const { data: seriesData, error: seriesError } = await supabase
      .from('series')
      .select(`*, ${seriesAuthorSelect}`)
      .eq('slug', seriesSlug)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (seriesError) {
      throw new Error(seriesError.message)
    }

    const rawSeries = ((seriesData ?? []) as unknown as RawSeriesRow[])[0]

    if (!rawSeries) {
      return null
    }

    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select(postSelect)
      .eq('slug', postSlug)
      .eq('series_id', rawSeries.id)
      .eq('published', true)
      .limit(1)

    if (postError) {
      throw new Error(postError.message)
    }

    const rawPost = ((postData ?? []) as unknown as RawPostRow[])[0]

    if (!rawPost) {
      return null
    }

    return {
      post: transformPost(rawPost),
      siblingPosts: await getSeriesSiblings(rawSeries.id, rawPost.id),
    }
  }
)

type ArchiveOptions = {
  category?: string
  tag?: string
  sort?: 'latest' | 'oldest'
  page?: number
  pageSize?: number
}

type ArchiveFilterQuery<T> = {
  eq: (column: string, value: string) => T
}

function applyArchiveFilters<T extends ArchiveFilterQuery<T>>(
  query: T,
  filters: Pick<ArchiveOptions, 'category' | 'tag'>
) {
  let scopedQuery = query

  if (filters.category) {
    scopedQuery = scopedQuery.eq('category', filters.category)
  }

  if (filters.tag) {
    scopedQuery = scopedQuery.eq('post_tags.tags.name', filters.tag)
  }

  return scopedQuery
}

export async function getArchivePosts({
  category,
  tag,
  sort = 'latest',
  page = 1,
  pageSize = 12,
}: ArchiveOptions): Promise<{
  posts: Post[]
  totalCount: number
  totalPages: number
}> {
  const supabase = await createClient()
  const isOldestFirst = sort === 'oldest'
  const idSelect = tag
    ? 'id, post_tags!inner(tag_id, tags!post_tags_tag_id_fkey!inner(name))'
    : 'id'

  let countQuery = supabase
    .from('posts')
    .select(idSelect, { count: 'exact', head: true })
    .eq('published', true)

  countQuery = applyArchiveFilters(countQuery, {
    category,
    tag,
  })

  const { count: totalCountValue, error: countError } = await countQuery

  if (countError) {
    throw new Error(countError.message)
  }

  const totalCount = totalCountValue ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const rangeStart = (safePage - 1) * pageSize
  const rangeEnd = rangeStart + pageSize - 1

  let pageIdQuery = supabase
    .from('posts')
    .select(idSelect)
    .eq('published', true)
    .order('published_at', { ascending: isOldestFirst, nullsFirst: false })
    .range(rangeStart, rangeEnd)

  pageIdQuery = applyArchiveFilters(pageIdQuery, {
    category,
    tag,
  })

  const { data: pageIdData, error: pageIdError } = await pageIdQuery

  if (pageIdError) {
    throw new Error(pageIdError.message)
  }

  const postIds = Array.from(
    new Set(
      ((pageIdData ?? []) as unknown as Array<{ id: string }>).map((row) => row.id)
    )
  )

  if (postIds.length === 0) {
    return {
      posts: [],
      totalCount,
      totalPages,
    }
  }

  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select(postSelect)
    .in('id', postIds)
    .order('published_at', { ascending: isOldestFirst, nullsFirst: false })

  if (postError) {
    throw new Error(postError.message)
  }

  return {
    posts: ((postData ?? []) as unknown as RawPostRow[]).map(transformPost),
    totalCount,
    totalPages,
  }
}

export const getAllCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as DbCategoryRow[]).map((category) => ({
    id: category.id,
    name: category.name,
    created_at: category.created_at,
  }))
})

export const getAllTags = cache(async (): Promise<Tag[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(postTagSelect)
    .eq('published', true)

  if (error) {
    throw new Error(error.message)
  }

  const tags = new Map<string, Tag>()

  ;((data ?? []) as unknown as RawPostRow[]).forEach((row) => {
    row.post_tags?.forEach((rawPostTag) => {
      const tag = normalizeJoinedRecord(rawPostTag.tags)

      if (!tag || tags.has(tag.id)) {
        return
      }

      tags.set(tag.id, {
        id: tag.id,
        name: tag.name,
        created_at: tag.created_at,
      })
    })
  })

  return [...tags.values()].sort((left, right) => left.name.localeCompare(right.name))
})
