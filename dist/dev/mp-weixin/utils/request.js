"use strict";
const common_vendor = require("../common/vendor.js");
common_vendor.axios.defaults.adapter = function(config) {
  return new Promise((resolve, reject) => {
    common_vendor.wx$1.request({
      url: config.baseURL + config.url,
      // 拼接 baseURL
      method: config.method,
      data: config.method === "GET" ? config.params : config.data,
      header: config.headers,
      success(res) {
        const response = {
          data: res.data,
          status: res.statusCode,
          statusText: "OK",
          headers: res.header,
          config,
          request: null
        };
        resolve(response);
      },
      fail(err) {
        reject(err);
      }
    });
  });
};
const service = common_vendor.axios.create({
  baseURL: "http://localhost:3000",
  // 替换为你的后端地址
  timeout: 1e4
});
service.interceptors.request.use((config) => {
  const token = common_vendor.wx$1.getStorageSync("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      common_vendor.wx$1.showToast({ title: res.message || "请求失败", icon: "none" });
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res;
  },
  (error) => {
    common_vendor.wx$1.showToast({ title: error.errMsg || "网络错误", icon: "none" });
    return Promise.reject(error);
  }
);
exports.service = service;
