<script setup lang="ts">
import { onMounted, watchEffect, onUnmounted } from 'vue'
import { FEATURES } from '@/lib/features'

function setBmcVisibility(visible: boolean) {
  const btn = document.getElementById('bmc-wbtn')
  if (btn) btn.style.display = visible ? 'flex' : 'none'
}

onMounted(() => {
  watchEffect(() => setBmcVisibility(FEATURES.buyMeACoffee))
})

onUnmounted(() => setBmcVisibility(false))
</script>

<template>
  <div />
</template>
