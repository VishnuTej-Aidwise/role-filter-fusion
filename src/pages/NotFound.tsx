
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleNavigateHome = () => {
    if (isAuthenticated && user) {
      navigate(`/dashboard/${user.role}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-12 rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold text-navy mb-6">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button onClick={handleNavigateHome} className="bg-navy hover:bg-navy-dark transition-colors">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
