import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, UserRound } from 'lucide-react';

export function HRTipsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const tips = [
    {
      avatar: "👩‍💼",
      message: "Always customize your resume for each internship application - HRs spot generic resumes instantly!",
      name: "Priya, HR at Google"
    },
    {
      avatar: "👨‍💼",
      message: "In interviews, focus on what you learned from projects, not just what you built.",
      name: "Rahul, Talent Acq. at Amazon"
    },
    {
      avatar: "👩‍💻",
      message: "Include 2-3 measurable achievements in your resume under each experience.",
      name: "Ananya, Campus Recruiter"
    },
    {
      avatar: "🧑‍💼",
      message: "Research the company's values and mention how they align with yours during interviews.",
      name: "Arjun, HR at Microsoft"
    },
    {
      avatar: "👩‍🎓",
      message: "Even if rejected, always ask for feedback - it shows growth mindset to HR teams.",
      name: "Neha, Early Career Recruiter"
    }
  ];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prev) => (prev + 1) % tips.length),
      3000
    );

    return () => resetTimeout();
  }, [currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <UserRound className="h-5 w-5 text-purple-600" />
        HR Pro Tips
      </h3>
      
      <div className="relative h-40">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`absolute inset-0 p-4 transition-opacity duration-500 flex flex-col items-center text-center ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="text-4xl mb-2">{tip.avatar}</div>
            <p className="text-sm text-gray-700 mb-2 italic">"{tip.message}"</p>
            <p className="text-xs text-gray-500 mt-auto">— {tip.name}</p>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-1 mt-4">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to tip ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}