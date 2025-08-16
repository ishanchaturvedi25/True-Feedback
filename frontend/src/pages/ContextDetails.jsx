// src/pages/ContextDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContextDetails } from "../services/contextService";
import Header from "../components/Header";

const ContextDetails = () => {
  const { id } = useParams();
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const data = await getContextDetails(id);
        setContext(data);
      } catch (err) {
        console.error("Error fetching context details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContext();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!context) return <div className="text-center mt-10">Context not found</div>;

  return (
    <div>
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{context.label}</h1>
        <p className="text-gray-600 mb-2">Slug: {context.slug}</p>
        <p className="mb-6">{context.description}</p>

        <h2 className="text-xl font-semibold mb-4">Feedbacks</h2>
        {context.feedbacks && context.feedbacks.length > 0 ? (
          <div className="space-y-3">
            {context.feedbacks.map((fb) => (
              <div key={fb._id} className="border p-3 rounded shadow-sm">
                <p className="text-gray-800">{fb.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(fb.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No feedback received yet.</p>
        )}
      </div>
    </div>
  );
};

export default ContextDetails;