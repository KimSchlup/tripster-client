import { ApiService } from "@/api/apiService";
import { RoadtripMember, InvitationStatus } from "@/types/roadtripMember";
import { User } from "@/types/user";

/**
 * Service for managing roadtrip members
 */
export class RoadtripMemberService {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Get all members of a roadtrip
   * @param roadtripId - The ID of the roadtrip
   * @returns List of users who are members of the roadtrip
   */
  async getMembers(roadtripId: string | number): Promise<User[]> {
    try {
      console.log(`Fetching members for roadtrip ID: ${roadtripId}`);
      return await this.apiService.get<User[]>(`/roadtrips/${roadtripId}/members`);
    } catch (error) {
      console.error("Error fetching roadtrip members:", error);
      throw error;
    }
  }

  /**
   * Invite a user to a roadtrip
   * @param roadtripId - The ID of the roadtrip
   * @param username - The username of the user to invite
   * @returns The created roadtrip member
   */
  async inviteMember(roadtripId: string | number, username: string): Promise<RoadtripMember> {
    try {
      console.log(`Inviting user ${username} to roadtrip ID: ${roadtripId}`);
      return await this.apiService.post<RoadtripMember>(
        `/roadtrips/${roadtripId}/members`, 
        { username }
      );
    } catch (error) {
      console.error("Error inviting roadtrip member:", error);
      throw error;
    }
  }

  /**
   * Remove a user from a roadtrip
   * @param roadtripId - The ID of the roadtrip
   * @param userId - The ID of the user to remove
   */
  async removeMember(roadtripId: string | number, userId: string | number): Promise<void> {
    try {
      console.log(`Removing user ${userId} from roadtrip ID: ${roadtripId}`);
      await this.apiService.delete<void>(`/roadtrips/${roadtripId}/members/${userId}`);
    } catch (error) {
      console.error("Error removing roadtrip member:", error);
      throw error;
    }
  }

  /**
   * Update a member's invitation status
   * @param roadtripId - The ID of the roadtrip
   * @param userId - The ID of the user
   * @param status - The new invitation status
   */
  async updateMemberStatus(
    roadtripId: string | number, 
    userId: string | number, 
    status: InvitationStatus
  ): Promise<void> {
    try {
      console.log(`Updating status for user ${userId} in roadtrip ID: ${roadtripId} to ${status}`);
      await this.apiService.put<void>(
        `/roadtrips/${roadtripId}/members/${userId}`, 
        { invitationStatus: status }
      );
    } catch (error) {
      console.error("Error updating roadtrip member status:", error);
      throw error;
    }
  }
}
