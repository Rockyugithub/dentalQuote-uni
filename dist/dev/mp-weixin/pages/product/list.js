"use strict";
const common_vendor = require("../../common/vendor.js");
const api_project = require("../../api/project.js");
if (!Math) {
  (uniIcons + CustomPopup)();
}
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const CustomPopup = () => "../../components/custom-popup.js";
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const projects = common_vendor.reactive([]);
    const loading = common_vendor.ref(false);
    const addProjectPopup = common_vendor.ref(false);
    const addProductPopup = common_vendor.ref(false);
    const editProductPopup = common_vendor.ref(false);
    const newProjectName = common_vendor.ref("");
    const currentProjectId = common_vendor.ref("");
    const newProductName = common_vendor.ref("");
    const newProductPrice = common_vendor.ref("");
    const editingProduct = common_vendor.reactive({
      productId: "",
      projectId: "",
      productName: "",
      price: 0
    });
    const fetchData = async () => {
      try {
        loading.value = true;
        const res = await api_project.getAllProject();
        projects.splice(0, projects.length, ...res.data.map((project) => ({
          projectId: project.id,
          projectName: project.name,
          expanded: true,
          products: project.products.map((product) => ({
            productId: product.id,
            productName: product.name,
            price: product.price,
            projectId: project.id
          }))
        })));
      } catch (error) {
        console.error("获取数据失败:", error);
        common_vendor.index.showToast({ title: "数据加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const showAddProjectDialog = () => {
      newProjectName.value = "";
      addProjectPopup.value = true;
    };
    const confirmAddProject = async () => {
      if (!newProjectName.value.trim()) {
        common_vendor.index.showToast({ title: "项目名称不能为空", icon: "none" });
        return;
      }
      try {
        await api_project.addProject({ name: newProjectName.value });
        await fetchData();
        common_vendor.index.showToast({ title: "添加成功" });
        addProjectPopup.value = false;
      } catch (error) {
        console.error("添加项目失败:", error.message);
        common_vendor.index.showToast({ title: `添加失败:${error.message}`, icon: "none" });
      }
    };
    const cancelAddProject = () => {
      addProjectPopup.value = false;
    };
    const confirmDeleteProject = (projectId) => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个项目吗？项目下的所有产品也将被删除",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_project.deleteProject({ projectId });
              await fetchData();
              common_vendor.index.showToast({ title: "删除成功" });
            } catch (error) {
              console.error("删除项目失败:", error);
              common_vendor.index.showToast({ title: `删除失败:${error.message}`, icon: "none" });
            }
          }
        }
      });
    };
    const showAddProductDialog = (projectId) => {
      currentProjectId.value = projectId;
      newProductName.value = "";
      newProductPrice.value = "";
      addProductPopup.value = true;
    };
    const confirmAddProduct = async () => {
      if (!newProductName.value.trim()) {
        common_vendor.index.showToast({ title: "产品名称不能为空", icon: "none" });
        return;
      }
      const price = parseFloat(newProductPrice.value);
      if (isNaN(price) || price <= 0) {
        common_vendor.index.showToast({ title: "请输入有效的价格", icon: "none" });
        return;
      }
      try {
        await api_project.addProduct({
          projectId: currentProjectId.value,
          name: newProductName.value.trim(),
          price
        });
        await fetchData();
        common_vendor.index.showToast({ title: "添加成功" });
        addProductPopup.value = false;
      } catch (error) {
        console.error("添加产品失败:", error);
        common_vendor.index.showToast({ title: `添加失败:${error.message}`, icon: "none" });
      }
    };
    const cancelAddProduct = () => {
      addProductPopup.value = false;
    };
    const showEditProductDialog = (product) => {
      Object.assign(editingProduct, {
        productId: product.productId,
        projectId: product.projectId,
        productName: product.productName,
        price: product.price
      });
      editProductPopup.value = true;
    };
    const confirmEditProduct = async () => {
      if (!editingProduct.productName.trim()) {
        common_vendor.index.showToast({ title: "产品名称不能为空", icon: "none" });
        return;
      }
      const price = parseFloat(editingProduct.price);
      if (isNaN(price) || price <= 0) {
        common_vendor.index.showToast({ title: "请输入有效的价格", icon: "none" });
        return;
      }
      try {
        let data = {
          projectId: editingProduct.projectId,
          productId: editingProduct.productId,
          name: editingProduct.productName.trim(),
          price
        };
        console.info(data);
        await api_project.updateProduct(data);
        await fetchData();
        common_vendor.index.showToast({ title: "更新成功" });
        editProductPopup.value = false;
      } catch (error) {
        console.error("更新产品失败:", error);
        common_vendor.index.showToast({ title: `更新失败:${error.message}`, icon: "none" });
      }
    };
    const cancelEditProduct = () => {
      editProductPopup.value = false;
    };
    const confirmDeleteProduct = (productId, projectId) => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个产品吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_project.deleteProduct({ productId, projectId });
              await fetchData();
              common_vendor.index.showToast({ title: "删除成功" });
            } catch (error) {
              console.error("删除产品失败:", error);
              common_vendor.index.showToast({ title: `删除失败:${error.message}`, icon: "none" });
            }
          }
        }
      });
    };
    const toggleExpand = (projectId) => {
      const project = projects.find((p) => p.projectId === projectId);
      if (project) {
        projects.forEach((p) => {
          if (p.projectId !== projectId)
            p.expanded = false;
        });
        project.expanded = !project.expanded;
      }
    };
    common_vendor.onShow(() => {
      fetchData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "plus",
          size: "16",
          color: "#fff"
        }),
        b: common_vendor.o(showAddProjectDialog),
        c: projects.length > 0
      }, projects.length > 0 ? {
        d: common_vendor.f(projects, (project, k0, i0) => {
          return {
            a: common_vendor.t(project.projectName),
            b: "4b72d8ce-1-" + i0,
            c: common_vendor.t(project.products.length),
            d: common_vendor.o(($event) => showAddProductDialog(project.projectId), project.projectId),
            e: "4b72d8ce-2-" + i0,
            f: common_vendor.o(($event) => confirmDeleteProject(project.projectId), project.projectId),
            g: "4b72d8ce-3-" + i0,
            h: common_vendor.o(($event) => toggleExpand(project.projectId), project.projectId),
            i: common_vendor.f(project.products, (product, k1, i1) => {
              return {
                a: "4b72d8ce-4-" + i0 + "-" + i1,
                b: common_vendor.t(product.productName),
                c: "4b72d8ce-5-" + i0 + "-" + i1,
                d: common_vendor.t(product.price),
                e: "4b72d8ce-6-" + i0 + "-" + i1,
                f: common_vendor.o(($event) => showEditProductDialog(product), product.productId),
                g: "4b72d8ce-7-" + i0 + "-" + i1,
                h: common_vendor.o(($event) => confirmDeleteProduct(product.productId, project.projectId), product.productId),
                i: product.productId
              };
            }),
            j: project.projectId,
            k: project.expanded ? 1 : ""
          };
        }),
        e: common_vendor.p({
          type: "list",
          size: "14",
          color: "#999"
        }),
        f: common_vendor.p({
          type: "trash",
          size: "18",
          color: "#ff4d4f"
        }),
        g: common_vendor.p({
          type: "arrowdown",
          size: "18",
          color: "#666"
        }),
        h: common_vendor.p({
          type: "shop",
          size: "16",
          color: "#4a90e2"
        }),
        i: common_vendor.p({
          type: "money",
          size: "14",
          color: "#ff6b6b"
        }),
        j: common_vendor.p({
          type: "compose",
          size: "18",
          color: "#666"
        }),
        k: common_vendor.p({
          type: "trash",
          size: "18",
          color: "#ff4d4f"
        })
      } : common_vendor.e({
        l: common_vendor.p({
          type: "info",
          size: "48",
          color: "#ccc"
        }),
        m: loading.value
      }, loading.value ? {} : {}, {
        n: common_vendor.p({
          type: "plus",
          size: "16",
          color: "#fff"
        }),
        o: common_vendor.o(showAddProjectDialog)
      }), {
        p: common_vendor.o(cancelAddProject),
        q: common_vendor.p({
          type: "close",
          size: "24",
          color: "#999"
        }),
        r: newProjectName.value,
        s: common_vendor.o(($event) => newProjectName.value = $event.detail.value),
        t: common_vendor.o(confirmAddProject),
        v: common_vendor.o(($event) => addProjectPopup.value = $event),
        w: common_vendor.p({
          modelValue: addProjectPopup.value
        }),
        x: common_vendor.o(cancelAddProduct),
        y: common_vendor.p({
          type: "close",
          size: "24",
          color: "#999"
        }),
        z: newProductName.value,
        A: common_vendor.o(($event) => newProductName.value = $event.detail.value),
        B: newProductPrice.value,
        C: common_vendor.o(($event) => newProductPrice.value = $event.detail.value),
        D: common_vendor.o(confirmAddProduct),
        E: common_vendor.o(($event) => addProductPopup.value = $event),
        F: common_vendor.p({
          modelValue: addProductPopup.value
        }),
        G: common_vendor.o(cancelEditProduct),
        H: common_vendor.p({
          type: "close",
          size: "24",
          color: "#999"
        }),
        I: editingProduct.productName,
        J: common_vendor.o(($event) => editingProduct.productName = $event.detail.value),
        K: editingProduct.price,
        L: common_vendor.o(($event) => editingProduct.price = $event.detail.value),
        M: common_vendor.o(confirmEditProduct),
        N: common_vendor.o(($event) => editProductPopup.value = $event),
        O: common_vendor.p({
          modelValue: editProductPopup.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
