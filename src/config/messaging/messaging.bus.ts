export interface Bus {
  send<TRequest, TResult>(pattern: string, message?: TRequest, options?: BusOptionsArgument): Promise<TResult>;

  publish(pattern: string, message: any): void;
}

export interface BusOptionsArgument {
  headers?: { [key: string]: string; },
  sendNullOnException?: boolean;
}
