<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const SCRIPT_ID = 'kofi-widget-script'

function cleanup() {
  document.getElementById(SCRIPT_ID)?.remove()
}

onMounted(() => {
  if (document.getElementById(SCRIPT_ID)) return
  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
  script.onload = () => {
    if (window.kofiWidgetOverlay) {
      window.kofiWidgetOverlay.draw('n_tty', {
        'type': 'floating-chat',
        'floating-chat.donateButton.text': 'Tip Us',
        'floating-chat.donateButton.background-color': '#794bc4',
        'floating-chat.donateButton.text-color': '#fff'
      })
    }
  }
  document.body.appendChild(script)
})

onUnmounted(() => cleanup())
</script>

<template>
  <div />
</template>
