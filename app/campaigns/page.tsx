import { CampaignList } from "@/components/campaign-list"

export default function Campaigns() {

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Campaign History</h1>
      <CampaignList />
    </div>
  )
}
