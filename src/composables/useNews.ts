import { ref, computed } from 'vue'

export type ArticleCategory = 'criminals' | 'economy' | 'intelligence' | 'world'

export interface Article {
  id: string
  title: string
  source: string
  link: string
  pubDate: Date
  category: ArticleCategory
  description?: string
  isNew?: boolean
  isRecent?: boolean
  createdAt?: Date
}

interface CategoryNews {
  criminals: Article[]
  economy: Article[]
  intelligence: Article[]
  world: Article[]
}

const STORAGE_KEY = 'hidden_news_articles'
const MAX_ARTICLES = 1000
const DISPLAY_PER_CATEGORY = 50

function generateId(title: string, source: string): string {
  const str = `${title}|${source}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `article_${Math.abs(hash).toString(36)}`
}

function isDuplicate(newArticle: Omit<Article, 'id'>, existing: Article[]): boolean {
  return existing.some(
    (a) => a.title === newArticle.title && a.source === newArticle.source
  )
}

function isRecent(pubDate: Date): boolean {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  return new Date(pubDate) > oneHourAgo
}

export function useNews() {
  const articles = ref<CategoryNews>({
    criminals: [],
    economy: [],
    intelligence: [],
    world: [],
  })

  const lastUpdate = ref<Date | null>(null)

  const loadArticles = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      Object.keys(parsed).forEach((cat) => {
        parsed[cat] = parsed[cat].map((a: any) => ({
          ...a,
          pubDate: new Date(a.pubDate),
          createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
          isRecent: isRecent(new Date(a.pubDate)),
        }))
      })
      articles.value = parsed
    }
  }

  const saveArticles = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles.value))
  }

  const pruneOldArticles = () => {
    const all = [
      ...articles.value.criminals,
      ...articles.value.economy,
      ...articles.value.intelligence,
      ...articles.value.world,
    ]
    if (all.length > MAX_ARTICLES) {
      const sorted = all.sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )
      const toKeep = sorted.slice(0, MAX_ARTICLES)
      const toRemove = new Set(sorted.slice(MAX_ARTICLES).map((a) => a.id))
      Object.keys(articles.value).forEach((cat) => {
        articles.value[cat as keyof CategoryNews] = articles.value[
          cat as keyof CategoryNews
        ].filter((a) => !toRemove.has(a.id))
      })
    }
  }

  const addArticle = (article: Omit<Article, 'id' | 'isNew' | 'isRecent' | 'createdAt'>) => {
    const newArticle: Article = {
      ...article,
      id: generateId(article.title, article.source),
      isNew: false,
      isRecent: isRecent(article.pubDate),
      createdAt: new Date(),
    }
    articles.value[article.category].push(newArticle)
    // Sort by date
    articles.value[article.category].sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    )
    pruneOldArticles()
    saveArticles()
    lastUpdate.value = new Date()
  }

  const deleteArticle = (category: ArticleCategory, id: string) => {
    articles.value[category] = articles.value[category].filter((a) => a.id !== id)
    saveArticles()
    lastUpdate.value = new Date()
  }

  const updateArticle = (category: ArticleCategory, id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>) => {
    const idx = articles.value[category].findIndex((a) => a.id === id)
    if (idx !== -1) {
      articles.value[category][idx] = {
        ...articles.value[category][idx],
        ...updates,
        isRecent: updates.pubDate ? isRecent(new Date(updates.pubDate)) : articles.value[category][idx].isRecent,
      }
      saveArticles()
      lastUpdate.value = new Date()
    }
  }

  const displayedArticles = computed(() => ({
    criminals: articles.value.criminals.slice(0, DISPLAY_PER_CATEGORY),
    economy: articles.value.economy.slice(0, DISPLAY_PER_CATEGORY),
    intelligence: articles.value.intelligence.slice(0, DISPLAY_PER_CATEGORY),
    world: articles.value.world.slice(0, DISPLAY_PER_CATEGORY),
  }))

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      criminals: 'Criminals Indonesia',
      economy: 'Economy Indonesia',
      intelligence: 'Intelligence (Need Attention)',
      world: 'World News',
    }
    return labels[category] || category
  }

  const formatTime = (date: Date | null): string => {
    if (!date) return 'never'
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  // Initialize on load
  loadArticles()

  return {
    articles,
    displayedArticles,
    lastUpdate,
    addArticle,
    deleteArticle,
    updateArticle,
    getCategoryLabel,
    formatTime,
  }
}