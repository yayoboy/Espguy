import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ExternalLink, Copy, CheckCircle2 } from 'lucide-react'
import { ComponentDoc } from '@/services/component-docs'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface ComponentDocumentationProps {
  doc: ComponentDoc | null
  open: boolean
  onClose: () => void
}

export default function ComponentDocumentation({
  doc,
  open,
  onClose,
}: ComponentDocumentationProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!doc) return null

  const handleCopyExample = () => {
    navigator.clipboard.writeText(doc.exampleConfig)
    setCopied(true)
    toast({
      title: 'Copied!',
      description: 'Example configuration copied to clipboard',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{doc.name}</DialogTitle>
              <DialogDescription className="mt-2">{doc.description}</DialogDescription>
            </div>
            <Badge variant="outline" className="ml-4">
              {doc.category}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Usage */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Usage</h3>
              <p className="text-sm text-muted-foreground">{doc.usage}</p>
            </div>

            {/* Common Uses */}
            {doc.commonUses && doc.commonUses.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Common Uses</h3>
                <div className="flex flex-wrap gap-2">
                  {doc.commonUses.map((use, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Configuration Fields */}
            {(doc.requiredFields || doc.optionalFields) && (
              <div className="grid grid-cols-2 gap-4">
                {doc.requiredFields && doc.requiredFields.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Required Fields</h3>
                    <Card className="p-3">
                      <ul className="space-y-1">
                        {doc.requiredFields.map((field, idx) => (
                          <li key={idx} className="text-xs font-mono text-muted-foreground">
                            • {field}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                )}

                {doc.optionalFields && doc.optionalFields.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Optional Fields</h3>
                    <Card className="p-3">
                      <ul className="space-y-1">
                        {doc.optionalFields.map((field, idx) => (
                          <li key={idx} className="text-xs font-mono text-muted-foreground">
                            • {field}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Example Configuration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Example Configuration</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyExample}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Card className="bg-muted/50 p-4">
                <pre className="text-xs font-mono overflow-x-auto">
                  <code>{doc.exampleConfig}</code>
                </pre>
              </Card>
            </div>

            {/* Related Components */}
            {doc.relatedComponents && doc.relatedComponents.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Related Components</h3>
                <div className="flex flex-wrap gap-2">
                  {doc.relatedComponents.map((component, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {component}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Official Documentation Link */}
            {doc.officialDocsUrl && (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                  onClick={() => window.open(doc.officialDocsUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Official ESPHome Documentation
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
