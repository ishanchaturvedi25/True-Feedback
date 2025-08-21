import React, { useEffect, useState } from "react";
import { getAllContexts, createContext } from "../services/contextService";
import { getFeedbackStatus, toggleFeedbackStatus } from "../services/userService";
import ContextCard from "../components/ContextCard";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const Home = () => {
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);

  // For Create Context form
  const [newContext, setNewContext] = useState({ label: "", description: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contexts
        const data = await getAllContexts();
        if (Array.isArray(data)) {
          setContexts(data);
        }

        // Fetch feedback toggle status
        const status = await getFeedbackStatus();
        setFeedbackEnabled(status?.enabled || false);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateContext = async (e) => {
    e.preventDefault();
    if (!newContext.label.trim()) return alert("Label is required");
    setCreating(true);
    try {
      const created = await createContext(newContext);
      if (created) {
        if (contexts.length > 0) {
          setContexts((prev) => [created.context, ...prev]);
        } else {
          setContexts([created.context]);
        }
        setNewContext({ label: "", description: "" });
      }
    } catch (err) {
      console.error("Error creating context:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleFeedback = async () => {
    try {
      const updated = await toggleFeedbackStatus(!feedbackEnabled);
      if (updated?.receiveFeedback !== undefined) {
        setFeedbackEnabled(updated.receiveFeedback);
      }
    } catch (err) {
      console.error("Error toggling feedback:", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <Header />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Contexts</h1>

          {/* Toggle feedback receiving */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Feedback Receiving</span>
            <button
              onClick={handleToggleFeedback}
              className={`px-3 py-1 rounded-full text-white ${
                feedbackEnabled ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              {feedbackEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Create context form */}
        <form onSubmit={handleCreateContext} className="mb-6 flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Context label"
            value={newContext.label}
            onChange={(e) =>
              setNewContext((prev) => ({ ...prev, label: e.target.value }))
            }
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Description"
            value={newContext.description}
            onChange={(e) =>
              setNewContext((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="border p-2 rounded flex-1"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {creating ? "Creating..." : "Add"}
          </button>
        </form>

        {/* Context list */}
        {contexts.length === 0 ? (
          <p className="text-gray-500">
            You haven't created any contexts yet.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {contexts.map((ctx) => (
              <Link to={`/context/${ctx._id}`} key={ctx._id}>
                <ContextCard
                  title={ctx.label}
                  description={ctx.description}
                  id={ctx._id}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;