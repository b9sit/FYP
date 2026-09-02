import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import api from "../api/axios";
import { ACCESS_TOKEN } from "../utils/constants";
import type { User } from "../utils/types";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      if (!accessToken) {
        return;
      }

      try {
        const res = await api.get("/api/user/");
        setUser({
          id: res.data.id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
          type: res.data.role,
          organisation: res.data.organisation,
          organisation_name: res.data.organisation_name,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
