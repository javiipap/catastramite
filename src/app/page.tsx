import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">Catastramite</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="hidden sm:flex">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 md:py-32 lg:py-40 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center gap-8">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                New: AI-Powered Automation
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent pb-2">
                Simplify your administrative procedures
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Catastramite streamlines complex bureaucratic workflows, enabling your organization to process requests faster and more securely than ever before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                <Link href="/login">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Start Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    View Demo
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
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground">Process applications and requests in real-time with our optimized workflow engine.</p>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-background rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Bank-Grade Security</h3>
                <p className="text-muted-foreground">Your data is protected with state-of-the-art encryption and role-based access control.</p>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-background rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Automated Compliance</h3>
                <p className="text-muted-foreground">Never worry about regulations. Our system updates automatically to keep you compliant.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light"></div>
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to modernize your administration?</h2>
              <p className="text-primary-foreground/80 max-w-xl text-lg">Join thousands of organizations using Catastramite to deliver better public services.</p>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="mt-4 font-semibold">
                  Create your Headquarters
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
