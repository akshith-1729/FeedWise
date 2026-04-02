import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

function Dashboard() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  // Backend currently expects "mode" like paragraph/bullets for output format.
  const [mode, setMode] = useState("paragraph"); // paragraph | bullets
  const [length, setLength] = useState("short");
  const [lengthValue, setLengthValue] = useState(0); // 0 short, 1 medium, 2 long
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("summarize"); // summarize | paraphrase
  const [fileInputKey, setFileInputKey] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { theme, toggleTheme } = useTheme();

  const lengthOptions = ["short", "medium", "long"];

  const HomeIcon = ({ className }) => (
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
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 10.5V21h14V10.5" />
      <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
    </svg>
  );

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

  const CopyIcon = ({ className }) => (
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
      <path d="M9 9h10v10H9z" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );

  const DownloadIcon = ({ className }) => (
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );

  const UploadIcon = ({ className }) => (
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );

  const bulletItems = mode === "bullets"
    ? summary
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/^[-•\u2022]\s+/, "").trim())
    : [];

  // 🔹 TEXT SUMMARY
  const generateSummary = async () => {
    if (!text.trim()) {
      alert("Please enter text");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        token
          ? "http://localhost:5000/api/summarize/secure"
          : "http://localhost:5000/api/summarize/open",
        { text, mode, length },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      alert("Error generating summary");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FILE SUMMARY
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);
      formData.append("length", length);

      const res = await axios.post(
        "http://localhost:5000/api/summarize/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSummary(res.data.summary);
      setFile(null);
      setFileInputKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔹 STATS
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;
  const outTrimmed = summary.trim();
  const summaryCount = outTrimmed
    ? outTrimmed.split(/\s+/).filter(Boolean).length
    : 0;
  const summaryCharCount = summary.length;
  const reduction =
    wordCount > 0 ? Math.round((1 - summaryCount / wordCount) * 100) : 0;

  const clearAll = () => {
    setText("");
    setSummary("");
    setFile(null);
    setFileInputKey((k) => k + 1);
  };

  const downloadAsWord = () => {
    if (!summary) return;

    const escaped = summary
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>FeedWise Summary</title>
  </head>
  <body>
    <h2>Summary</h2>
    <div>${escaped}</div>
  </body>
</html>`;

    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-qb-bg dark:bg-qb-darkBg">
      <div className="mx-auto flex min-h-screen w-full max-w-[1320px] gap-5 px-4 py-5 md:px-6">
        {/* LEFT RAIL */}
        <aside className="hidden w-[76px] shrink-0 md:flex">
          <div className="flex w-full flex-col items-center gap-4 rounded-qb bg-qb-surface py-4 shadow-qb dark:bg-qb-darkSurface">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-qb-greenSoft text-qb-green dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="text-lg font-bold">F</span>
            </div>
            <div className="h-px w-10 bg-qb-line dark:bg-qb-darkLine" />

            <button
              type="button"
              onClick={() => navigate("/")}
              className="grid h-10 w-10 place-items-center rounded-xl text-qb-muted transition hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5"
              aria-label="Home"
              title="Home"
            >
              <HomeIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("paraphrase")}
              className={[
                "grid h-10 w-10 place-items-center rounded-xl transition",
                activeTool === "paraphrase"
                  ? "bg-qb-greenSoft text-qb-green dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "text-qb-muted hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5",
              ].join(" ")}
              aria-label="Paraphrase"
              title="Paraphrase"
            >
              P
            </button>
            <button
              type="button"
              onClick={() => setActiveTool("summarize")}
              className={[
                "grid h-10 w-10 place-items-center rounded-xl transition",
                activeTool === "summarize"
                  ? "bg-qb-greenSoft text-qb-green dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "text-qb-muted hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5",
              ].join(" ")}
              aria-label="Summarize"
              title="Summarize"
            >
              S
            </button>

            <div className="mt-auto flex w-full flex-col items-center gap-3 pb-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-qb-muted transition hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5"
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

              {token ? (
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl px-3 py-2 text-xs font-medium text-qb-muted transition hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex w-full flex-col">
          {/* Top header */}
          <div className="flex items-start justify-between gap-3 px-1">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-qb-line bg-qb-surface text-qb-muted shadow-sm transition hover:bg-slate-50 dark:border-qb-darkLine dark:bg-qb-darkSurface dark:text-qb-darkMuted dark:hover:bg-white/5"
                aria-label="Home"
                title="Home"
              >
                <HomeIcon className="h-5 w-5" />
              </button>

              <div>
                <div className="text-sm font-semibold text-qb-muted dark:text-qb-darkMuted">
                  {activeTool === "summarize" ? "Summarizer" : "Paraphraser"}
                </div>
                <div className="text-2xl font-semibold tracking-tight dark:text-qb-darkText">
                  {activeTool === "summarize"
                    ? "Free AI Summarizer"
                    : "Free AI Paraphraser"}
                </div>
                <div className="mt-1 text-sm text-qb-muted dark:text-qb-darkMuted">
                  Clean, modern editing—built for a smooth writing experience.
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-qb-line bg-qb-surface px-4 py-2 text-sm font-medium text-qb-muted shadow-sm transition hover:bg-slate-50 dark:border-qb-darkLine dark:bg-qb-darkSurface dark:text-qb-darkMuted dark:hover:bg-white/5"
              >
                {theme === "dark" ? (
                  <>
                    <SunIcon className="h-4 w-4" />
                    Light theme
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-4 w-4" />
                    Dark theme
                  </>
                )}
              </button>
              <button
                type="button"
                className="rounded-full border border-qb-line bg-qb-surface px-4 py-2 text-sm font-medium text-qb-muted shadow-sm transition hover:bg-slate-50 dark:border-qb-darkLine dark:bg-qb-darkSurface dark:text-qb-darkMuted dark:hover:bg-white/5"
              >
                Upgrade
              </button>
            </div>
          </div>

          {/* Card */}
          <section className="relative mt-5 flex flex-1 flex-col rounded-qb bg-qb-surface shadow-qb dark:bg-qb-darkSurface">
            {/* Controls row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-qb-line px-4 py-3 md:px-5 dark:border-qb-darkLine">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTool("paraphrase")}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    activeTool === "paraphrase"
                      ? "bg-qb-greenSoft text-qb-green dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "text-qb-muted hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5",
                  ].join(" ")}
                >
                  Paraphrase
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool("summarize")}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    activeTool === "summarize"
                      ? "bg-qb-greenSoft text-qb-green dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "text-qb-muted hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5",
                  ].join(" ")}
                >
                  Summarize
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-qb-muted transition hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5"
                >
                  Delete
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                    Output:
                  </span>
                  <div className="flex items-center rounded-full border border-qb-line bg-qb-surface p-1 shadow-sm dark:border-qb-darkLine dark:bg-qb-darkSurface">
                    <button
                      type="button"
                      onClick={() => setMode("paragraph")}
                      className={[
                        "rounded-full px-3 py-1.5 text-sm font-semibold transition",
                        mode === "paragraph"
                          ? "bg-qb-greenSoft text-qb-green dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "text-qb-muted hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5",
                      ].join(" ")}
                    >
                      Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("bullets")}
                      className={[
                        "rounded-full px-3 py-1.5 text-sm font-semibold transition",
                        mode === "bullets"
                          ? "bg-qb-greenSoft text-qb-green dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "text-qb-muted hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5",
                      ].join(" ")}
                    >
                      Bullets
                    </button>
                  </div>
                </div>

                <label className="ml-1 text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                  Summary length:
                </label>

                <div className="flex w-[220px] items-center gap-3">
                  <span className="text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                    Short
                  </span>
                  <div className="flex-1">
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={1}
                      value={lengthValue}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setLengthValue(v);
                        setLength(lengthOptions[v] ?? "short");
                      }}
                      className="qb-range"
                      style={{
                        ["--fill"]: `${(lengthValue / 2) * 100}%`,
                      }}
                      aria-label="Summary length"
                    />
                    <div className="mt-1 flex justify-between px-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-500/70" />
                      <span className="h-1 w-1 rounded-full bg-emerald-500/50" />
                      <span className="h-1 w-1 rounded-full bg-emerald-500/30" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                    Long
                  </span>
                </div>
              </div>
            </div>

            {/* Split panes */}
            <div className="grid flex-1 grid-cols-1 gap-0 md:grid-cols-2">
              {/* Input */}
              <div className="flex flex-col border-b border-qb-line md:border-b-0 md:border-r dark:border-qb-darkLine">
                <div className="flex items-center justify-between px-4 py-3 md:px-5">
                  <div className="text-sm font-semibold text-qb-muted dark:text-qb-darkMuted">
                    Input
                  </div>
                  <div className="text-xs text-qb-muted dark:text-qb-darkMuted">
                    {wordCount} words · {charCount} chars
                  </div>
                </div>
                <div className="flex-1 px-4 pb-4 md:px-5">
                  <textarea
                    className="h-full min-h-[260px] w-full resize-none rounded-2xl border border-qb-line bg-white/70 p-4 text-[15px] leading-relaxed outline-none transition focus:border-green-300 focus:bg-white dark:border-qb-darkLine dark:bg-white/5 dark:text-qb-darkText dark:focus:bg-white/10"
                    placeholder="Enter or paste your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>

              {/* Output */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-5">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-qb-muted dark:text-qb-darkMuted">
                      Output
                    </div>
                    <div className="text-xs text-qb-muted dark:text-qb-darkMuted">
                      {summaryCount} words · {summaryCharCount} chars
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-qb-text transition hover:bg-slate-200 dark:bg-white/10 dark:text-qb-darkText dark:hover:bg-white/15"
                      onClick={() => summary && navigator.clipboard?.writeText(summary)}
                      disabled={!summary}
                    >
                      <CopyIcon className="h-4 w-4" />
                      Copy
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-qb-text transition hover:bg-slate-200 dark:bg-white/10 dark:text-qb-darkText dark:hover:bg-white/15 disabled:opacity-60"
                      onClick={downloadAsWord}
                      disabled={!summary}
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download (.doc)
                    </button>
                  </div>
                </div>
                <div className="flex-1 px-4 pb-4 md:px-5">
                  <div className="h-full min-h-[260px] w-full rounded-2xl border border-qb-line bg-white/70 p-4 text-[15px] leading-relaxed text-qb-text dark:border-qb-darkLine dark:bg-white/5 dark:text-qb-darkText">
                    {summary ? (
                      mode === "bullets" ? (
                        <ul className="list-disc space-y-2 pl-5">
                          {bulletItems.map((item, idx) => (
                            <li key={`${idx}-${item.slice(0, 24)}`}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="whitespace-pre-wrap">{summary}</div>
                      )
                    ) : (
                      <span className="text-qb-muted dark:text-qb-darkMuted">
                        Your result will appear here…
                      </span>
                    )}
                  </div>

                  {!!summary && (
                    <div className="mt-4 flex flex-wrap items-center justify-start gap-x-6 gap-y-2 border-t border-qb-line pt-3 text-xs text-qb-muted dark:border-qb-darkLine dark:text-qb-darkMuted">
                      <div className="whitespace-nowrap">
                        Reduction:{" "}
                        <span className="font-semibold text-qb-text dark:text-qb-darkText">
                          {reduction}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-qb-line px-4 py-3 md:px-5 dark:border-qb-darkLine">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  key={fileInputKey}
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-qb-muted file:mr-3 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-qb-text hover:file:bg-slate-200 dark:text-qb-darkMuted dark:file:bg-white/10 dark:file:text-qb-darkText dark:hover:file:bg-white/15 md:w-auto"
                />
                <button
                  type="button"
                  onClick={uploadFile}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-semibold text-qb-text transition hover:bg-slate-200 dark:bg-white/10 dark:text-qb-darkText dark:hover:bg-white/15"
                >
                  <UploadIcon className="h-4 w-4" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFileInputKey((k) => k + 1);
                  }}
                  className="h-10 rounded-full px-4 text-sm font-semibold text-qb-muted transition hover:bg-slate-50 dark:text-qb-darkMuted dark:hover:bg-white/5"
                >
                  Clear file
                </button>
              </div>

              <button
                type="button"
                onClick={generateSummary}
                className="h-11 rounded-full bg-qb-green px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 active:translate-y-px disabled:opacity-60"
                disabled={loading}
              >
                {loading
                  ? "Processing…"
                  : activeTool === "summarize"
                  ? "Summarize"
                  : "Paraphrase"}
              </button>
            </div>

            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 grid place-items-center rounded-qb bg-white/60 backdrop-blur-sm dark:bg-black/35">
                <div className="flex items-center gap-3 rounded-2xl border border-qb-line bg-qb-surface px-5 py-4 shadow-qb dark:border-qb-darkLine dark:bg-qb-darkSurface">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-qb-line border-t-qb-green dark:border-qb-darkLine dark:border-t-emerald-400" />
                  <div className="text-sm font-semibold text-qb-text dark:text-qb-darkText">
                    Working on it…
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="mt-4 text-center text-xs text-qb-muted dark:text-qb-darkMuted md:hidden">
            Tip: rotate to landscape for the best split-view experience.
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

