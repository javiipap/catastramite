import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gavel, Lock, Scroll } from "lucide-react"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bureaucracy for your Bedroom",
  description: "Streamline your power dynamics with official forms, request tracking, and automated compliance auditing. Love deserves paperwork.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Scroll className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">Catastramite</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Protocols</Link>
          <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Tributes</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Member Login</Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="hidden sm:flex">Begin Registration</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 md:py-32 lg:py-40 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center gap-8">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                New: Relationship Contract V2.0
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 dark:from-pink-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent pb-2">
                Bureaucracy for your Bedroom
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Streamline your power dynamics with official forms, request tracking, and automated compliance auditing. Love deserves paperwork.
              </p>

              {/* Hero Image */}
              <div className="relative w-full max-w-lg aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border bg-muted">
                <Image
                  src="/hero-image.jpg"
                  alt="Couple reviewing a contract"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                <Link href="/login">
                  <Button size="lg" className="h-12 px-8 text-base">
                    File a Request <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    See Example Contracts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/50 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="flex flex-col gap-4 p-6 bg-background rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                  <Scroll className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Rapid Processing</h3>
                <p className="text-muted-foreground">Submit permission requests for dates, purchases, or freetime and get approval in record time.</p>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-background rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Total Privacy</h3>
                <p className="text-muted-foreground">Your secrets, contracts, and disciplinary records are locked away from prying eyes.</p>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-background rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                  <Gavel className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Strict Enforcement</h3>
                <p className="text-muted-foreground">Never miss a deadline or duty. Our system automatically issues demerits for non-compliance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Paperwork in Action</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See how easy it is to formalize your affection. Browse our library of standard forms.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Demo Card 1 */}
              <div className="border rounded-xl overflow-hidden shadow-sm bg-background flex flex-col">
                <div className="bg-muted p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scroll className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">FORM-802B</span>
                  </div>
                  <div className="rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 text-xs font-medium">Approved</div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <h3 className="font-semibold text-lg">Application for Night Out</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between pb-2 border-b border-dashed">
                      <span>Applicant:</span>
                      <span className="font-medium text-foreground">Slave Unit 1</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-dashed">
                      <span>Duration:</span>
                      <span className="font-medium text-foreground">4 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reason:</span>
                      <span className="font-medium text-foreground">Recreational Maintenance</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 border-t text-center">
                  <p className="text-xs text-muted-foreground italic">Signed by Master Control • 2 hrs ago</p>
                </div>
              </div>

              {/* Demo Card 2 */}
              <div className="border rounded-xl overflow-hidden shadow-md bg-background flex flex-col transform md:-translate-y-4 ring-2 ring-primary/20">
                <div className="bg-primary/5 p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scroll className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs text-primary">FORM-114A</span>
                  </div>
                  <div className="rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 text-xs font-medium">Pending Review</div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <h3 className="font-semibold text-lg">Video Game Purchase Request</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between pb-2 border-b border-dashed">
                      <span>Item:</span>
                      <span className="font-medium text-foreground">Elden Ring DLC</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-dashed">
                      <span>Cost:</span>
                      <span className="font-medium text-foreground">$39.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Justification:</span>
                      <span className="font-medium text-foreground">Good Behavior Reward</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 border-t flex gap-2">
                  <Button className="w-full h-8 text-xs" variant="default">Approve</Button>
                  <Button className="w-full h-8 text-xs" variant="outline">Deny</Button>
                </div>
              </div>

              {/* Demo Card 3 */}
              <div className="border rounded-xl overflow-hidden shadow-sm bg-background flex flex-col opacity-80 hover:opacity-100 transition-opacity">
                <div className="bg-muted p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scroll className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">FORM-99X</span>
                  </div>
                  <div className="rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 text-xs font-medium">Rejected</div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <h3 className="font-semibold text-lg">Dishwashing Exemption</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between pb-2 border-b border-dashed">
                      <span>Type:</span>
                      <span className="font-medium text-foreground">Temporary Relief</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-dashed">
                      <span>Duration:</span>
                      <span className="font-medium text-foreground">One Evening</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reason:</span>
                      <span className="font-medium text-foreground">&quot;Tired&quot;</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border-t text-center">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">Denied: Insufficient Merit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light"></div>
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to sign the dotted line?</h2>
              <p className="text-primary-foreground/80 max-w-xl text-lg">Join other couples who have found peace through rigid administrative structure.</p>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="mt-4 font-semibold">
                  Create Relationship Entity
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Catastramite. All rights reserved.</p>
      </footer>
    </div>
  )
}
