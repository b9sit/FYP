import { createContext, useContext } from "react";
import type { User } from "../utils/types";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within UserProvider");
  }

  return context;
}

export { UserContext };
