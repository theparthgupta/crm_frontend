import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Mini CRM</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Create targeted marketing campaigns with our powerful segment builder and track their performance.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/campaigns/new">Create Campaign</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/campaigns">View Campaigns</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}
