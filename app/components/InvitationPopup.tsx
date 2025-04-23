"use client";

import { useState } from "react";
import { Roadtrip } from "@/types/roadtrip";
import { InvitationStatus } from "@/types/roadtripMember";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

interface InvitationPopupProps {
  roadtrip: Roadtrip;
  onClose: () => void;
  onStatusChange: () => void;
}

export default function InvitationPopup({ roadtrip, onClose, onStatusChange }: InvitationPopupProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const apiService = useApi();
  const { userId } = useAuth();

  const handleAccept = async () => {
    if (!roadtrip.roadtripId || !userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to accept the invitation
      await apiService.put(`/roadtrips/${roadtrip.roadtripId}/members/${userId}`, {
        invitationStatus: InvitationStatus.ACCEPTED
      });
      
      setSuccess("Invitation accepted successfully!");
      
      // Notify parent component and close after a delay
      // Use a longer delay to ensure the API has time to process the status change
      setTimeout(() => {
        onStatusChange();
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError("Failed to accept invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!roadtrip.roadtripId || !userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to decline the invitation
      await apiService.put(`/roadtrips/${roadtrip.roadtripId}/members/${userId}`, {
        invitationStatus: InvitationStatus.DECLINED
      });
      
      setSuccess("Invitation declined.");
      
      // Notify parent component and close after a delay
      // Use a longer delay to ensure the API has time to process the status change
      setTimeout(() => {
        onStatusChange();
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error declining invitation:", err);
      setError("Failed to decline invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        width: "400px",
        background: "white",
        borderRadius: 10,
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)"
      }}>
        <div style={{
          color: "black",
          fontSize: 24,
          fontFamily: "Manrope",
          fontWeight: 700,
          marginBottom: "10px"
        }}>
          Roadtrip Invitation
        </div>
        
        <div style={{
          color: "black",
          fontSize: 18,
          fontFamily: "Manrope",
          fontWeight: 700,
          marginBottom: "5px"
        }}>
          {roadtrip.name}
        </div>
        
        {(roadtrip.description || roadtrip.roadtripDescription) && (
          <div style={{
            color: "black",
            fontSize: 14,
            fontFamily: "Manrope",
            marginBottom: "20px"
          }}>
            {roadtrip.description || roadtrip.roadtripDescription}
          </div>
        )}
        
        <div style={{
          color: "black",
          fontSize: 16,
          fontFamily: "Manrope",
          marginBottom: "20px"
        }}>
          You have been invited to join this roadtrip. Would you like to accept or decline?
        </div>
        
        {error && (
          <div style={{
            color: "red",
            fontSize: 14,
            marginBottom: "10px"
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            color: "green",
            fontSize: 14,
            marginBottom: "10px"
          }}>
            {success}
          </div>
        )}
        
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px"
        }}>
          <button
            onClick={handleDecline}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: "#E74C3C",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
