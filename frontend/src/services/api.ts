import axios from "axios";

const apiUrl =
  typeof process !== "undefined" && process.env.VITE_API_URL
    ? process.env.VITE_API_URL
    : "http://localhost:3333";

export const api = axios.create({
  baseURL: apiUrl
});

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

function isLoginRequest(url: string | undefined) {
  return typeof url === "string" && url.includes("auth/login");
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoginRequest(error.config?.url)) {
      onUnauthorized?.();
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "Não foi possível concluir a ação";
  }

  return "Não foi possível concluir a ação";
}
