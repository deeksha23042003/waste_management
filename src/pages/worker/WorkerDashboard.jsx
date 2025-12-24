import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";

const WorkerDashboard = () => {
  const [assignedComplaints, setAssignedComplaints] = useState([]);

  const fetchAssignedComplaints = async () => {
    const user = supabase.auth.user();

    if (!user) return;

    const { data, error } = await supabase
      .from("complaints")
      .select("*")  
      .eq("assigned_to", user.id);

    if (!error) {
      setAssignedComplaints(data);
    }
  };

  const markResolved = async (id, proofFile) => {
    let proofPath = null;

    if (proofFile) {
      const fileExt = proofFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("proofs")
        .upload(fileName, proofFile);

      if (!error) {
        proofPath = data.path;
      }
    }

    const { error } = await supabase
      .from("complaints")
      .update({
        status: "Resolved",
        proof_image: proofPath,
      })
      .eq("id", id);

    if (!error) {
      fetchAssignedComplaints();
    }
  };

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Assigned Complaints</h2>

      <div className="space-y-3">
        {assignedComplaints.map((c) => (
          <div key={c.id} className="p-3 bg-white rounded shadow">
            <p>
              <strong>Description:</strong> {c.description}
            </p>
            <p>
              <strong>Status:</strong> {c.status}
            </p>

            <input
              type="file"
              className="mt-2"
              onChange={(e) =>
                markResolved(c.id, e.target.files[0])
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerDashboard;
