export interface UserModel {
  id?: string;
  type?: "user" | "admin";
  name: string;
  email: string;
  password: string;
  campus: string;
}
