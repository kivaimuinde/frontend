import { useState, useEffect } from "react";
import api from "../api/axios";

export default function TripForm({ trip, onCreated, onCancel, onError }) {
  const [form, setForm] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_used_hours: 0,
    cycle: "70/8",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trip) setForm(trip);
  }, [trip]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (trip) {
        await api.put(`trips/${trip.id}/`, form); // edit
      } else {
        await api.post("trips/", form); // create
      }
      onCreated();
      setForm({ current_location: "", pickup_location: "", dropoff_location: "", current_cycle_used_hours: 0, cycle: "70/8" });
    } catch (error) {
      let message = "Error submitting form.";
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") message = data;
        else if (data.detail) message = data.detail;
        else message = Object.values(data).flat().join(", ");
      } else if (error.message) message = error.message;
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Current Location</label>
        <input type="text" name="current_location" className="form-control" value={form.current_location} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Pickup Location</label>
        <input type="text" name="pickup_location" className="form-control" value={form.pickup_location} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Dropoff Location</label>
        <input type="text" name="dropoff_location" className="form-control" value={form.dropoff_location} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Current Cycle Used Hours</label>
        <input type="number" name="current_cycle_used_hours" className="form-control" value={form.current_cycle_used_hours} onChange={handleChange} min="0" step="0.1" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Cycle</label>
        <select name="cycle" className="form-select" value={form.cycle} onChange={handleChange}>
          <option value="70/8">70 hours / 8 days</option>
          <option value="60/7">60 hours / 7 days</option>
        </select>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? (trip ? "Updating..." : "Creating...") : (trip ? "Update Trip" : "Create Trip")}</button>
      </div>
    </form>
  );
}
