export interface StepDto {
    service: string;
    endpoint: string;
    payload: {
        code: string;
        language: string;
        input?: string | Blob;
        [key: string]: any;
    };
}

export interface CreatePipelineDto {
    steps: StepDto[];
}

export interface StepResultDto {
    output: string;
    error: string;
    stepNumber: number;
    output_file_content?: string;
    output_file_path?: string;
}

