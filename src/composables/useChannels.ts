import { ref, computed } from 'vue'

interface Channel {
  id: number;
  name: string;
  url: string;
  description: string | null;
  is_active: boolean;
  ordering: number;
}

const DEFAULT_CHANNELS: Omit<Channel, 'is_active'>[] = [
  {
    id: 1,
    name: 'Kompas TV',
    url: 'https://www.youtube.com/watch?v=DOOrIxw5xOw',
    description: 'Kompas TV - Live News',
    ordering: 1,
  },
  {
    id: 2,
    name: 'CNN Indonesia',
    url: 'https://www.youtube.com/watch?v=qbxprL02jWk',
    description: 'CNN Indonesia - Live News',
    ordering: 2,
  },
  {
    id: 3,
    name: 'TV One News',
    url: 'https://www.youtube.com/watch?v=yNKvkPJl-tg',
    description: 'TV One News - Live',
    ordering: 3,
  },
  {
    id: 4,
    name: 'Metro TV',
    url: 'https://www.youtube.com/watch?v=AUE5iHINUIw',
    description: 'Metro TV - Live News',
    ordering: 4,
  },
  {
    id: 5,
    name: 'iNews',
    url: 'https://www.youtube.com/watch?v=Kz3FK5FbBz8',
    description: 'iNews - Live News',
    ordering: 5,
  },
  {
    id: 6,
    name: 'IDX Channel',
    url: 'https://www.youtube.com/watch?v=ftuihGt1zuw',
    description: 'IDX Channel - Live',
    ordering: 6,
  },
  {
    id: 7,
    name: 'Al Jazeera English',
    url: 'https://www.youtube.com/watch?v=gCNeDWCI0vo',
    description: 'Al Jazeera English - Live News',
    ordering: 7,
  },
  {
    id: 8,
    name: 'Bloomberg Television',
    url: 'https://www.youtube.com/watch?v=iEpJwprxDdk',
    description: 'Bloomberg Television - Live',
    ordering: 8,
  },
  {
    id: 9,
    name: 'CNA',
    url: 'https://www.youtube.com/watch?v=XWq5kBlakcQ',
    description: 'CNA - Live News',
    ordering: 9,
  },
]

const STORAGE_KEY = 'live_tv_channels'

export function useChannels() {
  const channels = ref<Channel[]>([])

  const initializeChannels = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      channels.value = JSON.parse(stored)
    } else {
      channels.value = DEFAULT_CHANNELS.map((ch) => ({
        ...ch,
        is_active: true,
      }))
      saveChannels()
    }
  }

  const saveChannels = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels.value))
  }

  const toggleChannel = (id: number) => {
    const channel = channels.value.find((c) => c.id === id)
    if (channel) {
      channel.is_active = !channel.is_active
      saveChannels()
    }
  }

  const addChannel = (newChannel: Omit<Channel, 'id' | 'is_active'>) => {
    const maxId = Math.max(...channels.value.map((c) => c.id), 0)
    channels.value.push({
      ...newChannel,
      id: maxId + 1,
      is_active: true,
    })
    saveChannels()
  }

  const resetToDefaults = () => {
    channels.value = DEFAULT_CHANNELS.map((ch) => ({
      ...ch,
      is_active: true,
    }))
    saveChannels()
  }

  const activeChannelCount = computed(() =>
    channels.value.filter((c) => c.is_active).length
  )

  return {
    channels,
    initializeChannels,
    toggleChannel,
    addChannel,
    resetToDefaults,
    activeChannelCount,
  }
}