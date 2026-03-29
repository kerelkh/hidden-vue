<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <!-- Navigation -->
    <nav class="border-b border-slate-800 bg-slate-900/30 backdrop-blur">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-8">
            <RouterLink to="/dashboard" class="text-xl font-bold text-emerald-400">
              Hidden Monitoring
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>