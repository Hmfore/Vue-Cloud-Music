<template>
  <div class="tag" :style="styles">
    {{ text }}
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["text", "styles"],
};
</script>

<style lang="less" scoped>
.tag {
  position: relative;
  white-space: nowrap;
  text-overflow: initial;
  display: inline-block;
  font-size: 14px;
  color: red;
  border: 1px solid red;
  border-radius: 2px;
  padding: 1px 2px;
}
</style>
