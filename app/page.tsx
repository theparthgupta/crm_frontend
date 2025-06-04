import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageSquare,
  Lock,
  Database,
  BarChart,
  Sparkles,
  BrainCircuit,
  Clock,
  Target,
  Tag,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Intelligent Customer Relationship Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A powerful Mini CRM Platform that enables customer segmentation, personalized campaign delivery, and
                    intelligent insights using modern tools and approaches.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="inline-flex items-center gap-2">
                    Explore Features <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="aspect-video overflow-hidden rounded-xl border bg-gradient-to-br from-primary/20 via-muted/50 to-muted shadow-xl">
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <Sparkles className="h-16 w-16 text-primary mb-4" />
                    <h2 className="text-2xl font-bold">Mini CRM Platform</h2>
                    <p className="text-muted-foreground">Intelligent customer engagement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  Core Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Comprehensive CRM Solution</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a complete suite of tools to manage customer relationships, create targeted
                  campaigns, and deliver personalized messages.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-6 w-6 text-primary" />
                    <CardTitle>Data Ingestion</CardTitle>
                  </div>
                  <CardDescription>Easily import customer and order data manually or via an file upload.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Manual entry forms for customers and orders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>File upload UI (supports CSV and JSON formats)</span>
                    </li>
                     <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Supports ingestion of both customer and order data</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle>Segment Creation & Campaign History</CardTitle>
                  </div>
                  <CardDescription>
                    Intuitive interface for defining audience segments and viewing campaign performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Dynamic rule builder with AND/OR logic and preview</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Campaign history list with summary stats</span>
                    </li>
                     <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Redirect to history after segment save</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <CardTitle>Campaign Delivery & Logging</CardTitle>
                  </div>
                  <CardDescription>Automated delivery with logging and tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Automated campaign initiation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Personalized message sending to customers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Simulation of delivery success and failure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Display of summary delivery stats on history page</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-6 w-6 text-primary" />
                    <CardTitle>Authentication</CardTitle>
                  </div>
                  <CardDescription>Secure access control with Google OAuth 2.0 integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Google OAuth 2.0 authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Protected routes for application features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Login/Logout functionality</span>
                    </li>
                     <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Redirection after login/logout</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="ai-features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="px-3 py-1">
                  AI Integration
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Intelligent Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform leverages artificial intelligence to enhance your customer engagement strategies.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    <CardTitle>Natural Language to Segment Rules</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                     <span>AI converts natural language segment descriptions into logical rules.</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <CardTitle>AI-Driven Message Suggestions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                     <span>Feature to generate AI message variants based on campaign objective.</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-6 w-6 text-primary" />
                    <CardTitle>Campaign Performance Summarization</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                     <span>Display of human-readable AI insight summaries on campaign details.</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>Xeno CRM</span>
          </div>
          <p className="text-sm text-muted-foreground md:order-first md:flex-1">
            © {new Date().getFullYear()} Xeno. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
