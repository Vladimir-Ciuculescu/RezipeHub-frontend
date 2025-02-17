export interface Notification {
  id: number;
  title: string;
  body: string;
  data: any;
  createdAt: Date;
  read: boolean;
  timestamp?: string;
  //The person who generated the notification(the person who hit like button)
  actor?: {
    id: number;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
  };
}
