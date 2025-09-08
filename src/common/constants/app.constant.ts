export enum ENUM_APP_ENVIRONMENT {
  PRODUCTION = 'production',
  STAGING = 'staging',
  DEVELOPMENT = 'development',
}
// export const NEPAL_TIME_OFFSET_MINUTE: number = -345;

export const ADMIN_ROUTER: string = 'admin';
export const PUBLIC_USER_ROUTER: string = 'public-user';
export const SYSTEM_USER_ROUTER: string = 'system-user';
export const PARTNER_ROUTER: string = 'partner';

// Only request methods used in the system
export enum ENUM_APP_REQUEST_METHODS {
  GET = 'GET',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  POST = 'POST',
}
