import { useState } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileCode, Plus, Trash2, GripVertical, Play, Clock, Sparkles } from 'lucide-react'
import { SCRIPT_TEMPLATES, AUTOMATION_ACTIONS } from '@/services/advanced-templates'
import { useToast } from '@/components/ui/use-toast'

interface ScriptBuilderProps {
  open: boolean
  onClose: () => void
  onSave: (script: ScriptData) => void
}

export interface ScriptAction {
  id: string
  action: string
  config: Record<string, any>
}

export interface ScriptData {
  name: string
  description: string
  mode: 'single' | 'restart' | 'queued' | 'parallel'
  parameters: Array<{ name: string; type: string; default?: any }>
  sequence: ScriptAction[]
}

export default function ScriptBuilder({ open, onClose, onSave }: ScriptBuilderProps) {
  const [scriptName, setScriptName] = useState('')
  const [scriptDescription, setScriptDescription] = useState('')
  const [scriptMode, setScriptMode] = useState<ScriptData['mode']>('single')
  const [actions, setActions] = useState<ScriptAction[]>([])
  const [parameters, setParameters] = useState<Array<{ name: string; type: string; default?: any }>>([])
  const { toast } = useToast()

  const addAction = (actionType: string) => {
    const newAction: ScriptAction = {
      id: `action_${Date.now()}`,
      action: actionType,
      config: {},
    }
    setActions([...actions, newAction])
  }

  const removeAction = (actionId: string) => {
    setActions(actions.filter((a) => a.id !== actionId))
  }

  const moveAction = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === actions.length - 1)
    ) {
      return
    }

    const newActions = [...actions]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newActions[index], newActions[targetIndex]] = [newActions[targetIndex], newActions[index]]
    setActions(newActions)
  }

  const updateActionConfig = (actionId: string, config: Record<string, any>) => {
    setActions(
      actions.map((a) => (a.id === actionId ? { ...a, config: { ...a.config, ...config } } : a))
    )
  }

  const loadTemplate = (templateId: string) => {
    const template = SCRIPT_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setScriptName(template.name)
      setScriptDescription(template.description)
      setActions(
        template.sequence.map((seq, idx) => ({
          id: `action_${Date.now()}_${idx}`,
          action: seq.action,
          config: seq.params,
        }))
      )
      toast({
        title: 'Template Loaded',
        description: `Loaded template: ${template.name}`,
      })
    }
  }

  const handleSave = () => {
    if (!scriptName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a script name',
        variant: 'destructive',
      })
      return
    }

    if (actions.length === 0) {
      toast({
        title: 'Error',
        description: 'Script must contain at least one action',
        variant: 'destructive',
      })
      return
    }

    const scriptData: ScriptData = {
      name: scriptName,
      description: scriptDescription,
      mode: scriptMode,
      parameters,
      sequence: actions,
    }

    onSave(scriptData)
    toast({
      title: 'Script Saved',
      description: `Script "${scriptName}" has been saved`,
    })
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setScriptName('')
    setScriptDescription('')
    setScriptMode('single')
    setActions([])
    setParameters([])
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Script Builder
          </DialogTitle>
          <DialogDescription>
            Create reusable action sequences that can be called from automations
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4" style={{ height: 'calc(90vh - 180px)' }}>
          {/* Script Configuration */}
          <div className="w-80 shrink-0 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Script Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="script-name" className="text-xs">
                    Name *
                  </Label>
                  <Input
                    id="script-name"
                    placeholder="e.g., fade_lights"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="script-description" className="text-xs">
                    Description
                  </Label>
                  <Input
                    id="script-description"
                    placeholder="What does this script do?"
                    value={scriptDescription}
                    onChange={(e) => setScriptDescription(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="script-mode" className="text-xs">
                    Execution Mode
                  </Label>
                  <Select value={scriptMode} onValueChange={(val) => setScriptMode(val as any)}>
                    <SelectTrigger id="script-mode" className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single - Queue and wait</SelectItem>
                      <SelectItem value="restart">Restart - Cancel and restart</SelectItem>
                      <SelectItem value="queued">Queued - Run sequentially</SelectItem>
                      <SelectItem value="parallel">Parallel - Run simultaneously</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {SCRIPT_TEMPLATES.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => loadTemplate(template.id)}
                      >
                        <FileCode className="mr-2 h-3 w-3" />
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Action Library */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Action Library</CardTitle>
                <CardDescription className="text-xs">Click to add</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <Tabs defaultValue="Light">
                    <TabsList className="w-full h-8">
                      <TabsTrigger value="Light" className="text-xs flex-1">
                        Light
                      </TabsTrigger>
                      <TabsTrigger value="Switch" className="text-xs flex-1">
                        Switch
                      </TabsTrigger>
                      <TabsTrigger value="Other" className="text-xs flex-1">
                        Other
                      </TabsTrigger>
                    </TabsList>

                    {['Light', 'Switch', 'Other'].map((category) => (
                      <TabsContent key={category} value={category} className="mt-2 space-y-1">
                        {AUTOMATION_ACTIONS.filter(
                          (a) =>
                            (category === 'Light' && a.category === 'Light') ||
                            (category === 'Switch' && a.category === 'Switch') ||
                            (category === 'Other' &&
                              !['Light', 'Switch'].includes(a.category || ''))
                        ).map((action) => (
                          <Button
                            key={action.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs h-7"
                            onClick={() => addAction(action.id)}
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            {action.name}
                          </Button>
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Action Sequence */}
          <div className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Action Sequence</CardTitle>
                    <CardDescription className="text-xs">
                      Actions will execute in order from top to bottom
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{actions.length} actions</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6">
                  {actions.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                      <div className="text-center">
                        <Play className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 font-semibold">Empty Sequence</h3>
                        <p className="text-sm text-muted-foreground">
                          Add actions from the library to build your script
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {actions.map((action, index) => {
                        const actionDef = AUTOMATION_ACTIONS.find((a) => a.id === action.action)

                        return (
                          <Card key={action.id} className="relative">
                            <CardContent className="p-4">
                              {/* Step number */}
                              <div className="absolute -left-3 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {index + 1}
                              </div>

                              <div className="flex items-start gap-3">
                                {/* Drag handle */}
                                <div className="flex flex-col gap-1 pt-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => moveAction(index, 'up')}
                                    disabled={index === 0}
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => moveAction(index, 'down')}
                                    disabled={index === actions.length - 1}
                                  >
                                    <GripVertical className="h-4 w-4 rotate-180" />
                                  </Button>
                                </div>

                                {/* Action config */}
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <Label className="text-xs font-semibold">
                                      {actionDef?.name || action.action}
                                    </Label>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {actionDef?.category}
                                    </Badge>
                                  </div>

                                  {/* Entity ID for most actions */}
                                  {action.action !== 'delay' &&
                                    !action.action.includes('logger') && (
                                      <div>
                                        <Label className="text-xs">Entity ID</Label>
                                        <Input
                                          placeholder="e.g., room_light"
                                          value={action.config.id || ''}
                                          onChange={(e) =>
                                            updateActionConfig(action.id, { id: e.target.value })
                                          }
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                    )}

                                  {/* Delay specific config */}
                                  {action.action === 'delay' && (
                                    <div className="grid gap-2 md:grid-cols-3">
                                      <div>
                                        <Label className="text-xs">Milliseconds</Label>
                                        <Input
                                          type="number"
                                          value={action.config.milliseconds || ''}
                                          onChange={(e) =>
                                            updateActionConfig(action.id, {
                                              milliseconds: e.target.value,
                                            })
                                          }
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">Seconds</Label>
                                        <Input
                                          type="number"
                                          value={action.config.seconds || ''}
                                          onChange={(e) =>
                                            updateActionConfig(action.id, {
                                              seconds: e.target.value,
                                            })
                                          }
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">Minutes</Label>
                                        <Input
                                          type="number"
                                          value={action.config.minutes || ''}
                                          onChange={(e) =>
                                            updateActionConfig(action.id, {
                                              minutes: e.target.value,
                                            })
                                          }
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* Light brightness/transition */}
                                  {action.action?.includes('light.turn_on') && (
                                    <div className="grid gap-2 md:grid-cols-2">
                                      <div>
                                        <Label className="text-xs">Brightness (0-255)</Label>
                                        <Input
                                          type="number"
                                          min="0"
                                          max="255"
                                          value={action.config.brightness || ''}
                                          onChange={(e) =>
                                            updateActionConfig(action.id, {
                                              brightness: e.target.value,
                                            })
                                          }
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">Transition (seconds)</Label>
                                        <Input
                                          type="number"
                                          value={action.config.transition_length || ''}
                                          onChange={(e) =>
                                            updateActionConfig(action.id, {
                                              transition_length: e.target.value,
                                            })
                                          }
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Delete button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => removeAction(action.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>

                              {/* Arrow to next action */}
                              {index < actions.length - 1 && (
                                <div className="mt-3 flex justify-center">
                                  <div className="flex flex-col items-center">
                                    <div className="h-6 w-px bg-border"></div>
                                    <div className="h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border"></div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <FileCode className="mr-2 h-4 w-4" />
            Save Script
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
