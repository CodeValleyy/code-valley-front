export interface StepDto {
    service: string;
    endpoint: string;
    payload: {
        code: string;
        language: string;
        input_file?: any;
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

export interface SavePipelineDto {
    owner_id: number;
    name: string;
    description: string;
    steps: string[];
}
