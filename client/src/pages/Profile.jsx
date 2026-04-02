import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    joinedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/dashboard");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dbProfile = {
          name: res.data?.name ?? "",
          email: res.data?.email ?? "",
          bio: res.data?.bio ?? "",
          joinedAt: res.data?.createdAt ?? "",
        };
        setProfile(dbProfile);
        localStorage.setItem("feedwise-profile", JSON.stringify(dbProfile));
      } catch (err) {
        const localProfile = localStorage.getItem("feedwise-profile");
        if (localProfile) {
          const parsed = JSON.parse(localProfile);
          setProfile((prev) => ({ ...prev, ...parsed }));
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate]);

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      localStorage.setItem("feedwise-profile", JSON.stringify(profile));

      if (token) {
        const res = await axios.put(
          "http://localhost:5000/api/auth/profile",
          { name: profile.name, bio: profile.bio },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = {
          name: res.data?.user?.name ?? profile.name,
          email: res.data?.user?.email ?? profile.email,
          bio: res.data?.user?.bio ?? profile.bio,
          joinedAt: res.data?.user?.createdAt ?? profile.joinedAt,
        };
        setProfile(updated);
        localStorage.setItem("feedwise-profile", JSON.stringify(updated));
      }

      setMessage("Profile saved to database.");
    } catch (err) {
      setMessage("Unable to sync with server right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-qb-bg dark:bg-qb-darkBg">
      <div className="mx-auto w-full max-w-[980px] px-4 py-6 md:px-6 md:py-10">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-sm font-semibold text-qb-muted transition hover:text-qb-text dark:text-qb-darkMuted dark:hover:text-qb-darkText"
          >
            ← Dashboard
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="h-10 rounded-full border border-qb-line bg-qb-surface px-4 text-sm font-semibold text-qb-muted shadow-sm transition hover:bg-slate-50 dark:border-qb-darkLine dark:bg-qb-darkSurface dark:text-qb-darkMuted dark:hover:bg-white/5"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <div className="rounded-qb bg-qb-surface p-6 shadow-qb dark:bg-qb-darkSurface md:p-8">
          <h1 className="text-2xl font-semibold text-qb-green">Profile</h1>
          <p className="mt-1 text-sm text-qb-muted dark:text-qb-darkMuted">
            Manage your account details.
          </p>

          {loading ? (
            <div className="mt-6 text-sm text-qb-muted dark:text-qb-darkMuted">
              Loading profile...
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                  Full name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Enter your name"
                  className="mt-2 h-11 w-full rounded-2xl border border-qb-line bg-white/70 px-4 text-sm outline-none transition focus:border-green-300 focus:bg-white dark:border-qb-darkLine dark:bg-white/5 dark:text-qb-darkText dark:focus:bg-white/10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  placeholder="Enter your email"
                  className="mt-2 h-11 w-full rounded-2xl border border-qb-line bg-slate-100 px-4 text-sm outline-none dark:border-qb-darkLine dark:bg-white/10 dark:text-qb-darkText"
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-medium text-qb-muted dark:text-qb-darkMuted">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, bio: e.target.value }))
                  }
                  placeholder="Add a short bio"
                  className="mt-2 min-h-[96px] w-full rounded-2xl border border-qb-line bg-white/70 p-4 text-sm outline-none transition focus:border-green-300 focus:bg-white dark:border-qb-darkLine dark:bg-white/5 dark:text-qb-darkText dark:focus:bg-white/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm text-qb-muted dark:text-qb-darkMuted md:grid-cols-2">
                <div className="rounded-2xl border border-qb-line bg-white/70 p-3 dark:border-qb-darkLine dark:bg-white/5">
                  Account type:{" "}
                  <span className="font-semibold text-qb-text dark:text-qb-darkText">
                    {token ? "User" : "Guest"}
                  </span>
                </div>
                <div className="rounded-2xl border border-qb-line bg-white/70 p-3 dark:border-qb-darkLine dark:bg-white/5">
                  Joined:{" "}
                  <span className="font-semibold text-qb-text dark:text-qb-darkText">
                    {profile.joinedAt
                      ? new Date(profile.joinedAt).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
              </div>

              {message ? (
                <div className="text-sm text-qb-muted dark:text-qb-darkMuted">
                  {message}
                </div>
              ) : null}

              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="h-11 rounded-full bg-qb-green px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save profile"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="h-11 rounded-full bg-slate-100 px-6 text-sm font-semibold text-qb-text transition hover:bg-slate-200 dark:bg-white/10 dark:text-qb-darkText dark:hover:bg-white/15"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

