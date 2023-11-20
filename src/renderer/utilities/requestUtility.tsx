/**
 * Utility functions to make API requests.
 * By importing this file, you can use the provided get and post functions.
 * You shouldn't need to modify this file, but if you want to learn more
 * about how these functions work, google search "Fetch API"
 *
 * These functions return promises, which means you should use ".then" on them.
 * e.g. get('/api/foo', { bar: 0 }).then(res => console.log(res))
 */
import axios, { AxiosResponse, AxiosError } from "axios";

const timeoutMillis = 100 * 1000;

// Helper code to make a get request. Default parameter of empty JSON Object for params.
// Returns a Promise to a JSON Object.
export async function get(endpoint: string, params = {}, extraHeaders = {}) {
  return axios
    .get(endpoint, {
      params: params,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        ...extraHeaders,
      },
    })
    .then((resp: AxiosResponse) => {
      // console.log(resp);
      return resp.data;
    })
    .catch((error: AxiosError) => {
      console.log(error.response?.data);
      throw error;
    });
}

// Helper code to make a post request. Default parameter of empty JSON Object for params.
// Returns a Promise to a JSON Object.
export async function post(endpoint: string, params = {}, extraHeaders = {}) {
  return axios
    .post(endpoint, params, {
      headers: { "Content-type": "application/json", ...extraHeaders },
      timeout: timeoutMillis,
    })
    .then((resp: AxiosResponse) => {
      console.log(resp);
      return resp.data;
    })
    .catch((error) => {
      console.log(error.response?.data);
      throw error;
    });
}
// Helper code to make a put request. Default parameter of empty JSON Object for params.
// Returns a Promise to a JSON Object.
export async function put(endpoint: string, params = {}, extraHeaders = {}) {
  return axios
    .put(endpoint, params, {
      headers: { "Content-type": "application/json", ...extraHeaders },
      timeout: timeoutMillis,
    })
    .then((resp: AxiosResponse) => {
      console.log(resp);
      return resp.data;
    })
    .catch((error) => {
      console.log(error.response?.data);
      throw error;
    });
}

// Helper code to make a delete request. Default parameter of empty JSON Object for params.
// Returns a Promise to a JSON Object.
export async function del(endpoint: string, params = {}, extraHeaders = {}) {
  return axios
    .delete(endpoint, {
      params: params,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        ...extraHeaders,
      },
    })
    .then((resp: AxiosResponse) => {
      console.log(resp);
      return resp.data;
    })
    .catch((error) => {
      console.log(error.response?.data);
      throw error;
    });
}

const prepareEndpointByParams = (
  endpoint: string,
  urlParams: { [key: string]: number | string | any }
): [string, { [key: string]: string }] => {
  let headers: { [key: string]: string } = {};
  if ("userSecret" in urlParams) {
    let { userSecret, ..._urlParams } = urlParams;
    headers["X-User-Secret"] = userSecret as string;
    urlParams = _urlParams;
  }
  for (const [key, val] of Object.entries(urlParams)) {
    endpoint = endpoint.replace(
      `{${key}}`,
      val instanceof String ? val : val.toString()
    );
  }
  return [endpoint, headers];
};

export async function appGet(
  endpoint: string,
  urlParams: { [key: string]: number | string },
  params = {}
) {
  let [url, headers] = prepareEndpointByParams(endpoint, { ...urlParams });
  return get(url, params, headers);
}

export async function appPost(
  endpoint: string,
  urlParams: { [key: string]: number | string },
  params = {}
) {
  let [url, headers] = prepareEndpointByParams(endpoint, { ...urlParams });
  return post(url, params, headers);
}

export async function appPut(
  endpoint: string,
  urlParams: { [key: string]: number | string },
  params = {}
) {
  let [url, headers] = prepareEndpointByParams(endpoint, { ...urlParams });
  return put(url, params, headers);
}

export async function appDelete(
  endpoint: string,
  urlParams: { [key: string]: number | string },
  params = {}
) {
  let [url, headers] = prepareEndpointByParams(endpoint, { ...urlParams });
  return del(url, params, headers);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const backendConfig = {
  verify_email: "https://www.toymaker-ben.online/api/verify_email",
  events: "https://www.toymaker-ben.online/api/users/{userId}/events",
  add_user: "https://www.toymaker-ben.online/api/users",
  verify_user: "https://www.toymaker-ben.online/api/authenticate",
  add_mailbox: "https://www.toymaker-ben.online/api/users/{userId}/mailboxes",
  remove_mailbox:
    "https://www.toymaker-ben.online/api/users/{userId}/mailboxes/{address}",
  update_mailbox:
    "https://www.toymaker-ben.online/api/users/{userId}/mailboxes/{address}",
  user_profile: "https://www.toymaker-ben.online/api/users/{userId}/profile",
  ws: "wss://www.toymaker-ben.online/api/ws/{userId}",
};
