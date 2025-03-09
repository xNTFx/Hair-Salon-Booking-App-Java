import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "../types/Types";
import { getUserDetails, refreshToken } from "../api/GetFetches";

export default function useAuthLogged() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isLoggedIn = !!Cookies.get("isLoggedIn");

  useEffect(() => {
    if (!isLoggedIn) {
      setIsUserLoading(false);
      return;
    }

    let isMounted = true;
    setIsUserLoading(true);

    const fetchUserData = async () => {
      try {
        const refreshResponse = await refreshToken();

        const accessToken = refreshResponse.data.accessToken;

        const response = await getUserDetails(accessToken);

        if (isMounted) {
          setUser({
            id: response.data.id,
            username: response.data.username,
            role: response.data.role,
          });
          setIsUserLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsUserLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  if (error) {
    console.error(error);
  }

  return { user, isUserLoading, setUser };
}
