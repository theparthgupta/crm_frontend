"use client"

import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

type AudiencePreviewProps = {
  audienceSize: number | null
  onPreview: () => void
}

export function AudiencePreview({ audienceSize, onPreview }: AudiencePreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Audience Preview</h3>

      {audienceSize !== null && (
        <div className="bg-muted p-4 rounded-md flex items-center justify-center">
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">{audienceSize.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Customers</div>
          </div>
        </div>
      )}

      <Button className="w-full" variant="outline" onClick={onPreview}>
        Preview Audience Size
      </Button>
    </div>
  )
}
