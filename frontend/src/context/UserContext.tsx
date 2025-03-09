import { createContext } from "react";

import useAuthLogged from "../hooks/useAuthLogged";

interface User {
  id: string;
  username: string;
  role: string;
}

export const UserContext = createContext<{
  user: User | null | undefined;
  isUserLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>> | undefined;
}>({ user: null, isUserLoading: false, setUser: undefined });

interface UserProviderType {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderType) => {
  const { user, isUserLoading, setUser } = useAuthLogged();

  return (
    <UserContext.Provider value={{ user, isUserLoading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
