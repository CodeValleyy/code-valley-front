export interface StepDto {
    service: string;
    endpoint: string;
    payload: {
        code: string;
        language: string;
        input?: string;
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
}
