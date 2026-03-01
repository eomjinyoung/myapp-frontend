export interface UserResponse {
    no: number;
    name: string;
    email: string;
}

export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
    newPasswordMatching?: boolean;
}
