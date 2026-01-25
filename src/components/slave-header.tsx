"use client"

import { useAuth } from "@/lib/auth/context"
import { HeadquartersSelector } from "@/components/headquarters-selector"
import { Button } from "@/components/ui/button"
import { Building2, LogOut, User, ArrowLeftRight } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlaveNav } from "@/components/slave-nav"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { logoutAction } from "@/lib/actions/auth"

interface SlaveHeaderProps {
  headquartersId: string
}

export function SlaveHeader({ headquartersId }: SlaveHeaderProps) {
  const { subject: user } = useAuth()

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="px-2 py-6">
                <div className="flex items-center gap-2 mb-8 px-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">Catastramite</span>
                </div>
                <SlaveNav headquartersId={headquartersId} />
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2 px-2">Current Headquarters</p>
                  <div className="px-2">
                    <HeadquartersSelector />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary hidden md:block" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Catastramite</h1>
              <p className="text-xs text-muted-foreground">Slave Portal</p>
            </div>
          </div>
          <div className="hidden md:block ml-4 pl-4 border-l">
            <HeadquartersSelector />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/master/${headquartersId}/dashboard`} className="cursor-pointer">
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  Switch to Admin View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logoutAction()} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
