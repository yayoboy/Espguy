import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock, Trash2, Play, Upload, Wifi } from 'lucide-react'
import { useBuildHistoryStore } from '@/store/useBuildHistoryStore'
import { formatDistanceToNow } from 'date-fns'

interface BuildHistoryDialogProps {
  open: boolean
  onClose: () => void
  projectId?: string
}

export default function BuildHistoryDialog({
  open,
  onClose,
  projectId,
}: BuildHistoryDialogProps) {
  const { builds, clearHistory, getBuildsForProject } = useBuildHistoryStore()

  const displayBuilds = projectId ? getBuildsForProject(projectId) : builds

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compile':
        return <Play className="h-4 w-4" />
      case 'upload':
        return <Upload className="h-4 w-4" />
      case 'ota':
        return <Wifi className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500'
      case 'failed':
        return 'bg-destructive'
      case 'in_progress':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Build History</DialogTitle>
              <DialogDescription>
                {projectId
                  ? 'Build history for this project'
                  : 'All build history across projects'}
              </DialogDescription>
            </div>
            {displayBuilds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Clear all build history?')) {
                    clearHistory()
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {displayBuilds.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Clock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No build history yet</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {displayBuilds.map((build) => (
                <Card key={build.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        {getStatusIcon(build.status)}
                        <div className="h-full w-px bg-border" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(build.type)}
                              <h4 className="font-semibold text-sm capitalize">{build.type}</h4>
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(build.status)} text-white text-xs`}
                              >
                                {build.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {build.projectName}
                            </p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <p>
                              {formatDistanceToNow(new Date(build.timestamp), {
                                addSuffix: true,
                              })}
                            </p>
                            {build.duration && (
                              <p className="mt-1">
                                Duration: {Math.round(build.duration / 1000)}s
                              </p>
                            )}
                          </div>
                        </div>

                        {build.errors && build.errors.length > 0 && (
                          <div className="rounded bg-destructive/10 p-2">
                            <p className="text-xs font-semibold text-destructive mb-1">
                              Errors:
                            </p>
                            {build.errors.map((error, idx) => (
                              <p key={idx} className="text-xs text-destructive/80">
                                • {error}
                              </p>
                            ))}
                          </div>
                        )}

                        {build.logs && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              View logs
                            </summary>
                            <pre className="mt-2 rounded bg-muted p-2 overflow-x-auto">
                              {build.logs}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
