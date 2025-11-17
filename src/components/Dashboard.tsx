import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  Settings,
  Moon,
  Sun,
  Cpu,
  Command as CommandIcon,
  Download,
} from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import { useThemeStore } from '@/store/useThemeStore'
import ProjectList from './ProjectList'
import ProjectEditor from './ProjectEditor'
import { NewProjectDialog } from './NewProjectDialog'
import CommandPalette from './CommandPalette'
import ImportExportDialog from './ImportExportDialog'
import { useToast } from '@/components/ui/use-toast'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects')
  const [showNewProject, setShowNewProject] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const { projects, setProjects, currentProject, setCurrentProject } = useProjectStore()
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
      <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-center gap-3">
          <Cpu className="h-6 w-6 text-primary" />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">ESPHome GUI</h1>
            <Badge variant="outline" className="text-xs">
              v1.0.0
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              // Trigger command palette
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true,
              })
              document.dispatchEvent(event)
            }}
          >
            <CommandIcon className="h-4 w-4" />
            <span className="hidden md:inline">Command</span>
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImportExport(true)}
            title="Import/Export Projects"
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Import/Export</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="gap-2"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="hidden md:inline">Dark</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            title="Application Settings"
            onClick={() => {
              toast({
                title: 'Settings',
                description: 'Settings panel coming soon!',
              })
            }}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Settings</span>
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

      <ImportExportDialog
        open={showImportExport}
        onClose={() => setShowImportExport(false)}
        projects={projects}
        onImport={(project) => {
          setCurrentProject(project)
          setActiveTab('editor')
          loadProjects()
        }}
      />

      <CommandPalette
        onNewProject={() => setShowNewProject(true)}
        onSwitchToEditor={() => setActiveTab('editor')}
        onOpenNodeEditor={() => {
          // Node Editor is opened from ProjectEditor
          toast({
            title: 'Node Editor',
            description: 'Open a project first, then use the Node Flow button',
          })
        }}
        onOpenScriptBuilder={() => {
          // Script Builder is opened from ProjectEditor
          toast({
            title: 'Script Builder',
            description: 'Open a project first, then use the Script button',
          })
        }}
        onOpenDeviceMonitor={() => {
          // Device Monitor is opened from ProjectEditor
          toast({
            title: 'Device Monitor',
            description: 'Open a project first, then use the Monitor button',
          })
        }}
      />
    </div>
  )
}
