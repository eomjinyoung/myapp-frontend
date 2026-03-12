/**
 * PostListDto
 */
export interface PostSummary {
  no: number
  title: string
  createdAt: string
  views: number
  authorName: string
}

/**
 * PostListResponseDto
 */
export interface PostListResponse {
  posts: PostSummary[]
  currentPage: number
  totalPages: number
}

/**
 * PostResponseDto
 */
export interface Post {
  no: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  views: number
  tags: string
  authorName: string
  authorNo: number
}

/**
 * PostCreateDto
 */
export interface PostCreateRequest {
  title: string
  content: string
  tags: string
}

/**
 * PostUpdateDto
 */
export interface PostUpdateRequest {
  title: string
  content: string
  tags: string
}
