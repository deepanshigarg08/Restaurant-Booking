import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Set initial value to null
  const router = useRouter();

  useEffect(() => {
    // Check localStorage after mount
    const token = localStorage.getItem("Auth_Token");

    if (token) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      setIsAuthenticated(false); // User is not authenticated
      router.push("/"); // Redirect to login if not authenticated
    }
  }, []);

  return isAuthenticated;
};
