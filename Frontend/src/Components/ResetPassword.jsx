import { useState } from "react";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import backendUrl from "../api";
import { useNavigate } from "react-router-dom";

export function ResetPassword({ closeModal }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authorization");
      const isHR = window.location.pathname.includes("/HR/HrDashboard");
      const apiEndpoint = isHR ? "/hr/changePassword" : "/student/changePassword";
      const redirectPath = isHR ? "/hr/login" : "/login";
    
      // Start the loading spinner
      setLoading(true);
      
      // Store the start time
      const startTime = Date.now();
    
      const response = await axios.post(
        `${backendUrl}${apiEndpoint}`,
        { currentPassword, newPassword },
        { headers: { Authorization: token } }
      );
    
      // Calculate remaining time to ensure total 3 seconds loading
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(3000 - elapsedTime, 0);
    
      // Wait for remaining time
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    
      // Show success toast
      toast.success("Password changed successfully!");
    
      // Close modal and redirect after toast is shown (about 3 seconds)
      setTimeout(() => {
        closeModal();
        navigate(redirectPath);
      }, 2000);
    
    } catch (err) {
      setLoading(false);
      console.error("Error resetting password:", err);
      const errorMessage =
        err.response?.data?.message === "Current password is incorrect"
          ? "Current password is incorrect!"
          : err.response?.data?.error || "Something went wrong!";
      setError(errorMessage);
      toast.error(errorMessage);
    }finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Full-screen loader with blur background */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="p-6 bg-white bg-opacity-90 rounded-lg shadow-xl">
            <SyncLoader size={15} color="#3b82f6" />
          </div>
        </div>
      )}

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative mx-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors text-2xl"
          >
            &times;
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center font-medium shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}