import { useEffect, useState, useCallback } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Plus,
  FolderOpen,
  FileCode,
  Cpu,
  Code,
  Zap,
  Save,
  Play,
  Upload,
  Search,
  Settings,
  Moon,
  Sun,
  Thermometer,
  Lightbulb,
  Activity,
  Wind,
  Monitor,
  GitBranch,
} from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useToast } from '@/components/ui/use-toast'
import { getAllCategories } from '@/services/templates'

interface CommandPaletteProps {
  onNewProject?: () => void
  onOpenPinMapper?: () => void
  onOpenLambdaEditor?: () => void
  onOpenAutomationBuilder?: () => void
  onOpenNodeEditor?: () => void
  onOpenScriptBuilder?: () => void
  onOpenDeviceMonitor?: () => void
  onSave?: () => void
  onCompile?: () => void
  onUpload?: () => void
  onSwitchToEditor?: () => void
  onSwitchToYaml?: () => void
  onSwitchToPinMap?: () => void
}

export default function CommandPalette({
  onNewProject,
  onOpenPinMapper,
  onOpenLambdaEditor,
  onOpenAutomationBuilder,
  onOpenNodeEditor,
  onOpenScriptBuilder,
  onOpenDeviceMonitor,
  onSave,
  onCompile,
  onUpload,
  onSwitchToEditor,
  onSwitchToYaml,
  onSwitchToPinMap,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const { projects, currentProject, setCurrentProject } = useProjectStore()
  const { theme, setTheme } = useThemeStore()
  const { toast } = useToast()
  const categories = getAllCategories()

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Project Actions */}
        <CommandGroup heading="Project">
          <CommandItem
            onSelect={() => runCommand(() => onNewProject?.())}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>New Project</span>
          </CommandItem>
          {currentProject && (
            <>
              <CommandItem
                onSelect={() => runCommand(() => onSave?.())}
              >
                <Save className="mr-2 h-4 w-4" />
                <span>Save Project</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onCompile?.())}
              >
                <Play className="mr-2 h-4 w-4" />
                <span>Compile</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onUpload?.())}
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload to Device</span>
              </CommandItem>
            </>
          )}
        </CommandGroup>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Projects">
              {projects.slice(0, 5).map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => {
                    setCurrentProject(project)
                    runCommand(() => {
                      toast({
                        title: 'Project Opened',
                        description: `Switched to ${project.name}`,
                      })
                    })
                  }}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <span>{project.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {project.board}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Editor Views */}
        {currentProject && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Editor Views">
              <CommandItem
                onSelect={() => runCommand(() => onSwitchToEditor?.())}
              >
                <Activity className="mr-2 h-4 w-4" />
                <span>Visual Editor</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onSwitchToYaml?.())}
              >
                <FileCode className="mr-2 h-4 w-4" />
                <span>YAML Editor</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onSwitchToPinMap?.())}
              >
                <Cpu className="mr-2 h-4 w-4" />
                <span>Pin Mapper</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {/* Advanced Tools */}
        {currentProject && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Advanced Tools">
              <CommandItem
                onSelect={() => runCommand(() => onOpenLambdaEditor?.())}
              >
                <Code className="mr-2 h-4 w-4" />
                <span>Lambda Editor</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onOpenAutomationBuilder?.())}
              >
                <Zap className="mr-2 h-4 w-4" />
                <span>Automation Builder</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onOpenNodeEditor?.())}
              >
                <GitBranch className="mr-2 h-4 w-4" />
                <span>Node Editor</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onOpenScriptBuilder?.())}
              >
                <FileCode className="mr-2 h-4 w-4" />
                <span>Script Builder</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onOpenDeviceMonitor?.())}
              >
                <Activity className="mr-2 h-4 w-4" />
                <span>Device Monitor</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => onOpenPinMapper?.())}
              >
                <Cpu className="mr-2 h-4 w-4" />
                <span>Pin Mapper</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {/* Component Categories Quick Access */}
        <CommandSeparator />
        <CommandGroup heading="Component Categories">
          {categories.slice(0, 8).map((category) => {
            const icon = getCategoryIcon(category)
            return (
              <CommandItem
                key={category}
                onSelect={() => {
                  runCommand(() => {
                    toast({
                      title: 'Category Selected',
                      description: `Showing ${category} components`,
                    })
                    // This would trigger category filter in component library
                  })
                }}
              >
                {icon}
                <span>{category}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        {/* Settings */}
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark'
                setTheme(newTheme)
                toast({
                  title: 'Theme Changed',
                  description: `Switched to ${newTheme} mode`,
                })
              })
            }}
          >
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                toast({
                  title: 'Settings',
                  description: 'Settings panel coming soon',
                })
              })
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        {/* Help */}
        <CommandSeparator />
        <CommandGroup heading="Help">
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                window.open('https://esphome.io/index.html', '_blank')
              })
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>ESPHome Documentation</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                toast({
                  title: 'Keyboard Shortcuts',
                  description: 'Ctrl/Cmd+K: Command Palette',
                })
              })
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Keyboard Shortcuts</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

// Helper function to get appropriate icon for category
function getCategoryIcon(category: string) {
  const iconMap: Record<string, JSX.Element> = {
    'Sensors': <Thermometer className="mr-2 h-4 w-4" />,
    'Sensors - Environmental': <Thermometer className="mr-2 h-4 w-4" />,
    'Sensors - Light': <Lightbulb className="mr-2 h-4 w-4" />,
    'Binary Sensors': <Activity className="mr-2 h-4 w-4" />,
    'Lights': <Lightbulb className="mr-2 h-4 w-4" />,
    'Climate': <Wind className="mr-2 h-4 w-4" />,
    'Display': <Monitor className="mr-2 h-4 w-4" />,
  }

  return iconMap[category] || <Activity className="mr-2 h-4 w-4" />
}
