import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Vendor from "./pages/Vendor/Vendor";
import Admin from "./pages/Admin/Admin";
import User from "./pages/User/User";
import Login from "./pages/Login/Login";
import StripePaymentform from "./pages/User/StripePaymentform";
import PaymentSuccess from "./pages/User/PaymentSuccess";
import PaymentCancelled from "./pages/User/PaymentCancelled";

// Create and export Auth Context
export const AuthContext = createContext(null);

// Auth Provider Component
const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  // Update userRole when localStorage changes
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
  }, []);

  const login = (role) => {
    setUserRole(role);
  };

  const logout = () => {
    setUserRole(null);
    // Clear all localStorage items
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole } = useContext(AuthContext);
  
  if (!userRole) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'vendor') return <Navigate to="/vendor" replace />;
    if (userRole === 'user') return <Navigate to="/user" replace />;
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
           // In your router configuration
           <Route path="/payment/:status" element={<PaymentSuccess />} />
            {/* <Route path="/payment/cancel" element={<PaymentCancelled />} /> */}
          
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <Vendor />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <User />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<h1>ERROR 404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { userRole } = useContext(AuthContext);
  
  if (userRole) {
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'vendor') return <Navigate to="/vendor" replace />;
    if (userRole === 'user') return <Navigate to="/user" replace />;
  }
  
  return children;
};

export default App;