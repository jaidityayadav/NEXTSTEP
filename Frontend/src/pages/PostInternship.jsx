import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { HrNavbar } from "../Components/HrNavbar";
import backendUrl from "../api";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  DollarSign,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const PostInternship = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");
  const conversionRate = 83;
  const isImmediate = watch("is_immediate");

  const convertToINR = (stipend, currency) => {
    if (currency === "USD") {
      return stipend * conversionRate;
    }
    return stipend;
  };

  const onSubmit = async (data) => {
    try {
      const convertedStipend = convertToINR(parseFloat(data.stipend), currency);

      const formData = {
        ...data,
        stipend: convertedStipend,
        currency,
        is_immediate: Boolean(data.is_immediate),
        duration: parseInt(data.duration),
        starting_date: data.is_immediate ? new Date().toISOString() : new Date(data.starting_date).toISOString(),
        deadline: new Date(data.deadline).toISOString() // Add the deadline here
      };

      const token = localStorage.getItem("authorization");
      if (!token) {
        toast.error("Please login to post internships");
        return;
      }

      // Show loading state for 2 seconds (simulated API delay)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.post(
        `${backendUrl}/hr/postInternship`,
        formData,
        { headers: { Authorization: token } }
      );

      toast.success("Internship posted successfully!");
      navigate("/HR/HrDashboard");
      reset();
    } catch (error) {
      console.error("Error posting internship:", error);
      toast.error(error.response?.data?.message || "Failed to post internship");
    }
  };

  return (
    <>
      <HrNavbar />
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8" />
                <div>
                  <h1 className="text-2xl font-bold">Post New Internship</h1>
                  <p className="text-blue-100">Fill in the details to create a new internship opportunity</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    {...register("company_name", { required: "Company name is required" })}
                    className={`w-full px-4 py-2 border ${errors.company_name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="e.g., Tech Solutions Inc."
                  />
                  {errors.company_name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.company_name.message}
                    </p>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    Position
                  </label>
                  <input
                    type="text"
                    {...register("position", { required: "Position is required" })}
                    className={`w-full px-4 py-2 border ${errors.position ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="e.g., Frontend Developer"
                  />
                  {errors.position && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.position.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    {...register("location", { required: "Location is required" })}
                    className={`w-full px-4 py-2 border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="e.g., Remote, Bangalore"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Stipend */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Stipend
                  </label>
                  <div className="flex rounded-lg shadow-sm">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-4 py-2 border border-r-0 rounded-l-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="INR">
                        <IndianRupee className="h-4 w-4 inline mr-1" />
                        INR
                      </option>
                      <option value="USD">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        USD
                      </option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("stipend", { 
                        required: "Stipend is required", 
                        min: { value: 0, message: "Must be positive" }
                      })}
                      className={`flex-1 px-4 py-2 border ${errors.stipend ? 'border-red-300 rounded-r-lg' : 'border-gray-300 rounded-r-lg'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.stipend && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.stipend.message}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    {...register("duration", { 
                      required: "Duration is required",
                      min: { value: 1, message: "Minimum 1 month" },
                      max: { value: 12, message: "Maximum 12 months" }
                    })}
                    className={`w-full px-4 py-2 border ${errors.duration ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                {/* Starting Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Starting Date
                  </label>
                  <input
                    type="date"
                    {...register("starting_date", { 
                      required: isImmediate ? false : "Starting date is required"
                    })}
                    className={`w-full px-4 py-2 border ${errors.starting_date ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    disabled={isImmediate}
                  />
                  {errors.starting_date && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.starting_date.message}
                    </p>
                  )}
                </div>

                {/* Deadline Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    {...register("deadline", { required: "Deadline is required" })}
                    className={`w-full px-4 py-2 border ${errors.deadline ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  />
                  {errors.deadline && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.deadline.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Immediate Start Checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register("is_immediate")}
                  className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Immediate Start</label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg focus:ring-4 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                  ) : (
                    "Post Internship"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
