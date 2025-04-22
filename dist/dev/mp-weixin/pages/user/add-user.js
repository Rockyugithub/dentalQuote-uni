"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const _sfc_main = {
  __name: "add-user",
  emits: ["success", "close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const form = common_vendor.ref({
      username: "",
      password: "",
      role: { value: "user", label: "普通用户" }
    });
    const roles = common_vendor.ref([
      { value: "user", label: "普通用户" },
      { value: "admin", label: "管理员" }
    ]);
    const loading = common_vendor.ref(false);
    const onRoleChange = (e) => {
      form.value.role = roles.value[e.detail.value];
    };
    const handleSubmit = async () => {
      if (!form.value.username || !form.value.password) {
        return common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
      }
      loading.value = true;
      try {
        await mockApiAddUser(form.value);
        emit("success");
        common_vendor.index.showToast({ title: "添加成功" });
        closeForm();
      } catch (e) {
        common_vendor.index.showToast({ title: e.message || "添加失败", icon: "none" });
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
        c: form.value.username,
        d: common_vendor.o(($event) => form.value.username = $event.detail.value),
        e: form.value.password,
        f: common_vendor.o(($event) => form.value.password = $event.detail.value),
        g: common_vendor.t(form.value.role.label || "请选择角色"),
        h: common_vendor.p({
          type: "arrowright",
          size: "16",
          color: "#999"
        }),
        i: roles.value,
        j: common_vendor.o(onRoleChange),
        k: loading.value,
        l: common_vendor.o(handleSubmit)
      };
    };
  }
};
wx.createComponent(_sfc_main);
