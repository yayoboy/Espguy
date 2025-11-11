import { useState, useEffect } from 'react'
import { Project } from '@/store/useProjectStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Save, Play, Upload, FileCode } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import ComponentLibrary from './ComponentLibrary'
import YamlEditor from './YamlEditor'
import BuildConsole from './BuildConsole'
import { ESPHomeService } from '@/services/esphome'
import { useEditorStore } from '@/store/useEditorStore'

interface ProjectEditorProps {
  project: Project
}

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const [activeTab, setActiveTab] = useState('components')
  const [showConsole, setShowConsole] = useState(false)
  const [buildProcess, setBuildProcess] = useState<string | null>(null)
  const { components, yaml, setYaml, setComponents } = useEditorStore()
  const { toast } = useToast()

  useEffect(() => {
    loadProjectYaml()
  }, [project.id])

  useEffect(() => {
    // Update YAML when components change
    if (components.length > 0) {
      const newYaml = ESPHomeService.componentsToYaml(
        project.name,
        project.platform,
        project.board,
        components
      )
      setYaml(newYaml)
    }
  }, [components])

  const loadProjectYaml = async () => {
    try {
      const result = await window.electronAPI.yaml.load(project.id)
      if (result.success && result.yaml) {
        setYaml(result.yaml)
        const loadedComponents = ESPHomeService.yamlToComponents(result.yaml)
        setComponents(loadedComponents)
      } else {
        // Generate default YAML if none exists
        const defaultYaml = ESPHomeService.getDefaultConfig(
          project.name,
          project.platform,
          project.board
        )
        setYaml(defaultYaml)
        setComponents([])
      }
    } catch (error) {
      console.error('Failed to load YAML:', error)
    }
  }

  const handleSave = async () => {
    try {
      const result = await window.electronAPI.yaml.save({
        projectId: project.id,
        yaml,
      })

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Project saved successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save project',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Failed to save:', error)
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      })
    }
  }

  const handleCompile = async () => {
    try {
      // Save before compiling
      await handleSave()

      setShowConsole(true)
      const result = await window.electronAPI.esphome.compile(project.id)

      if (result.success) {
        setBuildProcess(result.processId)
        toast({
          title: 'Build Started',
          description: 'Compiling your ESPHome configuration...',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to start build',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Failed to compile:', error)
      toast({
        title: 'Error',
        description: 'Failed to compile project',
        variant: 'destructive',
      })
    }
  }

  const handleUpload = async () => {
    try {
      // Get serial ports
      const portsResult = await window.electronAPI.serial.list()

      if (!portsResult.success || portsResult.ports.length === 0) {
        toast({
          title: 'Error',
          description: 'No serial ports found. Please connect your device.',
          variant: 'destructive',
        })
        return
      }

      // Save before uploading
      await handleSave()

      setShowConsole(true)
      const result = await window.electronAPI.esphome.upload(
        project.id,
        portsResult.ports[0]
      )

      if (result.success) {
        setBuildProcess(result.processId)
        toast({
          title: 'Upload Started',
          description: 'Uploading firmware to device...',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to start upload',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Failed to upload:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload to device',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-sm text-muted-foreground">
            {project.platform} - {project.board}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={handleCompile}>
            <Play className="mr-2 h-4 w-4" />
            Compile
          </Button>
          <Button onClick={handleUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <div className="flex flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full w-full flex-col"
        >
          <TabsList className="mx-6 mt-4 w-auto">
            <TabsTrigger value="components">Visual Editor</TabsTrigger>
            <TabsTrigger value="yaml">
              <FileCode className="mr-2 h-4 w-4" />
              YAML Editor
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-1 overflow-hidden">
            <TabsContent value="components" className="m-0 flex-1">
              <ComponentLibrary project={project} />
            </TabsContent>

            <TabsContent value="yaml" className="m-0 flex-1">
              <YamlEditor yaml={yaml} onChange={setYaml} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Build Console */}
      {showConsole && (
        <BuildConsole
          processId={buildProcess}
          onClose={() => {
            setShowConsole(false)
            setBuildProcess(null)
          }}
        />
      )}
    </div>
  )
}
