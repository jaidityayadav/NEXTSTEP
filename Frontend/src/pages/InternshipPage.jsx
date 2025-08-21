import Papa from 'papaparse';
import { useEffect, useState, useRef } from 'react';
import { Navbarnew } from '../Components/Navbarnew';

export function InternshipPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const jobsPerPage = 5;
  const topRef = useRef(null);

  // Fetch data
  useEffect(() => {
    setIsLoading(true);
    fetch('/job.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: header => header.trim(),
          complete: (results) => {
            const validJobs = results.data.filter(job => job.job_location && job.job_location.trim() !== '');
            setJobs(validJobs);
            setFilteredJobs(validJobs);
            setIsLoading(false);
          },
          error: () => {
            setIsLoading(false);
          }
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let tempJobs = jobs.filter(job => job.job_location && job.job_location.trim() !== '');

    if (searchQuery) {
      tempJobs = tempJobs.filter(job =>
        job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLocation) {
      tempJobs = tempJobs.filter(job => job.job_location === selectedLocation);
    }

    setFilteredJobs(tempJobs);
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, jobs]);

  // Scroll to top when page changes
  useEffect(() => {
    if (topRef.current) {
      try {
        topRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } catch (e) {
        topRef.current.scrollIntoView(true);
      }
    }
  }, [currentPage]);

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Responsive job locations - ensure no empty locations
  const locations = [...new Set(jobs
    .filter(job => job.job_location && job.job_location.trim() !== '')
    .map(job => job.job_location)
  )];

  return (
    <>
      <Navbarnew />
      <div ref={topRef} className="min-h-screen bg-gradient-to-br from-[#1c1a3b] via-[#2a2748] to-[#379090] mx-auto px-4 py-6 md:px-8 md:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header - Responsive text sizing */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Find Your Dream Internship
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300">
              Browse through our curated list of internship opportunities
            </p>
          </div>

          {/* Search & Filter - Stack on mobile, row on larger screens */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 md:mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              {/* Search with responsive sizing */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  className="w-full p-2 sm:p-3 pl-8 sm:pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute left-2 sm:left-3 top-2.5 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              {/* Location dropdown - full width on mobile */}
              <select
                className="p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 text-sm sm:text-base"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            {/* Results count - smaller text on mobile */}
            <div className="mt-3 text-white text-xs sm:text-sm">
              Showing {filteredJobs.length} jobs ,internships
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedLocation && ` in ${selectedLocation}`}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-40 sm:h-64">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredJobs.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-white/10 rounded-xl backdrop-blur-sm">
              <svg
                className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-base sm:text-lg font-medium text-white">No internships found</h3>
              <p className="mt-1 text-gray-300 text-sm sm:text-base">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}

          {/* Job Listings - Responsive card layout */}
          {!isLoading && filteredJobs.length > 0 && (
            <>
              <ul className="space-y-3 sm:space-y-4 mb-6 md:mb-8">
                {currentJobs.map((job, index) => (
                  <li key={index} className="bg-white/90 hover:bg-white transition-all duration-200 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{job.job_title}</h2>
                        <p className="text-base sm:text-lg text-gray-700 mb-2">{job.company_name}</p>
                        
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                          <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                            {job.job_location}
                          </span>
                          {job.is_remote?.toLowerCase() === 'true' && (
                            <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Apply Now
                          <svg
                            className="ml-1 sm:ml-2 -mr-0.5 sm:-mr-1 h-3 w-3 sm:h-4 sm:w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </a>
                        
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Responsive Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-300">
                  Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} results
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center text-xs sm:text-sm ${
                      currentPage === 1 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-1 sm:px-2 text-white text-xs sm:text-sm">...</span>
                    )}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                          currentPage === totalPages
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  <button
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center text-xs sm:text-sm ${
                      currentPage === totalPages
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}