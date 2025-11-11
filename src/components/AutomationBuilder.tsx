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
import { Plus, Trash2, Zap, GitBranch, Play } from 'lucide-react'
import {
  AUTOMATION_TRIGGERS,
  AUTOMATION_ACTIONS,
  AUTOMATION_CONDITIONS,
  AUTOMATION_TEMPLATES,
} from '@/services/advanced-templates'
import { useToast } from '@/components/ui/use-toast'

interface AutomationBuilderProps {
  open: boolean
  onClose: () => void
  onSave: (automation: any) => void
}

export default function AutomationBuilder({
  open,
  onClose,
  onSave,
}: AutomationBuilderProps) {
  const [name, setName] = useState('')
  const [trigger, setTrigger] = useState<any>(null)
  const [conditions, setConditions] = useState<any[]>([])
  const [actions, setActions] = useState<any[]>([])
  const { toast } = useToast()

  const handleAddCondition = () => {
    setConditions([...conditions, { condition: '', config: {} }])
  }

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleAddAction = () => {
    setActions([...actions, { action: '', config: {} }])
  }

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the automation',
        variant: 'destructive',
      })
      return
    }

    if (!trigger) {
      toast({
        title: 'Error',
        description: 'Please configure a trigger',
        variant: 'destructive',
      })
      return
    }

    if (actions.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one action',
        variant: 'destructive',
      })
      return
    }

    onSave({
      name,
      trigger,
      conditions,
      actions,
    })

    onClose()
    resetForm()
  }

  const resetForm = () => {
    setName('')
    setTrigger(null)
    setConditions([])
    setActions([])
  }

  const loadTemplate = (templateId: string) => {
    const template = AUTOMATION_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setName(template.name)
      setTrigger(template.trigger)
      setConditions(template.condition || [])
      setActions(template.action)
      toast({
        title: 'Template Loaded',
        description: `Loaded template: ${template.name}`,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automation Builder
          </DialogTitle>
          <DialogDescription>
            Create visual automations with triggers, conditions, and actions
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Start</CardTitle>
                <CardDescription>Load a template to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {AUTOMATION_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => loadTemplate(template.id)}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      {template.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="automation-name">Automation Name *</Label>
              <Input
                id="automation-name"
                placeholder="e.g., Motion Activated Light"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Trigger */}
            <Card className="border-blue-500/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Play className="h-4 w-4 text-blue-500" />
                  Trigger (When)
                </CardTitle>
                <CardDescription>What starts this automation?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select
                  value={trigger?.platform || ''}
                  onValueChange={(value) =>
                    setTrigger({ platform: value, config: {} })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUTOMATION_TRIGGERS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {trigger && (
                  <div className="space-y-2">
                    <Label>Entity ID</Label>
                    <Input
                      placeholder="e.g., motion_sensor"
                      value={trigger.config.entity_id || ''}
                      onChange={(e) =>
                        setTrigger({
                          ...trigger,
                          config: { ...trigger.config, entity_id: e.target.value },
                        })
                      }
                    />

                    {trigger.platform === 'state' && (
                      <>
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <Label>From State</Label>
                            <Input
                              placeholder="off"
                              value={trigger.config.from || ''}
                              onChange={(e) =>
                                setTrigger({
                                  ...trigger,
                                  config: { ...trigger.config, from: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>To State</Label>
                            <Input
                              placeholder="on"
                              value={trigger.config.to || ''}
                              onChange={(e) =>
                                setTrigger({
                                  ...trigger,
                                  config: { ...trigger.config, to: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {trigger.platform === 'numeric_state' && (
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <Label>Above</Label>
                          <Input
                            type="number"
                            placeholder="25"
                            value={trigger.config.above || ''}
                            onChange={(e) =>
                              setTrigger({
                                ...trigger,
                                config: { ...trigger.config, above: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Below</Label>
                          <Input
                            type="number"
                            placeholder="20"
                            value={trigger.config.below || ''}
                            onChange={(e) =>
                              setTrigger({
                                ...trigger,
                                config: { ...trigger.config, below: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conditions */}
            <Card className="border-yellow-500/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <GitBranch className="h-4 w-4 text-yellow-500" />
                      Conditions (If) - Optional
                    </CardTitle>
                    <CardDescription>Additional checks before running</CardDescription>
                  </div>
                  <Button size="sm" onClick={handleAddCondition}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {conditions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No conditions. Automation will run whenever triggered.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {conditions.map((condition, index) => (
                      <Card key={index}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div className="flex-1 space-y-2">
                              <Select
                                value={condition.condition || ''}
                                onValueChange={(value) => {
                                  const newConditions = [...conditions]
                                  newConditions[index] = {
                                    condition: value,
                                    config: {},
                                  }
                                  setConditions(newConditions)
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AUTOMATION_CONDITIONS.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                      {c.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {condition.condition === 'time' && (
                                <div className="grid gap-2 md:grid-cols-2">
                                  <div>
                                    <Label className="text-xs">After</Label>
                                    <Input
                                      type="time"
                                      value={condition.config.after || ''}
                                      onChange={(e) => {
                                        const newConditions = [...conditions]
                                        newConditions[index].config.after = e.target.value
                                        setConditions(newConditions)
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Before</Label>
                                    <Input
                                      type="time"
                                      value={condition.config.before || ''}
                                      onChange={(e) => {
                                        const newConditions = [...conditions]
                                        newConditions[index].config.before = e.target.value
                                        setConditions(newConditions)
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCondition(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-green-500/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-green-500" />
                      Actions (Then)
                    </CardTitle>
                    <CardDescription>What should happen?</CardDescription>
                  </div>
                  <Button size="sm" onClick={handleAddAction}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {actions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Add at least one action
                  </p>
                ) : (
                  <div className="space-y-3">
                    {actions.map((action, index) => (
                      <Card key={index}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Badge className="mt-1">{index + 1}</Badge>
                            <div className="flex-1 space-y-2">
                              <Select
                                value={action.action || ''}
                                onValueChange={(value) => {
                                  const newActions = [...actions]
                                  newActions[index] = { action: value, config: {} }
                                  setActions(newActions)
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AUTOMATION_ACTIONS.map((a) => (
                                    <SelectItem key={a.id} value={a.id}>
                                      {a.name} ({a.category})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {action.action && action.action !== 'delay' && (
                                <div>
                                  <Label className="text-xs">Entity ID</Label>
                                  <Input
                                    placeholder="e.g., room_light"
                                    value={action.config.id || ''}
                                    onChange={(e) => {
                                      const newActions = [...actions]
                                      newActions[index].config.id = e.target.value
                                      setActions(newActions)
                                    }}
                                  />
                                </div>
                              )}

                              {action.action === 'delay' && (
                                <div className="grid gap-2 md:grid-cols-3">
                                  <div>
                                    <Label className="text-xs">Milliseconds</Label>
                                    <Input
                                      type="number"
                                      value={action.config.milliseconds || ''}
                                      onChange={(e) => {
                                        const newActions = [...actions]
                                        newActions[index].config.milliseconds = e.target.value
                                        setActions(newActions)
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Seconds</Label>
                                    <Input
                                      type="number"
                                      value={action.config.seconds || ''}
                                      onChange={(e) => {
                                        const newActions = [...actions]
                                        newActions[index].config.seconds = e.target.value
                                        setActions(newActions)
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Minutes</Label>
                                    <Input
                                      type="number"
                                      value={action.config.minutes || ''}
                                      onChange={(e) => {
                                        const newActions = [...actions]
                                        newActions[index].config.minutes = e.target.value
                                        setActions(newActions)
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {action.action?.includes('light.turn_on') && (
                                <div className="grid gap-2 md:grid-cols-2">
                                  <div>
                                    <Label className="text-xs">Brightness (0-255)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="255"
                                      value={action.config.brightness || ''}
                                      onChange={(e) => {
                                        const newActions = [...actions]
                                        newActions[index].config.brightness = e.target.value
                                        setActions(newActions)
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Transition (seconds)</Label>
                                    <Input
                                      type="number"
                                      value={action.config.transition_length || ''}
                                      onChange={(e) => {
                                        const newActions = [...actions]
                                        newActions[index].config.transition_length = e.target.value
                                        setActions(newActions)
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAction(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Zap className="mr-2 h-4 w-4" />
            Save Automation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
