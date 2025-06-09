import React from "react";
import { useAuth } from "./AuthProvider";
import { LoginForm } from "./AuthProvider";
import { AlertTriangle, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  fallback,
}) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Current Role: {user.role}</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Contact your administrator to request access to this feature.
              </p>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

// Higher-order component for easy wrapping
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  permission?: string,
) => {
  return (props: P) => (
    <ProtectedRoute permission={permission}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
