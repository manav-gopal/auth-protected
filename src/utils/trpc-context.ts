import { deserializeUser } from "@/server/auth-middleware";

interface User {
  id: string;
  name: string | null;
  email: string;
  verified: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface Context {
  user: User | null;
}

export const createContext = async (): Promise<Context> => {
  const user = await deserializeUser();
  return user;
};

export type ContextType = Context;
