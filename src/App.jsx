function TrashPage() {
  const [trashFiles, setTrashFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchTrash = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/trash`);
    const data = await res.json();
    setTrashFiles(data);
    setLoading(false);
  };
  React.useEffect(() => { fetchTrash(); }, []);
  const handleRestore = async (id) => {
    await fetch(`${API_URL}/api/trash/restore/${id}`, { method: "POST" });
    fetchTrash();
  };
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/trash/delete/${id}`, { method: "DELETE" });
    fetchTrash();
  };
  const handleClear = async () => {
    await fetch(`${API_URL}/api/trash/clear`, { method: "DELETE" });
    fetchTrash();
  };
  return (
    <div className={`${neon.border} ${neon.glow} rounded-2xl p-6 bg-slate-900/50`}>
      <PageHeader title="Trash" subtitle="Items are deleted after 30 days" />
      <button onClick={handleClear} className="mb-4 px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700">Clear All</button>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : trashFiles.length === 0 ? (
        <EmptyState onUploadClick={() => {}} />
      ) : (
        <div className="space-y-3">
          {trashFiles.map(f => (
            <div key={f.fileId} className="flex items-center justify-between bg-slate-800/60 rounded-xl p-4 border border-white/10">
              <div>
                <div className="font-mono text-blue-200">{f.filename}</div>
                <div className="text-xs text-slate-400">Deleted: {new Date(f.deletedAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRestore(f.fileId)} className="px-3 py-1 rounded bg-cyan-600 text-white hover:bg-cyan-700">Restore</button>
                <button onClick={() => handleDelete(f.fileId)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FolderOpen,
  Share2,
  Trash2,
  Settings,
  Search,
  Upload,
  Grid,
  List,
  FileText,
  Image as ImageIcon,
  Music2,
  FileArchive,
  Link,
  MoreVertical,
  Moon,
  Sun
} from "lucide-react";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/login`, { username, password });
      if (res.data.success) {
        onLogin(username);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-sky-800 to-slate-900">
      <div className="w-full max-w-md p-8 rounded-2xl neon-glow bg-slate-950/80 border border-blue-400/30">
        <h1 className="text-3xl font-bold text-blue-300 mb-6 text-center">Neon Drive Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 rounded bg-slate-800 text-blue-200 border border-blue-400/30 focus:outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 rounded bg-slate-800 text-blue-200 border border-blue-400/30 focus:outline-none" />
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg">Login</button>
        </form>
      </div>
    </div>
  );
}

function SettingsPage({ username }) {
  const [masked, setMasked] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const handleChange = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/change-password`, { username, oldPassword, newPassword });
      if (res.data.success) {
        setSuccess("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  };
  return (
    <div className="max-w-lg mx-auto mt-12 p-8 rounded-xl bg-slate-900/80 border border-blue-400/30 shadow-xl">
      <h2 className="text-2xl font-bold text-blue-300 mb-4">Account Settings</h2>
      <div className="mb-4">
        <div className="text-lg text-blue-200">Username: <span className="font-mono">{username}</span></div>
        <div className="text-lg text-blue-200">Password: <span className="font-mono">{masked ? "••••••••" : "(hidden)"}</span></div>
        <button className="text-xs text-blue-400 underline" onClick={() => setMasked(!masked)}>{masked ? "Show" : "Hide"} Password</button>
      </div>
      <form onSubmit={handleChange} className="space-y-3">
        <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full px-4 py-2 rounded bg-slate-800 text-blue-200 border border-blue-400/30 focus:outline-none" />
        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 rounded bg-slate-800 text-blue-200 border border-blue-400/30 focus:outline-none" />
        <button type="submit" className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg">Change Password</button>
        {success && <div className="text-green-400 text-sm text-center">{success}</div>}
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
      </form>
    </div>
  );
}

const neon = {
  ring: "ring-2 ring-blue-400/40",
  glow: "shadow-[0_0_30px_rgba(34,211,238,0.25)]",
  text: "text-blue-300",
  border: "border border-blue-400/30",
};

const pages = [
  { key: "home", label: "Home", icon: Home },
  { key: "files", label: "My Files", icon: FolderOpen },
  { key: "shared", label: "Shared", icon: Share2 },
  { key: "trash", label: "Trash", icon: Trash2 },
  { key: "settings", label: "Settings", icon: Settings },
];

const extToIcon = (ext) => {
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return ImageIcon;
    case "mp3":
    case "wav":
      return Music2;
    case "zip":
    case "rar":
      return FileArchive;
    case "txt":
    case "pdf":
    default:
      return FileText;
  }
};

const MAX_SPACE = 1024 * 1024 * 1024; // 1GB

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function TopBar({ onUploadClick, search, setSearch, view, setView, dark, setDark }) {
  return (
    <div className={`sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 bg-slate-900/70 ${neon.border} ${neon.glow} rounded-2xl p-3 flex items-center gap-3`}>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/70 border border-white/5 flex-1">
        <Search className="size-4 opacity-70" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files, tags, people…"
          className="bg-transparent outline-none w-full placeholder:text-slate-400"
        />
      </div>
      <button
        onClick={onUploadClick}
        className={`group relative overflow-hidden px-4 py-2 rounded-xl font-medium ${neon.ring} ${neon.glow} bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 hover:from-cyan-500/30 hover:to-fuchsia-500/30`}
      >
        <span className="inline-flex items-center gap-2">
          <Upload className="size-4" /> Upload
        </span>
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("grid")}
          className={`p-2 rounded-xl border ${view === "grid" ? "border-cyan-400/50" : "border-white/5"}`}
          aria-label="Grid view"
        >
          <Grid className="size-4" />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-2 rounded-xl border ${view === "list" ? "border-cyan-400/50" : "border-white/5"}`}
          aria-label="List view"
        >
          <List className="size-4" />
        </button>
  {/* Removed dark mode button */}
      </div>
    </div>
  );
}

function Sidebar({ current, setCurrent, usedSpace }) {
  return (
    <aside className="h-full w-64 hidden md:flex md:flex-col gap-2 pr-2">
      <div className={`rounded-2xl p-4 bg-slate-900/60 border border-white/5 ${neon.glow}`}>
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">H A R I C L O U D</div>
        <div className="text-xl font-semibold leading-tight">
          <span className="text-white">Neon</span>
          <span className={`ml-2 ${neon.text}`}>Drive</span>
        </div>
        <div className="mt-1 text-xs text-slate-400">Futuristic Cloud Storage</div>
      </div>
      <nav className={`rounded-2xl p-2 bg-slate-900/60 border border-white/5 ${neon.glow} flex-1`}>
        {pages.map((p) => (
          <button
            key={p.key}
            onClick={() => setCurrent(p.key)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:bg-white/5 transition ${
              current === p.key ? "bg-white/10 border border-cyan-400/30" : "border border-transparent"
            }`}
          >
            <p.icon className={`size-4 ${current === p.key ? neon.text : "text-slate-300"}`} />
            <span className="text-slate-200">{p.label}</span>
          </button>
        ))}
      </nav>
      <div className="rounded-2xl p-4 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 border border-white/10">
        <div className="text-sm text-slate-300">Storage</div>
        <div className="mt-2 w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div className="h-2 bg-cyan-400/60" style={{ width: `${(usedSpace / MAX_SPACE) * 100}%` }} />
        </div>
        <div className="mt-2 text-xs text-slate-400">{formatSize(usedSpace)} of 1 GB used</div>
      </div>
    </aside>
  );
}

