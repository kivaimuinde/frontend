import { useState, useEffect, useCallback } from "react";
import TripForm from "../components/TripForm";
import TripList from "../components/TripList";
import api from "../api/axios";

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null); // New: track trip for editing
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [refreshing, setRefreshing] = useState(false);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 2000);
  };

  const fetchTrips = useCallback(async () => {
    try {
      const response = await api.get("trips/");
      setTrips(response.data);
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch trips.", "danger");
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTrips();
      showAlert("Trips refreshed!", "info");
    } finally {
      setRefreshing(false);
    }
  };

  const handleTripCreatedOrUpdated = async () => {
    setShowModal(false);
    setSelectedTrip(null);
    await fetchTrips();
    showAlert(`Trip ${selectedTrip ? "updated" : "created"} successfully!`, "success");
  };

  const handleTripError = (message) => showAlert(message, "danger");

  const handleTripDeleted = async (tripId) => {
    try {
      await api.delete(`trips/${tripId}/`);
      await fetchTrips();
      showAlert("Trip deleted successfully!", "success");
    } catch {
      showAlert("Failed to delete trip.", "danger");
    }
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShowModal(false);
  };

  return (
    <div className="container mt-4">
      {alert.show && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show mb-4`}
          role="alert"
          style={{ position: "sticky", top: "20px", zIndex: 1050 }}
        >
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert({ show: false, message: "", type: "" })}
          ></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Driver Dashboard</h3>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Refreshing...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </>
            )}
          </button>

          <button
            className="btn btn-primary me-2"
            onClick={() => {
              setSelectedTrip(null);
              setShowModal(true);
            }}
          >
            Add New Trip
          </button>

          <button
            className="btn btn-outline-danger"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <TripList
        trips={trips}
        onDelete={handleTripDeleted}
        onEdit={handleEditTrip} // Pass edit handler
      />

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
          onClick={handleBackdropClick}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTrip ? "Edit Trip" : "Create New Trip"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <TripForm
                  trip={selectedTrip} // Pass trip for editing
                  onCreated={handleTripCreatedOrUpdated}
                  onCancel={() => setShowModal(false)}
                  onError={handleTripError}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
