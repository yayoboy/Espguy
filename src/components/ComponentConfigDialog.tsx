import { useState, useEffect } from 'react'
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
import { ComponentTemplate } from '@/services/templates'

interface ComponentConfigDialogProps {
  open: boolean
  template: ComponentTemplate
  initialConfig?: Record<string, any>
  onSave: (config: Record<string, any>) => void
  onClose: () => void
}

export function ComponentConfigDialog({
  open,
  template,
  initialConfig,
  onSave,
  onClose,
}: ComponentConfigDialogProps) {
  const [config, setConfig] = useState<Record<string, any>>({})

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig)
    } else {
      setConfig({ ...template.config })
    }
  }, [template, initialConfig])

  const handleSave = () => {
    onSave(config)
    onClose()
  }

  const updateConfigValue = (key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const renderConfigField = (key: string, value: any) => {
    // Skip nested objects for now
    if (typeof value === 'object' && value !== null) {
      return null
    }

    return (
      <div key={key} className="grid gap-2">
        <Label htmlFor={key}>
          {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          {template.requiredFields?.includes(key) && ' *'}
        </Label>
        <Input
          id={key}
          value={config[key] || ''}
          onChange={(e) => updateConfigValue(key, e.target.value)}
          placeholder={`Enter ${key}`}
        />
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {template.name}</DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {Object.entries(template.config).map(([key, value]) =>
            renderConfigField(key, value)
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
