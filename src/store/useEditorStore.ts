import { create } from 'zustand'

export interface Component {
  id: string
  type: string
  name: string
  platform: string
  config: Record<string, any>
}

interface EditorStore {
  components: Component[]
  selectedComponent: Component | null
  yaml: string
  setComponents: (components: Component[]) => void
  addComponent: (component: Component) => void
  updateComponent: (component: Component) => void
  deleteComponent: (id: string) => void
  setSelectedComponent: (component: Component | null) => void
  setYaml: (yaml: string) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  components: [],
  selectedComponent: null,
  yaml: '',
  setComponents: (components) => set({ components }),
  addComponent: (component) =>
    set((state) => ({ components: [...state.components, component] })),
  updateComponent: (component) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === component.id ? component : c
      ),
      selectedComponent:
        state.selectedComponent?.id === component.id
          ? component
          : state.selectedComponent,
    })),
  deleteComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedComponent:
        state.selectedComponent?.id === id ? null : state.selectedComponent,
    })),
  setSelectedComponent: (component) => set({ selectedComponent: component }),
  setYaml: (yaml) => set({ yaml }),
}))
