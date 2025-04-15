"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Roadtrip } from "@/types/roadtrip";


interface newRoadtripProps {
    name: string;
    roadtripMembers: [];
    roadtripDescription: string;
  }

export default function MyRoadtrips() {
    const [roadtrips, setRoadtrips] = useState<Roadtrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiService = useApi();
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchRoadtrips = async () => {
            // Check token directly from localStorage for debugging
            const token = localStorage.getItem("token");
            console.log("Token in my-roadtrips page:", token);
            
            // If user is not logged in, don't try to fetch roadtrips
            if (!isLoggedIn || !token) {
                console.log("User not logged in or no token found");
                setError("Please login first in order to access your roadtrips.");
                setLoading(false);
                // Redirect to login page
                router.push('/login');
                return;
            }
            
            try {
                setLoading(true);
                console.log("Fetching roadtrips with token:", token);
                
                // Add a small delay to ensure token is properly set in headers
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const data = await apiService.get<Roadtrip[]>("/roadtrips");
                console.log("API response:", data);
                
                // Log roadtrips without ID for debugging
                if (Array.isArray(data)) {
                    data.forEach(roadtrip => {
                        if (roadtrip.roadtripId === undefined) {
                            console.warn("Roadtrip without ID:", roadtrip);
                        }
                    });
                    
                    setRoadtrips(data);
                    setError(null);
                } else {
                    console.error("Unexpected response format:", data);
                    setError("Received invalid data format from server.");
                }
            } catch (err) {
                console.error("Error fetching roadtrips:", err);
                
                // Check if it's a 401 error (not authenticated)
                const error = err as { status?: number };
                if (error && error.status === 401) {
                    console.log("Authentication error (401)");
                    // Clear token and redirect to login
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    setError("Your session has expired. Please login again.");
                    // Redirect to login page
                    router.push('/login');
                } else {
                    setError("Failed to load roadtrips. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoadtrips();
    }, [apiService, isLoggedIn, router]);

    const handleRoadtripClick = (roadtripId: number | undefined) => {
        if (roadtripId === undefined) {
            console.error("Roadtrip ID is undefined");
            return;
        }
        router.push(`/my-roadtrips/${roadtripId}`);
    };

    const handleNewRoadtripClick = async () => {
        // If user is not logged in, redirect to login page
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        
        try {
            // Create a new empty roadtrip
            const newRoadtrip: newRoadtripProps = {
                name: "New Roadtrip",
                roadtripMembers: [],
                roadtripDescription: ""
            };
            
            console.log("Creating new roadtrip...");
            
            // Post the new roadtrip to the API
            const createdRoadtrip = await apiService.post<Roadtrip>("/roadtrips", newRoadtrip);
            console.log("Created roadtrip:", createdRoadtrip);
            
            // Redirect to the settings page for the new roadtrip
            // Use roadtripId from backend
            const roadtripId = createdRoadtrip.roadtripId;
            
            if (roadtripId === undefined) {
                throw new Error("Created roadtrip has no ID");
            }
            
            router.push(`/my-roadtrips/${roadtripId}/settings`);
        } catch (err) {
            console.error("Error creating new roadtrip:", err);
            
            // Check if it's an authentication error
            const error = err as { status?: number };
            if (error && error.status === 401) {
                setError("Please login first in order to create a roadtrip.");
                router.push('/login');
            } else {
                setError("Failed to create new roadtrip. Please try again later.");
            }
        }
    };

    const formatMembersList = (members: { id: string; name: string }[]) => {
        if (!members || members.length === 0) return "No members";
        if (members.length === 1) return members[0].name;
        
        const firstTwo = members.slice(0, 2).map(m => m.name).join(", ");
        const remaining = members.length - 2;
        
        return remaining > 0 
            ? `${firstTwo} + ${remaining} more` 
            : firstTwo;
    };

    return (
        <>
            <Header />
            <div style={{ padding: "32px", maxWidth: "1500px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "32px", marginBottom: "8px", textAlign: "left", marginLeft: "40px" }}>My Roadtrips</h1>
                <hr style={{ border: "none", borderBottom: "1px solid #ccc", width: "100%", marginBottom: "32px" }} />
                
                {loading && <p>Loading roadtrips...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                {!loading && !error && (
                    <div key="roadtrips-container" style={{width: '100%', display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px'}}>
                        {/* Display existing roadtrips */}
                        {roadtrips.map((roadtrip, index) => (
                            <div 
                                key={`roadtrip-${roadtrip.roadtripId || index}`}
                                style={{
                                    width: 328, 
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                                    flexDirection: 'column', 
                                    justifyContent: 'flex-start', 
                                    alignItems: 'flex-start', 
                                    display: 'flex',
                                    cursor: roadtrip.roadtripId ? 'pointer' : 'not-allowed'
                                }}
                                onClick={() => {
                                    console.log("Clicked roadtrip with ID:", roadtrip.roadtripId);
                                    handleRoadtripClick(roadtrip.roadtripId);
                                }}
                            >
                                <div style={{width: 328, height: 100, background: '#D9D9D9', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <div style={{color: 'white', fontSize: 24, fontFamily: 'Manrope', fontWeight: '700'}}>
                                        {roadtrip.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div style={{width: 328, height: 100, textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 32, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word'}}>
                                    {roadtrip.name}
                                </div>
                                <div style={{width: 328, height: 40, textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word'}}>
                                    {formatMembersList(roadtrip.roadtripMembers)}
                                </div>
                                {(roadtrip.description || roadtrip.roadtripDescription) && (
                                    <div style={{width: '100%', justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
                                        <div style={{width: '100%', padding: '0 10px', justifyContent: 'space-between', alignItems: 'center', display: 'flex'}}>
                                            <div style={{width: '100%', height: 35, justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word'}}>
                                                {roadtrip.description || roadtrip.roadtripDescription}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* New Trip Card - always show exactly one */}
                        <div 
                            key="new-trip-card"
                            data-new-blank="New" 
                            data-state="Default" 
                            onClick={handleNewRoadtripClick}
                            style={{
                                width: 328, 
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                                flexDirection: 'column', 
                                justifyContent: 'flex-start', 
                                alignItems: 'flex-start', 
                                display: 'flex',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{width: 328, height: 100, background: '#D9D9D9', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <div style={{color: 'white', fontSize: 24, fontFamily: 'Manrope', fontWeight: '700'}}>+</div>
                            </div>
                            <div style={{width: 328, height: 100, textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'rgba(0, 0, 0, 0.40)', fontSize: 32, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word'}}>New Trip</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
