import React, { useEffect, useState } from "react";
import { getAllContexts } from "../services/contextService";
import ContextCard from "../components/ContextCard";
import Header from "../components/Header";

const Home = () => {
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const data = await getAllContexts();
        if (data && Array.isArray(data)) {
          setContexts(data);
        }
      } catch (err) {
        console.error("Error fetching contexts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContexts();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <Header />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Contexts</h1>
        {contexts.length === 0 ? (
          <p className="text-gray-500">
            You haven't created any contexts yet.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {contexts.map((ctx) => (
              <ContextCard
                key={ctx._id}
                title={ctx.label}
                slug={ctx.slug}
                description={ctx.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;