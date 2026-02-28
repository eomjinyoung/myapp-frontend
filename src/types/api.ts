export interface UserSignupDto {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export interface LoginRequestDto {
    email: string;
    password: string;
}

export interface LoginResponseDto {
    accessToken: string;
    tokenType: string;
    userName: string;
    refreshToken: string;
}

export interface UserResponseDto {
    no: number;
    name: string;
    email: string;
}

export interface PostListDto {
    no: number;
    title: string;
    createdAt: string;
    views: number;
    authorName: string;
}

export interface PostListResponseDto {
    posts: PostListDto[];
    currentPage: number;
    totalPages: number;
}

export interface PostResponseDto {
    no: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    views: number;
    tags: string;
    authorName: string;
    authorNo: number;
}

export interface PostCreateDto {
    title: string;
    content: string;
    tags?: string;
}

export interface PostUpdateDto {
    no?: number;
    title: string;
    content: string;
    tags?: string;
}

export interface ErrorResponseDto {
    message: string;
    status: number;
}
