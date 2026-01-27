import type React from "react"
import { MasterHeader } from "@/components/master/master-header"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Headquarters Management",
};

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
