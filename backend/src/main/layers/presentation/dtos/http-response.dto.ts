export type HttpResponse<T = Record<string, unknown>> = {
  body: T;
  status: number;
};
