"use client"

import React, { useState, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { 
  Chrome, 
  TrendingUp, 
  Brain, 
  Shield, 
  Zap, 
  Eye, 
  EyeOff, 
  Mail, 
  AlertCircle,
  Loader2
} from "lucide-react"

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const DEMO_CREDENTIALS = {
  email: "demo@trademind.ai",
  password: "password123"
} as const

const MIN_PASSWORD_LENGTH = 6

export function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const validateForm = useCallback((data: FormData): FormErrors => {
    const newErrors: FormErrors = {}
    
    if (!data.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!data.password.trim()) {
      newErrors.password = "Password is required"
    } else if (data.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    }
    
    return newErrors
  }, [])

  const handleInputChange = useCallback((field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }))
      }
    }, [errors])

  const handleSubmit = useCallback(async (
    e: React.FormEvent,
    action: 'signIn' | 'signUp'
  ) => {
    e.preventDefault()
    
    const trimmedData = {
      email: formData.email.trim(),
      password: formData.password.trim()
    }
    
    const formErrors = validateForm(trimmedData)
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      if (action === 'signIn') {
        await signIn(trimmedData.email, trimmedData.password)
        toast({
          title: "Welcome back! 🎉",
          description: "Successfully signed in to TradeMind AI",
        })
      } else {
        await signUp(trimmedData.email, trimmedData.password)
        toast({
          title: "Account created! 🎉",
          description: "Welcome to TradeMind AI",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({
        title: action === 'signIn' ? "Sign in failed" : "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [formData, validateForm, signIn, signUp, toast])

  const handleOAuthSignIn = useCallback(async (provider: 'google' | 'microsoft') => {
    setLoading(true)
    
    try {
      const credentials = provider === 'google' 
        ? { email: "google@trademind.ai", password: "google123" }
        : { email: "microsoft@trademind.ai", password: "microsoft123" }
      
      await signIn(credentials.email, credentials.password)
      toast({
        title: "Welcome! 🎉",
        description: `Successfully signed in with ${provider === 'google' ? 'Google' : 'Microsoft'}`,
      })
    } catch (error) {
      toast({
        title: `${provider === 'google' ? 'Google' : 'Microsoft'} sign in failed`,
        description: `Demo mode: ${provider === 'google' ? 'Google' : 'Microsoft'} OAuth simulation`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [signIn, toast])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const fillDemoCredentials = useCallback(() => {
    setFormData(DEMO_CREDENTIALS)
    setErrors({})
    toast({
      title: "Demo credentials filled",
      description: "Click 'Sign In' to continue with demo account",
    })
  }, [toast])

  const renderPasswordInput = (id: string, placeholder: string) => (
    <div className="space-y-2">
      <Label htmlFor={id}>Password</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={formData.password}
          onChange={handleInputChange('password')}
          required
          disabled={loading}
          minLength={MIN_PASSWORD_LENGTH}
          className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          disabled={loading}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password}</p>
      )}
    </div>
  )

  const renderEmailInput = (id: string) => (
    <div className="space-y-2">
      <Label htmlFor={id}>Email</Label>
      <Input
        id={id}
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange('email')}
        required
        disabled={loading}
        className={errors.email ? 'border-red-500' : ''}
      />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email}</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold">TradeMind AI</h1>
            </div>
            <p className="text-xl text-blue-100">Professional Trading Platform with AI-Powered Insights</p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: TrendingUp,
                color: "text-blue-400",
                title: "Real-time Market Data",
                description: "Live NSE & BSE data with advanced charting"
              },
              {
                icon: Brain,
                color: "text-purple-400",
                title: "AI-Powered Advisory",
                description: "Intelligent recommendations and market insights"
              },
              {
                icon: Shield,
                color: "text-green-400",
                title: "Secure & Compliant",
                description: "Bank-grade security with regulatory compliance"
              },
              {
                icon: Zap,
                color: "text-yellow-400",
                title: "Lightning Fast",
                description: "Ultra-low latency order execution"
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <feature.icon className={`w-6 h-6 ${feature.color} mt-1`} />
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to TradeMind AI</CardTitle>
            <CardDescription>Sign in to access your trading dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Mode Alert */}
            <Alert className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Demo Mode:</strong> This is a demonstration platform. Use any email/password (6+ chars) or click
                the demo button below.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" disabled={loading}>Sign In</TabsTrigger>
                <TabsTrigger value="signup" disabled={loading}>Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={(e) => handleSubmit(e, 'signIn')} className="space-y-4">
                  {renderEmailInput('email')}
                  {renderPasswordInput('password', 'Enter your password (min 6 characters)')}
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={fillDemoCredentials}
                  disabled={loading}
                >
                  Fill Demo Credentials
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={(e) => handleSubmit(e, 'signUp')} className="space-y-4">
                  {renderEmailInput('signup-email')}
                  {renderPasswordInput('signup-password', 'Create a password (min 6 characters)')}
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleOAuthSignIn('microsoft')}
                disabled={loading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Continue with Microsoft
              </Button>
            </div>

            <div className="mt-6 p-3 bg-muted/50 rounded-lg">
              <div className="text-center text-sm">
                <p className="font-medium text-green-600 mb-1">Demo Credentials:</p>
                <p className="text-xs text-muted-foreground">Email: {DEMO_CREDENTIALS.email}</p>
                <p className="text-xs text-muted-foreground">Password: {DEMO_CREDENTIALS.password}</p>
                <p className="text-xs text-muted-foreground mt-2 text-blue-600">
                  Or use any email with 6+ character password
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}