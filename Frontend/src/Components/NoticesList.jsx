import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Megaphone,
  CalendarDays,
  User,
  Mail
} from 'lucide-react';
import backendUrl from '../api';

export function NoticesList() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${backendUrl}/notice/all`);
        setNotices(response.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
        toast.error("Failed to fetch notices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === notices.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? notices.length - 1 : prev - 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="ml-4 text-lg text-gray-700">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
          <div className="flex items-center space-x-3">
            <Megaphone className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">HR Announcements</h1>
              <p className="text-indigo-100 text-sm">Important updates from the HR team</p>
            </div>
          </div>
        </div>

        {/* Notices Carousel */}
        <div className="relative p-6 min-h-[300px]">
          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="text-lg text-gray-600">No notices available yet</p>
              <p className="text-sm text-gray-500">Check back later!</p>
            </div>
          ) : (
            <>
              {/* Notice Card (Sliding) */}
              <div 
                key={notices[currentSlide].id}
                className="p-6 rounded-lg transition-all duration-500 transform hover:scale-[1.01]"
                style={{
                  background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                  border: "1px solid #e0e7ff",
                }}
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar (HR Initial) */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {notices[currentSlide].postedBy.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Notice Content */}
                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {notices[currentSlide].title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 mb-4">
                      {notices[currentSlide].message}
                    </p>

                    {/* Meta Info (Author, Date) */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-indigo-500" />
                        <span>{notices[currentSlide].postedBy.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-indigo-500" />
                        <span>{notices[currentSlide].postedBy.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-4 w-4 text-indigo-500" />
                        <span>{new Date(notices[currentSlide].createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 transition"
                  aria-label="Previous notice"
                >
                  <ChevronLeft className="h-5 w-5 text-indigo-600" />
                </button>

                {/* Dot Indicators */}
                <div className="flex space-x-2">
                  {notices.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 w-2 rounded-full transition ${currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
                      aria-label={`Go to notice ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 transition"
                  aria-label="Next notice"
                >
                  <ChevronRight className="h-5 w-5 text-indigo-600" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}