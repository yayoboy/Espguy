import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Terminal } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BuildConsoleProps {
  processId: string | null
  onClose: () => void
}

export default function BuildConsole({ processId, onClose }: BuildConsoleProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [exitCode, setExitCode] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!processId) return

    const unsubscribeLog = window.electronAPI.esphome.onLog((data) => {
      if (data.processId === processId) {
        setLogs((prev) => [...prev, data.data])
      }
    })

    const unsubscribeComplete = window.electronAPI.esphome.onComplete((data) => {
      if (data.processId === processId) {
        setIsComplete(true)
        setExitCode(data.code)
      }
    })

    return () => {
      unsubscribeLog()
      unsubscribeComplete()
    }
  }, [processId])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 h-80 border-t bg-background">
      <Card className="h-full rounded-none border-x-0 border-b-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Terminal className="h-5 w-5" />
            Build Console
            {isComplete && (
              <span
                className={`ml-2 text-sm ${
                  exitCode === 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {exitCode === 0 ? '✓ Success' : '✗ Failed'}
              </span>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] p-0">
          <ScrollArea className="h-full">
            <div
              ref={scrollRef}
              className="h-full overflow-auto bg-black p-4 font-mono text-sm text-green-400"
            >
              {logs.length === 0 ? (
                <div className="text-muted-foreground">
                  Waiting for output...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {log}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
