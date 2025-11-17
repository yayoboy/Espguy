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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Upload, FileJson, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Project } from '@/store/useProjectStore'

interface ImportExportDialogProps {
  open: boolean
  onClose: () => void
  projects: Project[]
  onImport: (project: Project) => void
}

export default function ImportExportDialog({
  open,
  onClose,
  projects,
  onImport,
}: ImportExportDialogProps) {
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleExport = async () => {
    if (!selectedProject) {
      toast({
        title: 'Error',
        description: 'Please select a project to export',
        variant: 'destructive',
      })
      return
    }

    const project = projects.find((p) => p.id === selectedProject)
    if (!project) return

    try {
      // Load YAML content
      const yamlResult = await window.electronAPI.yaml.load(project.id)

      const exportData = {
        project: {
          name: project.name,
          platform: project.platform,
          board: project.board,
          createdAt: project.createdAt,
        },
        yaml: yamlResult.yaml || '',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${project.name.replace(/\s+/g, '_')}_esphome.json`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: 'Project Exported',
        description: `Project "${project.name}" exported successfully`,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export project',
        variant: 'destructive',
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.json')) {
        toast({
          title: 'Invalid File',
          description: 'Please select a JSON file',
          variant: 'destructive',
        })
        return
      }
      setImportFile(file)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to import',
        variant: 'destructive',
      })
      return
    }

    try {
      const text = await importFile.text()
      const data = JSON.parse(text)

      // Validate import data
      if (!data.project || !data.yaml) {
        throw new Error('Invalid project file format')
      }

      // Create new project
      const newProject: Project = {
        id: `project_${Date.now()}`,
        name: `${data.project.name} (Imported)`,
        platform: data.project.platform,
        board: data.project.board,
        createdAt: new Date().toISOString(),
      }

      // Create project and save YAML
      const createResult = await window.electronAPI.project.create({
        name: newProject.name,
        platform: newProject.platform,
        board: newProject.board,
      })

      if (createResult.success && createResult.project) {
        await window.electronAPI.yaml.save({
          projectId: createResult.project.id,
          yaml: data.yaml,
        })

        onImport(createResult.project)
        toast({
          title: 'Project Imported',
          description: `Project "${newProject.name}" imported successfully`,
        })
        onClose()
      }
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to import project',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import / Export Projects</DialogTitle>
          <DialogDescription>
            Export your projects to backup or share, or import existing projects
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-select">Select Project</Label>
              <select
                id="project-select"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">-- Select a project --</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.board})
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <FileJson className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Export Format</p>
                  <p className="text-xs text-muted-foreground">
                    Projects are exported as JSON files containing configuration and YAML data.
                    You can share these files or use them as backups.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleExport} className="w-full" disabled={!selectedProject}>
              <Download className="mr-2 h-4 w-4" />
              Export Project
            </Button>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-input">Select File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-input"
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
              </div>
              {importFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {importFile.name}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Import Notes</p>
                  <p className="text-xs text-muted-foreground">
                    Imported projects will be created as new projects with "(Imported)" suffix.
                    Make sure the file is a valid ESPHome GUI export.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleImport} className="w-full" disabled={!importFile}>
              <Upload className="mr-2 h-4 w-4" />
              Import Project
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
