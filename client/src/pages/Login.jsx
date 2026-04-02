import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const SunIcon = ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );

  const MoonIcon = ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
    </svg>
  );

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-qb-bg dark:bg-qb-darkBg">
      <div className="mx-auto w-full max-w-[520px] px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-qb-muted transition hover:text-qb-text dark:text-qb-darkMuted dark:hover:text-qb-darkText"
          >
            ← Home
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-qb-line bg-qb-surface px-4 text-sm font-semibold text-qb-muted shadow-sm transition hover:bg-slate-50 dark:border-qb-darkLine dark:bg-qb-darkSurface dark:text-qb-darkMuted dark:hover:bg-white/5"
          >
            {theme === "dark" ? (
              <>
                <SunIcon className="h-4 w-4" />
                Light
              </>
            ) : (
              <>
                <MoonIcon className="h-4 w-4" />
                Dark
              </>
            )}
          </button>
        </div>

        <div className="w-full rounded-qb bg-qb-surface p-7 shadow-qb dark:bg-qb-darkSurface">
          <h2 className="text-2xl font-semibold tracking-tight text-qb-green">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-qb-muted dark:text-qb-darkMuted">
            Login to continue using FeedWise AI.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-qb-line bg-white/70 px-4 text-sm outline-none transition focus:border-green-300 focus:bg-white dark:border-qb-darkLine dark:bg-white/5 dark:text-qb-darkText dark:focus:bg-white/10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-qb-line bg-white/70 px-4 text-sm outline-none transition focus:border-green-300 focus:bg-white dark:border-qb-darkLine dark:bg-white/5 dark:text-qb-darkText dark:focus:bg-white/10"
              />
            </div>

            <button
              className="h-11 w-full rounded-full bg-qb-green px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 active:translate-y-px"
              onClick={handleLogin}
            >
              Login
            </button>

            <button
              className="h-11 w-full rounded-full bg-slate-100 px-6 text-sm font-semibold text-qb-text transition hover:bg-slate-200 active:translate-y-px dark:bg-white/10 dark:text-qb-darkText dark:hover:bg-white/15"
              onClick={() => navigate("/")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

