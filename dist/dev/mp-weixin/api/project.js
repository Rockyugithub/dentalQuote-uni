"use strict";
const utils_request = require("../utils/request.js");
function getAllProject(data) {
  return utils_request.service({
    url: "/projects/list",
    method: "post",
    data
  });
}
function addProject(data) {
  return utils_request.service({
    url: "/projects/create",
    method: "post",
    data
  });
}
function deleteProject(data) {
  return utils_request.service({
    url: "/projects/delete",
    method: "post",
    data
  });
}
function addProduct(data) {
  return utils_request.service({
    url: "/products/add",
    method: "post",
    data
  });
}
function deleteProduct(data) {
  return utils_request.service({
    url: "/products/delete",
    method: "post",
    data
  });
}
function updateProduct(data) {
  return utils_request.service({
    url: "/products/update",
    method: "post",
    data
  });
}
exports.addProduct = addProduct;
exports.addProject = addProject;
exports.deleteProduct = deleteProduct;
exports.deleteProject = deleteProject;
exports.getAllProject = getAllProject;
exports.updateProduct = updateProduct;
