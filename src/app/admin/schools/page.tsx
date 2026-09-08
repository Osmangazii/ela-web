"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { SchoolItem } from "@/types/database";

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
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [founderInfo, setFounderInfo] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  function resetForm() {
    setName("");
    setCity("");
    setFounderInfo("");
    setOrderIndex(0);
    setImageUrl(null);
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

    const supabase = createClient();
    const { error: err } = await supabase.from("schools").insert({
      name,
      city,
      founder_info: founderInfo || null,
      order_index: orderIndex,
      image_url: imageUrl,
    });

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    resetForm();
    setShowForm(false);
    setSaving(false);
    await loadSchools();
  }

  async function handleDelete(school: SchoolItem) {
    if (!window.confirm(`Delete "${school.name}" permanently?`)) return;

    const supabase = createClient();

    // Best-effort cleanup of the linked image in the 'media' bucket.
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
      setError(err.message);
      return;
    }
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
          onClick={() => setShowForm((v) => !v)}
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

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-brand-pink-light bg-white p-6 md:grid-cols-2"
        >
          <label className="block">
            <span className={labelClass()}>School name</span>
            <input className={inputClass} required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Varela" />
          </label>
          <label className="block">
            <span className={labelClass()}>City</span>
            <input className={inputClass} required value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Athens" />
          </label>
          <label className="block md:col-span-2">
            <span className={labelClass()}>Founder info (optional)</span>
            <input
              className={inputClass}
              value={founderInfo}
              onChange={(e) => setFounderInfo(e.target.value)}
              placeholder="Short founder / founding-member note"
            />
          </label>
          <label className="block">
            <span className={labelClass()}>Order index</span>
            <input
              className={inputClass}
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
            />
          </label>

          <div>
            <span className={labelClass()}>School image / logo</span>
            <div className="flex flex-wrap items-center gap-3">
              {imageUrl && (
                <span className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200">
                  <Image src={imageUrl} alt="Upload preview" fill className="object-cover" sizes="112px" />
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
              <label className="flex h-20 w-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-2xl text-slate-400 hover:border-brand-pink hover:text-brand-pink">
                <span>{uploading ? "…" : imageUrl ? "↺" : "+"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
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
              {saving ? "Saving…" : "Save school"}
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
          <table className="w-full min-w-180 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Founder info</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id} className="border-b border-slate-50 last:border-0 hover:bg-brand-bg/40">
                  <td className="px-4 py-3">
                    {school.image_url ? (
                      <span className="relative block h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                        <Image src={school.image_url} alt="" fill className="object-cover" sizes="64px" />
                      </span>
                    ) : (
                      <span className="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">{school.name}</td>
                  <td className="px-4 py-3 text-slate-600">{school.city}</td>
                  <td className="max-w-56 truncate px-4 py-3 text-slate-500">{school.founder_info}</td>
                  <td className="px-4 py-3 text-slate-500">{school.order_index}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(school)}
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
