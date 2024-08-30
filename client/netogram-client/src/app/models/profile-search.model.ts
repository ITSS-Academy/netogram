export interface ProfileSearchModel {
  uid: string;
  userName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  coverUrl: string;
  status?: string | null;
}
