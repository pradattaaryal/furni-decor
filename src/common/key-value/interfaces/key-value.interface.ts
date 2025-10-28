// export enum FEATURE_ACTION_KEY_ENUM {
//   REGISTER = 'REGISTER',
//   LOGIN = 'LOGIN',
//   VERIFY_OPT = 'VERIFY_OTP',
//   VERIFY_TOKEN = 'VERIFY_TOKEN',
//   FORGET_PASSWORD = 'FORGET_PASSWORD',
// }

export interface IGetKeyData {
  module: string;
  identifier: string | number;
}

export interface ISetKeyOptions {
  expirationSeconds?: number;
}
