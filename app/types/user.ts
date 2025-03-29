import { EmergencyContact } from './emergencyContact';

export interface User {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  mail: string | null;
  phoneNumber: string | null;
  token: string | null;
  status: string | null;
  recieveNotifications: boolean;
  emergencyContact?: EmergencyContact | null;
}
