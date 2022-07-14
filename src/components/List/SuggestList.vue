<template>
  <div class="suggestlist">
    <header class="suggestlist-title"><slot name="title"></slot></header>
    <main class="suggestlist-content">
      <slot name="content">
        <div class="item"></div>
      </slot>
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.suggestlist-title {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding-left: 10px;
  height: 30px;
  font-size: 12px;
  background-color: #f5f5f7;
}
.item {
  box-sizing: border-box;
  padding: 0 30px;
  line-height: 28px;
  height: 28px;
  font-size: 12px;
  &:hover {
    background-color: #f2f2f2;
  }
}
</style>
