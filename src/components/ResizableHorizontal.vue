<template>
  <div ref="main" class="root" :style="style">
    <div class="resizable">
      <slot />
    </div>
    <div
      ref="resizer"
      class="resizer"
      v-touch-pan.prevent.mouse="handlePan"
    ></div>
  </div>
</template>
<script>
let mouseX = 0;
export default {
  props: ["innerStyle"],
  data() {
    return {
      style: this.innerStyle
    };
  },
  methods: {
    handlePan(event) {
      this.style = {
        flexBasis: this.$refs.main.clientWidth + event.delta.x + "px"
      };
    }
  },
  created() {}
};
</script>
<style lang="css" scoped>
.root {
  flex: 1 0 300px;
  display: flex;
  /* background-color: red; */
}
.resizable {
  /* background-color: #ccc; */
  flex: 1 0 0;
  display: flex;
}
.resizer {
  padding: 0 2px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.12);
  background-clip: content-box;
  cursor: w-resize;
}
</style>
