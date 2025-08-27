'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const testSupabase = async () => {
    try {
      setStatus('Testing Supabase connection...')
      const { data, error } = await supabase.from('test').select('*').limit(1)
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist"
        setStatus(`Supabase Error: ${error.message}`)
      } else {
        setStatus('Supabase connected successfully! 🎉')
      }
    } catch (err) {
      setStatus(`Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Next.js + Supabase + Tailwind + shadcn/ui
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Your full-stack development setup is ready! 🚀
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Technology Stack Card */}
          <Card>
            <CardHeader>
              <CardTitle>🛠️ Technology Stack</CardTitle>
              <CardDescription>
                Everything you need to build modern web applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <span className="font-medium">Next.js 15</span>
                <span className="text-sm text-slate-500">- React Framework</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Supabase</span>
                <span className="text-sm text-slate-500">- Database & Auth</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="font-medium">Tailwind CSS</span>
                <span className="text-sm text-slate-500">- Styling</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
                <span className="font-medium">shadcn/ui</span>
                <span className="text-sm text-slate-500">- Components</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-medium">Bun</span>
                <span className="text-sm text-slate-500">- Package Manager</span>
              </div>
            </CardContent>
          </Card>

          {/* Test Supabase Connection Card */}
          <Card>
            <CardHeader>
              <CardTitle>🔗 Test Supabase Connection</CardTitle>
              <CardDescription>
                Verify your Supabase configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testSupabase} className="w-full">
                Test Connection
              </Button>
              {status && (
                <div className={`p-3 rounded-md text-sm ${
                  status.includes('Error') 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : status.includes('successfully')
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {status}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demo Form Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>📝 Demo Form</CardTitle>
              <CardDescription>
                This form demonstrates shadcn/ui components with Tailwind styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <Input
                    id="message"
                    placeholder="Type something here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => alert(`You typed: ${message}`)}
                    disabled={!message.trim()}
                    className="w-full"
                  >
                    Submit Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🚀 Next Steps</CardTitle>
            <CardDescription>
              Ready to start building? Here's what you can do:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2">1. Configure Supabase</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Update your <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">.env.local</code> file with your Supabase credentials
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2">2. Add More Components</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Run <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">bunx shadcn@latest add [component]</code> to add more UI components
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold mb-2">3. Start Building</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Create your database schema, add authentication, and build your app!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
