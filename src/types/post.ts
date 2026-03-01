export interface PostListDto {
    no: number;
    title: string;
    createdAt: string;
    views: number;
    authorName: string;
}

export interface PostListResponse {
    posts: PostListDto[];
    currentPage: number;
    totalPages: number;
}

export interface PostResponse {
    no: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    views: number;
    tags?: string;
    authorName: string;
    authorNo: number;
}

export interface PostCreateRequest {
    title: string;
    content?: string;
    tags?: string;
}

export interface PostUpdateRequest {
    no?: number;
    title: string;
    content?: string;
    tags?: string;
}
