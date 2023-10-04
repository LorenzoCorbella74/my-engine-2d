export type Timer = {
    delay: number;
    cacheDelay: number;
    callback: (remaining: number | null) => any;
    repeat?: number; // if 
}

export type FunctionToBeCalledContinuously = {
    duration: number;
    callback: (dt: number) => void;
    callBackEnd?: () => any;
}