"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Math) {
  (addUser + CustomPopup + editPwd)();
}
const addUser = () => "./add-user.js";
const editPwd = () => "./edit-pwd.js";
const CustomPopup = () => "../../components/custom-popup.js";
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const userList = common_vendor.ref([]);
    const addUserPopup = common_vendor.ref(false);
    const editPwdPopup = common_vendor.ref(false);
    const currentUser = common_vendor.ref({ id: 1, username: "test" });
    const fetchUserList = async () => {
      const res = await userStore.getAllUsers();
      userList.value = res.data;
    };
    const handleDelete = async (userId) => {
      await userStore.deleteUser({ "userId": userId });
      fetchUserList();
    };
    const showAddUser = () => {
      addUserPopup.value = true;
    };
    const showEditPwd = (user) => {
      currentUser.value = user;
      editPwdPopup.value = true;
    };
    const closePopup = () => {
      editPwdPopup.value = false;
      addUserPopup.value = false;
    };
    common_vendor.onMounted(fetchUserList);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(showAddUser),
        b: common_vendor.f(userList.value, (user, k0, i0) => {
          return {
            a: common_vendor.t(user.username),
            b: common_vendor.t(user.role.label),
            c: common_vendor.o(($event) => showEditPwd(user), user.id),
            d: user.role.value === "admin",
            e: common_vendor.o(($event) => handleDelete(user.id), user.id),
            f: user.id
          };
        }),
        c: common_vendor.o(fetchUserList),
        d: common_vendor.o(closePopup),
        e: common_vendor.o(($event) => addUserPopup.value = $event),
        f: common_vendor.p({
          ["content-style"]: {
            borderRadius: "32rpx"
          },
          modelValue: addUserPopup.value
        }),
        g: common_vendor.o(fetchUserList),
        h: common_vendor.o(closePopup),
        i: common_vendor.p({
          user: currentUser.value
        }),
        j: common_vendor.o(($event) => editPwdPopup.value = $event),
        k: common_vendor.p({
          ["custom-style"]: "border-radius:32rpx;",
          modelValue: editPwdPopup.value
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
