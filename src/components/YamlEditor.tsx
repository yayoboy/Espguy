import { useEffect, useRef, useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react'
import { YamlValidator, ValidationError } from '@/services/yaml-validator'

interface YamlEditorProps {
  yaml: string
  onChange: (yaml: string) => void
}

export default function YamlEditor({ yaml, onChange }: YamlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isValid, setIsValid] = useState(true)
  const validationTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== yaml) {
      textareaRef.current.value = yaml
    }
    validateYaml(yaml)
  }, [yaml])

  const validateYaml = useCallback((yamlContent: string) => {
    // Debounce validation
    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current)
    }

    validationTimerRef.current = setTimeout(() => {
      const result = YamlValidator.validate(yamlContent)
      setValidationErrors(result.errors)
      setIsValid(result.valid)
    }, 500)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    validateYaml(newValue)
  }

  const scrollToLine = (line: number) => {
    if (textareaRef.current) {
      const lines = textareaRef.current.value.split('\n')
      let charCount = 0
      for (let i = 0; i < line - 1 && i < lines.length; i++) {
        charCount += lines[i].length + 1 // +1 for newline
      }
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(charCount, charCount)
      textareaRef.current.scrollTop = ((line - 1) * 20) // Approximate line height
    }
  }

  const errorCount = validationErrors.filter((e) => e.severity === 'error').length
  const warningCount = validationErrors.filter((e) => e.severity === 'warning').length

  return (
    <div className="flex h-full flex-col p-6 gap-4">
      {/* Validation Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValid && errorCount === 0 ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-500">Valid YAML</span>
            </>
          ) : errorCount > 0 ? (
            <>
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                {errorCount} {errorCount === 1 ? 'Error' : 'Errors'}
              </span>
            </>
          ) : null}
          {warningCount > 0 && (
            <div className="flex items-center gap-1 ml-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500">
                {warningCount} {warningCount === 1 ? 'Warning' : 'Warnings'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Editor */}
        <Card className="flex-1 overflow-hidden">
          <textarea
            ref={textareaRef}
            defaultValue={yaml}
            onChange={handleChange}
            className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm outline-none"
            placeholder="# ESPHome configuration will appear here..."
            spellCheck={false}
          />
        </Card>

        {/* Validation Errors Panel */}
        {validationErrors.length > 0 && (
          <Card className="w-80 overflow-hidden">
            <div className="border-b p-3">
              <h3 className="font-semibold text-sm">Validation Issues</h3>
            </div>
            <ScrollArea className="h-[calc(100%-48px)]">
              <div className="p-3 space-y-2">
                {validationErrors.map((error, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      error.severity === 'error'
                        ? 'border-destructive/50 bg-destructive/5'
                        : 'border-yellow-500/50 bg-yellow-500/5'
                    }`}
                    onClick={() => scrollToLine(error.line)}
                  >
                    <div className="flex items-start gap-2">
                      {error.severity === 'error' ? (
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              error.severity === 'error'
                                ? 'border-destructive text-destructive'
                                : 'border-yellow-500 text-yellow-500'
                            }`}
                          >
                            Line {error.line}:{error.column}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{error.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>
  )
}
