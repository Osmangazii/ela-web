"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicAction } from "../actions";
import SortableList from "@/components/admin/SortableList";
import type { EventItem } from "@/types/database";

const DEFAULT_THEME = "#2D1C36";

/** The four official ELA event categories. */
const CATEGORIES = [
  "Student events",
  "Professional learning",
  "Family and community learning",
  "International exchange",
] as const;

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
  // Catalogue fields
  is_archived: boolean;
  event_date: string;
  location_or_online: string;
  target_audience: string;
  language: string;
  educational_purpose: string;
  category: string;
  registration_url: string;
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
  is_archived: false,
  event_date: "",
  location_or_online: "",
  target_audience: "",
  language: "",
  educational_purpose: "",
  category: "",
  registration_url: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-brand-coral";

function labelClass() {
  return "mb-1 block text-xs font-semibold text-slate-600";
}

/** Trim optional text; empty/whitespace becomes null so Supabase accepts it cleanly. */
function orNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Surface a helpful hint when the failure is a stale PostgREST schema cache
 * (i.e. a new column exists in the DB but not in the API's column list).
 */
function dbErrorHint(message: string): string {
  if (/schema cache|could not find the .* column|does not exist/i.test(message)) {
    return `${message} — Hint: apply supabase/migrations/0005_events_catalog.sql (or supabase/reload_schema.sql) and run "NOTIFY pgrst, 'reload schema';".`;
  }
  return message;
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
      is_archived: event.is_archived ?? false,
      event_date: event.event_date ?? "",
      location_or_online: event.location_or_online ?? "",
      target_audience: event.target_audience ?? "",
      language: event.language ?? "",
      educational_purpose: event.educational_purpose ?? "",
      category: event.category ?? "",
      registration_url: event.registration_url ?? "",
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
      col1_en: orNull(form.col1_en),
      col1_el: orNull(form.col1_el),
      col2_en: orNull(form.col2_en),
      col2_el: orNull(form.col2_el),
      order_index: orderValue,
      is_archived: form.is_archived,
      event_date: orNull(form.event_date),
      location_or_online: orNull(form.location_or_online),
      target_audience: orNull(form.target_audience),
      language: orNull(form.language),
      educational_purpose: orNull(form.educational_purpose),
      category: orNull(form.category),
      registration_url: orNull(form.registration_url),
    };

    const { error: err } = editingId
      ? await supabase.from("events").update(payload).eq("id", editingId)
      : await supabase.from("events").insert(payload);

    if (err) {
      setError(`Failed to save data. ${dbErrorHint(err.message)}`);
      setSaving(false);
      return;
    }

    setNotice(editingId ? "Event updated successfully" : "Event created successfully");
    await revalidatePublicAction("events");
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
    await revalidatePublicAction("events");
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
      setError(`Failed to delete data. ${dbErrorHint(err.message)}`);
      return;
    }
    if (!data || data.length === 0) {
      alert("Record could not be deleted! A permission/RLS rule may be blocking it.");
      return;
    }

    setNotice("Event deleted successfully");
    setEvents((prev) => prev.filter((item) => item.id !== event.id));
    await revalidatePublicAction("events");
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-brand-aubergine">Events Management</h1>
          <p className="text-sm text-slate-500">Create and manage the association&apos;s event stories.</p>
        </div>
        <button
          type="button"
          onClick={toggleForm}
          className="rounded-full bg-brand-lime px-5 py-2.5 text-sm font-bold text-brand-aubergine shadow-sm transition-all hover:bg-brand-lime-dark hover:shadow-md"
        >
          {showForm ? "Close" : "+ New Event"}
        </button>
      </header>

      {error && (
        <p className="mt-4 rounded-xl border border-brand-coral/40 bg-brand-coral/10 px-4 py-2.5 text-sm text-brand-aubergine">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 rounded-xl border border-brand-lime/60 bg-brand-lime/25 px-4 py-2.5 text-sm text-brand-aubergine">
          {notice}
        </p>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-brand-aubergine/10 bg-white p-6"
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
            <div className="space-y-4 rounded-2xl border border-brand-aubergine/10 bg-brand-aubergine/5 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-coral">Greek Details (EL)</h3>
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
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-xs text-white hover:bg-brand-coral"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <label className="flex h-20 w-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-2xl text-slate-400 hover:border-brand-coral hover:text-brand-coral">
                  <span>{uploading ? "…" : "+"}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
                </label>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                The first image is used as the cover. You can select several files at once.
              </p>
            </div>
          </div>

          {/* Catalogue details */}
          <div className="mt-6 rounded-2xl border border-black/5 bg-slate-50/50 p-6">
            <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-500 uppercase">
              Catalogue Details
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block">
                <span className={labelClass()}>Category</span>
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option value="">—</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className={labelClass()}>Catalogue date</span>
                <input
                  type="date"
                  className={inputClass}
                  value={form.event_date}
                  onChange={(e) => update("event_date", e.target.value)}
                />
              </label>

              <label className="block">
                <span className={labelClass()}>Location or online</span>
                <input
                  className={inputClass}
                  value={form.location_or_online}
                  onChange={(e) => update("location_or_online", e.target.value)}
                  placeholder="e.g. Athens / Online"
                />
              </label>

              <label className="block">
                <span className={labelClass()}>Target audience</span>
                <input
                  className={inputClass}
                  value={form.target_audience}
                  onChange={(e) => update("target_audience", e.target.value)}
                  placeholder="e.g. Students (15–18)"
                />
              </label>

              <label className="block">
                <span className={labelClass()}>Language</span>
                <input
                  className={inputClass}
                  value={form.language}
                  onChange={(e) => update("language", e.target.value)}
                  placeholder="e.g. English / Greek"
                />
              </label>

              <label className="block">
                <span className={labelClass()}>Registration / CTA link</span>
                <input
                  className={inputClass}
                  value={form.registration_url}
                  onChange={(e) => update("registration_url", e.target.value)}
                  placeholder="https://…"
                />
              </label>

              <label className="block md:col-span-2">
                <span className={labelClass()}>Educational purpose</span>
                <textarea
                  className={`${inputClass} min-h-24 resize-y`}
                  value={form.educational_purpose}
                  onChange={(e) => update("educational_purpose", e.target.value)}
                />
              </label>

              <label className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_archived}
                  onChange={(e) => update("is_archived", e.target.checked)}
                  className="h-4 w-4 accent-brand-lime"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Archive this event (moves it to the Past / Archive tab)
                </span>
              </label>
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
              className="rounded-full bg-brand-aubergine px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
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
                className="rounded-full bg-brand-lime px-5 py-2 text-sm font-bold text-brand-aubergine shadow-sm transition-all hover:bg-brand-lime-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
                    {event.title_el} · {event.event_date ?? event.date_en}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {event.category && (
                      <span className="rounded-full bg-brand-aubergine/10 px-2 py-0.5 text-xs font-semibold text-brand-aubergine">
                        {event.category}
                      </span>
                    )}
                    {event.is_archived && (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        Archived
                      </span>
                    )}
                  </div>
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
                    className="rounded-full border border-brand-coral/40 bg-white px-4 py-1.5 text-sm font-semibold text-brand-coral transition-colors hover:bg-brand-coral hover:text-white"
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
