// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [wardWorkers, setWardWorkers] = useState([]);

  const fetchComplaints = async () => {
    const { data, error } = await supabase.from("complaints").select("*");
    if (!error) setComplaints(data);
  };

  const fetchWardWorkers = async () => {
    const { data, error } = await supabase.from("users").select("*").eq("role", "worker");
    if (!error) setWardWorkers(data);
  };

  const assignComplaint = async (complaintId, workerId) => {
    const { error } = await supabase
      .from("complaints")
      .update({ assigned_to: workerId, status: "Assigned" })
      .eq("id", complaintId);
    if (!error) fetchComplaints();
  };

  useEffect(() => {
    fetchComplaints();
    fetchWardWorkers();
  }, []);

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="space-y-3">
        {complaints.map((c) => (
          <div key={c.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>
              <p><strong>Description:</strong> {c.description}</p>
              <p><strong>Status:</strong> {c.status}</p>
            </div>
            <select
              onChange={(e) => assignComplaint(c.id, e.target.value)}
              className="p-2 border rounded"
              defaultValue=""
            >
              <option value="" disabled>
                Assign to Worker
              </option>
              {wardWorkers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
