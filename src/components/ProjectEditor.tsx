import { useState, useEffect } from 'react'
import { Project } from '@/store/useProjectStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Save, Play, Upload, FileCode, Cpu, Code, Zap, GitBranch, Activity } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import ComponentLibrary from './ComponentLibrary'
import YamlEditor from './YamlEditor'
import BuildConsole from './BuildConsole'
import PinMapper from './PinMapper'
import LambdaEditor from './LambdaEditor'
import AutomationBuilder from './AutomationBuilder'
import NodeEditor, { FlowData } from './NodeEditor'
import ScriptBuilder, { ScriptData } from './ScriptBuilder'
import DeviceMonitor from './DeviceMonitor'
import { ESPHomeService } from '@/services/esphome'
import { useEditorStore } from '@/store/useEditorStore'

interface ProjectEditorProps {
  project: Project
}

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const [activeTab, setActiveTab] = useState('components')
  const [showConsole, setShowConsole] = useState(false)
  const [buildProcess, setBuildProcess] = useState<string | null>(null)
  const [showLambdaEditor, setShowLambdaEditor] = useState(false)
  const [showAutomationBuilder, setShowAutomationBuilder] = useState(false)
  const [showNodeEditor, setShowNodeEditor] = useState(false)
  const [showScriptBuilder, setShowScriptBuilder] = useState(false)
  const [showDeviceMonitor, setShowDeviceMonitor] = useState(false)
  const { components, yaml, setYaml, setComponents, addComponent } = useEditorStore()
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
      const result = await window.electronAPI.yaml.save(project.id, yaml)

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
          <Button variant="outline" size="sm" onClick={() => setShowLambdaEditor(true)}>
            <Code className="mr-2 h-4 w-4" />
            Lambda
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAutomationBuilder(true)}>
            <Zap className="mr-2 h-4 w-4" />
            Automation
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowNodeEditor(true)}>
            <GitBranch className="mr-2 h-4 w-4" />
            Node Flow
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowScriptBuilder(true)}>
            <FileCode className="mr-2 h-4 w-4" />
            Script
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDeviceMonitor(true)}>
            <Activity className="mr-2 h-4 w-4" />
            Monitor
          </Button>
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
              YAML
            </TabsTrigger>
            <TabsTrigger value="pinmap">
              <Cpu className="mr-2 h-4 w-4" />
              Pin Mapper
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-1 overflow-hidden">
            <TabsContent value="components" className="m-0 flex-1">
              <ComponentLibrary project={project} />
            </TabsContent>

            <TabsContent value="yaml" className="m-0 flex-1">
              <YamlEditor yaml={yaml} onChange={setYaml} />
            </TabsContent>

            <TabsContent value="pinmap" className="m-0 flex-1">
              <PinMapper board={project.board} platform={project.platform} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Lambda Editor Dialog */}
      <LambdaEditor
        open={showLambdaEditor}
        onClose={() => setShowLambdaEditor(false)}
        onSave={(lambda) => {
          const component = {
            id: `lambda-${Date.now()}`,
            type: 'lambda',
            name: lambda.name,
            platform: 'lambda',
            config: {
              lambda: lambda.code,
              return_type: lambda.returnType,
            },
          }
          addComponent(component)
          toast({
            title: 'Lambda Added',
            description: `Lambda "${lambda.name}" added to configuration`,
          })
        }}
      />

      {/* Automation Builder Dialog */}
      <AutomationBuilder
        open={showAutomationBuilder}
        onClose={() => setShowAutomationBuilder(false)}
        onSave={(automation) => {
          const component = {
            id: `automation-${Date.now()}`,
            type: 'automation',
            name: automation.name,
            platform: 'automation',
            config: automation,
          }
          addComponent(component)
          toast({
            title: 'Automation Added',
            description: `Automation "${automation.name}" added to configuration`,
          })
        }}
      />

      {/* Node Editor Dialog */}
      <NodeEditor
        open={showNodeEditor}
        onClose={() => setShowNodeEditor(false)}
        onSave={(flow: FlowData) => {
          const component = {
            id: `flow-${Date.now()}`,
            type: 'lambda',
            name: flow.name,
            platform: 'lambda',
            config: {
              lambda: `// Generated from flow: ${flow.name}\n// Nodes: ${flow.nodes.length}\n// TODO: Implement flow logic`,
              flow_data: flow,
            },
          }
          addComponent(component)
          toast({
            title: 'Flow Added',
            description: `Node flow "${flow.name}" added to configuration`,
          })
        }}
      />

      {/* Script Builder Dialog */}
      <ScriptBuilder
        open={showScriptBuilder}
        onClose={() => setShowScriptBuilder(false)}
        onSave={(script: ScriptData) => {
          const component = {
            id: `script-${Date.now()}`,
            type: 'script',
            name: script.name,
            platform: 'script',
            config: {
              id: script.name.toLowerCase().replace(/\s+/g, '_'),
              mode: script.mode,
              then: script.sequence.map((action) => ({
                [action.action]: action.config,
              })),
            },
          }
          addComponent(component)
          toast({
            title: 'Script Added',
            description: `Script "${script.name}" added to configuration`,
          })
        }}
      />

      {/* Device Monitor Dialog */}
      <DeviceMonitor
        open={showDeviceMonitor}
        onClose={() => setShowDeviceMonitor(false)}
      />

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
