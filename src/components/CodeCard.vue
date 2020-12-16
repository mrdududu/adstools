<template>
  <q-card flat bordered class="full-width flex column">
    <q-card-section>
      <q-input standout dense label="JavaScript" readonly>
        <template v-slot:after>
          <q-btn
            round
            dense
            flat
            icon="delete"
            @click="$emit('deleteCode', index)"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="flex column" style="flex: 1 0 0; overflow-x: auto;">
      <!-- <q-input v-model="codeInput" outlined autogrow type="textarea" /> -->
      <codemirror v-model="codeInput" :options="cmOptions" />
    </q-card-section>
  </q-card>
</template>
<script>
import { codemirror } from "vue-codemirror";

// import base style
import "codemirror/lib/codemirror.css";
export default {
  components: {
    codemirror
  },
  props: ["code", "index"],
  data() {
    return {
      codeInput: this.code,
      cmOptions: {
        tabSize: 2,
        mode: "text/javascript",
        // theme: "eclipse",
        lineNumbers: true,
        line: true
        // more CodeMirror options...
      }
    };
  },
  watch: {
    code(newCode) {
      if (newCode != this.codeInput) {
        this.codeInput = newCode;
      }
    },
    codeInput(newCodeInput) {
      // console.log("codeInput", newCodeInput);
      if (newCodeInput != this.code) {
        this.$emit("codeChanged", {
          index: this.index,
          code: newCodeInput
        });
      }
    }
  }
};
</script>
<style>
.CodeMirror {
  height: 100%;
}
</style>
