import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldAlert, Cpu, Bot, Activity } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy text-foreground selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Extras */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />

      {/* Navbar */}
      <header className="fixed top-0 w-full border-b border-white/5 bg-navy/80 backdrop-blur-md z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-white group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <span className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 border border-indigo-400/20">
                <ShieldAlert size={22} className="drop-shadow-md" />
              </span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              CommanderD
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/signin">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-200">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="hidden md:flex bg-white/5 border border-white/10 hover:bg-white/10 text-white backdrop-blur-sm shadow-sm hover:shadow-indigo-500/20 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 relative z-10 w-full max-w-7xl mx-auto">
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none opacity-60 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[130px] -z-10 pointer-events-none" />

        <div className="max-w-4xl space-y-8 animate-fade-in-up">
          {/* Version Badge */}
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-200 backdrop-blur-sm shadow-lg shadow-indigo-500/10 mb-6 group cursor-default hover:border-indigo-400/50 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
            <span className="font-medium tracking-wide">v2.0 System Online</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] drop-shadow-2xl">
            <span className="text-white">Denounce the</span>{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Downtime.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            Automated incident intelligence for high-velocity DevOps teams.
            Turn chaos into <span className="text-indigo-300 font-medium">structured resolution</span> in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500 animate-glow-pulse" />
              <Link href="/dashboard">
                <Button size="lg" className="relative h-14 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-lg font-medium shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  Open Command Center <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <Link href="/docs">
              <Button variant="ghost" size="lg" className="h-14 px-8 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl text-lg transition-all duration-200">
                Documentation
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left px-4">
          {[
            {
              icon: Cpu,
              title: "Real-time Analysis",
              desc: "Ingest millions of logs instantly. Our engine detects anomalies before they become outages.",
              color: "text-cyan-400"
            },
            {
              icon: Bot,
              title: "Autonomous Root Cause",
              desc: "GPT-4 powered logic pinpoints the exact commit and line of code responsible for the failure.",
              color: "text-indigo-400"
            },
            {
              icon: Activity,
              title: "Predictive Risk Scoring",
              desc: "Dynamic severity classification based on SLA impact and historical incident data.",
              color: "text-purple-400"
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl border border-white/5 bg-navy-light/40 backdrop-blur-md hover:bg-navy-light/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 ring-1 ring-white/10 group-hover:ring-${feature.color}/50 transition-all`}>
                <feature.icon className={`h-8 w-8 ${feature.color} drop-shadow-md`} />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                {feature.title}
              </h3>

              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-navy-light/20 backdrop-blur-sm py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-slate-500 text-sm">
            © 2026 CommanderD Inc. <span className="mx-2">•</span> Built for Hackathon
          </div>
          <div className="flex gap-6">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">Privacy</Button>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">Terms</Button>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">GitHub</Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
