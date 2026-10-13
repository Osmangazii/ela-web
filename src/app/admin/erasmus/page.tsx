"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicAction } from "../actions";
import { ERASMUS_STATUSES } from "@/lib/erasmus";
import type { ErasmusProject } from "@/types/database";

interface FormState {
  title: string;
  project_code: string;
  action_type: string;
  status: string;
  summary: string;
  priorities: string;
  partner_countries: string;
  start_date: string;
  end_date: string;
  results_summary: string;
  attachment_url: string;
  order_index: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  project_code: "",
  action_type: "",
  status: "Active",
  summary: "",
  priorities: "",
  partner_countries: "",
  start_date: "",
  end_date: "",
  results_summary: "",
  attachment_url: "",
  order_index: "0",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-brand-coral";

function labelClass() {
  return "mb-1 block text-xs font-semibold text-slate-600";
}

function orNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function dbErrorHint(message: string): string {
  if (/schema cache|could not find the .* column|does not exist/i.test(message)) {
    return `${message} — Hint: apply supabase/migrations/0007_erasmus_projects.sql and run "NOTIFY pgrst, 'reload schema';".`;
  }
  return message;
}

export default function AdminErasmus() {
  const [projects, setProjects] = useState<ErasmusProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("erasmus_projects")
      .select("*")
      .order("order_index", { ascending: true });
    if (err) {
      setError(dbErrorHint(err.message));
    } else if (data) {
      setProjects((data as unknown as ErasmusProject[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch callback only
    void loadProjects();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function toggleForm() {
    if (showForm) {
      resetForm();
      setShowForm(false);
    } else {
      resetForm();
      setShowForm(true);
    }
  }

  function startEdit(p: ErasmusProject) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      project_code: p.project_code ?? "",
      action_type: p.action_type ?? "",
      status: p.status ?? "Active",
      summary: p.summary ?? "",
      priorities: p.priorities ?? "",
      partner_countries: p.partner_countries ?? "",
      start_date: p.start_date ?? "",
      end_date: p.end_date ?? "",
      results_summary: p.results_summary ?? "",
      attachment_url: p.attachment_url ?? "",
      order_index: String(p.order_index ?? 0),
    });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const payload = {
      title: form.title.trim(),
      project_code: orNull(form.project_code),
      action_type: orNull(form.action_type),
      status: form.status || "Active",
      summary: orNull(form.summary),
      priorities: orNull(form.priorities),
      partner_countries: orNull(form.partner_countries),
      start_date: orNull(form.start_date),
      end_date: orNull(form.end_date),
      results_summary: orNull(form.results_summary),
      attachment_url: orNull(form.attachment_url),
      order_index: Number(form.order_index) || 0,
    };

    const { error: err } = editingId
      ? await supabase.from("erasmus_projects").update(payload).eq("id", editingId)
      : await supabase.from("erasmus_projects").insert(payload);

    if (err) {
      setError(`Failed to save data. ${dbErrorHint(err.message)}`);
      setSaving(false);
      return;
    }

    setNotice(editingId ? "Project updated successfully." : "Project created successfully.");
    await revalidatePublicAction("erasmus");
    resetForm();
    setShowForm(false);
    setSaving(false);
    await loadProjects();
  }

  async function handleDelete(p: ErasmusProject) {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const supabase = createClient();
    const { error: err } = await supabase.from("erasmus_projects").delete().eq("id", p.id);
    if (err) {
      setError(`Failed to delete data. ${dbErrorHint(err.message)}`);
      return;
    }
    setNotice("Project deleted successfully.");
    setProjects((prev) => prev.filter((item) => item.id !== p.id));
    await revalidatePublicAction("erasmus");
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-brand-aubergine">Erasmus+ Projects</h1>
          <p className="text-sm text-slate-500">Manage the Erasmus+ project portfolio.</p>
        </div>
        <button
          type="button"
          onClick={toggleForm}
          className="rounded-full bg-brand-lime px-5 py-2.5 text-sm font-bold text-brand-aubergine shadow-sm transition-all hover:bg-brand-lime-dark hover:shadow-md"
        >
          {showForm ? "Close" : "+ New Project"}
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

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-brand-aubergine/10 bg-white p-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className={labelClass()}>Title *</span>
              <input
                className={inputClass}
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. ELA: Promoting Sustainable and Innovative Environments"
              />
            </label>

            <label className="block">
              <span className={labelClass()}>Project code</span>
              <input
                className={inputClass}
                value={form.project_code}
                onChange={(e) => update("project_code", e.target.value)}
                placeholder="2024-1-EL01-KA220-SCH-000123456"
              />
            </label>

            <label className="block">
              <span className={labelClass()}>Action type</span>
              <input
                className={inputClass}
                value={form.action_type}
                onChange={(e) => update("action_type", e.target.value)}
                placeholder="KA1 Mobility / KA2 Strategic Partnerships / Small-scale"
              />
            </label>

            <label className="block">
              <span className={labelClass()}>Status</span>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                {ERASMUS_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass()}>Order index</span>
              <input
                type="number"
                className={inputClass}
                value={form.order_index}
                onChange={(e) => update("order_index", e.target.value)}
              />
            </label>

            <label className="block">
              <span className={labelClass()}>Start date</span>
              <input
                type="date"
                className={inputClass}
                value={form.start_date}
                onChange={(e) => update("start_date", e.target.value)}
              />
            </label>

            <label className="block">
              <span className={labelClass()}>End date</span>
              <input
                type="date"
                className={inputClass}
                value={form.end_date}
                onChange={(e) => update("end_date", e.target.value)}
              />
            </label>

            <label className="block md:col-span-2">
              <span className={labelClass()}>Priorities (comma-separated)</span>
              <input
                className={inputClass}
                value={form.priorities}
                onChange={(e) => update("priorities", e.target.value)}
                placeholder="Inclusion, Digital Literacy, Green Transition"
              />
            </label>

            <label className="block md:col-span-2">
              <span className={labelClass()}>Partner countries (comma-separated)</span>
              <input
                className={inputClass}
                value={form.partner_countries}
                onChange={(e) => update("partner_countries", e.target.value)}
                placeholder="Greece, Italy, Spain, Turkey"
              />
            </label>

            <label className="block md:col-span-2">
              <span className={labelClass()}>Summary</span>
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={form.summary}
                onChange={(e) => update("summary", e.target.value)}
              />
            </label>

            <label className="block md:col-span-2">
              <span className={labelClass()}>Results summary (optional)</span>
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={form.results_summary}
                onChange={(e) => update("results_summary", e.target.value)}
              />
            </label>

            <label className="block md:col-span-2">
              <span className={labelClass()}>Attachment / link (optional)</span>
              <input
                className={inputClass}
                value={form.attachment_url}
                onChange={(e) => update("attachment_url", e.target.value)}
                placeholder="https://…"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
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
              disabled={saving}
              className="rounded-full bg-brand-aubergine px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No projects yet. Create your first one above.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900">{p.title}</p>
                <p className="truncate text-xs text-slate-500">
                  {p.project_code || "—"} · {p.action_type || "—"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {p.status && (
                    <span className="rounded-full bg-brand-aubergine/10 px-2 py-0.5 text-xs font-semibold text-brand-aubergine">
                      {p.status}
                    </span>
                  )}
                  {p.partner_countries && (
                    <span className="text-xs text-slate-400">{p.partner_countries}</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 justify-end gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="rounded-full border border-brand-coral/40 bg-white px-4 py-1.5 text-sm font-semibold text-brand-coral transition-colors hover:bg-brand-coral hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
