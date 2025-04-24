"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const _sfc_main = {
  __name: "edit-pwd",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ["success", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const password = common_vendor.ref("");
    const confirmPassword = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const handleSubmit = async () => {
      if (!password.value || !confirmPassword.value) {
        return common_vendor.index.showToast({ title: "请输入完整密码", icon: "none" });
      }
      if (password.value !== confirmPassword.value) {
        return common_vendor.index.showToast({ title: "两次密码不一致", icon: "none" });
      }
      loading.value = true;
      try {
        await api_auth.updatePassword({ userId: props.user.id, newPassword: password.value });
        emit("success");
        common_vendor.index.showToast({ title: "修改成功" });
        closeForm();
      } catch (e) {
        common_vendor.index.showToast({ title: e.message || "修改失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const closeForm = () => emit("close");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeForm),
        b: common_vendor.p({
          type: "close",
          size: "24",
          color: "#999"
        }),
        c: common_vendor.t(__props.user.username),
        d: common_vendor.t(__props.user.role === "admin" ? "管理员" : "普通用户"),
        e: common_vendor.n(__props.user.role),
        f: password.value,
        g: common_vendor.o(($event) => password.value = $event.detail.value),
        h: confirmPassword.value,
        i: common_vendor.o(($event) => confirmPassword.value = $event.detail.value),
        j: loading.value,
        k: common_vendor.o(handleSubmit)
      };
    };
  }
};
wx.createComponent(_sfc_main);
