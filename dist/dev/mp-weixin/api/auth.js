"use strict";
const utils_request = require("../utils/request.js");
function getUserList(data) {
  return utils_request.service({
    url: "/users/list",
    method: "post",
    data
  });
}
function create(data) {
  return utils_request.service({
    url: "/users/create",
    method: "post",
    data
  });
}
function delUser(data) {
  return utils_request.service({
    url: "/users/delete",
    method: "post",
    data
  });
}
function updatePassword(data) {
  return utils_request.service({
    url: "/users/update-password",
    method: "post",
    data
  });
}
function loginApi(data) {
  return utils_request.service({
    url: "/login",
    method: "post",
    data
  });
}
exports.create = create;
exports.delUser = delUser;
exports.getUserList = getUserList;
exports.loginApi = loginApi;
exports.updatePassword = updatePassword;
