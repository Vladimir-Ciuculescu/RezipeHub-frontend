export interface Notification {
  id: number;
  title: string;
  body: string;
  data: any;
  createdAt: Date;
  read: boolean;
  timestamp?: string;
}
