module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    //配置路由懒加载插件
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-optional-chaining",
    /* element按需加载 */
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
};
