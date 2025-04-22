"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const projects = common_vendor.reactive([]);
    const loading = common_vendor.ref(false);
    const marketPrice = common_vendor.ref(0);
    const actualPrice = common_vendor.ref(0);
    const userRole = common_vendor.ref("");
    common_vendor.onMounted(() => {
      userRole.value = common_vendor.index.getStorageSync("userRole") || "";
    });
    const navigateToProduct = () => {
      common_vendor.index.navigateTo({
        url: "/pages/product/list"
      });
    };
    const navigateToUser = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/user"
      });
    };
    const fetchData = async () => {
      loading.value = true;
      try {
        const productData = [
          {
            "projectId": 1,
            "projectName": "洗牙项目",
            "products": [
              {
                "productId": 1,
                "projectId": 1,
                "productName": "超声波洗牙",
                "price": 200,
                "description": "基础清洁"
              },
              {
                "productId": 2,
                "projectId": 1,
                "productName": "喷砂洁牙",
                "price": 350,
                "description": "深度清洁"
              }
            ]
          },
          {
            "projectId": 2,
            "projectName": "补牙项目",
            "products": [
              {
                "productId": 3,
                "projectId": 2,
                "productName": "树脂补牙",
                "price": 150,
                "description": "前牙修复"
              }
            ]
          }
        ];
        projects.splice(0, projects.length);
        productData.forEach((project) => {
          projects.push({
            projectId: project.projectId,
            projectName: project.projectName,
            expanded: false,
            products: project.products.map((product) => ({
              ...product,
              productId: product.productId || product.id,
              // 兼容不同字段名
              selected: false,
              quantity: 1
            }))
          });
        });
      } catch (error) {
        console.error("数据加载失败:", error);
        common_vendor.index.showToast({
          title: "数据加载失败",
          icon: "none",
          duration: 2e3
        });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onShow(() => {
      fetchData();
    });
    const toggleExpand = (projectId) => {
      const project = projects.find((p) => p.projectId === projectId);
      if (project)
        project.expanded = !project.expanded;
    };
    const toggleProductSelect = (productId) => {
      for (const project of projects) {
        const product = project.products.find((p) => p.productId === productId);
        if (product) {
          product.selected = !product.selected;
          if (product.selected && product.quantity < 1) {
            product.quantity = 1;
          }
          break;
        }
      }
    };
    const toggleProjectSelect = (projectId) => {
      const project = projects.find((p) => p.projectId === projectId);
      if (!project)
        return;
      const shouldSelect = !project.products.every((p) => p.selected);
      project.products.forEach((product) => {
        product.selected = shouldSelect;
        if (product.selected && product.quantity < 1) {
          product.quantity = 1;
        }
      });
    };
    const updateQuantity = (productId, delta) => {
      for (const project of projects) {
        const product = project.products.find((p) => p.productId === productId);
        if (product) {
          product.quantity = Math.max(1, product.quantity + delta);
          if (!product.selected)
            product.selected = true;
          break;
        }
      }
    };
    const validateQuantity = (product) => {
      if (isNaN(product.quantity) || product.quantity < 1) {
        product.quantity = 1;
      }
    };
    const getSelectedProductCount = (projectId) => {
      const project = projects.find((p) => p.projectId === projectId);
      return project ? project.products.filter((p) => p.selected).length : 0;
    };
    const isProjectSelected = (projectId) => {
      const project = projects.find((p) => p.projectId === projectId);
      return project ? project.products.some((p) => p.selected) : false;
    };
    const resetAll = () => {
      projects.forEach((project) => {
        project.products.forEach((product) => {
          product.selected = false;
          product.quantity = 1;
        });
      });
      marketPrice.value = 0;
      actualPrice.value = 0;
    };
    const submitQuote = () => {
      const selectedProducts = [];
      projects.forEach((project) => {
        project.products.forEach((product) => {
          if (product.selected) {
            selectedProducts.push({
              projectId: project.projectId,
              productId: product.productId,
              name: product.productName,
              price: product.price,
              quantity: product.quantity
            });
          }
        });
      });
      if (selectedProducts.length === 0) {
        return common_vendor.index.showToast({ title: "请至少选择一个产品", icon: "none" });
      }
      common_vendor.index.request({
        url: "https://your-api-domain.com/api/quotes",
        method: "POST",
        data: {
          products: selectedProducts,
          marketPrice: marketPrice.value,
          actualPrice: actualPrice.value,
          totalCost: totalCost.value
        },
        success: () => {
          common_vendor.index.navigateTo({ url: "/pages/quote/success" });
        },
        fail: () => {
          common_vendor.index.showToast({ title: "提交失败", icon: "none" });
        }
      });
    };
    const totalCost = common_vendor.computed(() => {
      return projects.reduce((sum, project) => {
        return sum + project.products.reduce((projSum, product) => {
          return projSum + (product.selected ? product.price * product.quantity : 0);
        }, 0);
      }, 0);
    });
    const profit = common_vendor.computed(() => {
      return actualPrice.value - totalCost.value;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(fetchData),
        b: projects.length > 0
      }, projects.length > 0 ? {
        c: common_vendor.f(projects, (project, k0, i0) => {
          return common_vendor.e({
            a: isProjectSelected(project.projectId),
            b: common_vendor.o(($event) => toggleProjectSelect(project.projectId), project.projectId),
            c: getSelectedProductCount(project.projectId) > 0
          }, getSelectedProductCount(project.projectId) > 0 ? {
            d: common_vendor.t(getSelectedProductCount(project.projectId))
          } : {}, {
            e: common_vendor.t(project.projectName),
            f: "60d818e5-0-" + i0,
            g: common_vendor.p({
              type: project.expanded ? "minus" : "plus",
              size: "16"
            }),
            h: common_vendor.o(($event) => toggleExpand(project.projectId), project.projectId),
            i: project.expanded
          }, project.expanded ? {
            j: common_vendor.f(project.products, (product, k1, i1) => {
              return {
                a: product.selected,
                b: common_vendor.o(($event) => toggleProductSelect(product.productId), product.productId),
                c: common_vendor.t(product.productName),
                d: common_vendor.t(product.price.toFixed(2)),
                e: product.quantity <= 1,
                f: common_vendor.o(($event) => updateQuantity(product.productId, -1), product.productId),
                g: common_vendor.o(($event) => validateQuantity(product), product.productId),
                h: product.quantity,
                i: common_vendor.o(common_vendor.m(($event) => product.quantity = $event.detail.value, {
                  number: true
                }), product.productId),
                j: common_vendor.o(($event) => updateQuantity(product.productId, 1), product.productId),
                k: product.productId
              };
            })
          } : {}, {
            k: project.projectId
          });
        })
      } : common_vendor.e({
        d: loading.value
      }, loading.value ? {} : {}), {
        e: common_vendor.t(totalCost.value.toFixed(2)),
        f: marketPrice.value,
        g: common_vendor.o(common_vendor.m(($event) => marketPrice.value = $event.detail.value, {
          number: true
        })),
        h: actualPrice.value,
        i: common_vendor.o(common_vendor.m(($event) => actualPrice.value = $event.detail.value, {
          number: true
        })),
        j: common_vendor.t(profit.value.toFixed(2)),
        k: profit.value !== 0
      }, profit.value !== 0 ? {
        l: common_vendor.t((profit.value / totalCost.value * 100).toFixed(1))
      } : {}, {
        m: profit.value < 0 ? 1 : "",
        n: common_vendor.o(resetAll),
        o: common_vendor.o(submitQuote),
        p: userRole.value
      }, userRole.value ? common_vendor.e({
        q: userRole.value === "admin"
      }, userRole.value === "admin" ? {
        r: common_vendor.o(navigateToProduct)
      } : {}, {
        s: userRole.value === "admin"
      }, userRole.value === "admin" ? {
        t: common_vendor.o(navigateToUser)
      } : {}) : {});
    };
  }
};
wx.createPage(_sfc_main);
