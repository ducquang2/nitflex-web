import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const nitflexApiAxios = axios.create({
  baseURL: API_URL,
});

const requestAuthInterceptor = async (
  req: AxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      ...req,
      headers: {
        ...req.headers,
        Authorization: `Bearer ${token}`,
      },
    } as InternalAxiosRequestConfig;
  }
  return req as InternalAxiosRequestConfig;
};

nitflexApiAxios.interceptors.request.use(requestAuthInterceptor);

export default nitflexApiAxios;
