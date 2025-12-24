import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import "./UserDashboard.css";

export default function ComplaintForm() {
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;

    // 1. Upload image to Supabase Storage
    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("complaints")
        .upload(fileName, image);

      if (uploadError) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("complaints")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // 2. Insert complaint
    const { error } = await supabase.from("complaints").insert([
      {
        image_url: imageUrl,
        address,
        landmark,
        description,
      },
    ]);

    if (error) {
      alert("Failed to submit complaint");
    } else {
      alert("Complaint submitted successfully");
      setAddress("");
      setLandmark("");
      setDescription("");
      setImage(null);
    }

    setLoading(false);
  };

  return (
    <div className="complaint-container">
      <h2>Report Waste Issue</h2>

      <form onSubmit={handleSubmit}>
        {/* Evidence */}
        <label>Upload Evidence</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* Location */}
        <label>Street Address</label>
        <input
          type="text"
          placeholder="e.g. 123 Green Street"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label>Landmark (Optional)</label>
        <input
          type="text"
          placeholder="Near Central Park"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
