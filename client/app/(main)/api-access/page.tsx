"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Terminal,
  Play,
  RefreshCw,
  Sliders,
  Cpu,
  Layers,
  Lock,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Info,
  ExternalLink,
  Code,
  FileCode,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Clock,
  Database,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Define TypeScript interfaces for our state structures
interface ApiKey {
  id: string;
  name: string;
  key: string;
  scope: "Read-only" | "Read-Write" | "Admin";
  expiry: string;
  created: string;
  status: "Active" | "Revoked";
}

export default function ApiAccessPage() {
  // --- STATE MANAGEMENT ---
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "key_1",
      name: "Default Development Key",
      key: "sk-prv-••••••••••••••••a1b2",
      scope: "Admin",
      expiry: "Never",
      created: "2026-07-13",
      status: "Active"
    },
    {
      id: "key_2",
      name: "Production Client Web",
      key: "sk-prv-••••••••••••••••f9c8",
      scope: "Read-Write",
      expiry: "2026-10-16",
      created: "2026-07-15",
      status: "Active"
    }
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScope, setNewKeyScope] = useState<"Read-only" | "Read-Write" | "Admin">("Read-Write");
  const [newKeyExpiry, setNewKeyExpiry] = useState("30");
  const [showKeyGenerator, setShowKeyGenerator] = useState(false);
  const [generatedKeyVisible, setGeneratedKeyVisible] = useState<string | null>(null);
  
  // Playground States
  const [selectedEndpoint, setSelectedEndpoint] = useState("/v1/chat/completions");
  const [selectedModel, setSelectedModel] = useState("llama-3-8b-instruct");
  const [temperature, setTemperature] = useState<number[]>([0.7]);
  const [maxTokens, setMaxTokens] = useState<string>("1024");
  const [systemPrompt, setSystemPrompt] = useState("You are an advanced, secure private AI model assistant.");
  const [streamResponse, setStreamResponse] = useState(true);
  const [playgroundApiKey, setPlaygroundApiKey] = useState("key_1");
  const [customUserPrompt, setCustomUserPrompt] = useState("Explain the difference between local and cloud LLMs.");
  
  // Terminal Response Simulator States
  const [requestRunning, setRequestRunning] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string>("");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("curl");
  
  // Usage tracking states (simulating live telemetry)
  const [usageRequests, setUsageRequests] = useState(384);
  const [usageTokens, setUsageTokens] = useState(189420);
  const [rateLimitPercent, setRateLimitPercent] = useState(38.4);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);

  // Clipboard feedback indicators
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedCodeText, setCopiedCodeText] = useState(false);

  // Typewriter effect ref
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup typewriter interval on unmount
  useEffect(() => {
    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
      }
    };
  }, []);

  // --- ACTIONS & HANDLERS ---
  
  // Telemetry refresh simulator
  const handleRefreshTelemetry = () => {
    setIsRefreshingTelemetry(true);
    setTimeout(() => {
      setUsageRequests(prev => prev + Math.floor(Math.random() * 8) + 1);
      setUsageTokens(prev => prev + Math.floor(Math.random() * 4000) + 1200);
      setRateLimitPercent(prev => Math.min(100, parseFloat((prev + Math.random() * 2).toFixed(1))));
      setIsRefreshingTelemetry(false);
      toast.success("Usage statistics updated successfully.");
    }, 800);
  };

  // API Key Generator Handler
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error("Please enter a descriptive name for your API key.");
      return;
    }

    // Generate random mock key characters
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomStr = "";
    for (let i = 0; i < 20; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const rawKey = `sk-prv-${randomStr}`;
    const maskedKey = `sk-prv-••••••••••••••••${randomStr.slice(-4)}`;

    const dateToday = new Date().toISOString().split("T")[0];
    let expiryStr = "Never";
    if (newKeyExpiry !== "never") {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(newKeyExpiry, 10));
      expiryStr = expiryDate.toISOString().split("T")[0];
    }

    const newKeyObject: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: maskedKey,
      scope: newKeyScope,
      expiry: expiryStr,
      created: dateToday,
      status: "Active"
    };

    setKeys([newKeyObject, ...keys]);
    setGeneratedKeyVisible(rawKey); // Temporarily store raw key to show user once
    setNewKeyName("");
    toast.success("New API key generated successfully.");
  };

  // Revoke API Key Handler
  const handleRevokeKey = (id: string) => {
    setKeys(keys.map(k => {
      if (k.id === id) {
        return { ...k, status: "Revoked" as const };
      }
      return k;
    }));
    toast.warning("API key has been revoked.");
  };

  // Copy API key utility
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    toast.success("API key copied to clipboard.");
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  };

  // Dynamic code snippet builder based on playground values
  const getCodeSnippet = () => {
    const selectedKeyObject = keys.find(k => k.id === playgroundApiKey) || keys[0];
    const keyString = selectedKeyObject ? selectedKeyObject.key : "sk-prv-your-api-key-here";
    const tempVal = temperature[0];
    const maxTokensVal = parseInt(maxTokens) || 1024;

    switch (activeTab) {
      case "curl":
        if (selectedEndpoint === "/v1/chat/completions") {
          return `curl https://api.privgptstudio.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${keyString}" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [
      {"role": "system", "content": "${systemPrompt}"},
      {"role": "user", "content": "${customUserPrompt}"}
    ],
    "temperature": ${tempVal},
    "max_tokens": ${maxTokensVal},
    "stream": ${streamResponse}
  }'`;
        } else if (selectedEndpoint === "/v1/embeddings") {
          return `curl https://api.privgptstudio.com/v1/embeddings \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${keyString}" \\
  -d '{
    "model": "text-embedding-ada-002",
    "input": "${customUserPrompt}"
  }'`;
        } else {
          return `curl https://api.privgptstudio.com/v1/models \\
  -H "Authorization: Bearer ${keyString}"`;
        }

      case "js":
        if (selectedEndpoint === "/v1/chat/completions") {
          return `const response = await fetch("https://api.privgptstudio.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${keyString}"
  },
  body: JSON.stringify({
    model: "${selectedModel}",
    messages: [
      { role: "system", content: "${systemPrompt}" },
      { role: "user", content: "${customUserPrompt}" }
    ],
    temperature: ${tempVal},
    max_tokens: ${maxTokensVal},
    stream: ${streamResponse}
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`;
        } else if (selectedEndpoint === "/v1/embeddings") {
          return `const response = await fetch("https://api.privgptstudio.com/v1/embeddings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${keyString}"
  },
  body: JSON.stringify({
    model: "text-embedding-ada-002",
    input: "${customUserPrompt}"
  })
});

const data = await response.json();
console.log(data.data[0].embedding);`;
        } else {
          return `const response = await fetch("https://api.privgptstudio.com/v1/models", {
  headers: {
    "Authorization": "Bearer ${keyString}"
  }
});

const data = await response.json();
console.log(data);`;
        }

      case "python":
        if (selectedEndpoint === "/v1/chat/completions") {
          return `import requests

url = "https://api.privgptstudio.com/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${keyString}"
}
data = {
    "model": "${selectedModel}",
    "messages": [
        {"role": "system", "content": "${systemPrompt}"},
        {"role": "user", "content": "${customUserPrompt}"}
    ],
    "temperature": ${tempVal},
    "max_tokens": ${maxTokensVal},
    "stream": ${streamResponse}
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result["choices"][0]["message"]["content"])`;
        } else if (selectedEndpoint === "/v1/embeddings") {
          return `import requests

url = "https://api.privgptstudio.com/v1/embeddings"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${keyString}"
}
data = {
    "model": "text-embedding-ada-002",
    "input": "${customUserPrompt}"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result["data"][0]["embedding"])`;
        } else {
          return `import requests

url = "https://api.privgptstudio.com/v1/models"
headers = {
    "Authorization": "Bearer ${keyString}"
}

response = requests.get(url, headers=headers)
models = response.json()
print(models)`;
        }
      default:
        return "";
    }
  };

  // Copy code snippet utility
  const copyCodeSnippet = () => {
    const text = getCodeSnippet();
    navigator.clipboard.writeText(text);
    setCopiedCodeText(true);
    toast.success("Code snippet copied to clipboard.");
    setTimeout(() => {
      setCopiedCodeText(false);
    }, 2000);
  };

  // Run Test Request API Simulation Handler
  const handleRunRequest = () => {
    const activeKey = keys.find(k => k.id === playgroundApiKey);
    if (!activeKey || activeKey.status === "Revoked") {
      setResponseStatus(401);
      setResponseTime(15);
      setResponseOutput(JSON.stringify({
        error: {
          message: "Incorrect API key provided or key has been revoked. Ensure key status is active.",
          type: "invalid_request_error",
          code: "unauthorized_key"
        }
      }, null, 2));
      toast.error("API request failed: Unauthorized.");
      return;
    }

    setRequestRunning(true);
    setResponseOutput("");
    setResponseStatus(null);
    setResponseTime(null);

    // Dynamic mock outcomes depending on settings
    const mockLatency = Math.floor(Math.random() * 350) + 150; // 150ms to 500ms
    
    setTimeout(() => {
      setResponseStatus(200);
      setResponseTime(mockLatency);
      
      let finalJsonStr = "";
      if (selectedEndpoint === "/v1/chat/completions") {
        const mockResponses = [
          `As a private assistant model, I am running inside your dedicated secure instance. Based on your prompt, local models offer extreme data isolation while cloud models provide high elasticity. PrivGPT Studio integrates both layers so that sensitive PII logs never leak outside your security perimeter.`,
          `API handshake completed. Your parameter inputs of temperature=${temperature[0]} and model=${selectedModel} are initialized. PrivGPT ensures low-latency execution by caching weights in specialized GPU layers.`,
          `This response is simulated live. In a real integration, PrivGPT relays this prompt directly to the underlying model provider (like Ollama for local or Anthropic/OpenAI for cloud-routed queries) depending on your router rules.`
        ];
        const selectedResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        const mockResultObj = {
          id: `chatcmpl-${Math.random().toString(36).substring(2, 11)}`,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: selectedModel,
          usage: {
            prompt_tokens: Math.floor(customUserPrompt.length / 4) + 10,
            completion_tokens: Math.floor(selectedResponse.length / 4),
            total_tokens: Math.floor(customUserPrompt.length / 4) + Math.floor(selectedResponse.length / 4) + 10
          },
          choices: [
            {
              message: {
                role: "assistant",
                content: selectedResponse
              },
              logprobs: null,
              finish_reason: "stop",
              index: 0
            }
          ]
        };
        finalJsonStr = JSON.stringify(mockResultObj, null, 2);

      } else if (selectedEndpoint === "/v1/embeddings") {
        const mockEmbeddingObj = {
          object: "list",
          data: [
            {
              object: "embedding",
              index: 0,
              embedding: [
                0.00230612, -0.01549293, 0.02450912, -0.00392091, 0.01129381, 
                -0.03849102, 0.00789211, -0.02340103, 0.04012048, -0.01829023
              ]
            }
          ],
          model: "text-embedding-ada-002",
          usage: {
            prompt_tokens: Math.floor(customUserPrompt.length / 4),
            total_tokens: Math.floor(customUserPrompt.length / 4)
          }
        };
        finalJsonStr = JSON.stringify(mockEmbeddingObj, null, 2);

      } else {
        // Models list endpoint
        const mockModelsObj = {
          object: "list",
          data: [
            { id: "llama-3-8b-instruct", object: "model", created: 1713432000, owned_by: "meta" },
            { id: "mistral-7b-v0.2", object: "model", created: 1711281600, owned_by: "mistral" },
            { id: "phi-3-mini-4k", object: "model", created: 1715856000, owned_by: "microsoft" },
            { id: "text-embedding-ada-002", object: "model", created: 1671364800, owned_by: "openai" }
          ]
        };
        finalJsonStr = JSON.stringify(mockModelsObj, null, 2);
      }

      // Simulate typewriter effect output
      let currentIndex = 0;
      const speed = streamResponse ? 8 : 2; // faster if not streaming, to output JSON quickly
      
      if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
      
      typewriterIntervalRef.current = setInterval(() => {
        if (currentIndex < finalJsonStr.length) {
          const sliceSize = streamResponse ? 4 : 15;
          setResponseOutput(prev => prev + finalJsonStr.slice(currentIndex, currentIndex + sliceSize));
          currentIndex += sliceSize;
        } else {
          if (typewriterIntervalRef.current) {
            clearInterval(typewriterIntervalRef.current);
          }
          setRequestRunning(false);
          // Increment mock telemetry to reflect developer test action
          setUsageRequests(prev => prev + 1);
          setUsageTokens(prev => prev + (selectedEndpoint === "/v1/chat/completions" ? 180 : 15));
          toast.success("Request processed successfully.");
        }
      }, speed);

    }, mockLatency);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Developer Hub
            </Badge>
            <span className="text-xs text-muted-foreground">• API Version 1.4.2</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">API Access & Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage credentials, test integrations, and monitor rate limits for your PrivGPT Studio services.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleRefreshTelemetry}
            disabled={isRefreshingTelemetry}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshingTelemetry ? "animate-spin" : ""}`} />
            Sync Telemetry
          </Button>
          <Button 
            size="sm" 
            onClick={() => setShowKeyGenerator(!showKeyGenerator)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showKeyGenerator ? "Close Form" : "Create API Key"}
          </Button>
        </div>
      </div>

      {/* METRIC GRAPH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              API Requests
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{usageRequests.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${Math.min(100, (usageRequests / 1000) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Used this month</span>
              <span>1,000 max quota</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              Token Usage
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{usageTokens.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${Math.min(100, (usageTokens / 500000) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Token consumption</span>
              <span>500k limits</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              Rate Limit Capacity
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{rateLimitPercent}%</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-purple-500 transition-all duration-500" 
                style={{ width: `${rateLimitPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>RPM Limit utilization</span>
              <span>60 Requests/Min</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: KEY MANAGER & DOCUMENTATION */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* MOCK KEY GENERATOR COLLAPSIBLE */}
          {showKeyGenerator && (
            <Card className="border border-primary/20 bg-primary/5 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Generate Developer Key
                </CardTitle>
                <CardDescription>
                  This secret key can bypass authentication dialogs. Guard it with caution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateApiKey} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Key Name</label>
                    <Input
                      placeholder="e.g. Server Side Webhook Listener"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Key Scope / Permission</label>
                      <Select 
                        value={newKeyScope} 
                        onValueChange={(val) => setNewKeyScope(val as "Read-only" | "Read-Write" | "Admin")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Read-only">Read-only (Query logs, inspect models)</SelectItem>
                          <SelectItem value="Read-Write">Read-Write (Run chat inferences)</SelectItem>
                          <SelectItem value="Admin">Admin (Full administrative configurations)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiration Period</label>
                      <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Expiry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 Days (Temporary test session)</SelectItem>
                          <SelectItem value="30">30 Days (Standard token)</SelectItem>
                          <SelectItem value="90">90 Days (Quarterly rotation)</SelectItem>
                          <SelectItem value="never">Never expire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setShowKeyGenerator(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Generate Secret Token
                    </Button>
                  </div>
                </form>

                {/* TEMPORARY ONE-TIME KEY REVEAL PANEL */}
                {generatedKeyVisible && (
                  <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          Secret Key Generated Successfully!
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Please copy this key now. For your security, you won&apos;t be able to see it again.
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/20"
                        onClick={() => copyToClipboard(generatedKeyVisible, "raw-generated")}
                      >
                        {copiedKeyId === "raw-generated" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="font-mono text-sm bg-background p-2.5 rounded border select-all break-all pr-10 relative">
                      {generatedKeyVisible}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => setGeneratedKeyVisible(null)}
                    >
                      I have saved this key safely
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* KEY STORAGE TABLE LIST */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>API Credentials</CardTitle>
              <CardDescription>
                Tokens currently configured to call the local model runtime or cloud pipelines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descriptive Name</TableHead>
                      <TableHead>Secret Token</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No credentials active. Click &quot;Create API Key&quot; to configure your first credential token.
                        </TableCell>
                      </TableRow>
                    ) : (
                      keys.map((k) => (
                        <TableRow key={k.id} className={k.status === "Revoked" ? "opacity-60" : ""}>
                          <TableCell className="font-medium whitespace-nowrap">{k.name}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <div className="flex items-center gap-1.5">
                              <span>{k.key}</span>
                              {k.status === "Active" && (
                                <button
                                  className="text-muted-foreground hover:text-foreground transition p-1"
                                  onClick={() => copyToClipboard(k.key, k.id)}
                                  title="Copy Key Reference"
                                >
                                  {copiedKeyId === k.id ? (
                                    <Check className="h-3 w-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {k.scope}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">{k.created}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap">{k.expiry}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={k.status === "Active" ? "default" : "destructive"} 
                              className={`text-[10px] px-1.5 py-0 ${k.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}`}
                            >
                              {k.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {k.status === "Active" ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                onClick={() => handleRevokeKey(k.id)}
                                title="Revoke Credential"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 py-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-primary" />
                Never share API keys in client-side public git repos.
              </span>
              <a href="#" className="underline hover:text-foreground flex items-center gap-1">
                Security Best Practices <ExternalLink className="h-3 w-3" />
              </a>
            </CardFooter>
          </Card>

          {/* COMPREHENSIVE DOCUMENTATION ACCORDION */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>REST API Reference</CardTitle>
              </div>
              <CardDescription>
                Detailed configuration rules for developers connecting tools to the API endpoints.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                
                <AccordionItem value="auth-guide">
                  <AccordionTrigger className="text-sm font-semibold">
                    1. Bearer Token Authentication
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground text-sm">
                    <p>
                      All incoming HTTP requests sent to the PrivGPT Studio backend must contain a valid 
                      <code>Authorization</code> header specifying the Bearer token credentials.
                    </p>
                    <pre className="bg-secondary p-3 rounded-md font-mono text-xs text-foreground overflow-x-auto">
                      Authorization: Bearer sk-prv-your_generated_secret_string
                    </pre>
                    <p className="text-xs text-amber-500 flex items-center gap-1.5 mt-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      If authentication fails, the gateway throws a <code>401 Unauthorized</code> response.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="endpoint-completions">
                  <AccordionTrigger className="text-sm font-semibold">
                    2. POST /v1/chat/completions
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-muted-foreground text-sm">
                    <p>
                      Generate text completions recursively. Supports both streaming (event-stream chunking) 
                      and standard HTTP json payload completion blocks.
                    </p>
                    <div className="space-y-1.5">
                      <div className="font-semibold text-xs text-foreground">Body Parameters:</div>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        <li><code>model</code> (string, required): ID of the local/cloud weights library to deploy.</li>
                        <li><code>messages</code> (array, required): Sequential context payload structure matching roles system, user, or assistant.</li>
                        <li><code>temperature</code> (float, optional): Sampling temperature between 0.0 and 2.0. Defaults to 0.7.</li>
                        <li><code>max_tokens</code> (integer, optional): Maximum amount of completion tokens generated per query context.</li>
                        <li><code>stream</code> (boolean, optional): Stream partial token chunks back as server-sent events.</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="endpoint-embeddings">
                  <AccordionTrigger className="text-sm font-semibold">
                    3. POST /v1/embeddings
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground text-sm">
                    <p>
                      Converts your string payload inputs into standard vectors representing their semantic characteristics. 
                      Ideal for RAG setups and vector search database stores (like FAISS, Qdrant, Chroma).
                    </p>
                    <pre className="bg-secondary p-3 rounded-md font-mono text-xs text-foreground overflow-x-auto">
{`{
  "model": "text-embedding-ada-002",
  "input": "User search phrase snippet goes here"
}`}
                    </pre>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="error-codes">
                  <AccordionTrigger className="text-sm font-semibold">
                    4. Troubleshooting HTTP Error Codes
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-muted-foreground text-sm text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 border rounded bg-muted/30">
                        <div className="font-bold text-destructive">400 Bad Request</div>
                        <div>JSON payload malformed, incorrect prompt arrays, or unsupported models specified.</div>
                      </div>
                      <div className="p-3 border rounded bg-muted/30">
                        <div className="font-bold text-destructive">401 Unauthorized</div>
                        <div>Authentication token missing, expired, revoked, or key name has typos.</div>
                      </div>
                      <div className="p-3 border rounded bg-muted/30">
                        <div className="font-bold text-amber-500">429 Rate Limited</div>
                        <div>Max usage quotas exceeded. Wait for cooloff duration or upgrade from free tiers.</div>
                      </div>
                      <div className="p-3 border rounded bg-muted/30">
                        <div className="font-bold text-destructive">500 Server Error</div>
                        <div>Local backend worker crashed or Ollama engine lacks VRAM storage space.</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE API PLAYGROUND */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* SETTINGS CARD */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                <CardTitle>Sandbox Controller</CardTitle>
              </div>
              <CardDescription>
                Customize request parameters and generate code scripts instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Endpoint selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">HTTP Endpoint Target</label>
                <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/v1/chat/completions">POST /v1/chat/completions</SelectItem>
                    <SelectItem value="/v1/embeddings">POST /v1/embeddings</SelectItem>
                    <SelectItem value="/v1/models">GET /v1/models</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* API Key selector for code generation */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Key Signature</label>
                <Select value={playgroundApiKey} onValueChange={setPlaygroundApiKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Key" />
                  </SelectTrigger>
                  <SelectContent>
                    {keys.map(k => (
                      <SelectItem key={k.id} value={k.id} disabled={k.status === "Revoked"}>
                        {k.name} ({k.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEndpoint !== "/v1/models" && (
                <>
                  {/* Model selection */}
                  {selectedEndpoint === "/v1/chat/completions" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Model Engine</label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="llama-3-8b-instruct">Llama 3 (8B - Meta Local)</SelectItem>
                          <SelectItem value="mistral-7b-v0.2">Mistral (7B - Local)</SelectItem>
                          <SelectItem value="phi-3-mini-4k">Phi 3 (Mini 4K - Microsoft)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Prompt selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {selectedEndpoint === "/v1/chat/completions" ? "User Message / Query" : "Embed Inputs"}
                    </label>
                    <Input 
                      value={customUserPrompt}
                      onChange={(e) => setCustomUserPrompt(e.target.value)}
                      placeholder={selectedEndpoint === "/v1/chat/completions" ? "Prompt query text..." : "Sentence text to vectorize..."}
                    />
                  </div>

                  {selectedEndpoint === "/v1/chat/completions" && (
                    <>
                      {/* System instructions */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">System Instructions</label>
                        <textarea
                          rows={2}
                          className="w-full text-sm p-2 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          placeholder="You are an assistant..."
                        />
                      </div>

                      {/* Temperature slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <label className="font-medium">Temperature</label>
                          <span className="font-mono text-xs">{temperature[0]}</span>
                        </div>
                        <Slider 
                          value={temperature}
                          onValueChange={setTemperature}
                          max={1.5}
                          step={0.1}
                          className="py-1"
                        />
                      </div>

                      {/* Max tokens, streaming */}
                      <div className="grid grid-cols-2 gap-4 items-center pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Max Tokens</label>
                          <Input 
                            type="number"
                            value={maxTokens}
                            onChange={(e) => setMaxTokens(e.target.value)}
                            min={1}
                            max={4096}
                          />
                        </div>
                        <div className="flex items-center justify-between border rounded p-2.5 bg-muted/20">
                          <div className="space-y-0.5">
                            <label className="text-xs font-semibold cursor-pointer" htmlFor="stream-switch">
                              Stream Output
                            </label>
                            <div className="text-[10px] text-muted-foreground">JSON event flow</div>
                          </div>
                          <Switch
                            id="stream-switch"
                            checked={streamResponse}
                            onCheckedChange={setStreamResponse}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <Button 
                className="w-full flex items-center justify-center gap-2 mt-4"
                disabled={requestRunning}
                onClick={handleRunRequest}
              >
                {requestRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Executing Request Simulation...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                    Run Playground Query
                  </>
                )}
              </Button>

            </CardContent>
          </Card>

          {/* CODE SNIPPET GENERATOR */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Code className="h-4 w-4 text-primary" />
                  Integration Snippets
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={copyCodeSnippet}
                  className="h-8 text-xs flex items-center gap-1.5"
                >
                  {copiedCodeText ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-3">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <div className="bg-zinc-950 dark:bg-zinc-950 p-4 rounded-md border text-zinc-100 font-mono text-xs overflow-x-auto max-h-[220px] select-all">
                  <pre className="whitespace-pre">{getCodeSnippet()}</pre>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* TERMINAL MONITOR CONSOLE */}
          <Card className="shadow-sm border-zinc-800 bg-zinc-950 text-zinc-100">
            <CardHeader className="pb-2 border-b border-zinc-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-500" />
                <CardTitle className="text-xs font-mono text-zinc-400">Response Terminal Console</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {responseStatus && (
                  <Badge 
                    variant={responseStatus === 200 ? "default" : "destructive"} 
                    className={`font-mono text-[10px] px-1 py-0 ${responseStatus === 200 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : ""}`}
                  >
                    STATUS: {responseStatus}
                  </Badge>
                )}
                {responseTime && (
                  <Badge variant="outline" className="font-mono text-[10px] px-1 py-0 text-zinc-400 border-zinc-800">
                    LATENCY: {responseTime}ms
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 font-mono text-xs min-h-[160px] max-h-[300px] overflow-y-auto bg-zinc-950 scrollbar-thin">
              {requestRunning && responseOutput.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  <span>Connecting to secure inference worker gateway...</span>
                </div>
              ) : responseOutput ? (
                <pre className="text-zinc-300 whitespace-pre-wrap select-all">{responseOutput}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-600 text-center">
                  <Play className="h-8 w-8 mb-2 opacity-30 text-zinc-500" />
                  <p>Configure parameters above and click &quot;Run Playground Query&quot;</p>
                  <p className="text-[10px] text-zinc-700 mt-1">Simulated output results will write here</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-zinc-900 border-t border-zinc-800/80 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>privgpt-worker-daemon-v1.4</span>
              <span>UTF-8 JSON</span>
            </CardFooter>
          </Card>

        </div>

      </div>
    </div>
  );
}
