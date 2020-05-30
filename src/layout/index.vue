<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      isReal: state => state.user.isReal,
      isOpenAccount: state => state.user.isOpenAccount,
      isOpenAbcAccount: state => state.user.isOpenAbcAccount,
      roles: state => state.user.roles
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  created() {
    const isReal = Number(this.isReal);
    const isOpenAccount = this.isOpenAccount;
    const isOpenAbcAccount = this.isOpenAbcAccount;
    const roles = this.roles;
    if (!roles.includes("admin")) {
      if (isReal === 1) {
        this._confirmModel("实名认证正在审核中，请等候。");
      } else if (isReal === 0 || isReal === 2) {
        this._confirmModel("未实名认证或实名认证未通过！", "前往认证", () => {
          this.$router.push({ path: "/real-authorize" });
        });
      } else if (isReal === 3) {
        if (isOpenAccount !== true) {
          this._confirmModel(
            "您收款账户未完全开通，请开通账户。",
            "开通账户",
            () => {
              this.$router.push({ path: "/account/list" });
            }
          );
        } else {
          if (isOpenAbcAccount !== true) {
            this._confirmModel(
              "农行收款账户需要必须开通！",
              "开通农行",
              () => {
                this.$router.push({ path: "/account/list" });
              }
            );
          }
        }
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },

    _confirmModel(msg, confirmButtonText = "确定", confirmFn, cancelFn) {
      this.$confirm(msg, "系统提示", {
        confirmButtonText,
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(() => {
          if (confirmFn) {
            confirmFn.call(this);
          }
        })
        .catch(() => {
          if (cancelFn) {
            cancelFn.call(this);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
