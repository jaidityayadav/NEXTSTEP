import { Briefcase, ArrowUp, IndianRupee, PlusCircle, CheckCircle2, MapPin, Calendar, Clock, Users, Activity, FileText, Trash2, Edit2, BarChart2, Mail, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import backendUrl from '../api';  // Ensure this is correctly imported from your API configuration
import { HrNavbar } from '../Components/HrNavbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import ApplicationDetails from '../Components/ApplicationDetails';
import HrNoticeCard from '../Components/HrNoticeCard';

export function HrDashboard() {
  const [internships, setInternships] = useState([]);
  const [applicationCounts, setApplicationCounts] = useState({
    pendingReview: 0,
    approved: 2,
    interviewStage: 0,
    rejected: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 3;

  // Fetch internships
  const getInternships = async () => {
    const token = localStorage.getItem("authorization");
    try {
      const response = await axios.get(`${backendUrl}/hr/internships`, {
        headers: { authorization: token },
      });
      setInternships(response.data.internships || []);
    } catch (error) {
      console.error("Failed to Fetch Internships", error);
      toast.error("Failed to load internships");
    }
  };

  // Fetch application counts
 
  // Delete internship
  const deleteInternship = async (id) => {
    const token = localStorage.getItem("authorization");
    try {
      const response = await axios.delete(`${backendUrl}/hr/deleteInternship/${id}`, {
        headers: { authorization: token },
      });
      setInternships(internships.filter((item) => item.id !== id));
      toast.success("Internship deleted successfully");
    } catch (error) {
      console.error("Failed to delete internship", error);
      toast.error("Failed to delete internship");
    }
  };

  useEffect(() => {
    getInternships();
  }, []);

  // Pagination logic
  const indexOfLastInternship = currentPage * internshipsPerPage;
  const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
  const currentInternships = internships.slice(indexOfFirstInternship, indexOfLastInternship);
  const totalPages = Math.ceil(internships.length / internshipsPerPage);

  return (
    <>
      <HrNavbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Card 1: Post New Internship */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800">Post New Internship</h2>
              </div>
              <p className="text-gray-600 mb-6">Create and publish new internship opportunities for students</p>
              <a
                href="/HR/postInternship"
                className="block w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
              >
                Add Internship
              </a>
            </div>

            {/* Analytics Cards */}
            

            <HrNoticeCard />
          </div>

          {/* Middle Column: Manage Internships */}
          <div className={`bg-gray-100 rounded-xl h-fit shadow-md p-6 transition-all duration-300 ${currentInternships.length <= 2 ? "max-w-md mx-auto" : "max-w-4xl"}`}>
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <Edit2 className="h-6 w-6 text-purple-600" />
      <h2 className="text-lg font-bold text-gray-800">Manage Internships</h2>
    </div>
    <span className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600">
      {internships.length} total
    </span>
  </div>

  <div className="space-y-3 mb-4">
    {currentInternships.length > 0 ? (
      currentInternships.map((internship) => (
        <div key={internship.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {internship.position} @ {internship.company_name}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {internship.location}
                </span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" /> {internship.stipend}/mo
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {internship.duration} months
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {internship.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Start Date: {new Date(internship.starting_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Deadline to Apply: {new Date(internship.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-2">
              <a href={`/HR/editInternship/${internship.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                <Edit2 className="h-4 w-4" />
              </a>
              <button onClick={() => deleteInternship(internship.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-8">
        <FileText className="h-10 w-10 mx-auto text-gray-300" />
        <p className="text-gray-500 mt-2">No internships available</p>
      </div>
    )}
  </div>

  {internships.length > internshipsPerPage && (
    <div className="flex justify-between items-center mt-6">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="text-sm">
        Page {currentPage} of {totalPages}
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )}
</div>


          {/* Right Column */}
          <div className="space-y-6">
            <ApplicationDetails applicationCounts={applicationCounts} />
          </div>
        </div>
      </div>
    </>
  );
}
