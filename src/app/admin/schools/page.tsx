"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { SchoolItem } from "@/types/database";

interface FormState {
  name_en: string;
  name_el: string;
  subtitle_en: string;
  subtitle_el: string;
  city_en: string;
  city_el: string;
  member_status_en: string;
  member_status_el: string;
  description_en: string;
  description_el: string;
  order_index: number;
}

const EMPTY_FORM: FormState = {
  name_en: "",
  name_el: "",
  subtitle_en: "",
  subtitle_el: "",
  city_en: "",
  city_el: "",
  member_status_en: "",
  member_status_el: "",
  description_en: "",
  description_el: "",
  order_index: 0,
};

const SUBTITLE_PRESETS = [
  { label: "School of English", en: "SCHOOL OF ENGLISH", el: "ΚΕΝΤΡΟ ΑΓΓΛΙΚΗΣ ΓΛΩΣΣΑΣ" },
  { label: "Language School", en: "LANGUAGE SCHOOL", el: "ΚΕΝΤΡΟ ΞΕΝΩΝ ΓΛΩΣΣΩΝ" },
  { label: "Foreign Language Center", en: "FOREIGN LANGUAGE CENTER", el: "ΚΕΝΤΡΟ ΞΕΝΩΝ ΓΛΩΣΣΩΝ" },
  { label: "Modern Language Center", en: "MODERN LANGUAGE CENTER", el: "ΣΥΓΧΡΟΝΟ ΚΕΝΤΡΟ ΞΕΝΩΝ ΓΛΩΣΣΩΝ" },
  { label: "Education Centers", en: "EDUCATION CENTERS", el: "ΕΚΠΑΙΔΕΥΤΙΚΑ ΚΕΝΤΡΑ" },
  { label: "English French German", en: "ENGLISH FRENCH GERMAN", el: "ΑΓΓΛΙΚΑ ΓΑΛΛΙΚΑ ΓΕΡΜΑΝΙΚΑ" },
  { label: "School of Languages", en: "SCHOOL OF LANGUAGES", el: "ΣΧΟΛΗ ΞΕΝΩΝ ΓΛΩΣΣΩΝ" },
  { label: "School", en: "SCHOOL", el: "ΣΧΟΛΕΙΟ" },
  { label: "ELC", en: "ELC", el: "ELC" },
  { label: "Custom (Manual Input)", en: "CUSTOM", el: "CUSTOM" },
];

const MEMBER_STATUS_PRESETS = [
  { label: "None / Empty", en: "", el: "" },
  { label: "Founding Member", en: "FOUNDING MEMBER", el: "ΙΔΡΥΤΙΚΟ ΜΕΛΟΣ" },
  { label: "Member", en: "MEMBER", el: "ΜΕΛΟΣ" },
  { label: "Custom (Manual Input)", en: "CUSTOM", el: "CUSTOM" },
];

const CUSTOM = "CUSTOM";
const SUBTITLE_CUSTOM_INDEX = SUBTITLE_PRESETS.findIndex((p) => p.en === CUSTOM);

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-brand-pink";

function labelClass() {
  return "mb-1 block text-xs font-semibold text-slate-600";
}

