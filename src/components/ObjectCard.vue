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
          <q-btn round dense flat icon="more_vert">
            <q-menu v-model="showMenu">
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section @click="saveAsJson"
                    >Save as JSON</q-item-section
                  >
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section-file accept=".json" @onFileLoad="jsonLoaded"
                    >Load JSON</q-item-section-file
                  >
                </q-item>
                <q-item clickable>
                  <q-item-section-file
                    accept=".xlsx"
                    @onFileLoad="excelLoaded"
                    readAs="ArrayBuffer"
                    >Load Excel</q-item-section-file
                  >
                </q-item>
                <q-item clickable>
                  <q-item-section-file accept=".csv" @onFileLoad="csvLoaded"
                    >Load CSV</q-item-section-file
                  >
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section @click="$emit('deleteValue', index)"
                    >Delete</q-item-section
                  >
                </q-item>
                <!-- <q-item clickable>
                  <q-item-section>Load CSV</q-item-section>
                </q-item> -->
              </q-list>
            </q-menu>
          </q-btn>
        </template>
      </q-input></q-card-section
    >
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
import { saveAs } from "file-saver";
import Excel from "exceljs/dist/es5/exceljs.browser.js";
import { ExcelToObject, CSVToObject } from "../misc/helper";

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
    Vjsoneditor: () => import("components/Vjsoneditor"),
    qItemSectionFile: () => import("components/q-item-section-file")
  },
  props: ["value", "index"],
  data() {
    return {
      draggable: true,
      showMenu: false
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
    },
    jsonLoaded(fileData) {
      try {
        this.showMenu = false;
        const data = JSON.parse(fileData);
        this.value.val = data;
      } catch (err) {}
    },
    async excelLoaded(fileData) {
      this.showMenu = false;
      const excelData = await ExcelToObject(fileData);
      this.value.val = excelData;
    },
    async csvLoaded(fileData) {
      this.showMenu = false;
      const csvData = await CSVToObject(fileData);
      this.value.val = csvData;
    },
    saveAsJson() {
      this.showMenu = false;
      const json = JSON.stringify(this.val, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      saveAs(blob, `value_${this.value.name}.json`);
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
