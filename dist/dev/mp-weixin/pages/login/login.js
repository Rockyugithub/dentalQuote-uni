"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const form = common_vendor.ref({
      username: "",
      password: ""
    });
    const loading = common_vendor.ref(false);
    const handleLogin = async () => {
      if (!form.value.username || !form.value.password) {
        return common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
      }
      loading.value = true;
      const isAdmin = form.value.username === "admin";
      const role = isAdmin ? "admin" : "user";
      common_vendor.index.setStorageSync("userRole", role);
      loading.value = false;
      common_vendor.index.redirectTo({ url: "/pages/home/home" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: form.value.username,
        c: common_vendor.o(($event) => form.value.username = $event.detail.value),
        d: form.value.password,
        e: common_vendor.o(($event) => form.value.password = $event.detail.value),
        f: common_vendor.o(handleLogin),
        g: loading.value
      };
    };
  }
};
wx.createPage(_sfc_main);
