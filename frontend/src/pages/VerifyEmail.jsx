import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(60);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  useEffect(() => {
    const timer =
      resendTimer > 0 &&
      setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/users/verify-otp", { email, otp });
      debugger
      if (res.status === 200) {
        setMessage("Email verified successfully redirecting to home page!");
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await apiClient.post("/users/get-otp", { email });
      setMessage("OTP resent successfully.");
      setResendTimer(60);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleVerify} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl mb-4 text-center">Verify Your Email</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter the OTP sent to <strong>{email}</strong>
        </p>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Verify OTP
        </button>
        <button
          type="button"
          className={`w-full mt-3 text-sm text-blue-600 hover:underline ${
            resendTimer > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleResend}
          disabled={resendTimer > 0}
        >
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
        </button>
        {message && <p className="text-center mt-4 text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default VerifyEmail;