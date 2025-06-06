import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LogOut, Swords, User, LogIn } from "lucide-react";

const Navbar = () => {
  const { logout, user, isAuthenticated } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80  bg-gradient-to-tl from-gray-900 "
    >
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Swords className="w-5 h-5 text-primary text-indigo-400" />
              </div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-400">Lan-Party Ephec</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex btn btn-sm gap-2">
                  <User className="w-5 h-5 text-primary text-indigo-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-100 to-indigo-400 hidden sm:inline">
                    Compte
                  </span>
                </Link>

                <button className="flex btn btn-sm gap-2 items-center  " onClick={logout}>
                  <LogOut className="w-5 h-3 text-indigo-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-100 to-indigo-400 hidden sm:inline">
                    Déconnecter
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex btn btn-sm gap-2">
                  <LogIn className="w-5 h-5 text-indigo-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-100 to-indigo-400 hidden sm:inline">
                    Se connecter
                  </span>
                </Link>

                <Link to="/signup" className="flex btn btn-sm gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-100 to-indigo-400 hidden sm:inline">
                    S'inscrire
                  </span>
                </Link>
              </>
            )}
          {user?.droit === "admin" && (
          <Link to="/admin" className="mx-15 text-sm font-medium hover:opacity-80 transition-all bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-400">
            Dashboard
          </Link>
          )}
          </div>
        </div>

        {/* Bottom section with links */}
        <div className="flex   gap-6 py-2 ">
          <Link to="/tournois" className=" mr-15 text-sm font-medium hover:opacity-80 transition-all bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-500">
            Tournois
          </Link>
          <Link to="/team" className=" mx-15 text-sm font-medium hover:opacity-80 transition-all bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-400">
            Équipes
          </Link>

          {user?.droit === "admin" && (

            <Link to="/gestion" className="mx-15 text-sm font-medium hover:opacity-80 transition-all bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-400">
              Gestion
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
