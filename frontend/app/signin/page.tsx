"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldAlert, Github, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignInPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate authentication delay
        setTimeout(() => {
            setIsLoading(false)
            router.push("/dashboard")
        }, 1500)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-navy text-foreground relative overflow-hidden">
            {/* Background Extras */}
            <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Back Button */}
            <div className="absolute top-8 left-8 z-20">
                <Link href="/">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Landing
                    </Button>
                </Link>
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/20">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="bg-indigo-600/10 p-3 rounded-xl ring-1 ring-indigo-500/20 mb-4 shadow-lg shadow-indigo-500/10">
                            <ShieldAlert className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                            Sign in to CommanderD
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Access your incident intelligence dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="devops@company.com"
                                className="bg-navy/50 border-slate-border text-white placeholder:text-slate-600 focus:ring-indigo-500 focus:border-indigo-500 h-11"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-navy/50 border-slate-border text-white placeholder:text-slate-600 focus:ring-indigo-500 focus:border-indigo-500 h-11"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" className="border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
                            <Label htmlFor="remember" className="text-sm text-slate-400 font-normal cursor-pointer">Remember me for 30 days</Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0f1623] px-2 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full h-11 border-slate-border bg-transparent text-slate-300 hover:text-white hover:bg-white/5 hover:border-slate-500 transition-all">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                    </Button>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
