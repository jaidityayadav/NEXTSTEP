import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HrNavbar } from "../Components/HrNavbar";
import backendUrl from "../api";
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export function EditInternship() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [currency, setCurrency] = useState("INR");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    position: "",
    location: "",
    stipend: 0,
    duration: 1,
    starting_date: "",
    is_immediate: false,
  });

  useEffect(() => {
    const fetchInternship = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authorization");
        if (!token) {
          toast.error("No token found. Please login again.");
          return;
        }

        const response = await axios.get(
          `${backendUrl}/hr/internship/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        setInternship(response.data.internship);
        setFormData({
          company_name: response.data.internship.company_name,
          position: response.data.internship.position,
          location: response.data.internship.location,
          stipend: response.data.internship.stipend,
          duration: response.data.internship.duration,
          starting_date: response.data.internship.starting_date.split("T")[0],
          is_immediate: response.data.internship.is_immediate,
        });
      } catch (error) {
        console.error("Error fetching internship:", error);
        toast.error("Error fetching internship details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prevState) => ({
      ...prevState,
      is_immediate: !prevState.is_immediate,
    }));
  };

  const convertToINR = (stipend, currency) => {
    if (currency === "USD") {
      return stipend * 83;
    }
    return stipend;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const convertedStipend = convertToINR(parseFloat(formData.stipend), currency);
      const updatedInternship = {
        ...formData,
        stipend: convertedStipend,
        currency,
        starting_date: new Date(formData.starting_date).toISOString(),
      };

      // Fake delay for 2 seconds to show loader
      await new Promise(resolve => setTimeout(resolve, 2000));

      const token = localStorage.getItem("authorization");
      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }

      await axios.put(
        `${backendUrl}/hr/internship/${id}`,
        updatedInternship,
        {
          headers: { Authorization: token },
        }
      );

     
      setTimeout(() => navigate("/HR/HrDashboard"));
      toast.success("Internship updated successfully!");
    } catch (error) {
      console.error("Error updating internship:", error);
      toast.error(error.response?.data?.message || "Error updating internship");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Loading internship details...</p>
      </div>
    );
  }

  return (
    <>
      <HrNavbar />
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </button>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="h-6 w-6" />
                    Edit Internship
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Update the details of this internship opportunity
                  </p>
                </div>
                <div className="bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
                  ID: {id}
                </div>
              </div>
            </div>

            {isUpdating && (
              <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-700">Updating internship...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                {/* Stipend */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stipend
                  </label>
                  <div className="flex rounded-lg shadow-sm">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-4 py-2 border border-r-0 rounded-l-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="stipend"
                      value={formData.stipend}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    max="12"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                {/* Starting Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Starting Date
                  </label>
                  <input
                    type="date"
                    name="starting_date"
                    value={formData.starting_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    disabled={formData.is_immediate}
                    required={!formData.is_immediate}
                  />
                </div>
              </div>

              {/* Immediate Start Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_immediate"
                  checked={formData.is_immediate}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_immediate" className="ml-2 block text-sm text-gray-700">
                  Immediate Start (no specific start date)
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Update Internship
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}