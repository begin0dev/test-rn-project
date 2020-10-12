export {};

declare global {
  export function setTimeout(
    callback: (...args: any[]) => void,
    ms: number,
    ...args: any[]
  ): number;
}
