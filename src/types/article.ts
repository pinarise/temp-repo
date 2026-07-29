export type ArticleStatus =
  | "draft"
  | "editorial_review"
  | "changes_requested"
  | "published"
  | "scheduled";

export type ContentCategoryType = "article" | "video" | "player" | "club";

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  type: ContentCategoryType;
  is_active: boolean;
  parent: Category | null;
  children: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface SeoMetadata {
  id: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  schema_markup: string | null;
  noindex: boolean;
}

export interface ArticleAuthor {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: ArticleStatus;
  reading_time: number | null;
  allow_comments: boolean;
  is_breaking: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: ArticleAuthor;
  category: Omit<Category, "parent" | "children" | "parent_id" | "type" | "is_active"> | null;
  featured_media: string | null; // featured media ID or object if populated
  tags: Tag[];
  seo_metadata: SeoMetadata | null;
  clubs: unknown[];
  players: unknown[];
}

// Laravel pagination wrapper
export interface LaravelPagination<T> {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface ListArticlesParams {
  status?: ArticleStatus;
  category_id?: string;
  author_id?: string;
  tag_ids?: string; // Comma-separated
  search?: string;
  per_page?: number;
  page?: number;
}

export interface CreateArticlePayload {
  category_id?: string | null;
  featured_media_id?: string | null;
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  allow_comments?: boolean;
  is_breaking?: boolean;
  tags?: string[]; // Tag IDs
  clubs?: string[];
  players?: string[];
  seo?: Partial<Omit<SeoMetadata, "id">>;
}

export interface UpdateArticlePayload extends Partial<CreateArticlePayload> {}

export interface CreateCategoryPayload {
  parent_id?: string | null;
  name: string;
  slug?: string;
  description?: string | null;
  type?: ContentCategoryType;
  is_active?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export interface CreateTagPayload {
  name: string;
  slug?: string;
}

export interface UpdateTagPayload extends Partial<CreateTagPayload> {}
