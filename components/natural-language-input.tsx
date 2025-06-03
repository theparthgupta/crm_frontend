"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Wand2 } from "lucide-react"

type NaturalLanguageInputProps = {
  onGenerateRules: (rules: any[]) => void
}

export function NaturalLanguageInput({ onGenerateRules }: NaturalLanguageInputProps) {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateRules = () => {
    setIsGenerating(true)

    // In a real app, this would call an AI backend to generate rules
    // For now, we'll just simulate a delay and generate some sample rules
    setTimeout(() => {
      const sampleRules = [
        {
          id: "nl-1",
          type: "condition",
          attribute: "Total Spend",
          operator: "greater_than",
          value: "1000",
        },
        {
          id: "nl-2",
          type: "condition",
          logic: "and",
          attribute: "Visit Count",
          operator: "greater_than",
          value: "5",
        },
        {
          id: "nl-3",
          type: "condition",
          logic: "and",
          attribute: "Last Purchase Date",
          operator: "after",
          value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
      ]

      onGenerateRules(sampleRules)
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="nl-description" className="block text-sm font-medium mb-1">
          Describe your target audience in natural language
        </label>
        <Textarea
          id="nl-description"
          placeholder="e.g., Customers who spent more than $1000, visited at least 5 times, and made a purchase in the last 30 days"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button onClick={handleGenerateRules} disabled={!description || isGenerating}>
        <Wand2 className="h-4 w-4 mr-2" />
        {isGenerating ? "Generating..." : "Generate Rules"}
      </Button>
    </div>
  )
}
