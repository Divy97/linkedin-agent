'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Linkedin, MessageSquare, Users, Zap, Settings, AlertCircle, CheckCircle2, User, Loader2, RefreshCw } from 'lucide-react'
import { scrapeLinkedInProfile } from '@/lib/linkedin-scraper'

interface LinkedInConnection {
  cookie: string
  userAgent: string
  connected: boolean
}

interface LinkedInProfile {
  name: string
  headline: string
  profilePhoto: string
  publicIdentifier: string
}

export default function Home() {
  const [linkedinConnection, setLinkedinConnection] = useState<LinkedInConnection>({
    cookie: '',
    userAgent: '',
    connected: false
  })
  const [linkedinProfile, setLinkedinProfile] = useState<LinkedInProfile | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'agent', message: string}>>([])
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    // Check if LinkedIn connection exists in localStorage
    const savedConnection = localStorage.getItem('linkedin-connection')
    const savedProfile = localStorage.getItem('linkedin-profile')
    
    if (savedConnection) {
      const connection = JSON.parse(savedConnection)
      if (connection.cookie && connection.userAgent) {
        setLinkedinConnection({...connection, connected: true})
      }
    }
    
    if (savedProfile) {
      setLinkedinProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleLinkedInConnect = async () => {
    if (linkedinConnection.cookie && linkedinConnection.userAgent) {
      setIsLoadingProfile(true)
      setProfileError(null)
      
      try {
        // Scrape profile data
        const profileData = await scrapeLinkedInProfile(linkedinConnection.cookie, linkedinConnection.userAgent)
        
        if (profileData) {
          const connection = {
            ...linkedinConnection,
            connected: true
          }
          setLinkedinConnection(connection)
          setLinkedinProfile(profileData)
          
          // Save to localStorage
          localStorage.setItem('linkedin-connection', JSON.stringify(connection))
          localStorage.setItem('linkedin-profile', JSON.stringify(profileData))
          
          setIsConnectDialogOpen(false)
        } else {
          setProfileError('Failed to fetch profile data. Please check your cookies and try again.')
        }
      } catch (error) {
        setProfileError('Error connecting to LinkedIn. Please verify your credentials.')
        console.error('Connection error:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }
  }

  const handleDisconnect = () => {
    setLinkedinConnection({
      cookie: '',
      userAgent: '',
      connected: false
    })
    setLinkedinProfile(null)
    localStorage.removeItem('linkedin-connection')
    localStorage.removeItem('linkedin-profile')
  }

  const handleRefreshProfile = async () => {
    if (linkedinConnection.connected) {
      setIsLoadingProfile(true)
      setProfileError(null)
      
      try {
        const profileData = await scrapeLinkedInProfile(linkedinConnection.cookie, linkedinConnection.userAgent)
        
        if (profileData) {
          setLinkedinProfile(profileData)
          localStorage.setItem('linkedin-profile', JSON.stringify(profileData))
        } else {
          setProfileError('Failed to refresh profile data.')
        }
      } catch (error) {
        setProfileError('Error refreshing profile data.')
        console.error('Refresh error:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }
  }

  const handleSendMessage = () => {
    if (!linkedinConnection.connected) {
      setIsConnectDialogOpen(true)
      return
    }

    if (!chatMessage.trim()) return

    const newMessage = { role: 'user' as const, message: chatMessage }
    setChatHistory(prev => [...prev, newMessage])
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse = { 
        role: 'agent' as const, 
        message: `I understand you want to: "${chatMessage}". I'll help you automate this LinkedIn task. Let me process this request...` 
      }
      setChatHistory(prev => [...prev, agentResponse])
    }, 1000)

    setChatMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-xl shadow-sm">
                <Linkedin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">LinkedIn Agent</h1>
                <p className="text-sm text-muted-foreground">Automate your LinkedIn workflow</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Profile Display */}
              {linkedinConnection.connected && linkedinProfile && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={linkedinProfile.profilePhoto} alt={linkedinProfile.name} />
                    <AvatarFallback>
                      {linkedinProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{linkedinProfile.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {linkedinProfile.headline}
                    </p>
                  </div>
                </div>
              )}

              {linkedinConnection.connected ? (
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="border-secondary/50 text-secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              )}
              
              <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant={linkedinConnection.connected ? "outline" : "default"} className="bg-primary hover:bg-primary/90 text-primary-foreground border-none">
                    <Settings className="h-4 w-4 mr-2" />
                    {linkedinConnection.connected ? 'Manage' : 'Connect LinkedIn'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {linkedinConnection.connected ? 'Manage LinkedIn Connection' : 'Connect Your LinkedIn Account'}
                    </DialogTitle>
                    <DialogDescription>
                      {linkedinConnection.connected 
                        ? 'View your profile and manage your LinkedIn connection'
                        : 'Enter your LinkedIn session cookie and user-agent to enable automation'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  {linkedinConnection.connected ? (
                    /* Connected State - Show Profile */
                    <div className="space-y-6">
                      {/* Profile Section */}
                      <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {isLoadingProfile ? (
                            <Skeleton className="h-16 w-16 rounded-full" />
                          ) : (
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={linkedinProfile?.profilePhoto} alt={linkedinProfile?.name} />
                              <AvatarFallback>
                                <User className="h-8 w-8" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex-1">
                            {isLoadingProfile ? (
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {linkedinProfile?.name || 'Unknown User'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {linkedinProfile?.headline || 'No headline available'}
                                </p>
                                {linkedinProfile?.publicIdentifier && (
                                  <p className="text-xs text-primary">
                                    linkedin.com/in/{linkedinProfile.publicIdentifier}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={handleRefreshProfile}
                          variant="outline"
                          size="sm"
                          disabled={isLoadingProfile}
                        >
                          {isLoadingProfile ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {profileError && (
                        <Alert className="border-secondary/30 bg-secondary/10">
                          <AlertCircle className="h-4 w-4 text-secondary" />
                          <AlertDescription className="text-secondary">
                            {profileError}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleDisconnect}
                          variant="outline"
                          className="flex-1 border-secondary/50 text-secondary hover:bg-secondary/10"
                        >
                          Disconnect Account
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Not Connected State - Show Connection Form */
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cookie" className="block text-sm font-medium mb-2">
                          LinkedIn Session Cookie
                        </label>
                        <Textarea
                          id="cookie"
                          placeholder="li_at=AQEDARe...; JSESSIONID=..."
                          value={linkedinConnection.cookie}
                          onChange={(e) => setLinkedinConnection(prev => ({...prev, cookie: e.target.value}))}
                          className="min-h-[80px] roboto-mono text-xs"
                        />
                      </div>
                      <div>
                        <label htmlFor="userAgent" className="block text-sm font-medium mb-2">
                          User Agent
                        </label>
                        <Input
                          id="userAgent"
                          placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
                          value={linkedinConnection.userAgent}
                          onChange={(e) => setLinkedinConnection(prev => ({...prev, userAgent: e.target.value}))}
                          className="roboto-mono text-xs"
                        />
                      </div>

                      {profileError && (
                        <Alert className="border-secondary/30 bg-secondary/10">
                          <AlertCircle className="h-4 w-4 text-secondary" />
                          <AlertDescription className="text-secondary">
                            {profileError}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button 
                        onClick={handleLinkedInConnect}
                        disabled={!linkedinConnection.cookie || !linkedinConnection.userAgent || isLoadingProfile}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isLoadingProfile ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting & Fetching Profile...
                          </>
                        ) : (
                          'Connect & Verify Profile'
                        )}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Features */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border bg-card/90 backdrop-blur-sm shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>What I Can Do</span>
                </CardTitle>
                <CardDescription>
                  Automate your LinkedIn activities with simple commands
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 text-secondary mt-1" />
                  <div>
                    <p className="text-sm font-medium">Smart Messaging</p>
                    <p className="text-xs text-muted-foreground">Send personalized messages and congratulations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-4 w-4 text-secondary mt-1" />
                  <div>
                    <p className="text-sm font-medium">Connection Requests</p>
                    <p className="text-xs text-muted-foreground">Send targeted connection requests with custom notes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Linkedin className="h-4 w-4 text-secondary mt-1" />
                  <div>
                    <p className="text-sm font-medium">Profile Engagement</p>
                    <p className="text-xs text-muted-foreground">Like posts, comment, and engage with your network</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/90 backdrop-blur-sm shadow-sm">
              <CardHeader>
                <CardTitle>Example Commands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary">
                    &ldquo;Send connection requests to 10 people working at Google&rdquo;
                  </p>
                </div>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary">
                    &ldquo;Message John Smith congratulations on his new role&rdquo;
                  </p>
                </div>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary">
                    &ldquo;Find and connect with Growth marketers in San Francisco&rdquo;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card/90 backdrop-blur-sm shadow-sm h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>LinkedIn Agent Chat</span>
                </CardTitle>
                <CardDescription>
                  Tell me what you&apos;d like to do on LinkedIn, and I&apos;ll automate it for you
                </CardDescription>
              </CardHeader>
              
              {!linkedinConnection.connected && (
                <div className="px-6 pb-4">
                  <Alert className="border-secondary/30 bg-secondary/10">
                    <AlertCircle className="h-4 w-4 text-secondary" />
                    <AlertDescription className="text-secondary">
                      Please connect your LinkedIn account first to start using the agent
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <CardContent className="flex-1 flex flex-col">
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
                  {chatHistory.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <p>Start a conversation with your LinkedIn Agent</p>
                        <p className="text-sm mt-2">Try: &ldquo;Send connection requests to 5 people at GrowthX&rdquo;</p>
                      </div>
                    </div>
                  ) : (
                    chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          chat.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-foreground border border-border'
                        }`}>
                          <p className="text-sm">{chat.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder={linkedinConnection.connected ? "What would you like me to do on LinkedIn?" : "Connect LinkedIn first to start chatting..."}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!linkedinConnection.connected}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() || !linkedinConnection.connected}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
