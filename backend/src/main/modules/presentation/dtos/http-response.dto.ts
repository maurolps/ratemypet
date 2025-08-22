export type HttpResponse = {
  body?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
  status: number;
};
