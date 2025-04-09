"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useApi } from "@/hooks/useApi";
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

    useEffect(() => {
        const fetchRoadtrips = async () => {
            try {
                setLoading(true);
                const data = await apiService.get<Roadtrip[]>("/roadtrips");
                console.log("API response:", data);
                
                // Log roadtrips without ID for debugging
                data.forEach(roadtrip => {
                    if (roadtrip.id === undefined) {
                        console.warn("Roadtrip without ID:", roadtrip);
                    }
                });
                
                console.log("All roadtrips:", data);
                setRoadtrips(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching roadtrips:", err);
                setError("Failed to load roadtrips. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoadtrips();
    }, [apiService]);

    const handleRoadtripClick = (id: number | undefined) => {
        if (id === undefined) {
            console.error("Roadtrip ID is undefined");
            return;
        }
        router.push(`/my-roadtrips/${id}`);
    };

    const handleNewRoadtripClick = async () => {
        try {
            // Create a new empty roadtrip without Id
            const newRoadtrip: newRoadtripProps = {
                name: "",
                roadtripMembers: [],
                roadtripDescription: ""
            };
        
            
            // Post the new roadtrip to the API
            const createdRoadtrip = await apiService.post<Roadtrip>("/roadtrips", newRoadtrip);
            
            // Redirect to the settings page for the new roadtrip
            // Use id (from backend) or fallback to roadtripId (for backward compatibility)
            const roadtripId = createdRoadtrip.id || createdRoadtrip.roadtripId;
            router.push(`/my-roadtrips/${roadtripId}/settings`);
        } catch (err) {
            console.error("Error creating new roadtrip:", err);
            setError("Failed to create new roadtrip. Please try again later.");
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
            <Header isLoggedIn={true} />
            <div style={{ padding: "32px", maxWidth: "1500px", margin: "0 auto" }}>
                <h1>My Roadtrips</h1>
                
                {loading && <p>Loading roadtrips...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                {!loading && !error && (
                    <div key="roadtrips-container" style={{width: '100%', display: 'flex', flexWrap: 'wrap', gap: '20px', borderRadius: 5, border: '1px #9747FF solid', padding: '20px'}}>
                        {/* Display existing roadtrips */}
                        {roadtrips.map((roadtrip, index) => (
                            <div 
                                key={`roadtrip-${roadtrip.id || index}`}
                                style={{
                                    width: 328, 
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                                    flexDirection: 'column', 
                                    justifyContent: 'flex-start', 
                                    alignItems: 'flex-start', 
                                    display: 'flex',
                                    cursor: roadtrip.id ? 'pointer' : 'not-allowed'
                                }}
                                onClick={() => {
                                    console.log("Clicked roadtrip with ID:", roadtrip.id);
                                    handleRoadtripClick(roadtrip.id);
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
