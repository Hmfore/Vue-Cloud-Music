import axios from "axios";
import store from "../store";
axios.defaults.timeout = 10000;
axios.defaults.baseURL =
  // "https://netease-cloud-music-kbomqu9tv-hmfore.vercel.app";
  "https://netease-cloud-music-api-three-brown.vercel.app/";
//由于跨域，所以配置此选项是登陆后每次请求自动带cookie
//但是他与Access-Control-Allow-Origin:"*"相悖
axios.defaults.withCredentials = true;
// 错误处理函数
function handleError(error) {
  if (error.response) {
    // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    Promise.reject({
      data: error.response.data,
      code: 10000,
      msg: "请求错误",
    });
  } else if (error.request) {
    // 请求已经成功发起，但没有收到响应
    // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
    // 而在node.js中是 http.ClientRequest 的实例
    console.log(error.request);
    Promise.reject({
      data: null,
      code: 10001,
      msg: "无响应",
    });
  } else {
    // 发送请求时出了点问题
    console.log("Error", error.message);
    Promise.reject({
      data: null,
      code: 10002,
      msg: error.message,
    });
  }
}
//封装axios get请求
export const get = (url, params) => {
  if (!params) params = {};
  if (store.state.Ip) params.realIp = store.state.Ip;
  return axios
    .get(url, { params })
    .then((res) => res.data)
    .catch((err) => handleError(err));
};
//封装axios post请求
export const post = (url, data, headers, params) => {
  if (!params) params = {};
  if (store.state.ip) params.realIP = store.state.ip;
  return axios
    .post(url, data, { headers, params })
    .then((res) => res.data)
    .catch((error) => {
      handleError(error);
    });
};
//向第三方接口获取客户端ip
export const getIp = () =>
  axios.get("http://47.102.159.133:3333/real", { withCredentials: false });
