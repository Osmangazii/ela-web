"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import SortableList from "@/components/admin/SortableList";
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
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-brand-pink";

function labelClass() {
  return "mb-1 block text-xs font-semibold text-slate-600";
}

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
  const [notice, setNotice] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [initialOrder, setInitialOrder] = useState<EventItem[]>([]);

  async function loadEvents() {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("events")
      .select("*")
      .order("order_index", { ascending: true });
    if (err) {
      setError(err.message);
    } else if (data) {
      const list = (data as unknown as EventItem[]) ?? [];
      setEvents(list);
      setInitialOrder(list);
      setOrderChanged(false);
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

  // A single native date picker drives both language date columns.
  function updateDate(value: string) {
    setForm((prev) => ({ ...prev, date_en: value, date_el: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImages([]);
    setEditingId(null);
    setEditingTitle("");
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(event: EventItem) {
    setForm({
      title_en: event.title_en,
      title_el: event.title_el,
      date_en: event.date_en,
      date_el: event.date_el,
      location_en: event.location_en,
      location_el: event.location_el,
      theme_color: event.theme_color ?? DEFAULT_THEME,
      col1_en: event.col1_en ?? "",
      col1_el: event.col1_el ?? "",
      col2_en: event.col2_en ?? "",
      col2_el: event.col2_el ?? "",
    });
    setImages(event.images ?? []);
    setEditingId(event.id);
    setEditingTitle(event.title_en);
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
    setNotice(null);

    const supabase = createClient();
    // Order is derived from the drag-and-drop list, not a manual input.
    const existing = events.find((ev) => ev.id === editingId);
    const orderValue = existing ? (existing.order_index ?? 0) : events.length;
    const payload = {
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
      order_index: orderValue,
    };

    const { error: err } = editingId
      ? await supabase.from("events").update(payload).eq("id", editingId)
      : await supabase.from("events").insert(payload);

    if (err) {
      setError(`Failed to save data. ${err.message}`);
      setSaving(false);
      return;
    }

    setNotice(editingId ? "Event updated successfully" : "Event created successfully");
    resetForm();
    setShowForm(false);
    setSaving(false);
    await loadEvents();
  }

  function handleReorder(next: EventItem[]) {
    // Optimistic local reorder only — persistence happens via "Save Order".
    const reordered = next.map((ev, i) => ({ ...ev, order_index: i }));
    setEvents(reordered);
    setNotice(null);
    setOrderChanged(true);
  }

  async function handleSaveOrder() {
    if (!orderChanged || savingOrder) return;
    setSavingOrder(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const results = await Promise.all(
      events.map((event, index) =>
        supabase.from("events").update({ order_index: index }).eq("id", event.id),
      ),
    );
    const hasError = results.some((res) => res.error);

    if (hasError) {
      setError("Failed to update one or more items.");
      setSavingOrder(false);
      return;
    }

    setInitialOrder(events);
    setOrderChanged(false);
    setNotice("Order saved successfully.");
    setSavingOrder(false);
  }

  function handleResetOrder() {
    if (!orderChanged) return;
    setEvents(initialOrder);
    setOrderChanged(false);
    setNotice(null);
  }

  async function handleDelete(event: EventItem) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const supabase = createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    console.log("Active session:", session, "Session error:", sessionError);
    if (!session) {
      alert("No active session! Please sign out and sign in again.");
      return;
    }

    const paths = (event.images ?? [])
      .map(storagePathFromUrl)
      .filter((p): p is string => p !== null);
    if (paths.length > 0) {
      await supabase.storage.from("media").remove(paths);
    }

    const { data, error: err, count } = await supabase
      .from("events")
      .delete({ count: "exact" })
      .eq("id", event.id)
      .select();
    console.log("Delete response:", { data, error: err, count });

    if (err) {
      setError(`Failed to delete data. ${err.message}`);
      return;
    }
    if (!data || data.length === 0) {
      alert("Record could not be deleted! A permission/RLS rule may be blocking it.");
      return;
    }

    setNotice("Event deleted successfully");
    setEvents((prev) => prev.filter((item) => item.id !== event.id));
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
          onClick={toggleForm}
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
      {notice && (
        <p className="mt-4 rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-2.5 text-sm text-brand-green">
          {notice}
        </p>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-brand-pink-light bg-white p-6"
        >
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {editingId ? `Edit Event: ${editingTitle}` : "Create Event"}
          </h2>

          {/* Side-by-side EN / EL columns */}
          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* English */}
            <div className="space-y-4 rounded-2xl border border-black/5 bg-slate-50/50 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">English Details (EN)</h3>
              <label className="block">
                <span className={labelClass()}>Title (EN) *</span>
                <input className={inputClass} required value={form.title_en} onChange={(e) => update("title_en", e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass()}>Location (EN) *</span>
                <input className={inputClass} required value={form.location_en} onChange={(e) => update("location_en", e.target.value)} placeholder="e.g. Athens, Benaki Museum" />
              </label>
              <label className="block">
                <span className={labelClass()}>Description 1 (EN)</span>
                <textarea className={`${inputClass} min-h-24 resize-y`} value={form.col1_en} onChange={(e) => update("col1_en", e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass()}>Description 2 (EN)</span>
                <textarea className={`${inputClass} min-h-24 resize-y`} value={form.col2_en} onChange={(e) => update("col2_en", e.target.value)} />
              </label>
            </div>

            {/* Greek */}
            <div className="space-y-4 rounded-2xl border border-brand-pink-light bg-brand-pink-light/20 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-pink">Greek Details (EL)</h3>
              <label className="block">
                <span className={labelClass()}>Title (EL) *</span>
                <input className={inputClass} required value={form.title_el} onChange={(e) => update("title_el", e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass()}>Location (EL) *</span>
                <input className={inputClass} required value={form.location_el} onChange={(e) => update("location_el", e.target.value)} placeholder="π.χ. Αθήνα, Μουσείο Μπενάκη" />
              </label>
              <label className="block">
                <span className={labelClass()}>Description 1 (EL)</span>
                <textarea className={`${inputClass} min-h-24 resize-y`} value={form.col1_el} onChange={(e) => update("col1_el", e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass()}>Description 2 (EL)</span>
                <textarea className={`${inputClass} min-h-24 resize-y`} value={form.col2_el} onChange={(e) => update("col2_el", e.target.value)} />
              </label>
            </div>
          </div>

          {/* Shared fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block">
              <span className={labelClass()}>Event Date *</span>
              <input
                type="date"
                className={inputClass}
                required
                value={form.date_en}
                onChange={(e) => updateDate(e.target.value)}
              />
              <span className="mt-1 block text-xs text-slate-400">
                Applies to both language versions (YYYY-MM-DD).
              </span>
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

            <div className="md:col-span-2">
              <span className={labelClass()}>Cover Image (and gallery)</span>
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <span key={url} className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200">
                    <Image src={url} alt="Event image preview" fill className="object-cover" sizes="112px" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        COVER
                      </span>
                    )}
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
              <p className="mt-1.5 text-xs text-slate-400">
                The first image is used as the cover. You can select several files at once.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
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
              {saving ? "Saving…" : editingId ? "Update Event" : "Create Event"}
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
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">Drag the handle to reorder, then save your changes.</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetOrder}
                disabled={!orderChanged || savingOrder}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={!orderChanged || savingOrder}
                className="rounded-full bg-brand-pink px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#ff637b] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingOrder ? "Saving…" : "Save Order"}
              </button>
            </div>
          </div>
          <SortableList
            items={events}
            onReorder={handleReorder}
            renderItem={(event: EventItem, handle) => (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4">
                {handle}

                <span className="relative block h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {event.images && event.images.length > 0 ? (
                    <Image src={event.images[0]} alt="" fill className="object-cover" sizes="64px" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
                      —
                    </span>
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">{event.title_en}</p>
                  <p className="truncate text-xs text-slate-500">
                    {event.title_el} · {event.date_en}
                  </p>
                </div>

                <span
                  className="hidden h-6 w-6 shrink-0 rounded-full border border-white shadow sm:block"
                  style={{ backgroundColor: event.theme_color ?? DEFAULT_THEME }}
                  title="Theme color"
                />

                <div className="flex shrink-0 justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(event)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(event)}
                    className="rounded-full border border-brand-pink/40 bg-white px-4 py-1.5 text-sm font-semibold text-brand-pink transition-colors hover:bg-brand-pink hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}
