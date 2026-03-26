import config from "config";

export type Query = {
  [key: string]: any;
};

export type Params = {
  [key: string]: any;
};

export type Files = {
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ApiParams = {
  endpoint: string;
  query?: Query;
  method?: string;
  params?: Params;
  files?: Files;
  json?: any;
  accessToken?: string;
};

export type ApiResult<T> = {
  status: number;
  data?: T;
  errmsg?: string;
};

const serialize = (data: any): string => {
  if (typeof data === "object") {
    data = JSON.stringify(data);
  }

  return encodeURIComponent(data);
};

const queryToString = (query: Query | Params) =>
  Object.keys(query)
    .map((k) => `${serialize(k)}=${serialize(query[k])}`)
    .join("&");

export default <T>(apiParams: ApiParams): Promise<ApiResult<T>> => {
  const {
    endpoint: propsEndpoint,
    query,
    method: propsMethod,
    params,
    files,
    json,
    accessToken: propsAccessToken,
  } = apiParams;
  const method = propsMethod || "get";
  const accessToken = propsAccessToken || "";

  const { API_ROOT: CONFIG_API_ROOT } = config;

  const default_api_root = window.location.origin;

  const API_ROOT = CONFIG_API_ROOT || default_api_root;

  let endpoint = propsEndpoint;
  if (endpoint.indexOf(API_ROOT) === -1) {
    endpoint = API_ROOT + endpoint;
  }
  if (query) {
    endpoint = `${endpoint}?${queryToString(query)}`;
  }

  const headers: HeadersInit = {};
  let body: string | undefined;
  if (files) {
    for (const _name in files) {
    }
    // eslint-disable-next-line
    for (const _k in params) {
    }
  } else if (params) {
    const paramsStr = queryToString(params);
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = paramsStr;
  } else if (json) {
    body = JSON.stringify(json);
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers.Authorization = "bearer " + accessToken;
  }

  const csrftokenDOM = document.getElementById("__csrftoken__");
  const csrftoken =
    (csrftokenDOM ? csrftokenDOM.getAttribute("value") : "") || "";
  headers["X-CSRFToken"] = csrftoken;

  const options: RequestInit = {
    method,
    headers,
    body,
    credentials: "include",
  };

  return fetch(endpoint, options)
    .then((res) => {
      const status = res.status;
      return res
        .json()
        .then((data) => {
          if (res.status >= 400) {
            // error messages
            const msg = data.Msg || "";
            return { status, errmsg: msg };
          } else {
            return { status: res.status, data: data };
          }
        })
        .catch((err) => {
          console.log("api: json: err:", err);
          return { status: 598, errmsg: err.message };
        });
    })
    .catch((err) => {
      return { status: 599, errmsg: err.message };
    });
};
