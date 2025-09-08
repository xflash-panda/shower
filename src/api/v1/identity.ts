import { apiClient, getDefaultHeaders } from '@/helpers/api';
import type { AxiosRequestConfig } from 'axios';

export async function login(body: API_V1.Identity.LoginParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.Identity.LoginResult>(
    '/api/v1/identity/auth/login',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function checkLogin(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.Identity.CheckLoginResult>(
    '/api/v1/identity/auth/checkLogin',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function checkEmail(
  params: API_V1.Identity.CheckEmailParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.Identity.CheckEmailResult>(
    '/api/v1/identity/auth/checkEmail',
    {
      ...options,
      params: {
        ...params,
        ...(options?.params as Record<string, any>),
      },
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function checkPhone(
  params: API_V1.Identity.CheckPhoneParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.Identity.CheckPhoneResult>(
    '/api/v1/identity/auth/checkPhone',
    {
      ...options,
      params: {
        ...params,
        ...(options?.params as Record<string, any>),
      },
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function emailVerify(
  body: API_V1.Identity.EmailVerifyParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.Identity.EmailVerifyResult>(
    '/api/v1/identity/comm/sendEmailVerify',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function smsVerify(
  body: API_V1.Identity.SmsVerifyParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.Identity.SmsVerifyResult>(
    '/api/v1/identity/comm/sendSmsVerify',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function register(body: API_V1.Identity.RegisterParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.Identity.RegisterResult>(
    '/api/v1/identity/auth/register',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function forget(body: API_V1.Identity.ForgetParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.Identity.ForgetResult>(
    '/api/v1/identity/auth/forget',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function changeEmail(
  body: API_V1.Identity.ChangeEmailParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.Identity.ChangeEmailResult>(
    '/api/v1/identity/auth/changeEmail',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function changePhone(
  body: API_V1.Identity.ChangePhoneParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.Identity.ChangePhoneResult>(
    '/api/v1/identity/auth/changePhone',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function appleSignIn(
  body: API_V1.Identity.AppleSignInParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.Identity.AppleSignInResult>(
    '/api/v1/identity/auth/apple/signIn',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function googleSignIn(
  body: API_V1.Identity.GoogleSignInParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.Identity.GoogleSignInResult>(
    '/api/v1/identity/auth/google/signIn',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function googleSignInWithAccessToken(
  body: API_V1.Identity.GoogleSignInWithAccessTokenParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.Identity.GoogleSignInWithAccessTokenResult>(
    '/api/v1/identity/auth/google/signInWithAccessToken',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function loginWithSms(
  body: API_V1.Identity.LoginWithSmsParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.Identity.LoginWithSmsResult>(
    '/api/v1/identity/auth/loginWithSms',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}
