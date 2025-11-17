import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BuildEntry {
  id: string
  projectId: string
  projectName: string
  timestamp: Date
  type: 'compile' | 'upload' | 'ota'
  status: 'success' | 'failed' | 'in_progress'
  duration?: number
  errors?: string[]
  logs?: string
}

interface BuildHistoryState {
  builds: BuildEntry[]
  addBuild: (build: Omit<BuildEntry, 'id' | 'timestamp'>) => void
  updateBuild: (id: string, updates: Partial<BuildEntry>) => void
  clearHistory: () => void
  getBuildsForProject: (projectId: string) => BuildEntry[]
  getRecentBuilds: (limit?: number) => BuildEntry[]
}

export const useBuildHistoryStore = create<BuildHistoryState>()(
  persist(
    (set, get) => ({
      builds: [],

      addBuild: (build) => {
        const newBuild: BuildEntry = {
          ...build,
          id: `build_${Date.now()}_${Math.random()}`,
          timestamp: new Date(),
        }
        set((state) => ({
          builds: [newBuild, ...state.builds].slice(0, 100), // Keep last 100
        }))
      },

      updateBuild: (id, updates) => {
        set((state) => ({
          builds: state.builds.map((build) =>
            build.id === id ? { ...build, ...updates } : build
          ),
        }))
      },

      clearHistory: () => set({ builds: [] }),

      getBuildsForProject: (projectId) => {
        return get().builds.filter((build) => build.projectId === projectId)
      },

      getRecentBuilds: (limit = 10) => {
        return get().builds.slice(0, limit)
      },
    }),
    {
      name: 'build-history-storage',
    }
  )
)
