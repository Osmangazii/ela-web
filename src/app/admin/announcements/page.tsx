"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type {
  AnnouncementBlock,
  AnnouncementCategory,
  AnnouncementItem,
} from "@/types/database";

const CATEGORIES: AnnouncementCategory[] = [
  "Official Notice",
  "General Assembly",
  "Article",
  "News",
];

const WIDTHS: { value: "full" | "md" | "sm"; label: string }[] = [
  { value: "full", label: "100%" },
  { value: "md", label: "60%" },
  { value: "sm", label: "30%" },
];

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-brand-pink";

function labelClass() {
  return "mb-1 block text-xs font-semibold text-slate-600";
}

function newId() {
  return `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function newBlock(type: AnnouncementBlock["type"]): AnnouncementBlock {
  switch (type) {
    case "text":
      return { id: newId(), type: "text", content_en: "", content_el: "" };
    case "image":
      return { id: newId(), type: "image", url: "", width: "full" };
    case "table":
      return { id: newId(), type: "table", headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "pdf":
      return { id: newId(), type: "pdf", title: "", url: "" };
  }
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleEl, setTitleEl] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("Official Notice");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [blocks, setBlocks] = useState<AnnouncementBlock[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadAnnouncements() {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
    } else if (data) {
      setAnnouncements((data as unknown as AnnouncementItem[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch callback only
    void loadAnnouncements();
  }, []);

  function resetForm() {
    setTitleEn("");
    setTitleEl("");
    setCategory("Official Notice");
    setDate(new Date().toISOString().slice(0, 10));
    setBlocks([]);
    setEditingId(null);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(item: AnnouncementItem) {
    setEditingId(item.id);
    setTitleEn(item.title_en);
    setTitleEl(item.title_el);
    setCategory((item.category as AnnouncementCategory) ?? "Official Notice");
    setDate(item.date ?? "");
    setBlocks(item.blocks ?? []);
    setShowForm(true);
  }

  function toggleForm() {
    if (showForm) {
      resetForm();
      setShowForm(false);
    } else {
      startCreate();
    }
  }

  function updateBlock(id: string, patch: Partial<AnnouncementBlock>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as AnnouncementBlock) : b)),
    );
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    setBlocks((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const supabase = createClient();
    const path = `announcements/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error: upErr } = await supabase.storage.from("announcements").upload(path, file, {
      upsert: true,
    });
    if (upErr) {
      setError(upErr.message);
      return null;
    }
    const { data } = supabase.storage.from("announcements").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleUpload(blockId: string, file: File) {
    setUploading(true);
    setError(null);
    const url = await uploadFile(file);
    if (url) updateBlock(blockId, { url } as Partial<AnnouncementBlock>);
    setUploading(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const payload = { title_en: titleEn, title_el: titleEl, category, date, blocks };
    const { error: err } = editingId
      ? await supabase.from("announcements").update(payload).eq("id", editingId)
      : await supabase.from("announcements").insert(payload);

    if (err) {
      setError(`Failed to save data. ${err.message}`);
      setSaving(false);
      return;
    }

    setNotice(editingId ? "Announcement updated successfully" : "Announcement created successfully");
    resetForm();
    setShowForm(false);
    setSaving(false);
    await loadAnnouncements();
  }

  async function handleDelete(item: AnnouncementItem) {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    const supabase = createClient();
    const { error: err } = await supabase.from("announcements").delete().eq("id", item.id);
    if (err) {
      setError(`Failed to delete data. ${err.message}`);
      return;
    }
    setNotice("Announcement deleted successfully");
    await loadAnnouncements();
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-brand-green">Announcements</h1>
          <p className="text-sm text-slate-500">Build announcements with flexible vertical blocks.</p>
        </div>
        <button
          type="button"
          onClick={toggleForm}
          className="rounded-full bg-brand-pink px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#ff637b] hover:shadow-md"
        >
          {showForm ? "Close" : "+ New Announcement"}
        </button>
      </header>

      {error && (
        <p className="mt-4 rounded-xl border border-brand-pink/40 bg-brand-pink/10 px-4 py-2.5 text-sm text-brand-green">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-2.5 text-sm text-brand-green">
          {notice}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basics */}
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-brand-pink-light bg-white p-6 md:grid-cols-2">
            <label className="block">
              <span className={labelClass()}>Title (EN) *</span>
              <input className={inputClass} required value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
            </label>
            <label className="block">
              <span className={labelClass()}>Title (EL)</span>
              <input className={inputClass} value={titleEl} onChange={(e) => setTitleEl(e.target.value)} />
            </label>
            <label className="block">
              <span className={labelClass()}>Category</span>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass()}>Date</span>
              <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>

          {/* Blocks */}
          <div className="space-y-4">
            {blocks.map((block, i) => (
              <div key={block.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {block.type} block
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" disabled={i === 0} onClick={() => moveBlock(i, -1)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30">▲</button>
                    <button type="button" disabled={i === blocks.length - 1} onClick={() => moveBlock(i, 1)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30">▼</button>
                    <button type="button" onClick={() => removeBlock(block.id)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">🗑</button>
                  </div>
                </div>

                {block.type === "text" && (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className={labelClass()}>Content (EN)</span>
                      <textarea className={`${inputClass} min-h-24 resize-y`} value={block.content_en} onChange={(e) => updateBlock(block.id, { content_en: e.target.value })} />
                    </label>
                    <label className="block">
                      <span className={labelClass()}>Content (EL)</span>
                      <textarea className={`${inputClass} min-h-24 resize-y`} value={block.content_el} onChange={(e) => updateBlock(block.id, { content_el: e.target.value })} />
                    </label>
                  </div>
                )}

                {block.type === "image" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {block.url && (
                        <span className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200">
                          <Image src={block.url} alt="Image preview" fill className="object-cover" sizes="112px" />
                        </span>
                      )}
                      <label className="flex h-20 w-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-2xl text-slate-400 hover:border-brand-pink hover:text-brand-pink">
                        <span>{uploading ? "…" : block.url ? "↺" : "+"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            if (f) void handleUpload(block.id, f);
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {WIDTHS.map((w) => (
                        <button
                          key={w.value}
                          type="button"
                          onClick={() => updateBlock(block.id, { width: w.value })}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            block.width === w.value ? "bg-brand-pink text-white" : "border border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === "table" && (
                  <div className="space-y-3 overflow-x-auto pb-2">
                    <table className="w-full min-w-120 text-sm">
                      <thead>
                        <tr>
                          {block.headers.map((h, c) => (
                            <th key={c} className="border border-slate-200 bg-slate-50/80 p-2 align-top">
                              <div className="flex items-center gap-1">
                                <input
                                  className="w-full min-w-0 rounded border border-slate-200 bg-slate-50/80 px-2 py-1 text-xs font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                  placeholder="Column header"
                                  value={h}
                                  onChange={(e) => {
                                    const headers = [...block.headers];
                                    headers[c] = e.target.value;
                                    updateBlock(block.id, { headers });
                                  }}
                                />
                                {block.headers.length > 1 && (
                                  <button
                                    type="button"
                                    title="Delete column"
                                    aria-label={`Delete column ${c + 1}`}
                                    onClick={() => {
                                      const headers = block.headers.filter((_, i) => i !== c);
                                      const rows = block.rows.map((row) => row.filter((_, i) => i !== c));
                                      updateBlock(block.id, { headers, rows });
                                    }}
                                    className="shrink-0 rounded p-0.5 text-slate-400 transition-colors hover:text-red-500"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </th>
                          ))}
                          <th className="w-10 border border-slate-200 bg-slate-50/80 p-1 align-top">
                            <button type="button" onClick={() => updateBlock(block.id, { headers: [...block.headers, "Column"] })} className="text-brand-pink">+</button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, r) => (
                          <tr key={r}>
                            {block.headers.map((_, c) => (
                              <td key={c} className="border border-slate-200 p-1">
                                <input
                                  className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                  value={row[c] ?? ""}
                                  onChange={(e) => {
                                    const rows = block.rows.map((x) => [...x]);
                                    rows[r][c] = e.target.value;
                                    updateBlock(block.id, { rows });
                                  }}
                                />
                              </td>
                            ))}
                            <td className="border border-slate-200 p-1 text-center">
                              <button type="button" onClick={() => updateBlock(block.id, { rows: block.rows.filter((_, idx) => idx !== r) })} className="text-slate-400 hover:text-brand-pink">✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button type="button" onClick={() => updateBlock(block.id, { rows: [...block.rows, block.headers.map(() => "")] })} className="text-sm font-semibold text-brand-pink hover:text-brand-green">
                      + Add Row
                    </button>
                  </div>
                )}

                {block.type === "pdf" && (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className={labelClass()}>Document title</span>
                      <input className={inputClass} value={block.title} onChange={(e) => updateBlock(block.id, { title: e.target.value })} />
                    </label>
                    <div>
                      <span className={labelClass()}>PDF file</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="block w-full text-xs text-slate-500"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          if (f) void handleUpload(block.id, f);
                        }}
                      />
                      {block.url && <p className="mt-1 truncate text-xs text-slate-400">{block.url}</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add block bar */}
          <div className="flex flex-wrap gap-2">
            {(["text", "image", "table", "pdf"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setBlocks((prev) => [...prev, newBlock(type)])}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-pink hover:text-brand-pink"
              >
                + {type === "text" ? "Text" : type === "image" ? "Image" : type === "table" ? "Table" : "PDF"}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-60">
              {saving ? "Saving…" : editingId ? "Update Announcement" : "Create Announcement"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Loading announcements…</p>
      ) : announcements.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No announcements yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {announcements.map((item) => (
            <li key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900">{item.title_en}</p>
                <p className="truncate text-xs text-slate-500">
                  {item.category} · {item.date} · {(item.blocks ?? []).length} block(s)
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => startEdit(item)} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                <button type="button" onClick={() => handleDelete(item)} className="rounded-full border border-brand-pink/40 bg-white px-4 py-1.5 text-sm font-semibold text-brand-pink hover:bg-brand-pink hover:text-white">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
