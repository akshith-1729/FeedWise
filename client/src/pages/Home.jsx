import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const startGuestMode = () => {
    localStorage.removeItem("token");
    navigate("/dashboard");
  };

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

  return (
    <div className="min-h-screen bg-qb-bg dark:bg-qb-darkBg">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-6 md:px-6 md:py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-qb-greenSoft text-qb-green shadow-sm dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="text-lg font-bold">F</span>
            </div>
            <div>
              <div className="text-base font-semibold text-qb-text dark:text-qb-darkText md:text-lg">
                FeedWise AI
              </div>
              <div className="text-xs text-qb-muted dark:text-qb-darkMuted">
                Summarize • Paraphrase • Export
              </div>
            </div>
          </div>

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

        {/* Hero */}
        <div className="mt-8 grid items-stretch gap-6 md:grid-cols-2">
          <div className="rounded-qb bg-qb-surface p-7 shadow-qb dark:bg-qb-darkSurface md:p-9">
            <div className="inline-flex items-center gap-2 rounded-full bg-qb-greenSoft px-3 py-1 text-xs font-semibold text-qb-green dark:bg-emerald-950/60 dark:text-emerald-300">
              New
              <span className="text-qb-muted dark:text-qb-darkMuted">
                Cleaner editor UI
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-qb-text dark:text-qb-darkText md:text-4xl">
              A focused writing workspace that feels fast.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-qb-muted dark:text-qb-darkMuted md:text-base">
              Paste text on the left, get results on the right. Switch between
              paragraph and bullet outputs, control length with a slider, and
              download your summary when you’re done.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="h-11 rounded-full bg-qb-green px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 active:translate-y-px"
              >
                Open Dashboard
              </button>

              <button
                onClick={() => navigate("/login")}
                className="h-11 rounded-full border border-qb-line bg-qb-surface px-6 text-sm font-semibold text-qb-text shadow-sm transition hover:bg-slate-50 active:translate-y-px dark:border-qb-darkLine dark:bg-qb-darkSurface dark:text-qb-darkText dark:hover:bg-white/5"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="h-11 rounded-full bg-slate-100 px-6 text-sm font-semibold text-qb-text transition hover:bg-slate-200 active:translate-y-px dark:bg-white/10 dark:text-qb-darkText dark:hover:bg-white/15"
              >
                Create account
              </button>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { title: "Split editor", desc: "Input ↔ output panes" },
                { title: "Length slider", desc: "Short → Long control" },
                { title: "Export", desc: "Download your result" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-qb-line bg-white/70 p-3 text-sm dark:border-qb-darkLine dark:bg-white/5"
                >
                  <div className="font-semibold text-qb-text dark:text-qb-darkText">
                    {f.title}
                  </div>
                  <div className="mt-1 text-xs text-qb-muted dark:text-qb-darkMuted">
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview panel */}
          <div className="rounded-qb bg-qb-surface p-7 shadow-qb dark:bg-qb-darkSurface md:p-9">
            <div className="text-sm font-semibold text-qb-muted dark:text-qb-darkMuted">
              Preview
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-qb-line bg-white/70 p-4 dark:border-qb-darkLine dark:bg-white/5">
                <div className="text-xs font-semibold text-qb-muted dark:text-qb-darkMuted">
                  Input
                </div>
                <div className="mt-2 h-24 rounded-xl bg-gradient-to-b from-white to-slate-50/60 dark:from-white/10 dark:to-white/5" />
              </div>
              <div className="rounded-2xl border border-qb-line bg-white/70 p-4 dark:border-qb-darkLine dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-qb-muted dark:text-qb-darkMuted">
                    Output
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-16 rounded-full bg-slate-100 dark:bg-white/10" />
                    <span className="h-7 w-24 rounded-full bg-slate-100 dark:bg-white/10" />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-11/12 rounded bg-slate-200/80 dark:bg-white/10" />
                  <div className="h-3 w-10/12 rounded bg-slate-200/70 dark:bg-white/10" />
                  <div className="h-3 w-9/12 rounded bg-slate-200/60 dark:bg-white/10" />
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-qb-line bg-white/70 p-4 dark:border-qb-darkLine dark:bg-white/5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-qb-muted dark:text-qb-darkMuted">
                  Summary length
                </div>
                <div className="text-xs text-qb-muted dark:text-qb-darkMuted">
                  Short → Long
                </div>
              </div>
              <div className="mt-3">
                <div className="h-1 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-slate-200/60 dark:to-white/10" />
                <div className="-mt-2 ml-[12%] h-5 w-5 rounded-full border-[3px] border-emerald-600 bg-white shadow-sm dark:border-emerald-400 dark:bg-qb-darkSurface" />
              </div>
              <button
                type="button"
                onClick={startGuestMode}
                className="mt-5 h-11 w-full rounded-full bg-qb-green text-sm font-semibold text-white shadow-sm transition hover:brightness-95 active:translate-y-px"
              >
                Try it now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-qb-muted dark:text-qb-darkMuted">
          Tip: Use the theme toggle to switch between light and dark modes.
        </div>
      </div>
    </div>
  );
}

export default Home;

