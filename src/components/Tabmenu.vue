<template>
  <div class="tabmenu">
    <el-menu
      :default-active="mode === 'menu' ? defaultactive : activeMenu"
      mode="horizontal"
      @select="menuItemClick"
    >
      <el-menu-item
        :index="item.path ? item.path : key + ''"
        v-for="(item, key) in menuList"
        :key="key"
      >
        <div class="itemstyle">
          {{ item.title ? item.title : item }}
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: "",
    };
  },

  props: {
    menuList: {
      /* [menuName1,menuName2] */
      /* [{path:'/xxx',name:'xxx'}] */
      type: Array,
      required: true,
    },
    mode: {
      /* menu/router */
      type: String,
      default: "menu",
    },
    defaultactive: {
      type: String,
      default: "0",
    },
  },
  created() {
    // if (this.mode === "router") {
    //   if (window.sessionStorage.getItem("activeMenu"))
    //     this.activeMenu = window.sessionStorage.getItem("activeMenu");
    // }
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(val) {
        if (this.mode === "router") {
          this.activeMenu = val;
        }
      },
    },
  },
  methods: {
    menuItemClick(index) {
      if (this.mode === "menu") {
        this.$emit("menuClick", index);
      } else if (this.mode === "router") {
        if (this.$route.path !== index) {
          window.sessionStorage.setItem("activeMenu", index);
          this.$router.push(index);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tabmenu {
  .el-menu.el-menu--horizontal {
    border: 1px solid transparent;
    min-width: 450px;
  }
  .el-menu--horizontal > .el-menu-item {
    color: #000;
    // border: 2px solid transparent;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    font-size: 17px;
    font-weight: bold;
    border-bottom: 3px solid transparent;
    .itemstyle {
      height: 43px;
      border-bottom: 3px solid red;
    }
  }
}
</style>
