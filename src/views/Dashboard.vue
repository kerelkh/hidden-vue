<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChannels } from '@/composables/useChannels'

const { channels, initializeChannels, activeChannelCount } = useChannels()

const isAllPaused = ref(false)
const iframes: Record<number, HTMLIFrameElement> = {}

onMounted(() => {
  initializeChannels()
  document.title = 'Live TV Monitoring - Hidden Monitoring'
})

const pauseAll = () => {
  isAllPaused.value = true
  Object.values(iframes).forEach((iframe) => {
    const video = iframe.contentWindow?.document.querySelector('video')
    video?.pause()
  })
}

const playAll = () => {
  isAllPaused.value = false
  Object.values(iframes).forEach((iframe) => {
    const video = iframe.contentWindow?.document.querySelector('video')
    video?.play()
  })
}

const togglePlayAll = () => {
  if (isAllPaused.value) playAll()
  else pauseAll()
}

const handleIframeLoad = (channelId: number, event: Event) => {
  iframes[channelId] = event.target as HTMLIFrameElement
}
</script>

<template>
  <div class="flex h-full flex-col gap-3">
    <!-- Controls -->
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-700 bg-slate-900 p-3">
      <div class="text-sm font-semibold text-slate-300">
        <span class="text-green-400">●</span> Live: <span class="text-white font-bold">{{ activeChannelCount }}/{{ channels.length }}</span>
      </div>
      <div class="text-xs font-semibold text-slate-400">LIVE NEWS MONITOR</div>
      <div class="flex items-center gap-2">
        <button
          @click="togglePlayAll"
          class="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 transition"
        >
          {{ isAllPaused ? 'Play All' : 'Pause All' }}
        </button>
      </div>
    </div>

    <!-- Channel Grid -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="channel in channels.filter(c => c.is_active)"
          :key="channel.id"
          class="relative rounded-lg border border-slate-800 bg-slate-900 overflow-hidden"
        >
          <div class="absolute top-2 left-2 z-10 rounded bg-black/70 px-2 py-1 text-xs text-white">
            {{ channel.name }}
          </div>
          <div class="aspect-video w-full">
            <iframe
              v-if="channel.is_active"
              :src="channel.url.replace('watch?v=', 'embed/')"
              class="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              @load="handleIframeLoad(channel.id, $event)"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>