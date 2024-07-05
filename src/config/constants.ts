export const PIPELINE_API_URL = 'https://pipeline-orchestrator.code-valley.xyz';
export const WS_PROD_URL = 'wss://pipeline-orchestrator.code-valley.xyz';
export const WS_DEV_URL = 'ws://localhost:3000';
export const socketUrl = import.meta.env.NODE_ENV === 'production' ? WS_PROD_URL : WS_DEV_URL;