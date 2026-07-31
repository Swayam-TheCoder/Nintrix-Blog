import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  Home,
  LogIn,
  UserPlus,
  PenSquare,
} from "lucide-react";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // Temporary theme button
  const dark = true;

  const navItem = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
    ${
      isActive
        ? "bg-emerald-500/15 text-emerald-400 shadow-lg"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <motion.nav
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="
      sticky
      top-0
      z-50
      backdrop-blur-xl
      bg-black/60
      border-b
      border-slate-800
      shadow-xl
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}

        <Link to="/">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="
            text-3xl
            font-black
            bg-gradient-to-r
            from-emerald-400
            via-cyan-400
            to-blue-500
            bg-clip-text
            text-transparent
            tracking-wide
            "
          >
            SBlog
          </motion.h1>
        </Link>

        {/* SEARCH */}

        <div className="hidden lg:flex items-center w-[350px] relative">

          <Search
            size={18}
            className="absolute left-4 text-slate-400"
          />

          <input
            placeholder="Search articles..."
            className="
            w-full
            bg-slate-900
            border
            border-slate-700
            rounded-full
            py-2.5
            pl-11
            pr-4
            text-white
            placeholder:text-slate-500
            focus:outline-none
            focus:border-emerald-400
            transition
            "
          />

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-2">

          <NavLink
            to="/"
            className={navItem}
          >
            <Home size={18} />
            Home
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={navItem}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/create"
              className={navItem}
            >
              <PenSquare size={18} />
              Write
            </NavLink>
          )}

          {/* Notification */}

          {user && (
            <button
              className="
              relative
              p-3
              rounded-full
              hover:bg-slate-800
              transition
              "
            >
              <Bell
                className="text-white"
                size={20}
              />

              <span
                className="
                absolute
                top-2
                right-2
                w-2
                h-2
                rounded-full
                bg-red-500
                animate-pulse
                "
              />
            </button>
          )}

          {/* Theme */}

          <button
            className="
            p-3
            rounded-full
            hover:bg-slate-800
            transition
            "
          >
            {dark ? (
              <Sun
                className="text-yellow-400"
                size={20}
              />
            ) : (
              <Moon
                className="text-white"
                size={20}
              />
            )}
          </button>

          {!user ? (
            <>
              <NavLink
                to="/login"
                className={navItem}
              >
                <LogIn size={18} />
                Login
              </NavLink>

              <Link
                to="/register"
                className="
                px-5
                py-2.5
                rounded-full
                bg-gradient-to-r
                from-emerald-500
                to-cyan-500
                hover:scale-105
                transition
                flex
                items-center
                gap-2
                font-semibold
                "
              >
                <UserPlus size={18} />
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="
              px-5
              py-2.5
              rounded-full
              bg-red-500
              hover:bg-red-600
              transition
              flex
              items-center
              gap-2
              font-semibold
              "
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;