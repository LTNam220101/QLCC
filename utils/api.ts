import queryString from "query-string";
import { getClientToken } from "./auth";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Biến để theo dõi xem có đang refresh token hay không
let isRefreshing = false;
// Hàng đợi các requests đang chờ token mới
let refreshQueue: Array<() => void> = [];

// Hàm để xử lý refresh token
async function handleTokenRefresh() {
  if (isRefreshing) {
    // Nếu đang refresh, trả về promise sẽ resolve khi refresh hoàn tất
    return new Promise<void>((resolve) => {
      refreshQueue.push(() => resolve());
    });
  }

  isRefreshing = true;

  try {
    // Gọi API để refresh token
    const response = await fetch("/api/auth/refresh", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    // Thông báo cho tất cả các requests đang chờ
    refreshQueue.forEach((callback) => callback());
    refreshQueue = [];

    return Promise.resolve();
  } catch (error) {
    // Nếu refresh thất bại, chuyển hướng đến trang đăng nhập
    window.location.href = "/login";
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}
export const sendRequest = async <T>({
  url,
  method,
  body,
  queryParams = null,
  useCredentials = false,
  headers = {},
  nextOption = {},
  token,
}: IRequest) => {
  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({
      "content-type": "application/json",
      ...headers,
      // Thêm Authorization header nếu token được cung cấp
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";
  let requestUrl = `${apiUrl}${url}`;
  if (queryParams) {
    requestUrl = `${apiUrl}${url}?${queryString.stringify(queryParams)}`;
  }
  return fetch(requestUrl, options).then((res) => {
    if (res.ok) {
      return res.json() as T; //generic
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          status: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      });
    }
  });
};

export const sendRequestFile = async <T>({
  url,
  method,
  body,
  queryParams = null,
  useCredentials = false,
  headers = {},
  nextOption = {},
  token,
}: IRequest) => {
  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({
      ...headers,
      // Thêm Authorization header nếu token được cung cấp
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    body: body ? body : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  let requestUrl = `${apiUrl}${url}`;
  if (queryParams) {
    requestUrl = `${apiUrl}${url}?${queryString.stringify(queryParams)}`;
  }
  return fetch(requestUrl, options).then((res) => {
    if (res.ok) {
      return res.blob() as T; //generic
      // return res.json() as T; //generic
    } else {
      return res.blob().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          status: res.status,
          message: "",
          error: "",
        } as T;
      });
    }
  });
};

// Hàm wrapper cho sendRequest, tự động thêm token
export async function apiRequest<T>(options: Omit<IRequest, "token">) {
  try {
    const token = await getClientToken();
    const res = await sendRequest<T>({
      ...options,
      token,
    });
    return res
  } catch (error: any) {
    // Nếu lỗi 401 Unauthorized, thử refresh token và gọi lại
    if (error.status === 401) {
      try {
        // Refresh token
        await handleTokenRefresh();

        // Lấy token mới
        const newToken = await getClientToken();

        // Thực hiện lại request với token mới
        return await sendRequest<T>({
          ...options,
          token: newToken,
        });
      } catch (refreshError) {
        // Nếu refresh thất bại, ném lỗi
        throw refreshError;
      }
    }
    // Nếu không phải lỗi 401 hoặc refresh thất bại, ném lỗi gốc
    throw error;
  }
}

// Hàm wrapper cho sendRequestFile, tự động thêm token
export async function apiRequestFile<T>(options: Omit<IRequest, "token">) {
  try {
    const token = await getClientToken();
    const res = await sendRequestFile<T>({
      ...options,
      token,
    });
    return res
  } catch (error: any) {
    // Nếu lỗi 401 Unauthorized, thử refresh token và gọi lại
    if (error.status === 401) {
      try {
        // Refresh token
        await handleTokenRefresh();

        // Lấy token mới
        const newToken = await getClientToken();

        // Thực hiện lại request với token mới
        return await sendRequestFile<T>({
          ...options,
          token: newToken,
        });
      } catch (refreshError) {
        // Nếu refresh thất bại, ném lỗi
        throw refreshError;
      }
    }

    // Nếu không phải lỗi 401 hoặc refresh thất bại, ném lỗi gốc
    throw error;
  }
}
