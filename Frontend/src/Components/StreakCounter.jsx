import {Loader2, Flame, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import backendUrl from '../api';
import toast from 'react-hot-toast';

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);
  const [lastLogin, setLastLogin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get(`${backendUrl}/student/streak`, {
          headers: { 'Authorization': token }
        });
        
        setStreak(response.data.streak || 0);
        setLastLogin(response.data.lastLogin || null);
      } catch (error) {
        console.error("Failed to fetch streak data", error);
        toast.error("Failed to load login streak");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreakData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Login Streak
        </h3>
        {streak > 0 && (
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Current Streak</span>
            <span className="text-2xl font-bold text-gray-800">
              {streak} day{streak !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Last login: {formatDate(lastLogin)}</span>
          </div>

          {streak > 0 ? (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-1">
                {[...Array(Math.min(streak, 7))].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-full ${
                      i === streak - 1 ? 'bg-orange-500' : 'bg-orange-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Login tomorrow to keep your streak!
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Log in daily to start building your streak!
            </p>
          )}
        </div>
      )}
    </div>
  );
}