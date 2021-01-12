<template>
  <div ref="jsoneditor" style="flex: 1 0 0; overflow-x: auto;"></div>
</template>
<script>
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";
export default {
  props: ["value"],
  watch: {
    value(newValue) {
      console.log("watch new value", newValue);
      if (this.jsoneditor) {
        this.jsoneditor.set(newValue);
      }
    }
  },
  mounted() {
    console.log("this.$refs.jsoneditor", this.$refs.jsoneditor);
    const options = {
      mode: "tree",
      modes: ["code", "tree", "form", "view"],
      history: false,
      sortObjectKeys: false,
      search: false,
      enableSort: false,
      enableTransform: false,
      onChange: () => {
        try {
          const data = this.jsoneditor.get();
          console.log("onChange()", data);
          this.$emit("input", data);
        } catch (err) {}
      }
    };
    this.jsoneditor = new JSONEditor(this.$refs.jsoneditor, options);
    this.jsoneditor.set(this.value);
  }
};
</script>
