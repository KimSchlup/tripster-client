"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { RoadtripMember } from "@/types/roadtripMember";
import BackToMapButton from "@/components/BackToMapButton";
import EmergencyContactList from "@/components/EmergencyContactList";

function EmergencyContactsContent() {
  const params = useParams();
  const id = params.id as string;
  const apiService = useApi();

  const [members, setMembers] = useState<RoadtripMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch roadtrip members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiService.get<RoadtripMember[]>(
          `/roadtrips/${id}/members`
        );
        setMembers(data);
      } catch (err) {
        console.error("Failed to fetch roadtrip members", err);
        setError("Failed to load roadtrip members");
      }
    };

    fetchMembers();
  }, [id, apiService]);

  // Set loading to false after members are fetched
  useEffect(() => {
    if (members.length > 0) {
      setLoading(false);
    }
  }, [members]);

  return (
    <>
      <Header />
      <div
        className="container"
        style={{
          padding: "16px",
          margin: "16px auto 0",
          maxWidth: "1400px",
          position: "relative",
        }}
      >
        <BackToMapButton roadtripId={id} />

        {/* Add spacing div to prevent overlap with the button */}
        <div style={{ height: "50px" }}></div>

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <p style={{ fontSize: "18px" }}>Loading emergency contacts...</p>
          </div>
        )}

        {error && (
          <div
            style={{
              background: "rgba(230, 57, 59, 0.1)",
              border: "1px solid #E6393B",
              color: "#E6393B",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                color: "#090909",
                fontSize: 36,
                fontFamily: "Manrope",
                fontWeight: 700,
                lineHeight: "48px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Emergency Contacts</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 0,
                border: "1.5px solid #090909",
                marginBottom: "40px",
              }}
            ></div>

            {members.length === 0 ? (
              <div
                style={{
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: 10,
                  padding: "40px 20px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "18px",
                    color: "#666",
                  }}
                >
                  No roadtrip members found.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                }}
              >
                {members.map((member) => (
                  <div
                    key={member.userId}
                    style={{
                      background: "white",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      borderRadius: 10,
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        color: "black",
                        fontSize: 24,
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        marginBottom: "20px",
                      }}
                    >
                      {member.username}
                    </div>

                    <EmergencyContactList
                      userId={String(member.userId)}
                      readOnly={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default function EmergencyContactsPage() {
  return (
    <ProtectedRoute>
      <EmergencyContactsContent />
    </ProtectedRoute>
  );
}
