export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
}

export interface EmailArgs {
  to: string;
  subject: string;
  text: string;
  html: HTMLElement;
}
