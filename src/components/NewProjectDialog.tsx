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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjectStore } from '@/store/useProjectStore'
import { useToast } from '@/components/ui/use-toast'

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated: () => void
}

const ESP32_BOARDS = [
  'esp32dev',
  'esp32-s2',
  'esp32-s3',
  'esp32-c3',
  'nodemcu-32s',
  'esp32-poe',
]

const ESP8266_BOARDS = [
  'esp01_1m',
  'nodemcuv2',
  'd1_mini',
  'd1_mini_pro',
  'esp12e',
]

export function NewProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
}: NewProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [platform, setPlatform] = useState<'ESP32' | 'ESP8266'>('ESP32')
  const [board, setBoard] = useState('esp32dev')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const { addProject } = useProjectStore()
  const { toast } = useToast()

  const boards = platform === 'ESP32' ? ESP32_BOARDS : ESP8266_BOARDS

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a project name',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const project = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        platform,
        board,
        category: category.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await window.electronAPI.project.create(project)

      if (result.success) {
        addProject(project)
        toast({
          title: 'Success',
          description: `Project "${name}" created successfully`,
        })
        resetForm()
        onProjectCreated()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create project',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setPlatform('ESP32')
    setBoard('esp32dev')
    setCategory('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Configure your new ESPHome device project
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="My ESP Device"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="A brief description of your device"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select
              value={platform}
              onValueChange={(value: 'ESP32' | 'ESP8266') => {
                setPlatform(value)
                setBoard(value === 'ESP32' ? 'esp32dev' : 'nodemcuv2')
              }}
            >
              <SelectTrigger id="platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESP32">ESP32</SelectItem>
                <SelectItem value="ESP8266">ESP8266</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="board">Board *</Label>
            <Select value={board} onValueChange={setBoard}>
              <SelectTrigger id="board">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {boards.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              placeholder="e.g., Sensors, Lights, Climate"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
