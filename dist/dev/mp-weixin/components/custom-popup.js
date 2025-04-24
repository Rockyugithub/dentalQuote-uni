"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "custom-popup",
  props: {
    // 控制显示/隐藏（v-model）
    modelValue: {
      type: Boolean,
      default: false
    },
    // 点击遮罩层是否可关闭
    maskClosable: {
      type: Boolean,
      default: true
    },
    // 内容区域自定义样式
    contentStyle: {
      type: Object,
      default: () => ({})
    },
    // 层级控制
    zIndex: {
      type: Number,
      default: 999
    }
  },
  emits: [
    "update:modelValue",
    // 用于v-model
    "close"
    // 关闭事件
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const close = () => {
      emit("update:modelValue", false);
      emit("close");
    };
    __expose({
      closePopup: close
    });
    const handleMaskClick = () => {
      if (props.maskClosable) {
        close();
      }
    };
    common_vendor.computed(() => ({
      borderRadius: "32rpx",
      backgroundColor: "#fff",
      ...props.contentStyle
    }));
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.modelValue
      }, __props.modelValue ? {
        b: common_vendor.s(__props.contentStyle),
        c: common_vendor.o(() => {
        }),
        d: __props.zIndex,
        e: common_vendor.o(handleMaskClick)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cfc81dd2"]]);
wx.createComponent(Component);
