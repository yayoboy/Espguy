import { useState } from 'react'
import { Project } from '@/store/useProjectStore'
import { useEditorStore } from '@/store/useEditorStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Trash2, Settings } from 'lucide-react'
import {
  COMPONENT_TEMPLATES,
  getAllCategories,
  getTemplatesByCategory,
  getComponentCount,
  getCategoryCount,
} from '@/services/templates'
import { ComponentConfigDialog } from './ComponentConfigDialog'

interface ComponentLibraryProps {
  project: Project
}

export default function ComponentLibrary({ project }: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [configDialog, setConfigDialog] = useState<{
    open: boolean
    template?: any
    component?: any
  }>({ open: false })

  const { components, addComponent, deleteComponent } = useEditorStore()
  const categories = ['all', ...getAllCategories()]

  const filteredTemplates =
    selectedCategory === 'all'
      ? COMPONENT_TEMPLATES
      : getTemplatesByCategory(selectedCategory)

  const searchedTemplates = filteredTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddComponent = (template: any) => {
    setConfigDialog({ open: true, template })
  }

  const handleConfigSave = (config: any) => {
    const component = {
      id: `${Date.now()}-${Math.random()}`,
      type: configDialog.template.platform,
      name: config.name || configDialog.template.name,
      platform: configDialog.template.platform,
      config,
    }

    if (configDialog.component) {
      useEditorStore.getState().updateComponent({ ...configDialog.component, config })
    } else {
      addComponent(component)
    }

    setConfigDialog({ open: false })
  }

  return (
    <div className="flex h-full">
      {/* Component Library Sidebar */}
      <div className="w-96 border-r bg-muted/30">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Component Library</h3>
            <p className="text-xs text-muted-foreground">
              {getComponentCount()} components across {getCategoryCount()} categories
            </p>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2 pr-4 pt-4">
                <div className="mb-4">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {categories.slice(1).map((category) => (
                      <Button
                        key={category}
                        variant={
                          selectedCategory === category ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {searchedTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer transition-all hover:shadow-md"
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddComponent(template)}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Component
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </div>

      {/* Current Components */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">
            Components ({components.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder, click to configure
          </p>
        </div>

        {components.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <Plus className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No components yet</h3>
            <p className="text-sm text-muted-foreground">
              Add components from the library to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {components.map((component) => (
              <Card key={component.id} className="group transition-all hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{component.name}</h4>
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {component.platform}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {component.type}
                    </p>
                  </div>

                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const template = COMPONENT_TEMPLATES.find(
                          (t) => t.platform === component.platform
                        )
                        setConfigDialog({
                          open: true,
                          template,
                          component,
                        })
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteComponent(component.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Component Configuration Dialog */}
      {configDialog.open && (
        <ComponentConfigDialog
          open={configDialog.open}
          template={configDialog.template}
          initialConfig={configDialog.component?.config}
          onSave={handleConfigSave}
          onClose={() => setConfigDialog({ open: false })}
        />
      )}
    </div>
  )
}
