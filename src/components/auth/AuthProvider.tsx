import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator" | "viewer";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions
const PERMISSIONS = {
  admin: [
    "equipment.create",
    "equipment.edit",
    "equipment.delete",
    "bookings.approve",
    "bookings.reject",
    "bookings.view",
    "clients.view",
    "clients.edit",
    "reports.view",
    "settings.edit",
    "gps.view",
    "chat.access",
  ],
  operator: [
    "equipment.edit",
    "bookings.approve",
    "bookings.reject",
    "bookings.view",
    "clients.view",
    "gps.view",
    "chat.access",
  ],
  viewer: ["bookings.view", "clients.view", "reports.view", "gps.view"],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("equipease_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      // Mock authentication - replace with real auth service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo users for different roles
      const demoUsers: Record<string, User> = {
        "admin@equipease.com": {
          id: "1",
          email: "admin@equipease.com",
          name: "Admin User",
          role: "admin",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        },
        "operator@equipease.com": {
          id: "2",
          email: "operator@equipease.com",
          name: "Equipment Operator",
          role: "operator",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        },
        "viewer@equipease.com": {
          id: "3",
          email: "viewer@equipease.com",
          name: "Report Viewer",
          role: "viewer",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b48f1aa1?w=150",
        },
      };

      const authenticatedUser = demoUsers[email];

      if (authenticatedUser && password === "demo123") {
        setUser(authenticatedUser);
        localStorage.setItem(
          "equipease_user",
          JSON.stringify(authenticatedUser),
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("equipease_user");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return PERMISSIONS[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Login component
export const LoginForm: React.FC<{ onSuccess: () => void }> = ({
  onSuccess,
}) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("admin@equipease.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (success) {
      onSuccess();
    } else {
      setError("Invalid credentials. Try: admin@equipease.com / demo123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">EquipEase Admin</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-sm text-gray-600 text-center space-y-1">
            <p>Demo accounts:</p>
            <p>👨‍💼 Admin: admin@equipease.com / demo123</p>
            <p>👷‍♂️ Operator: operator@equipease.com / demo123</p>
            <p>👀 Viewer: viewer@equipease.com / demo123</p>
          </div>
        </form>
      </div>
    </div>
  );
};
