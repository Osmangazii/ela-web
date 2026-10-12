import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const read = (name) => {
  const m = env.match(new RegExp(`^${name}=(.*)$`, "m"));
  return m ? m[1].trim() : "";
};

const url = read("NEXT_PUBLIC_SUPABASE_URL");
const key = read("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const headers = { apikey: key, Authorization: `Bearer ${key}` };

const TABLES = [
  {
    name: "events",
    cols: [
      "category",
      "is_archived",
      "event_date",
      "location_or_online",
      "target_audience",
      "language",
      "educational_purpose",
      "registration_url",
    ],
    summarySelect: "is_archived,category",
  },
  {
    name: "announcements",
    cols: ["deadline_date", "target_audience"],
    summarySelect: "category",
  },
  {
    name: "erasmus_projects",
    cols: ["title", "project_code", "status", "priorities", "partner_countries", "attachment_url"],
    summarySelect: "status,title",
  },
];

let failures = 0;

for (const t of TABLES) {
  console.log(`\n=== ${t.name} ===`);

  const star = await fetch(`${url}/rest/v1/${t.name}?select=*&limit=1`, { headers });
  console.log("select=* ->", star.status);
  if (star.ok) {
    const rows = await star.json();
    if (rows[0]) console.log("columns:", Object.keys(rows[0]).join(", "));
  }

  for (const col of t.cols) {
    const res = await fetch(`${url}/rest/v1/${t.name}?select=${col}&limit=1`, { headers });
    if (!res.ok) failures++;
    console.log(`${res.ok ? "OK  " : "FAIL"}  ${col}  (HTTP ${res.status})`);
  }

  const s = await fetch(`${url}/rest/v1/${t.name}?select=${t.summarySelect}`, { headers });
  if (s.ok) {
    const rows = await s.json();
    console.log(`rows: ${rows.length}`, JSON.stringify(rows.slice(0, 12)));
  }
}

console.log(
  failures === 0
    ? "\nAll checked columns are live."
    : `\n${failures} column(s) missing — apply the pending migration(s) then re-run.`,
);
