export interface ServiceStatus {
    status: 'waiting' | 'ready' | 'calling' | 'done' | 'failed' | 'unknown';
}
