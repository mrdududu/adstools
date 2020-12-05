<template>
  <q-page style="display: flex; overflow-x: auto;">
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
    <div class="q-my-lg">
      <div>
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
      </div>
      <div class="q-mt-sm">
        <q-btn
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
    <div class="q-pa-lg">
      <q-btn flat round icon="play_circle_filled" @click="onClick_Run" />
      <!-- <q-btn
        type="a"
        :href="excelFile.url"
        :download="excelFile.filename"
        flat
        round
        icon="grid_on"
        @click="downloadExcel()"
      /> -->
      <q-btn flat round icon="grid_on" @click="downloadExcel()" />
    </div>
  </q-page>
</template>
<script>
import { LocalStorage } from "quasar";
const alphabet = "abcdefghijklmnopqrstuvwxyz";

//runCode({ v1: 1, v2: 2 }, "return v1+v2;");
const runCode = (vars, code) => {
  console.log("runCode", { vars, code });

  const varNames = Object.keys(vars);
  const varValues = varNames.map(name => vars[name]);
  const fn = new Function(...varNames, code);
  const res = fn(...varValues);
  // console.log("res", res);
  return res;
};

export default {
  components: {
    ValueCard: () => import("components/ValueCard"),
    CodeCard: () => import("components/CodeCard")
  },
  data() {
    return {
      core: [],
      excelFile: {
        url: "",
        filename: ""
      }
    };
  },
  methods: {
    onNameChanged(data) {
      console.log("onNameChanged data", data);
      this.core[data.index].var.name = data.name;
    },
    onValChanged(data) {
      console.log("onValChanged data", data);
      this.core[data.index].var.val = data.val;
    },
    onCodeChanged(data) {
      console.log("onValChanged data", data);
      this.core[data.index].code = data.code;
    },
    onDeleteValue(index) {
      console.log("onDeleteValue", index);
      this.core.splice(index, 1);
    },
    onDeleteCode(index) {
      console.log("onDeleteCode", index);
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
          this.core[i + 1].var.val = res;
        }
      }

      this.saveCore();
    },
    onClick_AddVar(index) {
      console.log("onClick_AddVar", { index });
      this.insertVar({});
    },
    onClick_AddCode() {
      console.log("onClick_AddCode");
      this.insertCode({});
      this.insertVar({});
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
    saveCore() {
      LocalStorage.set("core", this.core);
    },
    loadCore() {
      const core = LocalStorage.getItem("core");
      if (core) {
        this.core = core;
      } else {
        this.insertVar({ val: "a" });
        this.insertVar({ val: "b" });
        this.insertCode({ code: "return a + b;" });
        this.insertVar({ val: null });
      }
    },
    downloadExcel() {
      let maxRow = 0;
      const jsonData = [];
      const varsData = this.core.filter(item => item.var);
      varsData.forEach(varData => {
        let len = 1;
        if (Array.isArray(varData.var.val)) {
          len = varData.var.val.length;
        }

        if (maxRow < len) maxRow = len;
      });
      // console.log("varsData", varsData);
      console.log("maxRow", maxRow);

      for (let i = 0; i < maxRow; i++) {
        const row = {};
        varsData.forEach(varData => {
          let val = "";
          if (!Array.isArray(varData.var.val)) {
            val = 0 === i ? varData.var.val : "";
          } else {
            val = i < varData.var.val.length ? varData.var.val[i] : "";
          }

          row[varData.var.name] = val;
        });

        jsonData.push(row);
      }

      console.log("jsonData", jsonData);

      // const jsonData = encodeURIComponent('{"is_valid": true}');
      // this.excelFile.url = `data:text/plain;charset=utf-8,${jsonData}`;
      // this.excelFile.filename = "example.json";
    }
  },
  created() {
    this.loadCore();
  }
};
</script>
