"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Cpu,
  Layers,
  Settings,
  Terminal,
  Activity,
  Check,
  Copy,
  Info,
  ChevronRight,
  ExternalLink,
  Sliders,
  HelpCircle,
  AlertCircle,
  FileText,
  Hammer,
  Server,
  Key
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// TS Interface for articles
interface DocArticle {
  id: string;
  category: "getting-started" | "configuration" | "architecture" | "hosting" | "faq";
  title: string;
  shortDesc: string;
}

export default function DocumentationPage() {
  // --- STATE ---
  const [activeArticleId, setActiveArticleId] = useState<string>("intro");
  const [searchQuery, setSearchQuery] = useState("");
  
  // env builder states
  const [envProvider, setEnvProvider] = useState<"local" | "cloud">("local");
  const [envGpuType, setEnvGpuType] = useState<"cuda" | "rocm" | "mps" | "cpu">("cuda");
  const [envContextSize, setEnvContextSize] = useState<string>("4096");
  const [envAuthEnabled, setEnvAuthEnabled] = useState(true);
  const [envEnableLogging, setEnvEnableLogging] = useState(false);
  const [envDefaultModel, setEnvDefaultModel] = useState("llama3");
  const [copiedEnvCode, setCopiedEnvCode] = useState(false);

  // hosting compatibility calculator states
  const [calcCpuCores, setCalcCpuCores] = useState<number[]>([8]);
  const [calcRamSize, setCalcRamSize] = useState<number[]>([16]);
  const [calcGpuType, setCalcGpuType] = useState("rtx-3070");
  const [isCopiedCommand, setIsCopiedCommand] = useState<string | null>(null);

  // Articles index registry
  const articlesList: DocArticle[] = [
    { id: "intro", category: "getting-started", title: "Introduction & Setup", shortDesc: "Overview of PrivGPT-Studio runtime requirements, architecture and quick install commands." },
    { id: "env-builder", category: "configuration", title: "Environment Configuration", shortDesc: "Custom environment variable (.env) configuration builder tool." },
    { id: "architecture", category: "architecture", title: "Data Flow & Processing", shortDesc: "Details on parsing, chunk embedding vectorization, RAG queries and response structures." },
    { id: "hosting", category: "hosting", title: "Hosting Compatibility Checker", shortDesc: "Diagnostics validator to check suitability of local host computer specs." },
    { id: "faq", category: "faq", title: "Troubleshooting & FAQ", shortDesc: "Solutions for common CUDA memory errors, container conflicts and timeout logs." }
  ];

  // Copy helper
  const copyTextToClipboard = (text: string, refId: string) => {
    navigator.clipboard.writeText(text);
    if (refId === "env") {
      setCopiedEnvCode(true);
      setTimeout(() => setCopiedEnvCode(false), 2000);
    } else {
      setIsCopiedCommand(refId);
      setTimeout(() => setIsCopiedCommand(null), 2000);
    }
    toast.success("Content copied to clipboard.");
  };

  // --- CONFIG GENERATOR ---
  const generateEnvFile = () => {
    const header = `# =========================================\n# PrivGPT Studio Environment Variable File\n# Generated dynamically via Developer Portal\n# =========================================\n\n`;
    
    let vars = ``;
    vars += `PORT=3000\n`;
    vars += `NODE_ENV=production\n\n`;

    vars += `# INFERENCE GATEWAY SETTING\n`;
    if (envProvider === "local") {
      vars += `INFERENCE_PROVIDER=local\n`;
      vars += `OLLAMA_HOST=http://127.0.0.1:11434\n`;
      vars += `LOCAL_ACCELERATOR=${envGpuType.toUpperCase()}\n`;
      vars += `DEFAULT_MODEL=${envDefaultModel === "llama3" ? "llama3:8b" : "mistral:7b"}\n\n`;
    } else {
      vars += `INFERENCE_PROVIDER=cloud\n`;
      vars += `OPENAI_API_KEY=sk-proj-yourSecretAPIKeyHere...\n`;
      vars += `CLAUDE_API_KEY=sk-ant-yourAnthropicKeyHere...\n`;
      vars += `DEFAULT_MODEL=gpt-4o\n\n`;
    }

    vars += `# CORE ENGINE LIMITS\n`;
    vars += `CONTEXT_WINDOW_SIZE=${envContextSize}\n`;
    vars += `CHUNK_SIZE=500\n`;
    vars += `CHUNK_OVERLAP=50\n\n`;

    vars += `# AUTHENTICATION & PERMISSIONS\n`;
    vars += `ENABLE_AUTHENTICATION=${envAuthEnabled ? "true" : "false"}\n`;
    if (envAuthEnabled) {
      vars += `JWT_SECRET=prv-studio-jwt-secret-string-replace-me\n`;
      vars += `TOKEN_EXPIRY_HOURS=24\n\n`;
    } else {
      vars += `\n`;
    }

    vars += `# LOGGING & TELEMETRY\n`;
    vars += `TELEMETRY_LOGGING_LEVEL=${envEnableLogging ? "debug" : "info"}\n`;
    vars += `PERSIST_CHATS_SQLITE=true\n`;

    return header + vars;
  };

  // --- HARDWARE DIAGNOSTIC SCORE CALCULATOR ---
  const getDiagnosticsScore = () => {
    const cpu = calcCpuCores[0];
    const ram = calcRamSize[0];
    let score = 0;
    let verdict = "Unknown";
    let desc = "";
    let colorClass = "text-zinc-400";
    let speedEstimate = "0 t/s";

    // CPU Evaluation
    if (cpu >= 16) score += 25;
    else if (cpu >= 8) score += 15;
    else score += 5;

    // RAM Evaluation
    if (ram >= 64) score += 25;
    else if (ram >= 32) score += 20;
    else if (ram >= 16) score += 10;
    else score += 2;

    // GPU Evaluation
    switch (calcGpuType) {
      case "cpu-only":
        score += 5;
        verdict = "Low suitability (CPU Only)";
        desc = "Your system lacks dedicated VRAM. Local model loading is restricted to small models (e.g. Phi-3 Mini) and text will render very slowly (CPU fallback). We recommend cloud APIs.";
        colorClass = "text-amber-500";
        speedEstimate = "1 - 3 tokens/sec";
        break;
      case "rtx-3050":
        score += 25;
        verdict = "Minimal Local Inference Host";
        desc = "Suitable for 3B and 7B quantized models (Q4_K_M). Larger models will spill into RAM causing stutter. Set context window limits to 2048 to prevent crashes.";
        colorClass = "text-blue-400";
        speedEstimate = "12 - 18 tokens/sec";
        break;
      case "rtx-3070":
        score += 35;
        verdict = "Standard Developer Rig";
        desc = "Highly optimal for meta-llama-3 (8B) and mistral-7b running Q4 or Q8 compression. Smooth execution, capable of handling minor RAG workloads natively.";
        colorClass = "text-emerald-400";
        speedEstimate = "25 - 35 tokens/sec";
        break;
      case "rtx-4090":
        score += 50;
        verdict = "High-Performance Workstation";
        desc = "Excellent local configuration. Easily runs 8B/14B parameters at full FP16 or Q8 precision. Can run multiple parallel threads and larger context sizes (8k+ tokens) comfortably.";
        colorClass = "text-purple-400";
        speedEstimate = "60 - 85 tokens/sec";
        break;
    }

    return {
      score: Math.min(100, score),
      verdict,
      desc,
      colorClass,
      speedEstimate
    };
  };

  // Filter articles based on query
  const filteredArticles = articlesList.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Developer Portal
            </Badge>
            <span className="text-xs text-muted-foreground">• Setup Documentation</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Technical Manuals</h1>
          <p className="text-muted-foreground mt-1">
            Complete configurations manuals, environment variables builders, and self-hosting suitability diagnostics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/model-library" className="flex items-center gap-1.5">
              Model Library
              <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION COLUMN */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Docs Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search manuals..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Navigation Links list */}
          <div className="flex flex-col gap-1">
            {filteredArticles.length === 0 ? (
              <span className="text-xs text-muted-foreground p-3 text-center">
                No matching articles found.
              </span>
            ) : (
              filteredArticles.map((art) => (
                <button
                  key={art.id}
                  onClick={() => setActiveArticleId(art.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                    activeArticleId === art.id
                      ? "bg-primary text-primary-foreground shadow"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{art.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
                </button>
              ))
            )}
          </div>

          {/* Helper details card */}
          <Card className="bg-muted/40 border border-muted/50 p-4 rounded-lg hidden lg:block">
            <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong>Need custom integrations?</strong> Connect with our developers on Discord to request features or file runtime tickets.
              </div>
            </div>
          </Card>

        </div>

        {/* MAIN CONTENT READER CANVAS */}
        <div className="lg:col-span-9">
          
          {/* ARTICLE: INTRODUCTION & SETUP */}
          {activeArticleId === "intro" && (
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1.5 text-primary text-xs font-mono font-semibold">
                  <BookOpen className="h-4 w-4" />
                  CHAPTER 1: GETTING STARTED
                </div>
                <CardTitle className="text-2xl">Introduction & Local Setup</CardTitle>
                <CardDescription>
                  Setup your local machine environment to run PrivGPT-Studio models inside docker or node runtimes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground">1. System Prerequisites</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    PrivGPT Studio utilizes container virtualization and local server APIs to route inference messages safely. To run local weight configurations (Ollama runner), guarantee you meet these parameters:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                    <li><strong>Operating System:</strong> Windows 10/11 (WSL2), macOS 13+, or Ubuntu 22.04 LTS.</li>
                    <li><strong>System Memory:</strong> Minimum 8 GB RAM (16 GB or higher strongly recommended).</li>
                    <li><strong>Accelerators:</strong> Nvidia GPUs (with CUDA support) or Apple Silicon M-series.</li>
                    <li><strong>Daemons:</strong> Docker Engine v24+ and Ollama CLI runner installed.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground">2. Quick Installation CLI Commands</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Deploy the entire suite by pulling weights and launching the client UI. Run these setup commands:
                  </p>

                  <Tabs defaultValue="docker-tab" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-2.5">
                      <TabsTrigger value="docker-tab">Docker Stack</TabsTrigger>
                      <TabsTrigger value="npm-tab">Local NPM CLI</TabsTrigger>
                      <TabsTrigger value="ollama-tab">Ollama Pull</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="docker-tab" className="space-y-2">
                      <div className="relative bg-zinc-950 p-4 rounded-md border text-zinc-100 font-mono text-xs overflow-x-auto select-all pr-12">
                        <pre>{`# 1. Pull the Docker Compose stack file
curl -L https://privgptstudio.com/compose.yml -o docker-compose.yml

# 2. Spin up containers (server backend on port 8000, client UI on 3000)
docker compose up -d`}</pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                          onClick={() => copyTextToClipboard("curl -L https://privgptstudio.com/compose.yml -o docker-compose.yml\ndocker compose up -d", "docker-cmd")}
                        >
                          {isCopiedCommand === "docker-cmd" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="npm-tab" className="space-y-2">
                      <div className="relative bg-zinc-950 p-4 rounded-md border text-zinc-100 font-mono text-xs overflow-x-auto select-all pr-12">
                        <pre>{`# Install repository packages
npm install

# Run backend development server
npm run dev`}</pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                          onClick={() => copyTextToClipboard("npm install\nnpm run dev", "npm-cmd")}
                        >
                          {isCopiedCommand === "npm-cmd" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="ollama-tab" className="space-y-2">
                      <div className="relative bg-zinc-950 p-4 rounded-md border text-zinc-100 font-mono text-xs overflow-x-auto select-all pr-12">
                        <pre>{`# Pull the default Llama3 model locally
ollama pull llama3:8b

# Spin up weight listeners daemon
ollama serve`}</pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                          onClick={() => copyTextToClipboard("ollama pull llama3:8b\nollama serve", "ollama-cmd")}
                        >
                          {isCopiedCommand === "ollama-cmd" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </section>

                <section className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">First-Time Setup Tip:</strong> Once docker-compose wraps up execution, verify that container ports <code>3000</code> and <code>8000</code> are not blocked by third-party local utilities. Navigate to <code>http://localhost:3000</code> in your browser to verify dashboard startup.
                  </div>
                </section>

              </CardContent>
            </Card>
          )}

          {/* ARTICLE: ENVIRONMENT VARIABLES BUILDER */}
          {activeArticleId === "env-builder" && (
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1.5 text-primary text-xs font-mono font-semibold">
                  <Settings className="h-4 w-4" />
                  CHAPTER 2: CONFIGURATION
                </div>
                <CardTitle className="text-2xl">Environment configuration builder</CardTitle>
                <CardDescription>
                  Select parameters to generate a custom `.env` configuration file for your server daemon instance.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Parameter sliders and options */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-500">Builder Options</h3>
                    
                    {/* Provider toggle */}
                    <div className="flex items-center justify-between border p-3 rounded bg-muted/20">
                      <div className="space-y-0.5">
                        <label className="text-sm font-semibold cursor-pointer" htmlFor="env-provider-switch">
                          Inference Provider
                        </label>
                        <div className="text-xs text-muted-foreground">
                          {envProvider === "local" ? "Local (Ollama Daemon)" : "Cloud APIs (OpenAI / Anthropic)"}
                        </div>
                      </div>
                      <Switch
                        id="env-provider-switch"
                        checked={envProvider === "local"}
                        onCheckedChange={(checked) => setEnvProvider(checked ? "local" : "cloud")}
                      />
                    </div>

                    {/* Local acceleration select */}
                    {envProvider === "local" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">GPU Hardware Driver</label>
                        <Select value={envGpuType} onValueChange={(val) => setEnvGpuType(val as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="GPU Accelerator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cuda">Nvidia CUDA (Optimum for RTX/A100)</SelectItem>
                            <SelectItem value="rocm">AMD ROCm (Radeon acceleration)</SelectItem>
                            <SelectItem value="mps">Apple MPS (macOS metal frameworks)</SelectItem>
                            <SelectItem value="cpu">None / CPU fallback (Slow speeds)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Context window size select */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Inference Context Limit</label>
                      <Select value={envContextSize} onValueChange={setEnvContextSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Context Window" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2048">2,048 Tokens (Low VRAM cards)</SelectItem>
                          <SelectItem value="4096">4,096 Tokens (Standard Llama3)</SelectItem>
                          <SelectItem value="8192">8,192 Tokens (Extended reasoning)</SelectItem>
                          <SelectItem value="16384">16,384 Tokens (Heavy RAG loads)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Auth switcher */}
                    <div className="flex items-center justify-between border p-3 rounded bg-muted/20">
                      <div className="space-y-0.5">
                        <label className="text-sm font-semibold cursor-pointer" htmlFor="env-auth-switch">
                          Enable User Authentication
                        </label>
                        <div className="text-xs text-muted-foreground">Require token authorization headers</div>
                      </div>
                      <Switch
                        id="env-auth-switch"
                        checked={envAuthEnabled}
                        onCheckedChange={setEnvAuthEnabled}
                      />
                    </div>

                    {/* Debug logging switcher */}
                    <div className="flex items-center justify-between border p-3 rounded bg-muted/20">
                      <div className="space-y-0.5">
                        <label className="text-sm font-semibold cursor-pointer" htmlFor="env-log-switch">
                          Verbose Debug Logs
                        </label>
                        <div className="text-xs text-muted-foreground">Output runtime telemetry tags</div>
                      </div>
                      <Switch
                        id="env-log-switch"
                        checked={envEnableLogging}
                        onCheckedChange={setEnvEnableLogging}
                      />
                    </div>

                  </div>

                  {/* Output code area */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-500">Output .env File</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyTextToClipboard(generateEnvFile(), "env")}
                        className="h-8 text-xs flex items-center gap-1.5"
                      >
                        {copiedEnvCode ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy Configurations
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-md border text-zinc-100 font-mono text-xs overflow-y-auto max-h-[360px] select-all scrollbar-thin">
                      <pre className="whitespace-pre">{generateEnvFile()}</pre>
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>
          )}

          {/* ARTICLE: DATA FLOW & ARCHITECTURE */}
          {activeArticleId === "architecture" && (
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1.5 text-primary text-xs font-mono font-semibold">
                  <Layers className="h-4 w-4" />
                  CHAPTER 3: CORE ARCHITECTURE
                </div>
                <CardTitle className="text-2xl">Data Flow & RAG Ingestion</CardTitle>
                <CardDescription>
                  How PrivGPT-Studio parses files, vectors embeddings, indexes databases, and builds prompt contexts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground">1. Retrieval-Augmented Generation (RAG) Flow</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    PrivGPT Studio utilizes an ingestion pipeline to read files locally and inject context directly into prompt windows before inference. The workflow is partitioned as follows:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                    <div className="border p-3 rounded-lg bg-muted/30">
                      <Badge className="mb-2 bg-primary">Step 1</Badge>
                      <h4 className="font-semibold text-xs mb-1">Document Ingest</h4>
                      <p className="text-[11px] text-muted-foreground">PDFs, CSVs, or text blobs are parsed and stripped of style metadata.</p>
                    </div>
                    <div className="border p-3 rounded-lg bg-muted/30">
                      <Badge className="mb-2 bg-primary">Step 2</Badge>
                      <h4 className="font-semibold text-xs mb-1">Text Chunking</h4>
                      <p className="text-[11px] text-muted-foreground">Paragraphs are split into overlapping blocks (default: 500 characters).</p>
                    </div>
                    <div className="border p-3 rounded-lg bg-muted/30">
                      <Badge className="mb-2 bg-primary">Step 3</Badge>
                      <h4 className="font-semibold text-xs mb-1">Vector Indexing</h4>
                      <p className="text-[11px] text-muted-foreground">Nomic/OpenAI models convert chunks to float arrays, saved to SQLite/FAISS.</p>
                    </div>
                    <div className="border p-3 rounded-lg bg-muted/30">
                      <Badge className="mb-2 bg-primary">Step 4</Badge>
                      <h4 className="font-semibold text-xs mb-1">Prompt Assembly</h4>
                      <p className="text-[11px] text-muted-foreground">Top vector matches are merged with system templates and sent to the LLM.</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground">2. Prompt Context Architecture</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    PrivGPT-Studio packages queries in the format shown below. Ensure your local context settings support at least 4096 tokens to contain larger document vectors:
                  </p>
                  <pre className="bg-secondary p-3.5 rounded-md font-mono text-xs text-foreground overflow-x-auto">
{`<<SYS>>
You are a secure, offline assistant. Synthesize a response based ONLY on details below:
----------
CONTEXT BLOCK 1: [Document snippet metadata info...]
CONTEXT BLOCK 2: [Database log metadata snippet...]
----------
Strictly refuse answering details not addressed in the context above.
<</SYS>>
[USER]: What are the security compliance rules of file ingress?`}
                  </pre>
                </section>

              </CardContent>
            </Card>
          )}

          {/* ARTICLE: HOSTING SUITABILITY DIAGNOSTICS */}
          {activeArticleId === "hosting" && (
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1.5 text-primary text-xs font-mono font-semibold">
                  <Cpu className="h-4 w-4" />
                  CHAPTER 4: HOSTING DIAGNOSTICS
                </div>
                <CardTitle className="text-2xl">Self-Hosting Diagnostics</CardTitle>
                <CardDescription>
                  Input your machine specs to evaluate feasibility of hosting local inference services.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Inputs */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-500">Hardware Specifications</h3>
                    
                    {/* CPU slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <label>CPU Threads / Cores</label>
                        <span className="font-mono text-primary font-bold">{calcCpuCores[0]} Cores</span>
                      </div>
                      <Slider
                        value={calcCpuCores}
                        onValueChange={setCalcCpuCores}
                        min={2}
                        max={32}
                        step={2}
                        className="py-1"
                      />
                    </div>

                    {/* RAM slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <label>System RAM Size</label>
                        <span className="font-mono text-primary font-bold">{calcRamSize[0]} GB RAM</span>
                      </div>
                      <Slider
                        value={calcRamSize}
                        onValueChange={setCalcRamSize}
                        min={4}
                        max={128}
                        step={4}
                        className="py-1"
                      />
                    </div>

                    {/* GPU Dropdown */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-muted-foreground">Graphics card category</label>
                      <Select value={calcGpuType} onValueChange={setCalcGpuType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Inference GPU" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpu-only">CPU Only (No Nvidia/Apple Silicon)</SelectItem>
                          <SelectItem value="rtx-3050">Standard Entry GPU (e.g. RTX 3050/3060, 6-8GB VRAM)</SelectItem>
                          <SelectItem value="rtx-3070">Mid-Tier GPU (e.g. RTX 3070/4070, 10-12GB VRAM)</SelectItem>
                          <SelectItem value="rtx-4090">Enterprise Workstation GPU (e.g. RTX 4090, 24GB VRAM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </div>

                  {/* Calculations Scorecard */}
                  {(() => {
                    const diag = getDiagnosticsScore();
                    return (
                      <Card className="border border-primary/20 bg-primary/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-mono uppercase tracking-wider text-zinc-500">Suitability Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          
                          {/* Score metrics */}
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center font-bold text-lg text-primary bg-background shrink-0">
                              {diag.score}%
                            </div>
                            <div>
                              <h4 className={`font-bold text-sm ${diag.colorClass}`}>{diag.verdict}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">Est. Speed: <strong className="text-foreground">{diag.speedEstimate}</strong></p>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t">
                            {diag.desc}
                          </div>

                          <div className="pt-2 flex flex-col gap-2">
                            <div className="flex justify-between text-[11px] font-mono border-b pb-1">
                              <span>Docker Stack Readiness</span>
                              <span className="text-emerald-500 font-semibold">100% Compatible</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-mono border-b pb-1">
                              <span>Model Size Recommendation</span>
                              <span>{calcRamSize[0] >= 16 ? "8B Parameters (Standard)" : "3B Parameters (Light)"}</span>
                            </div>
                          </div>

                        </CardContent>
                      </Card>
                    );
                  })()}

                </div>

              </CardContent>
            </Card>
          )}

          {/* ARTICLE: TROUBLESHOOTING & FAQ */}
          {activeArticleId === "faq" && (
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1.5 text-primary text-xs font-mono font-semibold">
                  <HelpCircle className="h-4 w-4" />
                  CHAPTER 5: FAQ & TROUBLESHOOTING
                </div>
                <CardTitle className="text-2xl">Troubleshooting & FAQ</CardTitle>
                <CardDescription>
                  Find solutions to common installation warnings, runtime errors, and performance bugs.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                
                <Accordion type="single" collapsible className="w-full">
                  
                  <AccordionItem value="faq-cuda-oom">
                    <AccordionTrigger className="text-sm font-semibold">
                      Q1: How do I resolve CUDA Out Of Memory (OOM) errors?
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                      <p>
                        CUDA OOM happens when your model weights and active context memory exceed your GPU VRAM. Resolve this by:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Switching to a higher quantization compression scheme (e.g. Q4_K_M or Q2_K) in our Model Library registry.</li>
                        <li>Limiting the <code>CONTEXT_WINDOW_SIZE</code> in your <code>.env</code> file from 8192 down to 2048 or 4096.</li>
                        <li>Closing background programs that utilize GPU acceleration (like browsers or game engines).</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-daemons-unreachable">
                    <AccordionTrigger className="text-sm font-semibold">
                      Q2: Why does the client UI show &quot;Inference daemon unreachable&quot;?
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                      <p>
                        This occurs when the client interface cannot hit your local Ollama port (11434). Check that:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Ollama is running: run <code>ollama list</code> in your terminal.</li>
                        <li>If running inside docker, check that your compose file sets `OLLAMA_HOST` pointing to your local machine IP or <code>host.docker.internal</code>.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-embed-dimensions">
                    <AccordionTrigger className="text-sm font-semibold">
                      Q3: Can I swap local embedding models mid-session?
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                      <p>
                        Yes, but you will need to re-index existing document files. Vector databases (like FAISS) are mapped to a specific dimension size (e.g., 768 float dimensions for Nomic Embed, 1536 for OpenAI Ada). Swapping models with different output dimensions will crash searches unless the local indices are cleared and re-uploaded.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-auth-trouble">
                    <AccordionTrigger className="text-sm font-semibold">
                      Q4: How do I bypass user logins for a local single-user setup?
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                      <p>
                        If you are only running PrivGPT-Studio locally and don&apos;t require accounts, set <code>ENABLE_AUTHENTICATION=false</code> inside your <code>.env</code> file. This disables sign-in modals and redirects pages directly into the chat interface without requesting credentials.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-timeout">
                    <AccordionTrigger className="text-sm font-semibold">
                      Q5: Why do long queries time out after 60 seconds?
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                      <p>
                        This usually indicates the GPU has spilled into system memory, running at extremely low tokens/sec, triggering gateway timeout limits. You can resolve this by increasing the timeout environment variable <code>GATEWAY_TIMEOUT_SECONDS=300</code> or deploying a smaller, quantized model class.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>

              </CardContent>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
