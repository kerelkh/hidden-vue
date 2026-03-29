<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
    <h1 class="text-4xl font-bold text-emerald-400 mb-4">Hidden Monitoring</h1>
    <p class="text-lg text-slate-400 mb-8 max-w-xl">
      Real-time news and live TV monitoring for Indonesia. Built with Vue 3 + Tailwind.
    </p>
    <div class="flex gap-4">
      <RouterLink
        to="/dashboard"
        class="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition"
      >
        Go to Dashboard
      </RouterLink>
      <RouterLink
        to="/news"
        class="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-800 transition"
      >
        View News
      </RouterLink>
    </div>
  </div>
</template>