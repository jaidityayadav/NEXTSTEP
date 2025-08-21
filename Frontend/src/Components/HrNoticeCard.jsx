import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Megaphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  AlertTriangle,
  Mail,
  Bell,
  List,
  Trash2,
} from "lucide-react";
import backendUrl from "../api";

const HrNoticeCard = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch notices from the backend
  const fetchNotices = async () => {
    setLoadingNotices(true);
    try {
      const token = localStorage.getItem("authorization");
      const res = await axios.get(`${backendUrl}/notices/hr`, {
        headers: { authorization: token },
      });
      setNotices(res.data.notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error(error.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoadingNotices(false);
    }
  };

  // Handle form submission to post a new notice
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowLoader(true);

    try {
      const token = localStorage.getItem("authorization");
      await axios.post(
        `${backendUrl}/notice`,
        { title, message },
        { headers: { authorization: token } }
      );

      toast.success("Notice posted successfully!");
      setTitle("");
      setMessage("");
      if (showNotices) await fetchNotices();
    } catch (error) {
      console.error("Error posting notice:", error);
      toast.error(error.response?.data?.message || "Failed to post notice");
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  // Confirm deletion of the notice
  const confirmDelete = async (id) => {
    

    try {
      const url = `${backendUrl}/notice/${id}`; // Ensure id is passed here
      console.log("Deleting notice from:", url); // debug log

      const token = localStorage.getItem("authorization");
      await axios.delete(url, {
        headers: {
          Authorization: token,
        },
      });

      toast.success("Notice deleted successfully");
      fetchNotices(); // refresh the notice list
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    }
  };

  // Show the confirmation toast and initiate deletion
  const handleDeleteNotice = (id) => {
    if (!id) {
      console.error("Invalid notice ID:", id);
      return;
    }
  
    const noticeToDelete = notices.find((notice) => notice._id === id);
    const noticeTitle = noticeToDelete?.title || "this notice";
  
    toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-full max-w-xs">
          <p className="font-medium mb-3">Delete "{noticeTitle}"?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(id);
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setDeletingId(null);
              }}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  // Toggle the visibility of the notices list
  const toggleNotices = async () => {
    setShowNotices(!showNotices);
    if (!showNotices && notices.length === 0) await fetchNotices();
  };

  useEffect(() => {
    if (showNotices) fetchNotices();
  }, [showNotices]);

  return (
    <div className="relative max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <Toaster position="top-center" />
      {showLoader && (
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-medium text-gray-700">Posting your notice...</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Megaphone className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Post a New Notice</h2>
        </div>

        <button
          onClick={toggleNotices}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
        >
          {showNotices ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
          {showNotices ? "Hide Notices" : "View My Notices"}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700">Notice Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter notice title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Message Content</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[100px]"
              placeholder="Write your notice message here..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setMessage("");
              }}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              disabled={loading}
            >
              <X className="h-4 w-4 inline-block" /> Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-1" /> Posting...
                </span>
              ) : (
                <span className="flex items-center">
                  <Bell className="h-4 w-4 mr-1" /> Post Notice
                </span>
              )}
            </button>
          </div>
        </form>
      )}

      {showNotices && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Your Posted Notices</h3>
          {loadingNotices ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : notices.length === 0 ? (
            <p className="text-gray-500 text-center">You haven't posted any notices yet.</p>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-gray-800 font-medium">{notice.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notice.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Posted on: {new Date(notice.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={deletingId === notice.id}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HrNoticeCard;
