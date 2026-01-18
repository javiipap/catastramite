import type React from "react"
import { MasterHeader } from "@/components/master-header"

interface Props {
  children: React.ReactNode,
}

export default function MasterLayout({ children }: Props) {
  return (
    <div className="h-screen flex flex-col bg-muted/30">
      <div className="flex-none">
        <MasterHeader />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
