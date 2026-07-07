declare global {
  interface AuthRegisterDTO {
    email: string;
    password: string;
  }

  interface AuthVerifyOtpDTO {
    email: string;
    otp: number;
  }

  interface LogoutPayload {
    userId: string;
    accessJTI: string;
    refreshToken: string;
  }
}

export {};
