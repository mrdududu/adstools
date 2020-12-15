<template>
  <q-page class="flex column no-wrap">
    <div class="q-pa-sm q-pt-md" style="position: relative;">
      <q-toolbar class="bg-grey-3">
        <q-btn flat round dense>
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense>
          <q-icon name="more_vert" />
        </q-btn>
      </q-toolbar>
    </div>
    <div class="flex no-wrap content-block">
      <div class="content-col">
        <div class="full-width" style="backgroundColor: #0F0;">11</div>
      </div>
      <div class="content-col">2</div>
      <div class="content-col">3</div>
      <div class="content-col">4</div>
      <div class="content-col">5</div>
    </div>
  </q-page>
</template>
<style scoped>
.content-block {
  flex: 1 0 0;
  overflow-x: auto;
  background-color: #f00;
}
.content-col {
  flex: 1 0 400px;
  border: 1px solid #888;
}
</style>
