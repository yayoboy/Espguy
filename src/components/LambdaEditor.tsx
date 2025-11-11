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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Code, Sparkles, Copy, Check } from 'lucide-react'
import { LAMBDA_TEMPLATES, LambdaTemplate } from '@/services/advanced-templates'
import { useToast } from '@/components/ui/use-toast'

interface LambdaEditorProps {
  open: boolean
  onClose: () => void
  onSave: (lambda: { name: string; code: string; returnType?: string }) => void
  initialCode?: string
}

export default function LambdaEditor({
  open,
  onClose,
  onSave,
  initialCode,
}: LambdaEditorProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState(initialCode || '')
  const [returnType, setReturnType] = useState('auto')
  const [selectedTemplate, setSelectedTemplate] = useState<LambdaTemplate | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleTemplateSelect = (template: LambdaTemplate) => {
    setSelectedTemplate(template)
    setCode(template.code)
    setName(template.name)
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the lambda',
        variant: 'destructive',
      })
      return
    }

    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Lambda code cannot be empty',
        variant: 'destructive',
      })
      return
    }

    onSave({ name, code, returnType })
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setName('')
    setCode('')
    setReturnType('auto')
    setSelectedTemplate(null)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard',
    })
  }

  // Group templates by category
  const templatesByCategory = LAMBDA_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, LambdaTemplate[]>)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Lambda Editor
          </DialogTitle>
          <DialogDescription>
            Create custom C++ lambda functions for advanced logic
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="editor" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Code Editor</TabsTrigger>
            <TabsTrigger value="templates">
              <Sparkles className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Code Editor Tab */}
          <TabsContent value="editor" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lambda-name">Lambda Name *</Label>
                <Input
                  id="lambda-name"
                  placeholder="e.g., temperature_filter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lambda-code">Code *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Textarea
                  id="lambda-code"
                  placeholder="// Enter your C++ code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  spellCheck={false}
                />
              </div>

              {/* Variable Info */}
              {selectedTemplate && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Template Variables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedTemplate.variables.map((variable, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">{variable.type}</Badge>
                          <code className="font-mono">{variable.name}</code>
                          {variable.default !== undefined && (
                            <span className="text-muted-foreground">
                              = {variable.default}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Code Tips */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Lambda Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-xs text-muted-foreground">
                  <p>• Use <code>return</code> to specify the output value</p>
                  <p>• Access component states with <code>id(component_id)</code></p>
                  <p>• Use <code>static</code> variables to maintain state between calls</p>
                  <p>• Available types: int, float, bool, std::string</p>
                  <p>• Lambda runs in C++ context with full ESPHome API access</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-0">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {Object.entries(templatesByCategory).map(([category, templates]) => (
                  <div key={category}>
                    <h3 className="mb-3 text-sm font-semibold">{category}</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedTemplate?.id === template.id
                              ? 'border-primary'
                              : ''
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">{template.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {template.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="rounded-md bg-muted p-2">
                              <pre className="overflow-x-auto text-xs">
                                <code>{template.code.split('\n').slice(0, 3).join('\n')}...</code>
                              </pre>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {template.variables.map((v, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {v.name}: {v.type}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Code className="mr-2 h-4 w-4" />
            Save Lambda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
