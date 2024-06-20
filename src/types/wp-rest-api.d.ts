type WPAuthSuccessCode = 'jwt_auth_valid_token';
type WPAuthErrorCode = 'jwt_auth_failed' | 'jwt_auth_invalid_token';

export type WPLoginReponse = {
  token: string;
  user_display_name: string;
  user_email: string;
  user_nicename: string;
};

export type WPValidateReponse = {
  code: WPAuthSuccessCode;
  data: {
    status: number;
  };
};

export type WPAuthErrorResponse = {
  code: WPAuthErrorCode;
  data: {
    status: number;
  };
  message: string;
};
