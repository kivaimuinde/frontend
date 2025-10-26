import { Link } from "react-router-dom";

export default function TripList({ trips, onDelete, onEdit }) {
  if (!trips || trips.length === 0)
    return <p className="text-muted">No trips yet. Create one above.</p>;

  return (
    <div className="row">
      {trips.map((trip) => (
        <div key={trip.id} className="col-md-6 mb-3">
          <div className="card p-3 shadow-sm h-100">
            <h6 className="fw-bold mb-1">{trip.pickup_location} → {trip.dropoff_location}</h6>
            <small className="text-muted">Cycle used: {trip.current_cycle_used_hours} hrs</small>
            <div className="mt-2 d-flex gap-2">
              <Link to={`/trip/${trip.id}`} className="btn btn-outline-primary btn-sm">View</Link>
              {onEdit && <button className="btn btn-outline-secondary btn-sm" onClick={() => onEdit(trip)}>Edit</button>}
              {onDelete && <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(trip.id)}>Delete</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
