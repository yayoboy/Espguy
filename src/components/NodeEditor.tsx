import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Thermometer,
  Lightbulb,
  Zap,
  GitBranch,
  Calculator,
  Clock,
  ToggleLeft,
  Save,
  Play,
  Download,
  Trash2,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface NodeEditorProps {
  open: boolean
  onClose: () => void
  onSave: (flow: FlowData) => void
}

export interface FlowNode {
  id: string
  type: 'input' | 'logic' | 'output' | 'trigger'
  nodeType: string
  label: string
  config: Record<string, any>
  position: { x: number; y: number }
  inputs: string[]
  outputs: string[]
}

export interface FlowConnection {
  id: string
  source: string
  sourceOutput: string
  target: string
  targetInput: string
}

export interface FlowData {
  name: string
  description: string
  nodes: FlowNode[]
  connections: FlowConnection[]
}

// Node type definitions
const NODE_TYPES = {
  input: [
    { id: 'sensor_temperature', label: 'Temperature Sensor', icon: Thermometer, outputs: ['value'] },
    { id: 'sensor_humidity', label: 'Humidity Sensor', icon: Thermometer, outputs: ['value'] },
    { id: 'binary_sensor', label: 'Binary Sensor', icon: ToggleLeft, outputs: ['state'] },
    { id: 'number_input', label: 'Number Input', icon: Calculator, outputs: ['value'] },
    { id: 'time', label: 'Time', icon: Clock, outputs: ['hour', 'minute'] },
  ],
  logic: [
    { id: 'compare', label: 'Compare', icon: GitBranch, inputs: ['a', 'b'], outputs: ['true', 'false'] },
    { id: 'math', label: 'Math', icon: Calculator, inputs: ['a', 'b'], outputs: ['result'] },
    { id: 'threshold', label: 'Threshold', icon: GitBranch, inputs: ['value'], outputs: ['above', 'below'] },
    { id: 'and', label: 'AND', icon: GitBranch, inputs: ['a', 'b'], outputs: ['result'] },
    { id: 'or', label: 'OR', icon: GitBranch, inputs: ['a', 'b'], outputs: ['result'] },
    { id: 'not', label: 'NOT', icon: GitBranch, inputs: ['input'], outputs: ['result'] },
    { id: 'map', label: 'Map Value', icon: Calculator, inputs: ['value'], outputs: ['result'] },
  ],
  output: [
    { id: 'light_on', label: 'Turn On Light', icon: Lightbulb, inputs: ['trigger'] },
    { id: 'light_off', label: 'Turn Off Light', icon: Lightbulb, inputs: ['trigger'] },
    { id: 'switch_on', label: 'Turn On Switch', icon: Zap, inputs: ['trigger'] },
    { id: 'switch_off', label: 'Turn Off Switch', icon: Zap, inputs: ['trigger'] },
    { id: 'set_value', label: 'Set Value', icon: Calculator, inputs: ['value'] },
  ],
  trigger: [
    { id: 'on_state_change', label: 'On State Change', icon: Zap, outputs: ['trigger'] },
    { id: 'on_threshold', label: 'On Threshold', icon: GitBranch, outputs: ['trigger'] },
    { id: 'on_time', label: 'On Time', icon: Clock, outputs: ['trigger'] },
  ],
}

