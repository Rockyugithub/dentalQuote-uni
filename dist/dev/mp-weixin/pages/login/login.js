"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const loading = common_vendor.ref(false);
    const form = common_vendor.ref({
      name: "",
      password: ""
    });
    const handleLogin = async () => {
      if (!form.value.name || !form.value.password) {
        common_vendor.index.showToast({ title: "请输入用户名和密码", icon: "none" });
        return;
      }
      try {
        loading.value = true;
        await userStore.login(form.value);
        common_vendor.index.showToast({ title: "登录成功" });
        common_vendor.index.redirectTo({ url: "/pages/home/home" });
      } catch (err) {
        console.error("登录失败:", err);
        common_vendor.index.showToast({ title: err.message || "登录失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const navTo = (type) => {
      const routes = {
        register: "/pages/register/register",
        forget: "/pages/forget/forget"
      };
      common_vendor.index.navigateTo({ url: routes[type] });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: form.value.name,
        c: common_vendor.o(($event) => form.value.name = $event.detail.value),
        d: form.value.password,
        e: common_vendor.o(($event) => form.value.password = $event.detail.value),
        f: common_vendor.t(loading.value ? "登录中..." : "立即登录"),
        g: common_vendor.o(handleLogin),
        h: loading.value,
        i: common_vendor.o(($event) => navTo("register")),
        j: common_vendor.o(($event) => navTo("forget"))
      };
    };
  }
};
wx.createPage(_sfc_main);
