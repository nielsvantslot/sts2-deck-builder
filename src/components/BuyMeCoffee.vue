<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { FEATURES } from '@/lib/features'

const SCRIPT_ID = 'bmc-widget-script'

function cleanup() {
  document.getElementById(SCRIPT_ID)?.remove()
  document.getElementById('bmc-wbtn')?.remove()
}

onMounted(() => {
  if (!FEATURES.buyMeACoffee || document.getElementById(SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js'
  const attrs: Record<string, string> = {
    'data-name': 'BMC-Widget',
    'data-cfasync': 'false',
    'data-id': 'nutty',
    'data-description': 'Support me on Buy me a coffee!',
    'data-message': '',
    'data-color': '#5F7FFF',
    'data-position': 'Right',
    'data-x_margin': '18',
    'data-y_margin': '18',
  }
  for (const [key, value] of Object.entries(attrs)) {
    script.setAttribute(key, value)
  }
  script.addEventListener('load', () => {
    window.dispatchEvent(new Event('DOMContentLoaded'))
  })
  document.body.appendChild(script)
})

onUnmounted(() => cleanup())
</script>

<template>
  <div />
</template>