function UploadDropzone({ onFiles, usedSpace }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    const arr = Array.from(files);
    const totalSize = arr.reduce((sum, f) => sum + f.size, 0);
    if (usedSpace + totalSize > MAX_SPACE) {
      setError("Storage limit exceeded. Max 1GB allowed.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(0);
    let uploaded = 0;
    for (const file of arr) {
      await new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        const xhr = new XMLHttpRequest();
  const API_URL = import.meta.env.VITE_API_URL;
  xhr.open("POST", `${API_URL}/api/upload`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round(((uploaded + e.loaded) / totalSize) * 100));
          }
        };
        xhr.onload = () => {
          uploaded += file.size;
          setProgress(Math.round((uploaded / totalSize) * 100));
          resolve();
        };
        xhr.onerror = reject;
        xhr.send(formData);
      });
    }
    setUploading(false);
    setProgress(0);
    await onFiles(arr);
  };

  return (
    <label
      htmlFor="file-input"
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
      }}
      className={`relative grid place-items-center w-full h-40 rounded-2xl border-2 border-dashed ${drag ? "border-cyan-400/70" : "border-white/15"} bg-slate-900/50 hover:border-cyan-400/40 transition ${neon.glow}`}
    >
      <input
        id="file-input"
        ref={ref}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <div className="text-center px-6">
        <div className={`text-sm ${neon.text} font-medium`}>Drop files here or click to upload</div>
        <div className="text-xs text-slate-400 mt-1">PNG, JPG, PDF, ZIP, MP3…</div>
        {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
        {uploading && (
          <div className="mt-3 w-full flex flex-col items-center">
            <div className="w-2/3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-2 bg-cyan-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-cyan-300 mt-1">Uploading… {progress}%</div>
          </div>
        )}
      </div>
    </label>
  );
}

