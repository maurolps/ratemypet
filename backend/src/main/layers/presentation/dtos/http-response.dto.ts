export type HttpResponse = {
  body: {
    id?: string;
    name: string;
    email?: string;
    message?: string;
    created_at?: Date;
  };
  status: number;
};
