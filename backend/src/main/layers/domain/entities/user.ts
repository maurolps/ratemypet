export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  bio?: string;
  picture?: string | null;
  createdAt: Date;
}
