<template>
  <q-page class="flex column no-wrap">
    <div class="q-pa-sm q-pt-md" style="position: relative;">
      <ToolBar
        :savesList="savesList"
        :selectedSaveId="loadedSaveId"
        :presets="presets"
        @clickDownloadExcel="downloadExcel()"
        @clickRun="onClick_Run"
        @clickNew="onClick_New"
        @clickSave="onClick_Save"
        @clickSaveAs="onClick_SaveAs"
        @clickSaveAsJson="onClick_SaveAsJson"
        @clickLoadSave="onClick_LoadSave"
        @clickDeleteSave="onClick_DeleteSave"
        @loadedInputFileJson="onLoaded_InputFileJson"
        @selectedPreset="onSelected_Preset"
      />
    </div>
    <div class="flex no-wrap content-block">
      <template v-for="(item, index) in core">
        <ResizableHorizontal
          v-if="item.var"
          :key="index"
          innerStyle="flex-basis: 300px;"
        >
          <div class="q-pa-sm flex" style="width: 100%;">
            <ObjectCard
              v-if="item.var.type == 'object'"
              :index="index"
              :value.sync="item.var"
              @deleteValue="onDeleteValue"
              @dropCard="onDropCard"
            />
            <ValueCard
              v-else
              :index="index"
              :value.sync="item.var"
              @deleteValue="onDeleteValue"
              @dropCard="onDropCard"
            />
          </div>
        </ResizableHorizontal>
        <template v-else-if="item.code != null">
          <div class="q-pa-lg flex column" :key="'plus_' + index">
            <q-btn
              push
              no-wrap
              label="Array"
              icon="add"
              @click="
                () => {
                  insertVar({ index });
                }
              "
            />
            <q-btn
              class="q-mt-sm"
              push
              no-wrap
              label="Object"
              icon="add"
              @click="
                () => {
                  insertVar({ index, type: 'object' });
                }
              "
            />
          </div>
          <ResizableHorizontal :key="index" innerStyle="flex-basis: 400px;">
            <div class="q-pa-sm flex" style="width: 100%;">
              <CodeCard
                :index="index"
                :code="item.code"
                @codeChanged="onCodeChanged"
                @deleteCode="onDeleteCode"
              />
            </div>
          </ResizableHorizontal>
        </template>
      </template>
      <div class="q-pa-lg flex column">
        <q-btn
          push
          no-wrap
          label="Var"
          icon="add"
          @click="
            () => {
              insertVar({});
            }
          "
        />
        <q-btn
          class="q-mt-sm"
          push
          no-wrap
          label="Object"
          icon="add"
          @click="
            () => {
              insertVar({ type: 'object' });
            }
          "
        />
        <q-btn
          class="q-mt-sm"
          push
          no-wrap
          label="js"
          icon="wysiwyg"
          @click="
            () => {
              insertCode({});
            }
          "
        />
      </div>
    </div>
    <PromptDialog
      ref="dialogSaveAs"
      title="Save As"
      label-btn-ok="Save"
      @clickBtnOk="onOk_SaveAs"
    />
  </q-page>
</template>
<script>
import { LocalStorage } from "quasar";
import ExcelJS from "exceljs/dist/es5/exceljs.browser.js";
import { saveAs } from "file-saver";
import SaveDataClass from "../misc/SaveData";
import initialCore from "../misc/initial_core.json";
import presetsJson from "../misc/presets.json";
import { presets } from "app/babel.config";
const alphabet = "abcdefghijklmnopqrstuvwxyz";
// console.log({ initialCore });

const wpSaves = new SaveDataClass("wp_saves");

//runCode({ v1: 1, v2: 2 }, "return v1+v2;");
// ToDo implement this https://stackoverflow.com/questions/41587008/is-this-possible-to-limit-javascript-function-executing-time
const runCode = (vars, code) => {
  return new Promise((resolve, reject) => {
    // console.log("runCode", { vars, code });

    const varNames = Object.keys(vars);
    const varValues = varNames.map(name => vars[name]);
    const fn = new Function(...varNames, code);
    const res = fn(...varValues);
    // console.log("res", res);
    resolve(res);
  });
};

