<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import { useNews, type ArticleCategory } from '@/composables/useNews'

const {
  displayedArticles,
  lastUpdate,
  addArticle,
  deleteArticle,
  getCategoryLabel,
  formatTime,
} = useNews()

const showForm = ref(false)
const editingArticle = ref<{ category: ArticleCategory; article: any } | null>(null)

const form = ref({
  title: '',
  source: '',
  link: '',
  category: 'world' as ArticleCategory,
  pubDate: new Date().toISOString().slice(0, 16),
  description: '',
})

const openAddForm = (category: ArticleCategory) => {
  editingArticle.value = null
  form.value = {
    title: '',
    source: '',
    link: '',
    category,
    pubDate: new Date().toISOString().slice(0, 16),
    description: '',
  }
  showForm.value = true
}

const openEditForm = (category: ArticleCategory, article: any) => {
  editingArticle.value = { category, article }
  form.value = {
    title: article.title,
    source: article.source,
    link: article.link,
    category,
    pubDate: new Date(article.pubDate).toISOString().slice(0, 16),
    description: article.description || '',
  }
  showForm.value = true
}

const submitForm = () => {
  if (!form.value.title || !form.value.source || !form.value.link) {
    alert('Title, source, and link are required')
    return
  }
  if (editingArticle.value) {
    // update
    editingArticle.value.article.title = form.value.title
    editingArticle.value.article.source = form.value.source
    editingArticle.value.article.link = form.value.link
    editingArticle.value.article.pubDate = new Date(form.value.pubDate)
    editingArticle.value.article.description = form.value.description
  } else {
    // add
    addArticle({
      title: form.value.title,
      source: form.value.source,
      link: form.value.link,
      category: form.value.category,
      pubDate: new Date(form.value.pubDate),
      description: form.value.description,
    })
  }
  showForm.value = false
}

const confirmDelete = (category: ArticleCategory, id: string) => {
  if (confirm('Delete this article?')) {
    deleteArticle(category, id)
  }
}

const categories: ArticleCategory[] = ['criminals', 'economy', 'intelligence', 'world']
</script>

<template>
  <div class="flex h-screen flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-shrink-0 items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Real-time News Monitoring</h1>
        <p class="mt-1 text-sm text-slate-400">
          Manual article management • Last updated: {{ formatTime(lastUpdate) }}
        </p>
      </div>
      <button
        @click="openAddForm('world')"
        class="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition"
      >
        + Add Article
      </button>
    </div>

    <!-- News Grid -->
    <div class="grid flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="category in categories"
        :key="category"
        class="flex flex-col overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/30"
      >
        <div class="p-3 backdrop-blur">
          <h2 class="font-semibold text-white">{{ getCategoryLabel(category) }}</h2>
          <p class="mt-1 text-xs text-slate-400">
            {{ displayedArticles[category].length }} articles
          </p>
        </div>

        <div class="flex-1 overflow-hidden">
          <Swiper
            :modules="[Autoplay, Mousewheel]"
            :autoplay="{ delay: 0, disableOnInteraction: false }"
            :speed="3000"
            :loop="displayedArticles[category].length > 3"
            direction="vertical"
            class="h-full"
          >
            <SwiperSlide
              v-for="article in displayedArticles[category]"
              :key="article.id"
              class="flex flex-col justify-center p-3"
            >
              <div class="group relative rounded-lg border border-slate-700 bg-slate-800 p-3">
                <button
                  @click="openEditForm(category, article)"
                  class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="confirmDelete(category, article.id)"
                  class="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition"
                  title="Delete"
                >
                  🗑️
                </button>
                <h3 class="pr-8 text-sm font-semibold text-white leading-snug">
                  {{ article.title }}
                </h3>
                <p class="mt-1 text-xs text-slate-400">{{ article.source }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ formatTime(article.pubDate) }}</p>
                <a
                  :href="article.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-2 inline-block text-xs text-emerald-400 hover:underline"
                >
                  Read more →
                </a>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-6">
        <h2 class="mb-4 text-lg font-bold text-white">
          {{ editingArticle ? 'Edit Article' : 'Add Article' }}
        </h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300">Title</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Source</label>
            <input
              v-model="form.source"
              type="text"
              required
              class="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Link</label>
            <input
              v-model="form.link"
              type="url"
              required
              class="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Category</label>
            <select
              v-model="form.category"
              class="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            >
              <option value="criminals">Criminals</option>
              <option value="economy">Economy</option>
              <option value="intelligence">Intelligence</option>
              <option value="world">World</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Publication Date</label>
            <input
              v-model="form.pubDate"
              type="datetime-local"
              required
              class="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Description (optional)</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showForm = false"
              class="rounded border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              {{ editingArticle ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>