function FileCard({ file, view = "grid", onDelete }) {
  const Icon = extToIcon((file.filename || "").split(".").pop());
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`group ${neon.border} ${neon.glow} rounded-2xl bg-slate-900/50 hover:bg-slate-900/70 transition relative`}
    >
      {view === "grid" ? (
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-xl bg-slate-800/80 border border-white/5 group-hover:border-cyan-400/30 transition`}>
              <Icon className={`size-5 ${neon.text}`} />
            </div>
            <div className="relative">
              <button className="p-1 rounded-lg hover:bg-white/10" onClick={() => setMenuOpen((v) => !v)}>
                <MoreVertical className="size-4 text-slate-300" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-cyan-400/20 rounded-xl shadow-lg z-10">
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-cyan-400/10"
                    onClick={() => {
                      const API_URL = import.meta.env.VITE_API_URL;
                      window.open(`${API_URL}/api/download/${file.id}`);
                      setMenuOpen(false);
                    }}
                  >Download</button>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-red-400/10 text-red-400"
                    onClick={async () => {
                      const API_URL = import.meta.env.VITE_API_URL;
                      await fetch(`${API_URL}/api/delete/${file.id}`, { method: "DELETE" });
                      setMenuOpen(false);
                      if (onDelete) onDelete();
                    }}
                  >Delete</button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 font-medium text-slate-100 truncate" title={file.filename}>{file.filename}</div>
          <div className="text-xs text-slate-400 mt-1">{formatSize(file.length)}</div>
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-slate-400">
            <Link className="size-3" />
            {file.source === "local" ? "Local file" : "MongoDB"}
          </div>
        </div>
      ) : (
        <div className="p-3 grid grid-cols-12 items-center gap-3">
          <div className="col-span-6 md:col-span-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800/80 border border-white/5">
              <Icon className={`size-4 ${neon.text}`} />
            </div>
            <div className="truncate">
              <div className="font-medium text-slate-100 truncate" title={file.filename}>{file.filename}</div>
              <div className="text-xs text-slate-400">Uploaded {new Date(file.uploadDate).toLocaleString()}</div>
            </div>
          </div>
          <div className="col-span-3 text-xs text-slate-300">{formatSize(file.length)}</div>
          <div className="col-span-2 text-xs text-slate-400">{file.source === "local" ? "Local file" : "MongoDB"}</div>
          <div className="col-span-1 justify-self-end relative">
            <button className="p-2 rounded-xl hover:bg-white/10" onClick={() => setMenuOpen((v) => !v)}>
              <MoreVertical className="size-4 text-slate-300" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-cyan-400/20 rounded-xl shadow-lg z-10">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-cyan-400/10"
                  onClick={() => {
                    const API_URL = import.meta.env.VITE_API_URL;
                    window.open(`${API_URL}/api/download/${file.id}`);
                    setMenuOpen(false);
                  }}
                >Download</button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-red-400/10 text-red-400"
                  onClick={async () => {
                    const API_URL = import.meta.env.VITE_API_URL;
                    await fetch(`${API_URL}/api/delete/${file.id}`, { method: "DELETE" });
                    setMenuOpen(false);
                    if (onDelete) onDelete();
                  }}
                >Delete</button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function EmptyState({ onUploadClick }) {
  return (
    <div className="grid place-items-center h-64 rounded-2xl bg-slate-900/40 border border-white/5">
      <div className="text-center">
        <div className={`text-lg font-semibold ${neon.text}`}>Your cloud is zen-empty</div>
        <div className="text-slate-400 text-sm mt-1">Drag files here or use the Upload button</div>
        <button
          onClick={onUploadClick}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-400/30 hover:bg-white/5"
        >
          <Upload className="size-4" /> Upload files
        </button>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <div className={`text-xl font-semibold ${neon.text}`}>{title}</div>
      {subtitle && <div className="text-sm text-slate-400 mt-1">{subtitle}</div>}
    </div>
  );
}

function ContentArea({ page, files, setFiles, view, search, usedSpace, refreshFiles }) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? files.filter((f) => f.filename.toLowerCase().includes(q))
      : files;
  }, [files, search]);

  if (page === "settings") {
    return (
      <div className={`${neon.border} ${neon.glow} rounded-2xl p-6 bg-slate-900/50`}>
        <PageHeader title="Settings" subtitle="Personalize your NeonDrive experience" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 bg-slate-800/50 border border-white/5">
            <div className="font-medium text-slate-200">Account</div>
            <div className="text-sm text-slate-400 mt-1">Email, password, two-factor</div>
          </div>
          <div className="rounded-xl p-4 bg-slate-800/50 border border-white/5">
            <div className="font-medium text-slate-200">Integrations</div>
            <div className="text-sm text-slate-400 mt-1">Connect Netlify Functions / MongoDB Atlas</div>
          </div>
        </div>
      </div>
    );
  }
  if (page === "shared") {
    return (
      <div className={`${neon.border} ${neon.glow} rounded-2xl p-6 bg-slate-900/50`}>
        <PageHeader title="Shared with me" subtitle="Files and folders others shared with you" />
        <EmptyState onUploadClick={() => {}} />
      </div>
    );
  }
  if (page === "trash") {
    return <TrashPage />;
  }
  // Home & Files
  return (
    <div className="space-y-4">
      <div className={`${neon.border} ${neon.glow} rounded-2xl p-6 bg-slate-900/50`}>
        <PageHeader
          title={page === "home" ? "Quick Upload" : "Upload"}
          subtitle={page === "home" ? "Add recent documents, images, music and more" : "Drag & drop to add new files"}
        />
        <UploadDropzone onFiles={async (arr) => {
          for (const file of arr) {
            const formData = new FormData();
            formData.append("file", file);
            const API_URL = import.meta.env.VITE_API_URL;
            await fetch(`${API_URL}/api/upload`, {
              method: "POST",
              body: formData,
            });
          }
          await refreshFiles();
        }} usedSpace={usedSpace} />
      </div>
      <div className={`${neon.border} ${neon.glow} rounded-2xl p-6 bg-slate-900/50`}>
        <PageHeader
          title={page === "home" ? "Recent Files" : "My Files"}
          subtitle={filtered.length ? `${filtered.length} item(s)` : "No files match your search"}
        />
        {filtered.length === 0 ? (
          <EmptyState onUploadClick={() => {}} />
        ) : view === "grid" ? (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((f) => (
                <FileCard key={f.id} file={f} view="grid" onDelete={refreshFiles} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {filtered.map((f) => (
                <FileCard key={f.id} file={f} view="list" onDelete={refreshFiles} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [current, setCurrent] = useState("home");
  const [files, setFiles] = useState([]);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [usedSpace, setUsedSpace] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const refreshFiles = async () => {
    const res = await fetch(`${API_URL}/api/files`);
    const data = await res.json();
    setFiles(data);
    setUsedSpace(data.reduce((sum, f) => sum + (f.length || 0), 0));
  };

  useEffect(() => {
    if (loggedIn) refreshFiles();
  }, [loggedIn]);

  if (!loggedIn) {
    return <LoginPage onLogin={uname => { setLoggedIn(true); setUsername(uname); }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-3 md:gap-6">
          <Sidebar current={current} setCurrent={setCurrent} usedSpace={usedSpace} />
          <main className="space-y-3 md:space-y-4">
            <TopBar
              onUploadClick={() => setCurrent("files")}
              search={search}
              setSearch={setSearch}
              view={view}
              setView={setView}
            />
            {current === "settings" ? (
              <SettingsPage username={username} />
            ) : (
              <ContentArea
                page={current}
                files={files}
                setFiles={setFiles}
                view={view}
                search={search}
                usedSpace={usedSpace}
                refreshFiles={refreshFiles}
              />
            )}
            <div className={`${neon.border} ${neon.glow} rounded-2xl p-4 bg-slate-900/50 flex items-center justify-between`}>
              <div className="text-sm text-slate-400">Deploy on Netlify and connect MongoDB Atlas via serverless functions.</div>
              <a
                href="#"
                className="px-3 py-1.5 rounded-xl border border-cyan-400/30 hover:bg-white/5 text-sm"
              >
                Docs
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