export default function NodeEditor({ open, onClose, onSave }: NodeEditorProps) {
  const [flowName, setFlowName] = useState('')
  const [flowDescription, setFlowDescription] = useState('')
  const [nodes, setNodes] = useState<FlowNode[]>([])
  const [connections, setConnections] = useState<FlowConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const { toast } = useToast()

  const addNode = useCallback((type: keyof typeof NODE_TYPES, nodeType: string) => {
    const nodeTypeDef = NODE_TYPES[type].find(n => n.id === nodeType)
    if (!nodeTypeDef) return

    const newNode: FlowNode = {
      id: `node_${Date.now()}`,
      type,
      nodeType,
      label: nodeTypeDef.label,
      config: {},
      position: { x: 100, y: 100 },
      inputs: 'inputs' in nodeTypeDef ? nodeTypeDef.inputs : [],
      outputs: 'outputs' in nodeTypeDef ? nodeTypeDef.outputs : [],
    }

    setNodes(prev => [...prev, newNode])
    toast({
      title: 'Node Added',
      description: `Added ${nodeTypeDef.label} node`,
    })
  }, [toast])

  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    setConnections(prev =>
      prev.filter(c => c.source !== nodeId && c.target !== nodeId)
    )
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }, [selectedNode])

  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(n =>
      n.id === nodeId ? { ...n, position } : n
    ))
  }, [])

  const updateNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes(prev => prev.map(n =>
      n.id === nodeId ? { ...n, config: { ...n.config, ...config } } : n
    ))
  }, [])

  const handleSave = useCallback(() => {
    if (!flowName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a flow name',
        variant: 'destructive',
      })
      return
    }

    if (nodes.length === 0) {
      toast({
        title: 'Error',
        description: 'Flow must contain at least one node',
        variant: 'destructive',
      })
      return
    }

    const flowData: FlowData = {
      name: flowName,
      description: flowDescription,
      nodes,
      connections,
    }

    onSave(flowData)
    toast({
      title: 'Flow Saved',
      description: `Flow "${flowName}" has been saved`,
    })
    onClose()
  }, [flowName, flowDescription, nodes, connections, onSave, onClose, toast])

  const exportFlow = useCallback(() => {
    const flowData: FlowData = {
      name: flowName,
      description: flowDescription,
      nodes,
      connections,
    }

    const dataStr = JSON.stringify(flowData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${flowName || 'flow'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [flowName, flowDescription, nodes, connections])

  const clearFlow = useCallback(() => {
    setNodes([])
    setConnections([])
    setSelectedNode(null)
    toast({
      title: 'Flow Cleared',
      description: 'All nodes and connections removed',
    })
  }, [toast])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Node-based Logic Editor
          </DialogTitle>
          <DialogDescription>
            Visual flow-based editor for complex logic (Node-RED style)
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4" style={{ height: 'calc(95vh - 180px)' }}>
          {/* Node Palette */}
          <div className="w-64 shrink-0">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Node Palette</CardTitle>
                <CardDescription className="text-xs">
                  Drag or click to add nodes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(95vh-280px)]">
                  <Tabs defaultValue="input" className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="input" className="text-xs">Input</TabsTrigger>
                      <TabsTrigger value="logic" className="text-xs">Logic</TabsTrigger>
                    </TabsList>
                    <TabsList className="w-full grid grid-cols-2 mt-1">
                      <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                      <TabsTrigger value="trigger" className="text-xs">Trigger</TabsTrigger>
                    </TabsList>

                    {Object.entries(NODE_TYPES).map(([category, nodeTypes]) => (
                      <TabsContent key={category} value={category} className="mt-0 p-3 space-y-2">
                        {nodeTypes.map((nodeType) => {
                          const Icon = nodeType.icon
                          return (
                            <Button
                              key={nodeType.id}
                              variant="outline"
                              className="w-full justify-start text-xs h-auto py-2"
                              onClick={() => addNode(category as keyof typeof NODE_TYPES, nodeType.id)}
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              {nodeType.label}
                            </Button>
                          )
                        })}
                      </TabsContent>
                    ))}
                  </Tabs>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Flow Info */}
            <Card>
              <CardContent className="p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="flow-name" className="text-xs">Flow Name *</Label>
                    <Input
                      id="flow-name"
                      placeholder="e.g., Smart Lighting"
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flow-description" className="text-xs">Description</Label>
                    <Input
                      id="flow-description"
                      placeholder="What does this flow do?"
                      value={flowDescription}
                      onChange={(e) => setFlowDescription(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Canvas Area */}
            <Card className="flex-1 relative overflow-hidden bg-grid">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <Button size="sm" variant="outline" onClick={clearFlow}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Button size="sm" variant="outline" onClick={exportFlow}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  Test
                </Button>
              </div>

              <div className="absolute inset-0 p-8">
                {nodes.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <GitBranch className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                      <h3 className="mb-2 font-semibold">Empty Canvas</h3>
                      <p className="text-sm text-muted-foreground">
                        Add nodes from the palette to start building your flow
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full">
                    {/* Render nodes */}
                    {nodes.map((node) => (
                      <NodeComponent
                        key={node.id}
                        node={node}
                        isSelected={selectedNode?.id === node.id}
                        onSelect={() => setSelectedNode(node)}
                        onRemove={() => removeNode(node.id)}
                        onPositionChange={(pos) => updateNodePosition(node.id, pos)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Node Stats */}
            <div className="flex gap-2">
              <Badge variant="outline">
                {nodes.length} {nodes.length === 1 ? 'Node' : 'Nodes'}
              </Badge>
              <Badge variant="outline">
                {connections.length} {connections.length === 1 ? 'Connection' : 'Connections'}
              </Badge>
            </div>
          </div>

          {/* Node Properties */}
          <div className="w-64 shrink-0">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Properties</CardTitle>
                <CardDescription className="text-xs">
                  {selectedNode ? selectedNode.label : 'Select a node'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedNode ? (
                  <ScrollArea className="h-[calc(95vh-280px)]">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs">Node ID</Label>
                        <Input
                          value={selectedNode.id}
                          disabled
                          className="h-7 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={selectedNode.label}
                          onChange={(e) =>
                            setNodes(prev => prev.map(n =>
                              n.id === selectedNode.id ? { ...n, label: e.target.value } : n
                            ))
                          }
                          className="h-7 text-xs"
                        />
                      </div>

                      {/* Node-specific config */}
                      {selectedNode.nodeType === 'sensor_temperature' && (
                        <div>
                          <Label className="text-xs">Sensor ID</Label>
                          <Input
                            placeholder="temperature_sensor"
                            value={selectedNode.config.sensor_id || ''}
                            onChange={(e) =>
                              updateNodeConfig(selectedNode.id, { sensor_id: e.target.value })
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                      )}

                      {selectedNode.nodeType === 'compare' && (
                        <div>
                          <Label className="text-xs">Operator</Label>
                          <select
                            className="w-full h-7 text-xs border rounded px-2"
                            value={selectedNode.config.operator || '=='}
                            onChange={(e) =>
                              updateNodeConfig(selectedNode.id, { operator: e.target.value })
                            }
                          >
                            <option value="==">Equal (==)</option>
                            <option value="!=">Not Equal (!=)</option>
                            <option value=">">Greater (&gt;)</option>
                            <option value="<">Less (&lt;)</option>
                            <option value=">=">Greater or Equal (&gt;=)</option>
                            <option value="<=">Less or Equal (&lt;=)</option>
                          </select>
                        </div>
                      )}

                      {selectedNode.nodeType === 'threshold' && (
                        <div>
                          <Label className="text-xs">Threshold Value</Label>
                          <Input
                            type="number"
                            placeholder="25"
                            value={selectedNode.config.threshold || ''}
                            onChange={(e) =>
                              updateNodeConfig(selectedNode.id, { threshold: e.target.value })
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                      )}

                      {selectedNode.nodeType === 'math' && (
                        <div>
                          <Label className="text-xs">Operation</Label>
                          <select
                            className="w-full h-7 text-xs border rounded px-2"
                            value={selectedNode.config.operation || 'add'}
                            onChange={(e) =>
                              updateNodeConfig(selectedNode.id, { operation: e.target.value })
                            }
                          >
                            <option value="add">Add (+)</option>
                            <option value="subtract">Subtract (-)</option>
                            <option value="multiply">Multiply (*)</option>
                            <option value="divide">Divide (/)</option>
                            <option value="modulo">Modulo (%)</option>
                          </select>
                        </div>
                      )}

                      {(selectedNode.nodeType === 'light_on' ||
                        selectedNode.nodeType === 'light_off' ||
                        selectedNode.nodeType === 'switch_on' ||
                        selectedNode.nodeType === 'switch_off') && (
                        <div>
                          <Label className="text-xs">Entity ID</Label>
                          <Input
                            placeholder="room_light"
                            value={selectedNode.config.entity_id || ''}
                            onChange={(e) =>
                              updateNodeConfig(selectedNode.id, { entity_id: e.target.value })
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                      )}

                      {/* Inputs/Outputs */}
                      {selectedNode.inputs.length > 0 && (
                        <div>
                          <Label className="text-xs mb-2 block">Inputs</Label>
                          <div className="space-y-1">
                            {selectedNode.inputs.map((input) => (
                              <Badge key={input} variant="secondary" className="text-xs">
                                ← {input}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedNode.outputs.length > 0 && (
                        <div>
                          <Label className="text-xs mb-2 block">Outputs</Label>
                          <div className="space-y-1">
                            {selectedNode.outputs.map((output) => (
                              <Badge key={output} variant="secondary" className="text-xs">
                                {output} →
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => removeNode(selectedNode.id)}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete Node
                      </Button>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex h-[calc(95vh-280px)] items-center justify-center">
                    <p className="text-center text-xs text-muted-foreground">
                      Select a node to view its properties
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Flow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Node Component for rendering individual nodes on canvas
function NodeComponent({
  node,
  isSelected,
  onSelect,
  onRemove: _onRemove,
  onPositionChange,
}: {
  node: FlowNode
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onPositionChange: (pos: { x: number; y: number }) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    })
    onSelect()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      onPositionChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add/remove event listeners
  if (typeof window !== 'undefined') {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }

  const getNodeColor = () => {
    switch (node.type) {
      case 'input': return 'border-blue-500 bg-blue-500/10'
      case 'logic': return 'border-yellow-500 bg-yellow-500/10'
      case 'output': return 'border-green-500 bg-green-500/10'
      case 'trigger': return 'border-purple-500 bg-purple-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div
      className={`absolute rounded-lg border-2 p-3 cursor-move transition-all ${getNodeColor()} ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'shadow'
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        minWidth: '150px',
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold">{node.label}</h4>
        <Badge variant="outline" className="text-xs">
          {node.type}
        </Badge>
      </div>

      {/* Input connectors */}
      {node.inputs.length > 0 && (
        <div className="mb-2 space-y-1">
          {node.inputs.map((input) => (
            <div key={input} className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">{input}</span>
            </div>
          ))}
        </div>
      )}

      {/* Output connectors */}
      {node.outputs.length > 0 && (
        <div className="space-y-1">
          {node.outputs.map((output) => (
            <div key={output} className="flex items-center justify-end gap-1">
              <span className="text-xs text-muted-foreground">{output}</span>
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
