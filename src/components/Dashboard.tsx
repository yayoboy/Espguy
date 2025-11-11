import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  Settings,
  Moon,
  Sun,
  Cpu,
} from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import { useThemeStore } from '@/store/useThemeStore'
import ProjectList from './ProjectList'
import ProjectEditor from './ProjectEditor'
import { NewProjectDialog } from './NewProjectDialog'
import { useToast } from '@/components/ui/use-toast'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects')
  const [showNewProject, setShowNewProject] = useState(false)
  const { projects, setProjects, currentProject } = useProjectStore()
  const { theme, setTheme } = useThemeStore()
  const { toast } = useToast()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const result = await window.electronAPI.project.list()
      if (result.success) {
        setProjects(result.projects)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">ESPHome GUI</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full w-full flex-col"
        >
          {/* Sidebar */}
          <div className="flex h-full">
            <div className="w-64 border-r bg-muted/30">
              <div className="p-4">
                <Button
                  className="w-full"
                  onClick={() => setShowNewProject(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>

              <TabsList className="flex h-auto w-full flex-col items-stretch gap-1 bg-transparent p-2">
                <TabsTrigger
                  value="projects"
                  className="justify-start gap-2 data-[state=active]:bg-background"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>

                <TabsTrigger
                  value="editor"
                  className="justify-start gap-2 data-[state=active]:bg-background"
                  disabled={!currentProject}
                >
                  <FolderOpen className="h-4 w-4" />
                  Editor
                </TabsTrigger>
              </TabsList>

              {/* Recent Projects */}
              <div className="mt-6 px-4">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Recent Projects
                </h3>
                <div className="space-y-1">
                  {projects.slice(0, 5).map((project) => (
                    <Button
                      key={project.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start truncate text-sm"
                      onClick={() => {
                        useProjectStore.getState().setCurrentProject(project)
                        setActiveTab('editor')
                      }}
                    >
                      {project.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              <TabsContent value="projects" className="m-0 h-full">
                <ProjectList onProjectSelect={(project) => {
                  useProjectStore.getState().setCurrentProject(project)
                  setActiveTab('editor')
                }} />
              </TabsContent>

              <TabsContent value="editor" className="m-0 h-full">
                {currentProject ? (
                  <ProjectEditor project={currentProject} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">
                      Select a project to start editing
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      <NewProjectDialog
        open={showNewProject}
        onOpenChange={setShowNewProject}
        onProjectCreated={() => {
          loadProjects()
          setShowNewProject(false)
        }}
      />
    </div>
  )
}
