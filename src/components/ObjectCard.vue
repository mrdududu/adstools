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
        label="Object"
        v-model="value.name"
        @focus="draggable = false"
        @blur="draggable = true"
      >
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
      <!-- <textarea
        :value="valText"
        @input="onValTextInput"
        style="flex: 1 0 0;  overflow-x: auto;"
        @focus="draggable = false"
        @blur="draggable = true"
      ></textarea> -->
      <Vjsoneditor :value="val" @input="onValInput" />
    </q-card-section>
  </q-card>
</template>
<script>
const textToVal = text => {
  if (!text) return null;

  let val = null;
  try {
    val = JSON.parse(text);
  } catch (err) {
    val = text;
  }

  return val;
};

const valToText = val => {
  if (val) {
    if (typeof val == "string") {
      return val;
    }
    return JSON.stringify(val, null, 2);
  }

  return "";
};

export default {
  components: {
    Vjsoneditor: () => import("components/Vjsoneditor")
  },
  props: ["value", "index"],
  data() {
    return {
      draggable: true
    };
  },
  computed: {
    val() {
      return this.value.val;
    }
  },
  methods: {
    onValInput(val) {
      this.value.val = val;
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
