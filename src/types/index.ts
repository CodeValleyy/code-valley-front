export interface ExecuteCodeRequest {
  language: string
  code: string
}

export interface ExecuteCodeResponse {
  output: string
  error?: string
  outputFileContent?: string
}

export * from './User'
export * from './Post'
export * from './Content'
export * from './Pipeline'
