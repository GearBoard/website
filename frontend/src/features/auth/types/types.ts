export interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export interface RegistrationFormProps {
  onSwitchToLogin: () => void;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  department: string;
  password: string;
  profileImage: string | null;
}
