import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContextDetails, submitFeedback } from "../services/feedbackService";

const SubmitFeedbackPage = () => {
  const { contextId } = useParams();
  const [context, setContext] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await getContextDetails(contextId);
        console.log("res:", res);
        setContext(res.context);
      } catch (error) {
        console.error(error);
        setMessage("Context not found");
      }
    };
    fetchContext();
  }, [contextId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback(contextId, { feedbackMessage: feedback });
      setMessage("Feedback submitted successfully!");
      setFeedback("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error submitting feedback");
    }
  };

  if (!context) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{context.label}</h2>
      <p className="text-gray-600 mb-6">{context.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full p-3 border rounded-md"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Submit Feedback
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default SubmitFeedbackPage;