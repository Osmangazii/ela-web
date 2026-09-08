"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { EventItem } from "@/types/database";

const DEFAULT_THEME = "#165823";

interface FormState {
  title_en: string;
  title_el: string;
  date_en: string;
  date_el: string;
  location_en: string;
  location_el: string;
  theme_color: string;
  col1_en: string;
  col1_el: string;
  col2_en: string;
  col2_el: string;
  order_index: number;
}

const EMPTY_FORM: FormState = {
  title_en: "",
  title_el: "",
  date_en: "",
  date_el: "",
  location_en: "",
  location_el: "",
  theme_color: DEFAULT_THEME,
  col1_en: "",
  col1_el: "",
  col2_en: "",
  col2_el: "",
  order_index: 0,
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-brand-pink";

function labelClass() {
  return "mb-1 block text-xs font-semibold text-slate-600";
}

/** Extract the storage object path from a public URL, if possible. */
function storagePathFromUrl(url: string): string | null {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length);
  return path || null;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadEvents() {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("events")
      .select("*")
      .order("order_index", { ascending: true });
    if (err) {
      setError(err.message);
    } else if (data) {
      setEvents((data as unknown as EventItem[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch callback only
    void loadEvents();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImages([]);
  }

  async function uploadFile(file: File): Promise<string | null> {
    const supabase = createClient();
    const path = `events/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
      upsert: true,
    });
    if (upErr) {
      setError(upErr.message);
      return null;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    const uploaded: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) uploaded.push(url);
    }
    if (uploaded.length > 0) {
      setImages((prev) => [...prev, ...uploaded]);
    }
    setUploading(false);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase.from("events").insert({
      title_en: form.title_en,
      title_el: form.title_el,
      date_en: form.date_en,
      date_el: form.date_el,
      location_en: form.location_en,
      location_el: form.location_el,
      theme_color: form.theme_color || DEFAULT_THEME,
      images,
      col1_en: form.col1_en || null,
      col1_el: form.col1_el || null,
      col2_en: form.col2_en || null,
      col2_el: form.col2_el || null,
      order_index: form.order_index,
    });

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    resetForm();
    setShowForm(false);
    setSaving(false);
    await loadEvents();
  }

  async function handleDelete(event: EventItem) {
    if (!window.confirm(`Delete event "${event.title_en}" permanently?`)) return;

    const supabase = createClient();

    // Best-effort cleanup of the event images in the 'media' bucket.
    const paths = (event.images ?? [])
      .map(storagePathFromUrl)
      .filter((p): p is string => p !== null);
    if (paths.length > 0) {
      await supabase.storage.from("media").remove(paths);
    }

    const { error: err } = await supabase.from("events").delete().eq("id", event.id);
    if (err) {
      setError(err.message);
      return;
    }
    await loadEvents();
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-brand-green">Events Management</h1>
          <p className="text-sm text-slate-500">Create and manage the association&apos;s event stories.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-brand-pink px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#ff637b] hover:shadow-md"
        >
          {showForm ? "Close" : "+ New Event"}
        </button>
      </header>

      {error && (
        <p className="mt-4 rounded-xl border border-brand-pink/40 bg-brand-pink/10 px-4 py-2.5 text-sm text-brand-green">
          {error}
        </p>
      )}

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-brand-pink-light bg-white p-6 md:grid-cols-2"
        >
          <label className="block">
            <span className={labelClass()}>Title (EN) *</span>
            <input className={inputClass} required value={form.title_en} onChange={(e) => update("title_en", e.target.value)} />
          </label>
          <label className="block">
            <span className={labelClass()}>Title (EL) *</span>
            <input className={inputClass} required value={form.title_el} onChange={(e) => update("title_el", e.target.value)} />
          </label>
          <label className="block">
            <span className={labelClass()}>Date (EN) *</span>
            <input className={inputClass} required value={form.date_en} onChange={(e) => update("date_en", e.target.value)} placeholder="e.g. March 2023" />
          </label>
          <label className="block">
            <span className={labelClass()}>Date (EL) *</span>
            <input className={inputClass} required value={form.date_el} onChange={(e) => update("date_el", e.target.value)} placeholder="π.χ. Μάρτιος 2023" />
          </label>
          <label className="block">
            <span className={labelClass()}>Location (EN) *</span>
            <input className={inputClass} required value={form.location_en} onChange={(e) => update("location_en", e.target.value)} placeholder="e.g. Athens, Benaki Museum" />
          </label>
          <label className="block">
            <span className={labelClass()}>Location (EL) *</span>
            <input className={inputClass} required value={form.location_el} onChange={(e) => update("location_el", e.target.value)} placeholder="π.χ. Αθήνα, Μουσείο Μπενάκη" />
          </label>
          <label className="block">
            <span className={labelClass()}>Theme color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.theme_color}
                onChange={(e) => update("theme_color", e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white"
              />
              <span className="text-xs text-slate-500">{form.theme_color}</span>
            </div>
          </label>
          <label className="block">
            <span className={labelClass()}>Order index</span>
            <input
              className={inputClass}
              type="number"
              value={form.order_index}
              onChange={(e) => update("order_index", Number(e.target.value))}
            />
          </label>
          <label className="block">
            <span className={labelClass()}>Column 1 (EN)</span>
            <textarea className={`${inputClass} min-h-24 resize-y`} value={form.col1_en} onChange={(e) => update("col1_en", e.target.value)} />
          </label>
          <label className="block">
            <span className={labelClass()}>Column 1 (EL)</span>
            <textarea className={`${inputClass} min-h-24 resize-y`} value={form.col1_el} onChange={(e) => update("col1_el", e.target.value)} />
          </label>
          <label className="block">
            <span className={labelClass()}>Column 2 (EN)</span>
            <textarea className={`${inputClass} min-h-24 resize-y`} value={form.col2_en} onChange={(e) => update("col2_en", e.target.value)} />
          </label>
          <label className="block">
            <span className={labelClass()}>Column 2 (EL)</span>
            <textarea className={`${inputClass} min-h-24 resize-y`} value={form.col2_el} onChange={(e) => update("col2_el", e.target.value)} />
          </label>

          <div className="md:col-span-2">
            <span className={labelClass()}>Images (multiple)</span>
            <div className="flex flex-wrap gap-3">
              {images.map((url) => (
                <span key={url} className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200">
                  <Image src={url} alt="Upload preview" fill className="object-cover" sizes="112px" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-xs text-white hover:bg-brand-pink"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <label className="flex h-20 w-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-2xl text-slate-400 hover:border-brand-pink hover:text-brand-pink">
                <span>{uploading ? "…" : "+"}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </label>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">You can select several files at once.</p>
          </div>

          <div className="flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save event"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Loading events…</p>
      ) : events.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No events yet. Create your first one above.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
          <table className="w-full min-w-220 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title (EN / EL)</th>
                <th className="px-4 py-3">Date (EN / EL)</th>
                <th className="px-4 py-3">Location (EN / EL)</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-slate-50 last:border-0 hover:bg-brand-bg/40">
                  <td className="px-4 py-3">
                    {event.images && event.images.length > 0 ? (
                      <span className="relative block h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                        <Image src={event.images[0]} alt="" fill className="object-cover" sizes="64px" />
                      </span>
                    ) : (
                      <span className="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{event.title_en}</p>
                    <p className="text-xs text-slate-500">{event.title_el}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{event.date_en}</p>
                    <p className="text-xs text-slate-500">{event.date_el}</p>
                  </td>
                  <td className="max-w-52 px-4 py-3">
                    <p className="truncate text-slate-700">{event.location_en}</p>
                    <p className="truncate text-xs text-slate-500">{event.location_el}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{event.order_index}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(event)}
                      className="rounded-full border border-brand-pink/40 bg-white px-4 py-1.5 text-sm font-semibold text-brand-pink transition-colors hover:bg-brand-pink hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
