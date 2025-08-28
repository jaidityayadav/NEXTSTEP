import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbarnew } from '../Components/Navbarnew';
import backendUrl from '../api';

export function InternshipPage() {
    const [internships, setInternships] = useState([]);
    const [disabledButtons, setDisabledButtons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setInternships(res.Internships || []);
    }, []);

    const apply = async (internship, index) => {
        try {
            const response = await fetch(`${backendUrl}/student/applyInternship`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ opp: internship }),
            });

            if (response.ok) {
                console.log('Applied successfully');
                setDisabledButtons((prev) => [...prev, index]);
                const responseData = await response.json();
                console.log(responseData);
            } else {
                console.error('Application failed');
                const errorData = await response.json();
                console.error(errorData);
                navigate('/login'); // Redirect to login on failure
            }
        } catch (error) {
            console.error('Error applying:', error);
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#020024] via-[#386060] to-[#386060] min-h-screen">
            <Navbarnew />

            <main className="py-10 px-4">
                <section className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Available Internships
                    </h2>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {internships.length > 0 ? (
                            internships.map((internship, index) => (
                                <div
                                    key={index}
                                    className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {internship.Company || 'N/A'}
                                        </h3>
                                        <h4 className="text-lg text-gray-600 mb-4">
                                            {internship.Role || 'N/A'}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            <strong>Stipend:</strong>{' '}
                                            {internship.Location?.Stipend || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <strong>Internship Location:</strong>{' '}
                                            {internship.Internship?.Location || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <strong>Duration:</strong>{' '}
                                            {internship.Internship?.Duration || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <strong>Start Date:</strong>{' '}
                                            {internship.Internship?.StartDate || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-100 p-4 flex justify-center">
                                        <button
                                            className={`px-4 py-2 rounded-lg font-medium ${disabledButtons.includes(index)
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            onClick={() => apply(internship, index)}
                                            disabled={disabledButtons.includes(index)}
                                        >
                                            {disabledButtons.includes(index) ? 'Applied' : 'Apply'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center col-span-3">
                                Loading internships...
                            </p>
                        )}
                    </div>
                </section>
            </main>

            {/* <FooterSection/> */}
        </div>
    );
}
