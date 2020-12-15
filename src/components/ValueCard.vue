<template>
  <q-card flat bordered class="full-width flex column">
    <q-card-section>
      <q-input standout dense label="Var" :value="name" v-model="nameInput">
        <template v-slot:after>
          <q-btn
            v-if="index > 0"
            round
            dense
            flat
            icon="delete"
            @click="$emit('deleteValue', index)"
          />
        </template> </q-input
    ></q-card-section>
    <q-card-section class="flex column" style="flex: 1 0 0;">
      <textarea
        v-model="valInput"
        style="flex: 1 0 0;  overflow-x: auto;"
      ></textarea>
    </q-card-section>
  </q-card>
</template>
<script>
const textToVal = text => {
  if (!text) return [];

  const val = text.split("\n"); //.filter(t => !!t);

  return val;
};

const valToText = val => {
  if (val) {
    if (Array.isArray(val)) {
      return val.join("\n");
    } else {
      return val;
    }
  }

  return "";
};

export default {
  props: ["name", "val", "index"],
  data() {
    return {
      nameInput: "",
      valInput: ""
    };
  },
  watch: {
    nameInput(newName) {
      if (newName != this.name) {
        this.$emit("nameChanged", {
          index: this.index,
          name: newName
        });
      }
    },
    valInput(newText) {
      const textVal = valToText(this.val);
      if (newText != textVal) {
        this.$emit("valChanged", {
          index: this.index,
          val: textToVal(newText)
        });
      }
    },
    name(newName) {
      if (newName != this.nameInput) {
        this.nameInput = newName;
      }
    },
    val(newVal) {
      const newValText = valToText(newVal);
      if (newValText != this.text) {
        this.valInput = newValText;
      }
    }
  },
  created() {
    this.nameInput = this.name;
    this.valInput = valToText(this.val);
  }
};
</script>
