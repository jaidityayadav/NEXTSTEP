import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import backendUrl from '../api';
import { FiClock, FiCheckCircle, FiXCircle, FiInfo, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';

export function StatusDisplay() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const sliderRef = useRef(null); // Removed the TypeScript-specific type for JSX

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('authorization');
        if (!token) {
          setError('No authorization token found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${backendUrl}/applications`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.data && Array.isArray(response.data.applications)) {
          setApplications(response.data.applications);
        } else {
          setError('Invalid data format received');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statusConfig = {
    Pending: {
      icon: <FiClock className="mr-1" />,
      color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      bgColor: 'bg-yellow-100',
    },
    Approved: {
      icon: <FiCheckCircle className="mr-1" />,
      color: 'bg-green-50 text-green-800 border-green-200',
      bgColor: 'bg-green-100',
    },
    Rejected: {
      icon: <FiXCircle className="mr-1" />,
      color: 'bg-red-50 text-red-800 border-red-200',
      bgColor: 'bg-red-100',
    },
    default: {
      icon: <FiInfo className="mr-1" />,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      bgColor: 'bg-blue-100',
    },
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.default;
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      handlePrev();
    } else if (info.offset.x < -threshold && currentIndex < applications.length - 1) {
      handleNext();
    } else {
      controls.start({ x: -currentIndex * 100 + '%' });
    }
  };

  const handleNext = () => {
    if (currentIndex < applications.length - 1) {
      setCurrentIndex(currentIndex + 1);
      controls.start({ x: -(currentIndex + 1) * 100 + '%' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      controls.start({ x: -(currentIndex - 1) * 100 + '%' });
    }
  };

  return (
    <div className="h-fit bg-gray-50 py-8 px-4 sm:px-6 lg:px-8  rounded-lg ">
      <div className="max-w-7xl mx-auto h-fit">
        {/* Header Section with White Background */}
        <div className=" bg-blue-100  rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold  text-gray-900">Your Applications</h2>
              <p className="text-gray-600">Track all your job applications in one place</p>
            </div>
            {applications.length > 0 && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                {applications.length} {applications.length === 1 ? 'application' : 'applications'}
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 mb-8">
            <div className="flex items-center">
              <FiXCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {Array.isArray(applications) && applications.length > 0 ? (
          <div className="relative overflow-hidden">
            {/* Slider Navigation Arrows */}
            {applications.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none ${
                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <FiChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === applications.length - 1}
                  className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none ${
                    currentIndex === applications.length - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <FiChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Slider Container */}
            <motion.div
              ref={sliderRef}
              className="flex"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={controls}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ width: `${applications.length * 100}%` }}
            >
              {applications.map((application, index) => (
                <div
  key={index}
  className="w-full px-2"
  style={{ flex: '0 0 100%' }}
>
  <div className="bg-blue-50 rounded-xl shadow-sm p-4 h-full">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{application.company_name}</h3>
        <p className="text-gray-700 text-sm">{application.position}</p>
      </div>
      {application.logo && (
        <img 
          src={application.logo} 
          alt={`${application.company_name} logo`} 
          className="h-10 w-10 object-contain rounded"
        />
      )}
    </div>

    <div className="mt-4 space-y-2">
      <div className="flex items-center flex-wrap">
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
          getStatusConfig(application.status).color
        } border`}>
          {getStatusConfig(application.status).icon}
          {application.status}
        </span>
        {application.applied_date && (
          <span className="ml-3 text-xs text-gray-500">
            Applied on {new Date(application.applied_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {application.notes && (
        <div className="text-xs text-gray-600 bg-white border border-gray-200 p-2 rounded-lg">
          <p className="font-medium mb-0.5">Notes:</p>
          <p>{application.notes}</p>
        </div>
      )}

      {application.link && (
        <a 
          href={application.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
        >
          <FiExternalLink className="mr-1" />
          View job posting
        </a>
      )}
    </div>
  </div>
</div>

              ))}
            </motion.div>

            {/* Slider Indicators */}
            {applications.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {applications.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      controls.start({ x: -index * 100 + '%' });
                    }}
                    className={`h-2 w-2 rounded-full ${
                      index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  ></button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">No applications found.</p>
        )}
      </div>
    </div>
  );
}
