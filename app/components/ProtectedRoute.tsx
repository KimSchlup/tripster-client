"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
}

/**
 * A component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = "/login",
}) => {
  const { authState } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // If auth state is still loading, wait
      if (authState.isLoading) {
        return;
      }

      // If not logged in or token is expired, redirect to login
      if (!authState.isLoggedIn) {
        console.log("User not authenticated, redirecting to", fallbackUrl);
        router.push(fallbackUrl);
      }

      // Finished checking
      setIsChecking(false);
    };

    checkAuth();
  }, [authState.isLoggedIn, authState.isLoading, router, fallbackUrl]);

  // Show nothing while checking authentication
  if (isChecking || authState.isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
