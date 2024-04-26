export interface ExecuteCodeRequest {
    language: string;
    code: string;
}

export interface ExecuteCodeResponse {
    output: string;
    error?: string;
}
