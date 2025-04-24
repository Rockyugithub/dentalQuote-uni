"use strict";
const common_vendor = require("../common/vendor.js");
const api_auth = require("../api/auth.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const userInfo = common_vendor.ref(common_vendor.index.getStorageSync("userInfo") || null);
  const getAllUsers = async (data) => {
    const res = await api_auth.getUserList();
    return res;
  };
  const deleteUser = async (data) => {
    const res = await api_auth.delUser(data);
    return res;
  };
  const createUser = async (data) => {
    const res = await api_auth.create(data);
    return res;
  };
  const updataPwd = async (data) => {
    const res = await api_auth.updatePassword(data);
    return res;
  };
  const login = async (data) => {
    const res = await api_auth.loginApi(data);
    userInfo.value = res.data.user;
    common_vendor.index.setStorageSync("userInfo", userInfo.value);
    return res;
  };
  const logout = () => {
    userInfo.value = null;
    common_vendor.index.removeStorageSync("userInfo");
  };
  return { userInfo, login, logout, deleteUser, createUser, getAllUsers, updataPwd };
});
exports.useUserStore = useUserStore;