const getFilename = () => {
  var today = new Date();
  var y = today.getFullYear();
  // JavaScript months are 0-based.
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return `${y}${m}${d}${h}${mi}${s}`;
};

export default {
  components: {
    ToolBar: () => import("components/Toolbar"),
    ValueCard: () => import("components/ValueCard"),
    ObjectCard: () => import("components/ObjectCard"),
    CodeCard: () => import("components/CodeCard"),
    PromptDialog: () => import("components/PromptDialog"),
    ResizableHorizontal: () => import("components/ResizableHorizontal")
  },
  data() {
    return {
      core: [],
      loadedSaveId: null,
      savesList: [],
      presets: presetsJson
    };
  },
  methods: {
    onCodeChanged(data) {
      // console.log("onCodeChanged data", data);
      this.core[data.index].code = data.code;
    },
    onDeleteValue(index) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure to delete this value?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.core.splice(index, 1);
          this.$q.notify({
            message: "Value is deleted.",
            icon: "announcement",
            timeout: 2000
          });
        });
    },
    onDeleteCode(index) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure to delete this code?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.core.splice(index, 1);
          this.$q.notify({
            message: "Code is deleted.",
            icon: "announcement",
            timeout: 2000
          });
        });
    },
    onDropCard(e) {
      // console.log("onDropCard", e);

      const droppedData = this.core[e.droppedIndex];
      this.core.splice(e.droppedIndex, 1);
      this.core.splice(e.eventIndex, 0, droppedData);
    },
    async onClick_Run() {
      let vars = {};

      for (let i = 0; i < this.core.length; i++) {
        const el = this.core[i];

        if (el.var) {
          vars[el.var.name] = el.var.val;
        } else if (el.code) {
          // console.log("vars", vars);
          // console.log("el.code", el.code);
          const res = await runCode(vars, el.code);

          const resNames = Object.keys(res);
          resNames.forEach(name => {
            this.setValByName(name, res[name]);
          });
        }
      }

      await this.saveState();

      this.$q.notify({
        type: "positive",
        message: "Code running complete",
        icon: "check_circle",
        timeout: 2000
      });
    },
    onClick_AddVar(index) {
      // console.log("onClick_AddVar", { index });
      this.insertVar({});
    },
    onClick_AddCode() {
      // console.log("onClick_AddCode");
      this.insertCode({});
      this.insertVar({});
    },
    onClick_New() {
      console.log("onClick_New");
      this.loadedSaveId = null;
      this.core = [];
      this.insertVar({ val: null });
      this.insertCode({ code: "return {b: a}" });
      this.insertVar({ val: null });
    },
    async onClick_Save() {
      //resumeState
      console.log("onClick_Save");
      if (this.loadedSaveId) {
        await wpSaves.save({ id: this.loadedSaveId, data: this.core });
        this.savesList = await wpSaves.getList();
        this.$q.notify({
          type: "info",
          message: `Saved`,
          timeout: 2000
        });
      } else {
        this.$refs.dialogSaveAs.show();
      }
    },
    onClick_DeleteSave({ saveId }) {
      this.$q
        .dialog({
          title: "Delete save",
          message: "Are you sure to delete this save?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          await wpSaves.delete(saveId);
          this.savesList = await wpSaves.getList();
          this.onClick_New();
        });
    },
    onClick_SaveAs() {
      console.log("onClick_SaveAs");
      this.$refs.dialogSaveAs.show();
    },
    async onOk_SaveAs(prompt) {
      console.log("onClick_SaveAs", { prompt });
      const id = await wpSaves.save({ title: prompt, data: this.core });
      this.savesList = await wpSaves.getList();
      this.loadedSaveId = id;

      this.$q.notify({
        type: "info",
        message: `Saved as ${prompt}`,
        timeout: 2000
      });
    },
    onClick_SaveAsJson() {
      const json = JSON.stringify(this.core, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      saveAs(blob, `${getFilename()}.json`);
    },
    onLoaded_InputFileJson(json) {
      const oJson = JSON.parse(json);
      this.core = oJson;
      this.loadedSaveId = null;
    },
    async onClick_LoadSave(id) {
      console.log("onClick_LoadSave", { id });
      const saveData = await wpSaves.getData(id);
      // console.log({ saveData });
      this.loadedSaveId = id;
      this.core = saveData;

      this.$q.notify({
        type: "info",
        message: `Save is loaded.`,
        timeout: 2000
      });
    },
    onSelected_Preset(preset) {
      // console.log("onSelected_Preset", { preset });
      this.core = preset.core;

      this.$q.notify({
        type: "info",
        message: `Preset "${preset.name}" is loaded.`,
        timeout: 2000
      });
    },
    insertVar({ index, val, type }) {
      index = index === undefined || index === null ? this.core.length : index;
      type = type ? type : "array";
      val = val ? val : type == "object" ? {} : null;

      const name = alphabet[this.core.filter(item => item.var).length];
      this.core.splice(index, 0, { var: { name, val, type, selected: false } });
    },
    insertCode({ index, code }) {
      index = index === undefined || index === null ? this.core.length : index;
      code = code ? code : "";
      this.core.splice(index, 0, { code });
    },
    saveState() {
      return new Promise((resolve, reject) => {
        LocalStorage.set("state", {
          core: this.core,
          loadedSaveId: this.loadedSaveId
        });
        resolve();
      });
    },
    resumeState() {
      return new Promise(async (resolve, reject) => {
        const state = LocalStorage.getItem("state");
        this.savesList = await wpSaves.getList();
        if (state) {
          this.core = state.core;
          this.loadedSaveId = state.loadedSaveId;
        } else {
          this.core = initialCore;
        }
        resolve();
      });
    },
    async downloadExcel() {
      const sheetArray = this.getSheetArray();
      const wb = new ExcelJS.Workbook();

      const ws = wb.addWorksheet();

      sheetArray.forEach(sheetRow => {
        const row = ws.addRow(sheetRow);
        // row.font = { bold: true };
      });

      const buf = await wb.xlsx.writeBuffer();

      saveAs(new Blob([buf]), `${getFilename()}.xlsx`);
    },
    getSheetArray() {
      let maxRow = 0;
      const sheetArray = [];
      const namesRow = [];
      const varsData = this.core.filter(item => item.var && item.var.selected);

      varsData.forEach(varData => {
        let len = 1;
        if (Array.isArray(varData.var.val)) {
          len = varData.var.val.length;
        }

        if (maxRow < len) maxRow = len;

        namesRow.push(varData.var.name);
      });

      sheetArray.push(namesRow);

      for (let i = 0; i < maxRow; i++) {
        const row = [];
        varsData.forEach(varData => {
          let val = "";
          if (!Array.isArray(varData.var.val)) {
            val = 0 === i ? varData.var.val : "";
          } else {
            val = i < varData.var.val.length ? varData.var.val[i] : "";
          }

          row.push(val);
        });

        sheetArray.push(row);
      }

      return sheetArray;
    },
    setValByName(name, newVal) {
      const elVar = this.core.find(el => {
        if (el.var) {
          if (el.var.name == name) {
            return true;
          }
        }

        return false;
      });

      if (elVar) {
        elVar.var.val = newVal;
      }
    }
  },
  async created() {
    this.savesList = await wpSaves.getList();

    await this.resumeState();
  }
};
</script>
<style scoped>
.content-block {
  flex: 1 0 0;
  overflow-x: auto;
}
.content-col {
  flex: 1 0 400px;
}
</style>
