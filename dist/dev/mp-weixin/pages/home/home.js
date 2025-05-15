"use strict";
const common_vendor = require("../../common/vendor.js");
const api_project = require("../../api/project.js");
if (!Math) {
  uniIcons();
}
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const projects = common_vendor.reactive([]);
    const loading = common_vendor.ref(false);
    const quoteImage = common_vendor.ref("");
    const actualPrice = common_vendor.ref(0);
    const user = common_vendor.ref();
    const userRole = common_vendor.ref();
    const canvasHeight = common_vendor.ref(800);
    common_vendor.onMounted(() => {
      var _a, _b;
      user.value = common_vendor.index.getStorageSync("userInfo");
      userRole.value = (_b = (_a = user.value) == null ? void 0 : _a.role) == null ? void 0 : _b.value;
      setupListeners();
    });
    common_vendor.onUnmounted(() => {
      cleanupListeners();
    });
    const setupListeners = () => {
      common_vendor.index.$on("productUpdated", fetchData);
    };
    const cleanupListeners = () => {
      common_vendor.index.$off("productUpdated", fetchData);
    };
    const fetchData = async () => {
      loading.value = true;
      const res = await api_project.getAllProject();
      const productData = res.data;
      projects.splice(0, projects.length);
      productData.forEach((project) => {
        projects.push({
          projectId: project.id,
          projectName: project.name,
          expanded: false,
          products: project.products.map((product) => ({
            ...product,
            projectId: project.id,
            productId: product.id,
            productName: product.name,
            selected: false,
            quantity: 1
          }))
        });
      });
      loading.value = false;
    };
    common_vendor.onShow(() => {
      fetchData();
    });
    const toggleExpand = (projectId) => {
      const project = projects.find((p) => p.projectId === projectId);
      if (project)
        project.expanded = !project.expanded;
    };
    const toggleProductSelect = (projectId, productId) => {
      const project = projects.find((p) => p.projectId === projectId);
      if (!project)
        return;
      const product = project.products.find((p) => p.productId === productId);
      if (product) {
        product.selected = !product.selected;
        if (product.selected && (!product.quantity || product.quantity < 1)) {
          product.quantity = 1;
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
    const updateQuantity = (projectId, productId, delta) => {
      const project = projects.find((p) => p.projectId === projectId);
      if (!project)
        return;
      const product = project.products.find((p) => p.productId === productId);
      if (product) {
        const newQuantity = Math.max(1, (product.quantity || 0) + delta);
        product.quantity = newQuantity;
        if (!product.selected) {
          product.selected = true;
        }
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
      actualPrice.value = 0;
      quoteImage.value = "";
    };
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
    const downloadQuoteImage = () => {
      if (!quoteImage.value)
        return;
      common_vendor.index.showLoading({ title: "保存中...", mask: true });
      common_vendor.index.saveImageToPhotosAlbum({
        filePath: quoteImage.value,
        success: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "保存成功", icon: "success" });
        },
        fail: (err) => {
          console.error("保存失败:", err);
          common_vendor.index.hideLoading();
          if (err.errMsg.includes("authorize")) {
            common_vendor.index.showModal({
              title: "需要相册权限",
              content: "请允许访问相册以保存图片",
              success: (res) => {
                if (res.confirm) {
                  common_vendor.index.openSetting();
                }
              }
            });
          } else {
            common_vendor.index.showToast({ title: "保存失败", icon: "none" });
          }
        }
      });
    };
    const submitQuote = async () => {
      var _a;
      try {
        common_vendor.index.showLoading({ title: "生成报价单中...", mask: true });
        const selectedProducts = [];
        const baseHeights = {
          header: 100,
          // 标题+表头高度
          footer: 120,
          // 汇总信息高度
          row: 20
          // 每行产品高度
        };
        projects.forEach((project) => {
          project.products.forEach((product) => {
            if (product.selected) {
              selectedProducts.push({
                projectName: project.projectName,
                productName: product.productName,
                price: product.price,
                quantity: product.quantity,
                subtotal: (product.price * product.quantity).toFixed(2)
              });
            }
          });
        });
        if (selectedProducts.length === 0) {
          common_vendor.index.hideLoading();
          return common_vendor.index.showToast({ title: "请至少选择一个产品", icon: "none" });
        }
        const systemInfo = common_vendor.index.getSystemInfoSync();
        const canvasWidth = systemInfo.windowWidth * 0.95;
        canvasHeight.value = baseHeights.header + selectedProducts.length * baseHeights.row + baseHeights.footer;
        const context = common_vendor.index.createCanvasContext("quoteCanvas", this);
        context.setFillStyle("#ffffff");
        context.fillRect(0, 0, canvasWidth, canvasHeight.value);
        context.setFontSize(20);
        context.setFillStyle("#333333");
        context.setTextAlign("center");
        context.fillText("报价单", canvasWidth / 2, 30);
        context.setFontSize(14);
        context.setFillStyle("#666666");
        context.setTextAlign("left");
        const columnWidth = canvasWidth / 5;
        const headers = ["项目名称", "产品名称", "单价", "数量", "小计"];
        const headerY = 60;
        headers.forEach((text, index) => {
          const x = index * columnWidth + 10;
          context.fillText(text, x, headerY);
        });
        let currentY = headerY + 30;
        selectedProducts.forEach((product) => {
          context.setFontSize(12);
          context.setFillStyle("#333333");
          context.fillText(product.projectName, 10, currentY);
          context.fillText(product.productName, columnWidth + 10, currentY);
          context.setTextAlign("right");
          context.fillText(`¥${product.price}`, columnWidth * 2 + 10, currentY);
          context.setTextAlign("center");
          context.fillText(product.quantity.toString(), columnWidth * 3 + 10, currentY);
          context.setTextAlign("right");
          context.fillText(`¥${product.subtotal}`, columnWidth * 4 + 10, currentY);
          context.setTextAlign("left");
          currentY += baseHeights.row;
        });
        const summaryY = currentY + 20;
        context.setFontSize(14);
        context.fillText("零售价总计:", 10, summaryY);
        context.setTextAlign("right");
        context.fillText(`¥${totalCost.value.toFixed(2)}`, canvasWidth - 10, summaryY);
        context.setTextAlign("left");
        context.fillText("实际成交价:", 10, summaryY + 25);
        context.setTextAlign("right");
        context.fillText(`¥${actualPrice.value.toFixed(2)}`, canvasWidth - 10, summaryY + 25);
        context.setTextAlign("left");
        context.fillText("业务员佣金:", 10, summaryY + 50);
        context.setTextAlign("right");
        if ((_a = commission.value) == null ? void 0 : _a.message) {
          context.setFillStyle("#f56c6c");
          context.fillText(commission.value.message, canvasWidth - 10, summaryY + 50);
        } else {
          const commissionValue = typeof commission.value === "object" ? commission.value.value : typeof commission.value === "number" ? commission.value : 0;
          context.setFillStyle("#333333");
          context.fillText(`¥${commissionValue.toFixed(2)}`, canvasWidth - 10, summaryY + 50);
        }
        context.setFontSize(12);
        context.setFillStyle("#888888");
        context.setTextAlign("right");
        context.fillText(`生成时间: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, canvasWidth - 10, summaryY + 80);
        context.setStrokeStyle("#eaeaea");
        context.strokeRect(5, 5, canvasWidth - 10, canvasHeight.value - 10);
        context.draw(false, () => {
          setTimeout(() => {
            common_vendor.index.canvasToTempFilePath({
              canvasId: "quoteCanvas",
              success: (res) => {
                common_vendor.index.getFileSystemManager().saveFile({
                  tempFilePath: res.tempFilePath,
                  success: (savedRes) => {
                    quoteImage.value = savedRes.savedFilePath;
                    common_vendor.index.hideLoading();
                  },
                  fail: () => {
                    quoteImage.value = res.tempFilePath;
                    common_vendor.index.hideLoading();
                  }
                });
              },
              fail: (err) => {
                console.error("生成失败:", err);
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({ title: "生成失败", icon: "none" });
              }
            }, this);
          }, 500);
        });
      } catch (error) {
        console.error("生成出错:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "生成失败", icon: "none" });
      }
    };
    const totalCost = common_vendor.computed(() => {
      return projects.reduce((sum, project) => {
        return sum + project.products.reduce((projSum, product) => {
          return projSum + (product.selected ? product.price * product.quantity : 0);
        }, 0);
      }, 0);
    });
    const operatingCost = common_vendor.computed(() => {
      return totalCost.value > 0 ? (totalCost.value * 0.65).toFixed(2) : 0;
    });
    const retailPrice = common_vendor.computed(() => {
      return totalCost.value;
    });
    const commission = common_vendor.computed(() => {
      const A = retailPrice.value;
      const B = operatingCost.value;
      const C = actualPrice.value;
      const profit = A - B;
      const excess = C - B;
      if (B > C) {
        return { value: 0, message: `请业务员补足成本${(B - C).toFixed(2)}` };
      }
      if (C === B) {
        return { value: B * 0.1, message: "" };
      }
      if (excess > 0 && excess <= profit * 0.6) {
        return { value: B * 0.1 + excess * 0.4, message: "" };
      }
      if (excess > profit * 0.6 && excess <= profit) {
        return {
          value: B * 0.1 + profit * 0.6 * 0.4 + (excess - profit * 0.6) * 0.6,
          message: ""
        };
      }
      return {
        value: B * 0.1 + profit * 0.6 * 0.4 + profit * 0.4 * 0.6 + (C - A) * 0.65,
        message: ""
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: projects.length > 0
      }, projects.length > 0 ? {
        b: common_vendor.f(projects, (project, k0, i0) => {
          return common_vendor.e({
            a: isProjectSelected(project.projectId),
            b: common_vendor.o(($event) => toggleProjectSelect(project.projectId), project.projectId),
            c: getSelectedProductCount(project.projectId) > 0
          }, getSelectedProductCount(project.projectId) > 0 ? {
            d: common_vendor.t(getSelectedProductCount(project.projectId))
          } : {}, {
            e: common_vendor.t(project.projectName),
            f: "7da4c6af-0-" + i0,
            g: common_vendor.p({
              type: project.expanded ? "down" : "up",
              size: "16"
            }),
            h: common_vendor.o(($event) => toggleExpand(project.projectId), project.projectId),
            i: project.expanded
          }, project.expanded ? {
            j: common_vendor.f(project.products, (product, k1, i1) => {
              return {
                a: product.selected,
                b: common_vendor.o(($event) => toggleProductSelect(project.projectId, product.productId), product.productId),
                c: common_vendor.t(product.productName),
                d: common_vendor.t(product.price),
                e: product.quantity <= 1,
                f: common_vendor.o(($event) => updateQuantity(project.projectId, product.productId, -1), product.productId),
                g: common_vendor.o((e) => updateQuantity(project.projectId, product.productId, 0), product.productId),
                h: product.quantity,
                i: common_vendor.o(common_vendor.m(($event) => product.quantity = $event.detail.value, {
                  number: true
                }), product.productId),
                j: common_vendor.o(($event) => updateQuantity(project.projectId, product.productId, 1), product.productId),
                k: product.productId
              };
            })
          } : {}, {
            k: project.projectId
          });
        })
      } : common_vendor.e({
        c: loading.value
      }, loading.value ? {} : {}), {
        d: common_vendor.t(totalCost.value),
        e: actualPrice.value,
        f: common_vendor.o(common_vendor.m(($event) => actualPrice.value = $event.detail.value, {
          number: true
        })),
        g: commission.value.message
      }, commission.value.message ? {
        h: common_vendor.t(commission.value.message)
      } : {
        i: common_vendor.t(commission.value.value.toFixed(2))
      }, {
        j: common_vendor.o(resetAll),
        k: common_vendor.o(submitQuote),
        l: quoteImage.value
      }, quoteImage.value ? {
        m: quoteImage.value,
        n: canvasHeight.value + "px",
        o: common_vendor.o(downloadQuoteImage)
      } : {}, {
        p: userRole.value
      }, userRole.value ? common_vendor.e({
        q: userRole.value === "admin"
      }, userRole.value === "admin" ? {
        r: common_vendor.o(navigateToProduct)
      } : {}, {
        s: userRole.value === "admin"
      }, userRole.value === "admin" ? {
        t: common_vendor.o(navigateToUser)
      } : {}) : {}, {
        v: canvasHeight.value + "px"
      });
    };
  }
};
wx.createPage(_sfc_main);
