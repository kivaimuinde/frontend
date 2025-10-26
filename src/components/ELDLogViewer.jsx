import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const STATUS_LEVELS = {
  off_duty: 0,
  sleeper: 1,
  driving: 2,
  on_duty: 3,
};

export default function ELDLogViewer({ tripId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await api.get(`api/trips/${tripId}/logs/`);
      setLogs(res.data || []);
      console.log(res.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs([]);
      setError("Failed to load logs.");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    if (tripId) {
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, [tripId, fetchLogs]);

  const filtered = logs.filter((l) =>
    filter ? l.date.includes(filter) : true
  );
  const start = (page - 1) * pageSize;
  const currentLogs = filtered.slice(start, start + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const renderChart = (data) => {
    if (!data || data.length === 0) return null;

    const chartData = data.map((d) => ({
      hour: d.hour,
      status: d.status,
      level: STATUS_LEVELS[d.status] ?? 0,
    }));

    return (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            type="number"
            domain={[0, 24]}
            tickCount={13}
            label={{ value: "Hour of Day", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            type="number"
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
            tickFormatter={(v) =>
              Object.keys(STATUS_LEVELS).find(
                (key) => STATUS_LEVELS[key] === v
              )?.replace("_", " ") || ""
            }
          />
          <Tooltip
            formatter={(v) =>
              Object.keys(STATUS_LEVELS).find(
                (key) => STATUS_LEVELS[key] === v
              )?.replace("_", " ") || ""
            }
            labelFormatter={(h) => `Hour: ${h}`}
          />
          <Line
            type="stepAfter"
            dataKey="level"
            stroke="#3498db"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="position-relative" style={{ minHeight: "70vh" }}>
      {/* 🌀 Animated Loading Spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "4rem", height: "4rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <motion.p
              className="text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Loading logs...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          {/* 🔙 Back Button (top-right corner) */}
          <div
            className="position-absolute"
            style={{ top: "1rem", right: "1rem", zIndex: 1000 }}
          >
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)} // go back to previously accessed page
            >
              ← Back
            </button>
          </div>

          {error && <p className="text-danger text-center mt-5">{error}</p>}
          {!error && logs.length === 0 && (
            <p className="text-muted text-center mt-5">No logs available.</p>
          )}

          {logs.length > 0 && (
            <div className="card shadow-sm mt-4">
              <div className="card-header bg-secondary text-white py-2">
                <span>Daily Log Sheets</span>
              </div>

              <div className="card-body">
                <input
                  type="text"
                  placeholder="Filter by date (YYYY-MM-DD)"
                  className="form-control mb-2"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(1);
                  }}
                />

                {currentLogs.map((log) => (
                  <div key={log.id || log.date} className="border-bottom mb-3 pb-2">
                    <strong>{log.date}</strong>
                    <ul className="small text-muted mb-1">
                      <li>Miles: {log.miles_today}</li>
                      <li>Driving: {log.driving_hours} h</li>
                      <li>On Duty: {log.on_duty_hours} h</li>
                      <li>Off Duty + Sleeper: {log.off_duty_hours} h</li>
                    </ul>
                    {log.grid_plot_data?.length > 0
                      ? renderChart(log.grid_plot_data)
                      : <p className="text-muted small">No grid data available for this log.</p>}
                  </div>
                ))}

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span>Page {page} of {totalPages || 1}</span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
