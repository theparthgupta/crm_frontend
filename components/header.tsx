"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import Cookies from 'js-cookie';

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('authToken');
    router.push('/login');
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Mini CRM
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/campaigns"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/campaigns" ? "text-primary" : "text-muted-foreground"}`}
            >
              Campaigns
            </Link>
            <Link
              href="/campaigns/new"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/campaigns/new" ? "text-primary" : "text-muted-foreground"}`}
            >
              New Campaign
            </Link>
          </nav>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  )
}
