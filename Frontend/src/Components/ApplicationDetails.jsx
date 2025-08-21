import { BarChart2, FileText, ChevronLeft, ChevronRight, Users2,Users,ArrowUp,Briefcase,CheckCircle, FileCheck2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "../api";
import toast from "react-hot-toast";

const ApplicationDetails = () => {
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [uniqueStudents, setUniqueStudents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 2;
  


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

  useEffect(() => {
      getInternships();
    }, []);

    const rawPercentage = (internships.length/applications.length) * 100;
const cappedPercentage = Math.min(rawPercentage, 100);
  const AvgStipend = () => {
    const [avgStipend, setAvgStipend] = useState(null); // Store the average stipend value
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
      // Fetch the average stipend when the component mounts
      const fetchAvgStipend = async () => {
        try {
          const token = localStorage.getItem("authorization");
          setLoading(true);
          setError(null); // Reset any previous errors

          // Fetch data from the backend using Axios
          const response = await axios.get(`${backendUrl}/hr/avgsalary`, {
            headers: {
              'Authorization': token, // Assuming JWT token is stored in localStorage
            },
          });

          // Update state with fetched stipend value
          setAvgStipend(response.data.averageStipend);
        } catch (err) {
          // Handle error if request fails
          setError(err.response?.data?.message || 'Something went wrong');
        } finally {
          setLoading(false); // Set loading to false once the request completes
        }
      };

      fetchAvgStipend(); // Call the function to fetch data
    }, []); // No dependencies, so it runs only once on mount

    if (loading) {
      return <p>Loading...</p>; // Display loading text while fetching data
    }

    if (error) {
      return <p className="text-red-500">{error}</p>; // Display error if there's an issue
    }

    return (
      <p className="text-2xl font-bold mt-2">
        {avgStipend !== null ? `₹${avgStipend.toLocaleString()}` : 'No stipend data available'}
      </p>
    );
  };

  const handleStatusChange = async (appId, newStatus) => {
    const token = localStorage.getItem("authorization");

    try {
      const validStatuses = ["Pending Review", "Approved", "Interview Stage", "Rejected"];
      if (!validStatuses.includes(newStatus)) {
        toast.error("Invalid status");
        return;
      }

      await axios.put(`${backendUrl}/application/${appId}`, {
        status: newStatus,
      }, {
        headers: { authorization: token }
      });

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Status update failed", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("authorization");
      try {
        const response = await axios.get(`${backendUrl}/hr/internships`, {
          headers: { authorization: token },
        });

        const allInternships = response.data.internships || [];

        const allApplications = allInternships.flatMap((internship) =>
          internship.applications.map((app) => ({
            id: app.id,
            studentName: app.student.name,
            studentEmail: app.student.email,
            status: app.status,
            internshipPosition: internship.position,
            company: internship.company_name,
          }))
        );

        setApplications(allApplications);
      } catch (error) {
        console.error("Failed to fetch applications", error);
        toast.error("Failed to load applications");
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const uniqueStudentEmails = new Set(applications.map((app) => app.studentEmail));
    setUniqueStudents(uniqueStudentEmails.size);
  }, [applications]);

  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApps = applications.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  return (

    
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
    <div className="grid grid-cols-2 gap-4">
                  {/* Applications Received */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">Applications</h3>
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{applications.length}</p>
                    <p className="text-xs text-green-500 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" /> 12% from last month
                    </p>
                  </div>
    
                  {/* Active Internships */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">Active</h3>
                      <Briefcase className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{internships.length}</p>
                    <p className="text-xs text-gray-500">Open positions</p>
                  </div>
    
                  {/* Approval Rate */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">Approval Rate</h3>
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">
  {Math.floor(cappedPercentage)}%
</p>
<div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
  <div
    className="bg-purple-500 h-1.5 rounded-full"
    style={{ width: `${cappedPercentage}%` }}
  ></div>
</div>



                  </div>
    
                  {/* Avg. Stipend */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">Avg. Stipend</h3>
                      <span className="h-5 w-5 text-amber-500">₹</span>
                    </div>
                    <AvgStipend />
                  </div>
                </div>
      {/* Applications Card */}
      <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 ">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Applications</h2>
        </div>

        {currentApps.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <ul className="space-y-4">
            {currentApps.map((app) => (
              <li key={app.id} className="border border-gray-200 rounded-lg p-4">
                <p className="text-lg font-semibold text-gray-800">{app.studentName}</p>
                <p className="text-sm text-gray-600">{app.studentEmail}</p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Internship:</span> {app.internshipPosition} at {app.company}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">Status:</span> {app.status}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleStatusChange(app.id, "Approved")}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(app.id, "Rejected")}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {applications.length > applicationsPerPage && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-sm text-gray-700 disabled:text-gray-400"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm text-gray-700 disabled:text-gray-400"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>


     
    </div>
  );
};

export default ApplicationDetails;