export default function AdminSchools() {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [subtitlePresetIdx, setSubtitlePresetIdx] = useState(SUBTITLE_CUSTOM_INDEX);
  const [memberPresetIdx, setMemberPresetIdx] = useState(0);

  async function loadSchools() {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("schools")
      .select("*")
      .order("order_index", { ascending: true });
    if (err) {
      setError(err.message);
    } else if (data) {
      setSchools((data as unknown as SchoolItem[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch callback only
    void loadSchools();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImageUrl(null);
    setEditingId(null);
    setSubtitlePresetIdx(SUBTITLE_CUSTOM_INDEX);
    setMemberPresetIdx(0);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(school: SchoolItem) {
    setEditingId(school.id);
    setForm({
      name_en: school.name_en ?? school.name ?? "",
      name_el: school.name_el ?? school.name ?? "",
      subtitle_en: school.subtitle_en ?? "",
      subtitle_el: school.subtitle_el ?? "",
      city_en: school.city_en ?? school.city ?? "",
      city_el: school.city_el ?? school.city ?? "",
      member_status_en: school.member_status_en ?? "",
      member_status_el: school.member_status_el ?? "",
      description_en: school.description_en ?? school.founder_info ?? "",
      description_el: school.description_el ?? school.founder_info ?? "",
      order_index: school.order_index ?? 0,
    });
    setImageUrl(school.image_url);

    const subIdx = SUBTITLE_PRESETS.findIndex(
      (p) => p.en === (school.subtitle_en ?? "") && p.el === (school.subtitle_el ?? ""),
    );
    setSubtitlePresetIdx(subIdx === -1 ? SUBTITLE_CUSTOM_INDEX : subIdx);

    const memIdx = MEMBER_STATUS_PRESETS.findIndex(
      (p) => p.en === (school.member_status_en ?? "") && p.el === (school.member_status_el ?? ""),
    );
    setMemberPresetIdx(memIdx === -1 ? MEMBER_STATUS_PRESETS.length - 1 : memIdx);

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

  function handleSubtitlePreset(idx: number) {
    setSubtitlePresetIdx(idx);
    const preset = SUBTITLE_PRESETS[idx];
    if (preset.en !== CUSTOM) {
      setForm((prev) => ({ ...prev, subtitle_en: preset.en, subtitle_el: preset.el }));
    }
  }

  function handleMemberPreset(idx: number) {
    setMemberPresetIdx(idx);
    const preset = MEMBER_STATUS_PRESETS[idx];
    if (preset.en !== CUSTOM) {
      setForm((prev) => ({ ...prev, member_status_en: preset.en, member_status_el: preset.el }));
    }
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    const supabase = createClient();
    const path = `schools/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
      upsert: true,
    });

    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const trimmed = (v: string) => v.trim();
    // Keep legacy columns in sync for any fallback reads.
    const subtitleEn = trimmed(form.subtitle_en).toUpperCase();
    const subtitleEl = trimmed(form.subtitle_el).toUpperCase();
    const statusEn = trimmed(form.member_status_en).toUpperCase();
    const statusEl = trimmed(form.member_status_el).toUpperCase();
    const payload = {
      name_en: form.name_en,
      name_el: form.name_el,
      subtitle_en: subtitleEn || null,
      subtitle_el: subtitleEl || null,
      city_en: form.city_en,
      city_el: form.city_el,
      member_status_en: statusEn || null,
      member_status_el: statusEl || null,
      description_en: form.description_en || null,
      description_el: form.description_el || null,
      order_index: form.order_index,
      image_url: imageUrl,
      name: form.name_en || form.name_el,
      city: form.city_en || form.city_el,
    };

    const { error: err } = editingId
      ? await supabase.from("schools").update(payload).eq("id", editingId)
      : await supabase.from("schools").insert(payload);

    if (err) {
      setError(`Failed to save data. ${err.message}`);
      setSaving(false);
      return;
    }

    setNotice(editingId ? "School updated successfully." : "School created successfully.");
    resetForm();
    setShowForm(false);
    setSaving(false);
    await loadSchools();
  }

  async function handleDelete(school: SchoolItem) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const supabase = createClient();

    if (school.image_url) {
      const marker = "/object/public/media/";
      const idx = school.image_url.indexOf(marker);
      if (idx !== -1) {
        const objectPath = school.image_url.slice(idx + marker.length);
        if (objectPath) {
          await supabase.storage.from("media").remove([objectPath]);
        }
      }
    }

    const { error: err } = await supabase.from("schools").delete().eq("id", school.id);
    if (err) {
      setError(`Failed to delete data. ${err.message}`);
      return;
    }
    setNotice("School deleted successfully.");
    await loadSchools();
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-brand-green">Schools Management</h1>
          <p className="text-sm text-slate-500">Create and manage the network&apos;s member schools.</p>
        </div>
        <button
          type="button"
          onClick={toggleForm}
          className="rounded-full bg-brand-pink px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#ff637b] hover:shadow-md"
        >
          {showForm ? "Close" : "+ New School"}
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

      {/* Add / Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-brand-pink-light bg-white p-6"
        >
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {editingId ? "Edit School" : "New School"}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* EN column */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-pink">English (EN)</p>
              <label className="block">
                <span className={labelClass()}>Name (EN) *</span>
                <input className={inputClass} required value={form.name_en} onChange={(e) => update("name_en", e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass()}>City (EN)</span>
                <input className={inputClass} value={form.city_en} onChange={(e) => update("city_en", e.target.value)} placeholder="e.g. Corfu" />
              </label>
              <label className="block">
                <span className={labelClass()}>Description (EN)</span>
                <textarea className={`${inputClass} min-h-28 resize-y`} value={form.description_en} onChange={(e) => update("description_en", e.target.value)} />
              </label>
            </div>

            {/* EL column */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-pink">Greek (EL)</p>
              <label className="block">
                <span className={labelClass()}>Name (EL)</span>
                <input className={inputClass} value={form.name_el} onChange={(e) => update("name_el", e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass()}>City (EL)</span>
                <input className={inputClass} value={form.city_el} onChange={(e) => update("city_el", e.target.value)} placeholder="π.χ. Κέρκυρα" />
              </label>
              <label className="block">
                <span className={labelClass()}>Description (EL)</span>
                <textarea className={`${inputClass} min-h-28 resize-y`} value={form.description_el} onChange={(e) => update("description_el", e.target.value)} />
              </label>
            </div>
          </div>

          {/* Presets: subtitle & member status */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block">
                <span className={labelClass()}>Subtitle Preset</span>
                <select
                  className={inputClass}
                  value={subtitlePresetIdx}
                  onChange={(e) => handleSubtitlePreset(Number(e.target.value))}
                >
                  {SUBTITLE_PRESETS.map((p, i) => (
                    <option key={p.label} value={i}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              {SUBTITLE_PRESETS[subtitlePresetIdx]?.en === CUSTOM ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass()}>Subtitle (EN)</span>
                    <input className={inputClass} value={form.subtitle_en} onChange={(e) => update("subtitle_en", e.target.value)} />
                  </label>
                  <label className="block">
                    <span className={labelClass()}>Subtitle (EL)</span>
                    <input className={inputClass} value={form.subtitle_el} onChange={(e) => update("subtitle_el", e.target.value)} />
                  </label>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  EN: {form.subtitle_en || "—"} · EL: {form.subtitle_el || "—"}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className={labelClass()}>Member Status Preset</span>
                <select
                  className={inputClass}
                  value={memberPresetIdx}
                  onChange={(e) => handleMemberPreset(Number(e.target.value))}
                >
                  {MEMBER_STATUS_PRESETS.map((p, i) => (
                    <option key={p.label} value={i}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              {MEMBER_STATUS_PRESETS[memberPresetIdx]?.en === CUSTOM ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass()}>Member Status (EN)</span>
                    <input className={inputClass} value={form.member_status_en} onChange={(e) => update("member_status_en", e.target.value)} />
                  </label>
                  <label className="block">
                    <span className={labelClass()}>Member Status (EL)</span>
                    <input className={inputClass} value={form.member_status_el} onChange={(e) => update("member_status_el", e.target.value)} />
                  </label>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  EN: {form.member_status_en || "—"} · EL: {form.member_status_el || "—"}
                </p>
              )}
            </div>
          </div>

          {/* Shared fields */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block">
              <span className={labelClass()}>Order index</span>
              <input
                className={inputClass}
                type="number"
                value={form.order_index}
                onChange={(e) => update("order_index", Number(e.target.value))}
              />
            </label>

            <div>
              <span className={labelClass()}>Logo / image</span>
              <div className="flex flex-wrap items-center gap-3">
                {imageUrl && (
                  <span className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <Image src={imageUrl} alt="Upload preview" fill className="object-contain p-1" sizes="80px" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => setImageUrl(null)}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-xs text-white hover:bg-brand-pink"
                    >
                      ✕
                    </button>
                  </span>
                )}
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-2xl text-slate-400 hover:border-brand-pink hover:text-brand-pink">
                  <span>{uploading ? "…" : imageUrl ? "↺" : "+"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
              </div>
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
              {saving ? "Saving…" : editingId ? "Update school" : "Save school"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Loading schools…</p>
      ) : schools.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No schools yet. Create your first one above.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
          <table className="w-full min-w-190 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3">Name (EN / EL)</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id} className="border-b border-slate-50 last:border-0 hover:bg-brand-bg/40">
                  <td className="px-4 py-3">
                    {school.image_url ? (
                      <span className="relative block h-12 w-12 overflow-hidden rounded-lg bg-slate-50">
                        <Image src={school.image_url} alt="" fill className="object-contain p-1" sizes="48px" />
                      </span>
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{school.name_en ?? school.name}</p>
                    <p className="text-xs text-slate-500">{school.name_el ?? school.name}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{school.city_en ?? school.city}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{school.member_status_en ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{school.order_index}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(school)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(school)}
                        className="rounded-full border border-brand-pink/40 bg-white px-4 py-1.5 text-sm font-semibold text-brand-pink transition-colors hover:bg-brand-pink hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
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
