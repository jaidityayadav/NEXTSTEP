import { useState, useEffect } from 'react';
import axios from 'axios';
import backendUrl from '../api';
import toast from 'react-hot-toast';
import DidYouKnowCard from './DoyouKnow';
import { Edit2, User, GraduationCap, MapPin, Phone, Calendar,Clock,FileText, Search, ChevronLeft, ChevronRight, Heart, Loader2, Briefcase, Bookmark, CheckCircle } from 'lucide-react';
import { FooterSection } from './FooterSection';
import StreakCounter from './StreakCounter';
import { HRTipsCarousel } from './HRTipsCarousel';
import { StatusDisplay } from './StatusUpdater';
import { NoticesList } from './NoticesList';
import { useRef } from 'react';


export function StudentDashboard() {
    const internshipsRef = useRef(null);

    const [internships, setInternships] = useState([]);
    const [appliedInternships, setAppliedInternships] = useState([]);
    const [favoriteInternships, setFavoriteInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isApplying, setIsApplying] = useState(false);
    const [currentlyApplyingId, setCurrentlyApplyingId] = useState(null);
    const [activeTab, setActiveTab] = useState('available');
    const internshipsPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authorization");
                
                // Fetch internships
                const internshipsRes = await axios.get(`${backendUrl}/getinternships`);
                const sortedInternships = internshipsRes.data.internships?.sort((a, b) => 
                    new Date(b.created_at) - new Date(a.created_at)
                ) || [];
                setInternships(sortedInternships);

                // Fetch applied internships
                const appliedRes = await axios.get(`${backendUrl}/student/getAppliedInternships`, {
                    headers: { 'Authorization': token }
                });
                setAppliedInternships(appliedRes.data.appliedInternships || []);

                // Fetch favorite internships
                const favoritesRes = await axios.get(`${backendUrl}/student/getFavoriteInternships`, {
                    headers: { 'Authorization': token }
                });
                setFavoriteInternships(favoritesRes.data.favoriteInternships || []);
            } catch (error) {
                console.error("Failed to fetch data", error);
                toast.error("Failed to load data");
            }
        };

        fetchData();
    }, []);

    // Filter internships based on search and location
    const filteredInternships = internships.filter(internship => {
        const matchesSearch = searchTerm === '' || 
            internship.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.position.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLocation = locationFilter === '' || 
            internship.location.toLowerCase().includes(locationFilter.toLowerCase());
        
        return matchesSearch && matchesLocation;
    });

    // Get internships based on active tab
    const getCurrentInternships = () => {
        switch (activeTab) {
            case 'available':
                return filteredInternships.filter(
                    internship => !appliedInternships.some(applied => applied.id === internship.id)
                );
            case 'applied':
                return appliedInternships;
            case 'favorites':
                return filteredInternships.filter(
                    internship => favoriteInternships.some(fav => fav.id === internship.id)
                );
            default:
                return [];
        }
    };

    const currentInternships = getCurrentInternships();
    const indexOfLastInternship = currentPage * internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
    const paginatedInternships = currentInternships.slice(indexOfFirstInternship, indexOfLastInternship);
    const totalPages = Math.ceil(currentInternships.length / internshipsPerPage);

    // Get unique locations for filter dropdown
    const uniqueLocations = [...new Set(internships.map(internship => internship.location))];

    const handleApply = async (internshipId) => {
        try {
            setIsApplying(true);
            setCurrentlyApplyingId(internshipId);
    
            const token = localStorage.getItem("authorization");
            const response = await axios.post(
                `${backendUrl}/student/applyinternship`,
                { internshipId },
                { headers: { 'Authorization': token, 'Content-Type': 'application/json' } }
            );
    
            console.log("API Response:", response.data); // 🧪 Check what backend returns
    
            await new Promise(resolve => setTimeout(resolve, 2000));
    
            const appliedInternship = internships.find(i => i.id === internshipId);
            if (appliedInternship) {
                setAppliedInternships(prev => [...prev, appliedInternship]);
            }
    
            // ✅ More flexible success check
            if (
                response.status === 200 &&
                response.data?.message?.toLowerCase().includes("success")
            ) {
                toast.success('Application submitted successfully!');
            } else {
                toast.error(response.data?.message || 'Failed to apply.');
            }
    
        } catch (error) {
            console.error('Application failed:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application.');
        } finally {
            setIsApplying(false);
            setCurrentlyApplyingId(null);
        }
    };
    

    const handleFavorite = async (internshipId) => {
        try {
            const token = localStorage.getItem("authorization");
            const isCurrentlyFavorite = favoriteInternships.some(fav => fav.id === internshipId);
            
            if (isCurrentlyFavorite) {
                await axios.delete(`${backendUrl}/student/favoriteinternship/${internshipId}`, {
                    headers: { 'Authorization': token }
                });
                setFavoriteInternships(prev => prev.filter(fav => fav.id !== internshipId));
                toast.success('Removed from favorites');
            } else {
                const response = await axios.post(
                    `${backendUrl}/student/favorite`,
                    { internshipId },
                    { headers: { 'Authorization': token } }
                );
                const newFavorite = internships.find(i => i.id === internshipId);
                if (newFavorite) {
                    setFavoriteInternships(prev => [...prev, newFavorite]);
                    toast.success('Added to favorites');
                }
            }
        } catch (error) {
            console.error('Failed to update favorite', error);
            toast.error('Failed to update favorite');
        }
    };

    const isFavorite = (internshipId) => {
        return favoriteInternships.some(fav => fav.id === internshipId);
    };

    const isApplied = (internshipId) => {
        return appliedInternships.some(applied => applied.id === internshipId);
    };

    return (
        <div className="min-h-screen  relative overflow-x-hidden">
       
            {isApplying && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-lg font-medium text-gray-800">Submitting your application...</p>
                    </div>
                </div>
            )}

            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isApplying ? 'opacity-50' : ''}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side - Stats Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Stats Cards */}
                        <div className="bg-white rounded-xl shadow-md p-6"  id="internships-container">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Internship Stats</h2>
                            <div className="space-y-4">
                                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                                        <Briefcase className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        
                                        <p className="text-sm text-gray-500">Total Internships</p>
                                        <p className="text-2xl font-bold text-gray-800">{internships.length}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                                    <div className="p-3 rounded-full bg-green-100 mr-4">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Applied</p>
                                        <p className="text-2xl font-bold text-gray-800">{appliedInternships.length}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                                    <div className="p-3 rounded-full bg-purple-100 mr-4">
                                        <Bookmark className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Favorites</p>
                                        <p className="text-2xl font-bold text-gray-800">{favoriteInternships.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
              
                        {/* Did You Know Card at the bottom */}
                        <StatusDisplay/>
                        <StreakCounter/>
                        <DidYouKnowCard />
                        
                    </div>
                  
                    {/* Right Side - Internships List */}
                    <div className="lg:col-span-2">
                     
             
                    <div className="bg-white rounded-xl shadow-md p-6 ">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col w-full sm:w-auto sm:flex-row sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
                {activeTab === 'available' ? 'Available Internships' : 
                 activeTab === 'applied' ? 'Applied Internships' : 'Favorite Internships'}
            </h2>
            <div className="flex border rounded-lg overflow-x-auto w-86 justify-center mr-8 md:">
                <button
                    className={`px-3 py-1 text-sm ${activeTab === 'available' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => {
                        setActiveTab('available');
                        setCurrentPage(1);
                    }}
                >
                    Available
                </button>
                <button
                    className={`px-3 py-1 text-sm ${activeTab === 'applied' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => {
                        setActiveTab('applied');
                        setCurrentPage(1);
                    }}
                >
                    Applied
                </button>
                <button
                    className={`px-3 py-1 text-sm ${activeTab === 'favorites' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => {
                        setActiveTab('favorites');
                        setCurrentPage(1);
                    }}
                >
                    Favorites
                </button>
            </div>
        </div>
        
        {activeTab === 'available' && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by company or position"
                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                
                <select
                    className="md:w-32 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={locationFilter}
                    onChange={(e) => {
                        setLocationFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                    ))}
                </select>
            </div>
        )}
    </div>

    {/* ✅ Container with ID for scrollIntoView */}
    <div id="internships-container" className="space-y-4">
        {paginatedInternships.length > 0 ? (
            paginatedInternships.map((internship) => (
                <div
                    key={internship.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-50 hover:from-gray-100 hover:to-gray-100 transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                >
                    <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <span className="text-xl font-medium text-blue-600">{internship.company_name[0]}</span>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{internship.position}</h3>
                                <p className="text-sm text-gray-700 mb-2">{internship.company_name}</p>
                                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span>{internship.location}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span>Starting Date: {new Date(internship.starting_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                            <div className="flex items-start gap-1">
                                <FileText className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                                <p className="line-clamp-2">{internship.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        {activeTab === 'available' && !isApplied(internship.id) ? (
                            <>
                                <button
                                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg border bg-blue-600 text-white text-sm sm:text-base`}
                                    onClick={() => handleApply(internship.id)}
                                    disabled={isApplying && currentlyApplyingId === internship.id}
                                >
                                    Apply
                                </button>
                                <button
                                    className={`p-2 rounded-lg border ${
                                        isFavorite(internship.id) 
                                            ? 'bg-red-600 text-white' 
                                            : 'bg-gray-300 text-gray-700'
                                    }`}
                                    onClick={() => handleFavorite(internship.id)}
                                >
                                    <Heart 
                                        className="h-4 w-4 sm:h-5 sm:w-5" 
                                        fill={isFavorite(internship.id) ? 'currentColor' : 'none'}
                                    />
                                </button>
                            </>
                        ) : isApplied(internship.id) ? (
                            <span className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-green-600 text-white text-sm sm:text-base">
                                Applied
                            </span>
                        ) : (
                            <button
                                className={`p-2 rounded-lg border ${
                                    isFavorite(internship.id) 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-300 text-gray-700'
                                }`}
                                onClick={() => handleFavorite(internship.id)}
                            >
                                <Heart 
                                    className="h-4 w-4 sm:h-5 sm:w-5" 
                                    fill={isFavorite(internship.id) ? 'currentColor' : 'none'}
                                />
                            </button>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-8 text-gray-500">
                {activeTab === 'available' 
                    ? 'No available internships found matching your search/filter criteria.'
                    : activeTab === 'applied'
                        ? 'You haven\'t applied to any internships yet.'
                        : 'You haven\'t favorited any internships yet.'}
            </div>
        )}
    </div>

    {currentInternships.length > internshipsPerPage && (
    <div className="flex justify-between items-center mt-6">
        <button
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            onClick={() => {
                setCurrentPage(prev => prev - 1);
                setTimeout(() => {
                    const firstCard = document.querySelector('#internships-container > div:first-child');
                    if (firstCard) {
                        firstCard.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 0);
            }}
            disabled={currentPage === 1}
        >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            <span className="hidden sm:inline">Previous</span>
        </button>
        
        <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
        </span>
        
        <button
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            onClick={() => {
                setCurrentPage(prev => prev + 1);
                setTimeout(() => {
                    const firstCard = document.querySelector('#internships-container > div:first-child');
                    if (firstCard) {
                        firstCard.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 0);
            }}
            disabled={currentPage === totalPages}
        >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
        </button>
    </div>
)}
</div>

                       <div className='mt-8'> <HRTipsCarousel/> </div>
                       <div className='mt-8'> <NoticesList/> </div>
                    </div>
                   
                </div>
            </div>
            
            <FooterSection/>
        </div>
    );
}