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
      // console.log({ fileData });

      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(fileData);

      const worksheet = workbook.worksheets[0];
      let colNames = [];
      const excelData = [];

      worksheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
        if (row.values && 1 < row.values.length) {
          const rowValues = row.values;
          rowValues.shift(); // Delete null colunm
          // console.log({ rowValues });
          if (1 == rowNum) {
            colNames = rowValues;
          } else {
            const obj = {};
            for (let i = 0; i < rowValues.length; i++) {
              obj[colNames[i]] = rowValues[i];
            }
            excelData.push(obj);
          }
        }

        // console.log("Row " + rowNum + " = " + JSON.stringify(row.values));
        // const currRow = worksheet.getRow(rowNum);
        // console.log({ currRow });
      });

      // console.log({ colNames, excelData });
      this.value.val = excelData;
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
