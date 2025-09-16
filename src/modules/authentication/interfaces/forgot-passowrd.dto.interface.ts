// Interfaces for password-related operations

/** Forgot Password Request */
export interface IForgotPassword {
  email: string;
}

/** Forgot Password Set (Reset using token/OTP) */
export interface IForgotPasswordSet {
  email: string;
  password: string;
  token: string;
  // otp?: string; // optional if using OTP
}

/** Verify OTP */
export interface IVerifyOtp {
  email: string;
  otpCode: string;
}

/** Change Password (simple password change) */
export interface IChangePassword {
  password: string;
}

/** Verify Token (for token-based reset) */
export interface IVerifyToken {
  email: string;
  token: string;
}
export interface IResetPasswordDto {
  token: string;
  password: string;
}
/** Change New Password (requires old password) */
export interface IChangeNewPassword {
  oldPassword: string;
  newPassword: string;
}

/** Optional repository interface for managing tokens/OTPs */
export interface IResetTokenRepo {
  createToken(
    email: string,
    otpOrToken: string,
    expiresAt: Date,
  ): Promise<void>;
  verifyToken(email: string, otpOrToken: string): Promise<boolean>;
  invalidateToken(email: string, otpOrToken: string): Promise<void>;
}
