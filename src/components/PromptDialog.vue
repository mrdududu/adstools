<template>
  <q-dialog v-model="visible" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="prompt" autofocus @keyup.enter="onOk" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="labelBtnCancel" v-close-popup />
        <q-btn flat :label="labelBtnOk" @click="onOk" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  // props: ["labelBtnOk", "labelBtnCancel", "prompt", "title", "show"]
  props: {
    labelBtnOk: {
      type: String,
      default: "Ok"
    },
    labelBtnCancel: {
      type: String,
      default: "Cancel"
    },
    title: {
      type: String,
      default: "Title"
    }
  },
  data() {
    return {
      visible: false,
      prompt: ""
    };
  },
  methods: {
    onOk() {
      this.$emit("clickBtnOk", this.prompt);
      this.visible = false;
      this.prompt = "";
    },
    show() {
      this.visible = true;
    }
  }
};
</script>
