<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div v-if="!isCollapse" class="user-panel">
      <router-link title="个人中心" class="center" to="/user/profile">
        <div class="pull-left image">
          <img :src="avatar" class="img-circle" alt="User Image" title="个人中心" />
        </div>
      </router-link>
      <div class="pull-right">
        <p>admin</p>
        <div>
          <span class="icon-box">
            <i class="circle-icon"></i>
            在线
          </span>
          <span class="icon-box icon-box-logout" @click="logout">
            <i class="el-icon-switch-button circle-icon-logout"></i>
            注销
          </span>
        </div>
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar", "avatar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created() {
    //console.log(this.avatar);
  },
  methods: {
    logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.reload();
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-panel {
  white-space: nowrap;
  position: relative;
  width: 100%;
  padding: 15px;
  overflow: hidden;
  height: 75px;
  display: flex;
  flex-direction: row;
  .center {
    width: 45px !important;
  }
  .pull-left {
    height: 45px;
    font-size: 0;
    border-radius: 50%;
    .img-circle {
      width: 45px;
    }
  }
  .pull-right {
    height: 45px;
    margin-left: 10px;
    padding: 5px 5px 5px 0px;
    p {
      font-weight: 600;
      margin-bottom: 9px;
      color: #fff;
      font-size: 12px;
      margin: 0;
    }
    .icon-box {
      i {
        margin-right: 2px;
      }
      color: #fff;
      height: 34px;
      line-height: 34px;
      font-size: 12px;
      width: 50px !important;
    }
    .circle-icon {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #1c84c6;
    }
    .circle-icon-logout {
      margin-left: 3px;
      color: #ed5565;
    }
    .icon-box-logout {
      cursor: pointer;
    }
  }
}
</style>
