<template>
  <q-toolbar class="bg-grey-3 shadow-2 rounded-borders">
    <q-btn stretch flat label="New" />
    <q-btn stretch flat label="Save" />
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
