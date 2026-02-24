import { useState, useEffect, useCallback } from "react";
import AdminHeader from "./AdminHeader";
import { supabase } from "../../supabase";
import "./UsersTable.css";

/* ─── helpers ─────────────────────────────────────── */
const GRAD_COLORS = [
  "grad-purple",
  "grad-pink",
  "grad-teal",
  "grad-amber",
  "grad-sky",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();
}

function getGradient(name = "") {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRAD_COLORS[code % GRAD_COLORS.length];
}

function Avatar({ name = "", url = "", small = false }) {
  const [imgErr, setImgErr] = useState(false);
  const sizeClass = small ? "sm" : "";

  if (url && !imgErr) {
    return (
      <div className={`user-avatar ${sizeClass}`}>
        <img src={url} alt={name} onError={() => setImgErr(true)} />
      </div>
    );
  }

  return (
    <div className={`user-avatar ${getGradient(name)} ${sizeClass}`}>
      {getInitials(name)}
    </div>
  );
}

/* Count complaints by status */
function countComplaints(list = []) {
  return list.reduce(
    (acc, c) => {
      const s = (c.status || "").toLowerCase().trim();
      acc.total++;
      if (s === "pending") acc.pending++;
      else if (s === "in progress") acc.inProgress++;
      else if (s === "resolving") acc.resolving++;
      else if (s === "resolved") acc.resolved++;
      return acc;
    },
    { total: 0, pending: 0, inProgress: 0, resolving: 0, resolved: 0 }
  );
}

function CountCell({ value, type }) {
  if (value === 0) return <span className="count-zero">0</span>;
  const cls = {
    total: "count-total",
    pending: "count-pending",
    inProgress: "count-inprog",
    resolving: "count-resolving",
    resolved: "count-resolved",
  }[type] || "count-total";
  return <span className={cls}>{value}</span>;
}

function StatCard({ icon, label, value, colorClass }) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-card-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">
          {value === null ? (
            <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>—</span>
          ) : (
            value.toLocaleString()
          )}
        </div>
      </div>
      <div className={`stat-icon ${colorClass}`}>
        <span className="material-icons">{icon}</span>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

