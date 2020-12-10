<template>
  <q-toolbar class="bg-grey-3 shadow-2 rounded-borders">
    <q-toolbar-title shrink>
      Ads Tool
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
    <q-btn flat label="Load JSON" @click="$refs.inputFileJson.click()" />
    <input
      style="display: none;"
      ref="inputFileJson"
      type="file"
      accept=".json"
      @change="onChangeInputFileJson"
    />
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
export default {
  props: ["savesList", "selectedSaveId"],
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
    onChangeInputFileJson(event) {
      // console.log("onChangeInputFileJson", event);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.$emit("loadedInputFileJson", e.target.result);
      reader.readAsText(file);
    }
  }
};
</script>
