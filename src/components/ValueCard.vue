<template>
  <q-card
    ref="valueCard"
    flat
    bordered
    class="full-width flex column"
    :draggable="draggable"
  >
    <q-card-section>
      <q-input
        standout
        dense
        label="Var"
        v-model="value.name"
        @focus="draggable = false"
        @blur="draggable = true"
      >
        <template v-slot:before>
          <q-checkbox v-model="value.selected" />
        </template>
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
        :value="valText"
        @input="onValTextInput"
        style="flex: 1 0 0;  overflow-x: auto;"
        @focus="draggable = false"
        @blur="draggable = true"
      ></textarea>
      <div class="text-overline q-pt-xs" style="line-height: 1rem;">
        Count: {{ value.val ? value.val.length : "" }}
      </div>
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
  props: ["value", "index"],
  data() {
    return {
      draggable: true
    };
  },
  computed: {
    valText() {
      return valToText(this.value.val);
    }
  },
  methods: {
    onValTextInput(event) {
      // console.log("onValTextInput", event);
      const newValue = textToVal(event.target.value);
      this.value.val = newValue;
    }
  },
  mounted() {
    // console.log("mounted", this.$refs.valueCard);
    this.$refs.valueCard.$el.addEventListener("dragstart", e => {
      // console.log("dragstart", { e });
      e.dataTransfer.setData("text/plain", this.index);
    });

    this.$refs.valueCard.$el.addEventListener("drop", e => {
      e.preventDefault();

      const droppedIndex = Number(e.dataTransfer.getData("text/plain"));
      this.$emit("dropCard", { droppedIndex, eventIndex: this.index });
    });
  }
};
</script>
