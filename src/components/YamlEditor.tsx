import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'

interface YamlEditorProps {
  yaml: string
  onChange: (yaml: string) => void
}

export default function YamlEditor({ yaml, onChange }: YamlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== yaml) {
      textareaRef.current.value = yaml
    }
  }, [yaml])

  return (
    <div className="h-full p-6">
      <Card className="h-full overflow-hidden">
        <textarea
          ref={textareaRef}
          defaultValue={yaml}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm outline-none"
          placeholder="# ESPHome configuration will appear here..."
          spellCheck={false}
        />
      </Card>
    </div>
  )
}
