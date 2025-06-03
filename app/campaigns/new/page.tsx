"use client";

import { CampaignForm } from "@/components/campaign-form"

export default function NewCampaign() {

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>
      <CampaignForm />
    </div>
  )
}
