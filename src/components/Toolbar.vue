<template>
  <q-toolbar class="bg-grey-3 shadow-2 rounded-borders">
    <q-toolbar-title shrink>
      Datatool
    </q-toolbar-title>
    <q-separator vertical inset />
    <q-btn flat label="New" @click="$emit('clickNew')" />
    <q-btn-dropdown split flat label="Save" @click="$emit('clickSave')">
      <q-list>
        <q-item clickable v-close-popup @click="$emit('clickSaveAs')">
          <q-item-section>Save as</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="$emit('clickSaveAsJson')">
          <q-item-section>Save as JSON</q-item-section>
        </q-item>
        <q-item
          v-if="selectedSaveId"
          clickable
          v-close-popup
          @click="$emit('clickDeleteSave', { saveId: selectedSaveId })"
        >
          <q-item-section>Delete save</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn-dropdown
      v-if="0 < savesList.length"
      flat
      :label="selectedSave ? selectedSave.title : 'Load'"
    >
      <q-list>
        <q-item
          v-for="item in ddSavesList"
          :key="item.id"
          clickable
          v-close-popup
          @click="clickLoadSave(item.id, $event)"
        >
          <q-item-section>{{ item.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn-dropdown v-model="showLoadMenu" flat label="Load file">
      <q-list>
        <q-item clickable>
          <q-item-section-file accept=".json" @onFileLoad="onJsonLoad"
            >JSON</q-item-section-file
          >
        </q-item>
        <q-item clickable>
          <q-item-section-file
            accept=".xlsx"
            readAs="ArrayBuffer"
            @onFileLoad="onExcelLoad"
            >Excel</q-item-section-file
          >
        </q-item>
        <q-item clickable>
          <q-item-section-file accept=".csv" @onFileLoad="onCSVLoad"
            >CSV</q-item-section-file
          >
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-separator vertical inset />
    <q-btn-dropdown flat label="Select preset">
      <q-list>
        <q-item
          v-for="(preset, index) in presets"
          :key="index"
          clickable
          v-close-popup
          @click="$emit('selectedPreset', preset)"
        >
          <q-item-section>{{ preset.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-space />
    <q-btn
      flat
      dense
      label="Excel"
      icon="grid_on"
      class="q-mx-sm"
      @click="$emit('clickDownloadExcel')"
    />
    <q-separator vertical inset />
    <q-btn
      flat
      dense
      label="Run"
      icon="play_circle_filled"
      class="q-mx-sm"
      @click="$emit('clickRun')"
    />
  </q-toolbar>
</template>
<script>
import qItemSectionFile from "./q-item-section-file.vue";
export default {
  components: { qItemSectionFile },
  props: ["savesList", "selectedSaveId", "presets"],
  data() {
    return {
      showLoadMenu: false
    };
  },
  computed: {
    ddSavesList() {
      return this.savesList.filter(item => item.id != this.selectedSaveId);
    },
    selectedSave() {
      return this.savesList.find(item => item.id == this.selectedSaveId);
    }
  },
  methods: {
    clickLoadSave(id) {
      // console.log("clickLoadSave", { id });
      this.$emit("clickLoadSave", id);
    },
    onJsonLoad(data) {
      this.showLoadMenu = false;
      this.$emit("onJsonLoad", data);
    },
    onExcelLoad(data) {
      this.showLoadMenu = false;
      this.$emit("onExcelLoad", data);
    },
    onCSVLoad(data) {
      this.showLoadMenu = false;
      this.$emit("onCSVLoad", data);
    }
  }
};
</script>
