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
      // console.log("mouseMove", { event });
      // console.log(
      //   "minWidth",
      //   this.$refs.main.clientWidth + event.offset.x + "px"
      // );
      //event.offset.x
      //event.direction
      // this.$refs.main.style.width =
      //   this.$refs.main.clientWidth + event.offset.x;
      this.style = {
        minWidth: this.$refs.main.clientWidth + event.delta.x + "px"
      };
    }
  },
  created() {
    //     this.$refs.resizer.addEventListener("mousedown", function(e){
    //     m_pos = e.x;
    //     document.addEventListener("mousemove", resize, false);
    // }, false);
  }
};
</script>
<style lang="css" scoped>
.root {
  display: flex;
  /* background-color: red; */
}
.resizable {
  background-color: #ccc;
  flex: 1 0 0;
}
.resizer {
  width: 4px;
  background-color: #666;
  cursor: w-resize;
}
</style>
