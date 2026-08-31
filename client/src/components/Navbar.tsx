import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-primary-600">
          DevHire
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/jobs" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Browse Jobs
          </Link>

          {user ? (
            <>
              {user.role === "EMPLOYER" && (
                <Link to="/post-job" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Post a Job
                </Link>
              )}

              {user.role === "CANDIDATE" && (
                <Link to="/my-applications" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  My Applications
                </Link>
              )}

              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                <span className="text-sm text-gray-500">
                  {user.name}{" "}
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                    {user.role.toLowerCase()}
                  </span>
                </span>
                <button onClick={handleLogout} className="btn-secondary text-xs">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/signin" className="btn-secondary text-xs">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary text-xs">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
