<template>
  <q-item-section @click="click"><slot></slot></q-item-section>
</template>
<script>
export default {
  props: ["accept", "readAs"],
  methods: {
    click() {
      this.fileInput.click();
    }
  },
  mounted() {
    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    this.fileInput.accept = this.accept; //".json";
    this.fileInput.style.display = "none";
    this.fileInput.onchange = event => {
      // console.log("this.fileInput.onchange", event.target.files[0]);
      // this.$emit("change", event);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        // console.log("onFileLoad", e.target.result);
        this.$emit("onFileLoad", e.target.result);
      };

      if ("ArrayBuffer" == this.readAs) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
      // console.log({ file, reader });
    };

    document.body.appendChild(this.fileInput);
  }
};
</script>
