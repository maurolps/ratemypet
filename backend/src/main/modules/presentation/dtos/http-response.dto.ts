export type HttpResponse = {
  body: {
    id?: string;
    name: string;
    email?: string;
    message?: string;
  };
  status: number;
};
