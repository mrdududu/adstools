<template>
  <q-page style="display: flex; flex-direction: column;">
    <div class="q-pa-sm q-pt-md">
      <ToolBar
        :savesList="savesList"
        :selectedSaveId="loadedSaveId"
        @clickDownloadExcel="downloadExcel()"
        @clickRun="onClick_Run"
        @clickNew="onClick_New"
        @clickSave="onClick_Save"
        @clickSaveAs="onClick_SaveAs"
        @clickLoadSave="onClick_LoadSave"
      />
    </div>
    <div style="flex: 1 0 0; display: flex; overflow-x: auto;">
      <template v-for="(item, index) in core">
        <ValueCard
          v-if="item.var"
          :key="index"
          :index="index"
          :name="item.var.name"
          :val="item.var.val"
          @valChanged="onValChanged"
          @nameChanged="onNameChanged"
          @deleteValue="onDeleteValue"
        />
        <template v-else-if="item.code != null">
          <div class="q-my-lg" :key="'plus_' + index">
            <q-btn
              flat
              round
              icon="add"
              @click="
                () => {
                  insertVar({ index });
                }
              "
            />
          </div>
          <CodeCard
            :key="index"
            :index="index"
            :code="item.code"
            @codeChanged="onCodeChanged"
            @deleteCode="onDeleteCode"
          />
        </template>
      </template>
      <div class="q-pa-lg">
        <q-btn
          flat
          round
          icon="add"
          @click="
            () => {
              insertVar({});
            }
          "
        />
        <q-btn
          class="q-mt-sm"
          flat
          round
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
const alphabet = "abcdefghijklmnopqrstuvwxyz";

const wpSaves = new SaveDataClass("wp_saves");
//runCode({ v1: 1, v2: 2 }, "return v1+v2;");
const runCode = (vars, code) => {
  // console.log("runCode", { vars, code });

  const varNames = Object.keys(vars);
  const varValues = varNames.map(name => vars[name]);
  const fn = new Function(...varNames, code);
  const res = fn(...varValues);
  // console.log("res", res);
  return res;
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
    CodeCard: () => import("components/CodeCard"),
    PromptDialog: () => import("components/PromptDialog")
  },
  data() {
    return {
      core: [],
      loadedSaveId: null,
      savesList: wpSaves.getList()
    };
  },
  methods: {
    onNameChanged(data) {
      // console.log("onNameChanged data", data);
      this.core[data.index].var.name = data.name;
    },
    onValChanged(data) {
      // console.log("onValChanged data", data);
      this.core[data.index].var.val = data.val;
    },
    onCodeChanged(data) {
      // console.log("onCodeChanged data", data);
      this.core[data.index].code = data.code;
    },
    onDeleteValue(index) {
      // console.log("onDeleteValue", index);
      this.core.splice(index, 1);
    },
    onDeleteCode(index) {
      // console.log("onDeleteCode", index);
      this.core.splice(index, 1);
    },
    onClick_Run() {
      let vars = {};

      for (let i = 0; i < this.core.length; i++) {
        const el = this.core[i];

        if (el.var) {
          vars[el.var.name] = el.var.val;
        } else if (el.code) {
          // console.log("vars", vars);
          // console.log("el.code", el.code);
          const res = runCode(vars, el.code);

          const resNames = Object.keys(res);
          resNames.forEach(name => {
            this.setValByName(name, res[name]);
          });
        }
      }

      this.saveState();
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
    onClick_Save() {
      //resumeState
      console.log("onClick_Save");
      if (this.loadedSaveId) {
        wpSaves.save({ id: this.loadedSaveId, data: this.core });
      } else {
        this.$refs.dialogSaveAs.show();
      }
    },
    onClick_SaveAs() {
      console.log("onClick_SaveAs");
      this.$refs.dialogSaveAs.show();
    },
    onOk_SaveAs(prompt) {
      console.log("onClick_SaveAs", { prompt });
      const id = wpSaves.save({ title: prompt, data: this.core });
      this.savesList = wpSaves.getList();
      this.loadedSaveId = id;
    },
    onClick_LoadSave(id) {
      console.log("onClick_LoadSave", { id });
      const saveData = wpSaves.getData(id);
      // console.log({ saveData });
      this.loadedSaveId = id;
      this.core = saveData;
    },
    insertVar({ index, val }) {
      index = index === undefined || index === null ? this.core.length : index;
      val = val ? val : null;

      const name = alphabet[this.core.filter(item => item.var).length];
      this.core.splice(index, 0, { var: { name, val } });
    },
    insertCode({ index, code }) {
      index = index === undefined || index === null ? this.core.length : index;
      code = code ? code : "";
      this.core.splice(index, 0, { code });
    },
    saveState() {
      LocalStorage.set("state", {
        core: this.core,
        loadedSaveId: this.loadedSaveId
      });
    },
    resumeState() {
      const state = LocalStorage.getItem("state");
      this.savesList = wpSaves.getList();
      if (state) {
        this.core = state.core;
        this.loadedSaveId = state.loadedSaveId;
      } else {
        this.onClick_New();
      }
    },
    async downloadExcel() {
      const sheetArray = this.getSheetArray();
      const wb = new ExcelJS.Workbook();

      const ws = wb.addWorksheet();

      sheetArray.forEach(sheetRow => {
        const row = ws.addRow(sheetRow);
        row.font = { bold: true };
      });

      const buf = await wb.xlsx.writeBuffer();

      saveAs(new Blob([buf]), `${getFilename()}.xlsx`);
    },
    getSheetArray() {
      let maxRow = 0;
      const sheetArray = [];
      const namesRow = [];
      const varsData = this.core.filter(item => item.var);

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
  created() {
    this.resumeState();
  }
};
</script>
