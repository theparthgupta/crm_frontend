"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { SegmentBuilder } from "@/components/segment-builder"
import { NaturalLanguageInput } from "@/components/natural-language-input"
import { AudiencePreview } from "@/components/audience-preview"
import api from '@/lib/api'; // Import your API utility

export function CampaignForm() {
  const router = useRouter()
  const [campaignName, setCampaignName] = useState("")
  const [campaignMessage, setCampaignMessage] = useState("")
  const [segmentName, setSegmentName] = useState("")
  const [audienceSize, setAudienceSize] = useState<number | null>(null)
  const [rules, setRules] = useState<any[]>([
    { id: "1", type: "condition", attribute: "Total Spend", operator: "greater_than", value: "" },
  ])
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const campaignData = {
        name: campaignName,
        message: campaignMessage,
        segment: {
          name: segmentName,
          rules: rules, // Send the rules to the backend
        },
      };
      // Assuming POST to /api/campaigns with campaign data in the body
      await api.post('/api/campaigns', campaignData);
      console.log("Campaign created successfully!");
      // Navigate to campaigns page on success
      router.push("/campaigns");
    } catch (err) {
      console.error("Error creating campaign:", err);
      setSaveError("Failed to create campaign.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePreviewAudience = async () => {
    setPreviewLoading(true);
    setPreviewError(null);
    setAudienceSize(null);
    try {
      const response = await api.post<{ audienceSize: number }>('/api/segments', { rules });
      setAudienceSize(response.data.audienceSize);
    } catch (err) {
      console.error("Error fetching audience size:", err);
      setPreviewError("Failed to preview audience size.");
      setAudienceSize(null); // Clear previous preview on error
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="campaign-name" className="block text-sm font-medium mb-1">
                  Campaign Name
                </label>
                <Input
                  id="campaign-name"
                  placeholder="Enter campaign name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="segment-name" className="block text-sm font-medium mb-1">
                  Segment Name
                </label>
                <Input
                  id="segment-name"
                  placeholder="Enter segment name"
                  value={segmentName}
                  onChange={(e) => setSegmentName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="campaign-message" className="block text-sm font-medium mb-1">
                  Campaign Message
                </label>
                <Textarea
                  id="campaign-message"
                  placeholder="Enter your campaign message"
                  rows={4}
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Segment Builder</h3>
            <SegmentBuilder rules={rules} setRules={setRules} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Natural Language Input</h3>
            <NaturalLanguageInput onGenerateRules={(generatedRules) => setRules(generatedRules)} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            {/* Pass loading and error to AudiencePreview or handle here */}
            <AudiencePreview audienceSize={audienceSize} onPreview={handlePreviewAudience} />
             {previewLoading && <p>Loading audience size...</p>}
             {previewError && <p className="text-red-500">{previewError}</p>}
          </CardContent>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={handleSave}
          disabled={!campaignName || !segmentName || !campaignMessage || rules.length === 0 || saveLoading || previewLoading}
        >
          {saveLoading ? "Saving..." : "Save Segment & Create Campaign"}
        </Button>
        {saveError && <p className="text-red-500 mt-2">{saveError}</p>}
      </div>
    </div>
  );
}
