"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_popup_dialog = common_vendor.resolveComponent("uni-popup-dialog");
  _component_uni_popup_dialog();
}
if (!Math) {
  (addUser + editPwd)();
}
const addUser = () => "./add-user.js";
const editPwd = () => "./edit-pwd.js";
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const userList = common_vendor.ref([
      { id: 1, username: "admin", password: "admin123", role: "admin" },
      { id: 2, username: "user1", password: "123456", role: "user" }
    ]);
    const showPopup = common_vendor.ref("");
    const addUserPopup = common_vendor.ref(null);
    const editPwdPopup = common_vendor.ref(null);
    const currentUser = common_vendor.ref({ id: 1, username: "test" });
    const fetchUserList = async () => {
    };
    const handleDelete = async (userId) => {
      try {
        await common_vendor.index.request({
          url: `/api/users/${userId}`,
          method: "DELETE"
        });
        fetchUserList();
        common_vendor.index.showToast({ title: "删除成功" });
      } catch (e) {
        common_vendor.index.showToast({ title: "删除失败", icon: "none" });
      }
    };
    const showAddUser = () => {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addUserPopup.open();
        }, 300);
      });
    };
    const showEditPwd = (user) => {
      currentUser.value = user;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.editPwdPopup.open();
        }, 300);
      });
    };
    const closePopup = () => {
      showPopup.value = "";
    };
    common_vendor.onMounted(fetchUserList);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(showAddUser),
        b: common_vendor.f(userList.value, (user, k0, i0) => {
          return {
            a: common_vendor.t(user.username),
            b: common_vendor.t(user.password),
            c: common_vendor.t(user.role),
            d: common_vendor.o(($event) => showEditPwd(user), user.id),
            e: user.role === "admin",
            f: common_vendor.o(($event) => handleDelete(user.id), user.id),
            g: user.id
          };
        }),
        c: showPopup.value === "add"
      }, showPopup.value === "add" ? {
        d: common_vendor.o(fetchUserList),
        e: common_vendor.o(closePopup),
        f: common_vendor.sr(addUserPopup, "69f3cc65-0", {
          "k": "addUserPopup"
        }),
        g: common_vendor.p({
          mode: "base"
        })
      } : {}, {
        h: showPopup.value === "edit"
      }, showPopup.value === "edit" ? {
        i: common_vendor.o(fetchUserList),
        j: common_vendor.o(closePopup),
        k: common_vendor.p({
          user: currentUser.value
        }),
        l: common_vendor.sr(editPwdPopup, "69f3cc65-2", {
          "k": "editPwdPopup"
        }),
        m: common_vendor.p({
          mode: "base"
        })
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