/* ─── Main Component ──────────────────────────────── */
export default function UsersTable() {
  const [tab, setTab] = useState("citizen");
  const [wardFilter, setWardFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [citizens, setCitizens] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [wards, setWards] = useState([]);

  // complaint arrays keyed by citizen email or ward_number
  const [citizenMap, setCitizenMap] = useState({}); // { email: [...complaints] }
  const [wardMap, setWardMap] = useState({});        // { ward_number: [...complaints] }

  const [stats, setStats] = useState({
    citizens: null,
    workers: null,
    total: null,
    resolved: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. All profiles
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("*");
      if (pErr) throw pErr;

      const cits = profiles.filter(
        (p) => (p.user_type || "").toLowerCase() === "citizen"
      );
      const wrks = profiles.filter(
        (p) => (p.user_type || "").toLowerCase() === "worker"
      );

      setCitizens(cits);
      setWorkers(wrks);

      // 2. Ward details
      const { data: wardData, error: wErr } = await supabase
        .from("ward_details")
        .select("*")
        .order("ward_number", { ascending: true });
      if (wErr) throw wErr;
      setWards(wardData || []);

      // 3. All complaints (only fields we need)
      const { data: complaints, error: cErr } = await supabase
        .from("complaints")
        .select("id, email, ward_number, status");
      if (cErr) throw cErr;

      // 4. Build citizen complaint map (by email)
      const cMap = {};
      for (const c of cits) {
        if (c.email) cMap[c.email] = [];
      }
      for (const comp of complaints) {
        if (comp.email && cMap[comp.email] !== undefined) {
          cMap[comp.email].push(comp);
        }
      }
      setCitizenMap(cMap);

      // 5. Build ward complaint map (by ward_number)
      const wMap = {};
      for (const w of wrks) {
        if (w.ward_number != null) wMap[String(w.ward_number)] = [];
      }
      for (const comp of complaints) {
        const key = String(comp.ward_number);
        if (wMap[key] !== undefined) {
          wMap[key].push(comp);
        }
      }
      setWardMap(wMap);

      // 6. Summary stats
      const resolvedCount = complaints.filter(
        (c) => (c.status || "").toLowerCase().trim() === "resolved"
      ).length;

      setStats({
        citizens: cits.length,
        workers: wrks.length,
        total: complaints.length,
        resolved: resolvedCount,
      });
    } catch (err) {
      console.error("UsersTable error:", err);
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // reset page on tab or filter change
  useEffect(() => {
    setPage(1);
  }, [tab, wardFilter]);

  /* ── Derived lists ── */
  const filteredCitizens =
    wardFilter === "all"
      ? citizens
      : citizens.filter((c) => String(c.ward_number) === wardFilter);

  const filteredWorkers =
    wardFilter === "all"
      ? workers
      : workers.filter((w) => String(w.ward_number) === wardFilter);

  const activeList = tab === "citizen" ? filteredCitizens : filteredWorkers;
  const totalPages = Math.ceil(activeList.length / PAGE_SIZE);
  const paged = activeList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Pagination helper ── */
  function pageNumbers() {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  /* ── Render ── */
  return (
    <>
      <AdminHeader />

      <div className="users-table-wrapper">
        <div className="users-table-inner">

          {/* Heading */}
          <h2 className="users-page-title">User Management</h2>
          <p className="users-page-subtitle">
            Manage citizen profiles and ward worker assignments.
          </p>

          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              icon="people"
              label="Total Citizens"
              value={stats.citizens}
              colorClass="blue"
            />
            <StatCard
              icon="engineering"
              label="Ward Workers"
              value={stats.workers}
              colorClass="orange"
            />
            <StatCard
              icon="warning"
              label="Total Complaints"
              value={stats.total}
              colorClass="red"
            />
            <StatCard
              icon="check_circle"
              label="Resolved Complaints"
              value={stats.resolved}
              colorClass="green"
            />
          </div>

          {/* Table card */}
          <div className="table-card">

            {/* Controls */}
            <div className="table-controls">
              <div className="tab-toggle">
                <button
                  className={`tab-btn ${tab === "citizen" ? "active" : ""}`}
                  onClick={() => setTab("citizen")}
                >
                  Citizens
                </button>
                <button
                  className={`tab-btn ${tab === "worker" ? "active" : ""}`}
                  onClick={() => setTab("worker")}
                >
                  Ward Workers
                </button>
              </div>

              <select
                className="ward-select"
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
              >
                <option value="all">All Wards</option>
                {wards.map((w) => (
                  <option key={w.id} value={String(w.ward_number)}>
                    Ward {w.ward_number}{w.ward_name ? ` – ${w.ward_name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Body */}
            {error ? (
              <div className="table-state-msg" style={{ color: "#dc2626" }}>
                <span
                  className="material-icons"
                  style={{ display: "block", fontSize: "2rem", marginBottom: "0.5rem" }}
                >
                  error_outline
                </span>
                {error}
              </div>
            ) : loading ? (
              <div className="table-state-msg">
                <div className="table-spinner" />
                Loading data…
              </div>
            ) : paged.length === 0 ? (
              <div className="table-state-msg">No records found.</div>
            ) : (
              <div className="table-scroll">
                {tab === "citizen" ? (
                  <CitizensTable rows={paged} citizenMap={citizenMap} />
                ) : (
                  <WorkersTable rows={paged} wardMap={wardMap} />
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="table-pagination">
                <p className="pagination-info">
                  Showing{" "}
                  <strong>{(page - 1) * PAGE_SIZE + 1}</strong>–
                  <strong>{Math.min(page * PAGE_SIZE, activeList.length)}</strong>{" "}
                  of <strong>{activeList.length}</strong> results
                </p>
                <div className="pagination-nav">
                  <button
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <span className="material-icons" style={{ fontSize: "1rem" }}>
                      chevron_left
                    </span>
                  </button>
                  {pageNumbers().map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <span className="material-icons" style={{ fontSize: "1rem" }}>
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Citizens Table ──────────────────────────────── */
function CitizensTable({ rows, citizenMap }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ width: "3.5rem" }}>Avatar</th>
          <th>Name &amp; Contact</th>
          <th>Ward No.</th>
          <th className="center">Total</th>
          <th className="center col-red">Pending</th>
          <th className="center col-yellow">In Progress</th>
          <th className="center col-blue">Resolving</th>
          <th className="center col-green">Resolved</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((citizen) => {
          const complaints = citizenMap[citizen.email] || [];
          const cnt = countComplaints(complaints);
          const ward = citizen.ward_number
            ? String(citizen.ward_number).padStart(2, "0")
            : "—";

          return (
            <tr key={citizen.id}>
              <td>
                <Avatar name={citizen.full_name} url={citizen.avatar_url} />
              </td>
              <td>
                <div className="name-cell">
                  <span className="name-primary">{citizen.full_name || "—"}</span>
                  <span className="name-email">{citizen.email}</span>
                  {citizen.phone_no && (
                    <span className="name-phone">{citizen.phone_no}</span>
                  )}
                </div>
              </td>
              <td>
                <span className="ward-pill">Ward {ward}</span>
              </td>
              <td className="center">
                <CountCell value={cnt.total} type="total" />
              </td>
              <td className="center">
                <CountCell value={cnt.pending} type="pending" />
              </td>
              <td className="center">
                <CountCell value={cnt.inProgress} type="inProgress" />
              </td>
              <td className="center">
                <CountCell value={cnt.resolving} type="resolving" />
              </td>
              <td className="center">
                <CountCell value={cnt.resolved} type="resolved" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ─── Workers Table ───────────────────────────────── */
function WorkersTable({ rows, wardMap }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ width: "3.5rem" }}>Avatar</th>
          <th>Name &amp; Contact</th>
          <th>Assigned Ward</th>
          <th className="center">Total</th>
          <th className="center col-red">Pending</th>
          <th className="center col-yellow">In Progress</th>
          <th className="center col-blue">Resolving</th>
          <th className="center col-green">Resolved</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((worker) => {
          const key = String(worker.ward_number);
          const complaints = wardMap[key] || [];
          const cnt = countComplaints(complaints);
          const ward = worker.ward_number
            ? String(worker.ward_number).padStart(2, "0")
            : "—";

          return (
            <tr key={worker.id}>
              <td>
                <Avatar name={worker.full_name} url={worker.avatar_url} />
              </td>
              <td>
                <div className="name-cell">
                  <span className="name-primary">{worker.full_name || "—"}</span>
                  <span className="name-email">{worker.email || "—"}</span>
                  {worker.phone_no && (
                    <span className="name-phone">{worker.phone_no}</span>
                  )}
                </div>
              </td>
              <td>
                <span className="ward-pill primary">Ward {ward}</span>
              </td>
              <td className="center">
                <CountCell value={cnt.total} type="total" />
              </td>
              <td className="center">
                <CountCell value={cnt.pending} type="pending" />
              </td>
              <td className="center">
                <CountCell value={cnt.inProgress} type="inProgress" />
              </td>
              <td className="center">
                <CountCell value={cnt.resolving} type="resolving" />
              </td>
              <td className="center">
                <CountCell value={cnt.resolved} type="resolved" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}