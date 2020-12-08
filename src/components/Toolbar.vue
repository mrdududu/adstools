<template>
  <q-toolbar class="bg-grey-3 shadow-2 rounded-borders">
    <q-btn flat label="New" @click="$emit('clickNew')" />
    <q-btn-dropdown split flat label="Save" @click="$emit('clickSave')">
      <q-list>
        <q-item clickable v-close-popup @click="$emit('clickSaveAs')">
          <q-item-section>Save as</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn-dropdown flat :label="selectedSave ? selectedSave.title : 'Load'">
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
    <q-space />
    <q-btn
      flat
      round
      dense
      icon="grid_on"
      class="q-mx-sm"
      @click="$emit('clickDownloadExcel')"
    />
    <q-separator vertical inset />
    <q-btn
      flat
      round
      dense
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
    }
  }
};
</script>
