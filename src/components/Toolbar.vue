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
    <q-btn-dropdown flat label="Load recipe">
      <q-list>
        <q-item clickable v-close-popup @click="$emit('clickLoad')">
          <q-item-section>Name some recipe</q-item-section>
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
