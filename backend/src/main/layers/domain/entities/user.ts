export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  created_at: Date;
}
