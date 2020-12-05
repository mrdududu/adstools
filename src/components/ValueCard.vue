<template>
  <q-card flat bordered class="q-ma-sm flex column" style="min-width: 300px;">
    <q-card-section>
      <q-input standout dense label="Name" :value="name" v-model="nameInput">
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
        v-model="text"
        style="flex: 1 0 0;  overflow-x: auto;"
      ></textarea>
      <!-- <q-input dense v-model="text" outlined type="textarea" style="" /> -->
    </q-card-section>
  </q-card>
</template>
<script>
const textToVal = text => {
  if (!text) return null;

  let val = null;
  val = text.split("\n").filter(t => !!t);

  if (val.length == 0) return null;

  return val.length > 1 ? val : val[0];
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
      text: ""
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
    text(newText) {
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
        this.text = newValText;
      }
    }
  },
  created() {
    this.nameInput = this.name;
    this.text = valToText(this.val);
  }
};
</script>
