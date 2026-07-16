"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Cpu,
  Layers,
  Search,
  Filter,
  Download,
  Terminal,
  Activity,
  HardDrive,
  Info,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  ExternalLink,
  Star,
  Check,
  Zap,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Model interface
interface AIModel {
  id: string;
  name: string;
  provider: string;
  sizeGb: number;
  parameters: string;
  source: "Local" | "Cloud";
  capability: "Chat" | "Code" | "Embeddings";
  license: string;
  description: string;
  benchmarks: {
    mmlu: number;
    gsm8k: number;
    humanEval: number;
  };
  recommendedVram: number; // in GB
}

export default function ModelLibraryPage() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState<"All" | "Local" | "Cloud">("All");
  const [filterCapability, setFilterCapability] = useState<"All" | "Chat" | "Code" | "Embeddings">("All");
  const [filterSize, setFilterSize] = useState<"All" | "Tiny" | "Small" | "Medium" | "Large">("All");

  // VRAM hardware calculator state
  const [vramSize, setVramSize] = useState<number[]>([12]);
  const [selectedGpuCard, setSelectedGpuCard] = useState("rtx-4070");
  
  // Quantization sandbox state
  const [selectedQuantization, setSelectedQuantization] = useState<"FP16" | "Q8_0" | "Q4_K_M" | "Q2_K">("Q4_K_M");
  
  // Terminal pulling simulator states
  const [activeInstallerModel, setActiveInstallerModel] = useState<AIModel | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  // Model list
  const modelsData: AIModel[] = [
    {
      id: "llama-3-8b",
      name: "Llama 3 (8B Instruct)",
      provider: "Meta",
      sizeGb: 4.8,
      parameters: "8 Billion",
      source: "Local",
      capability: "Chat",
      license: "Llama 3 License",
      description: "State-of-the-art 8B parameter model optimized for general dialogue, agent tasks, and reasoning. Extremely lightweight and fast.",
      benchmarks: { mmlu: 68.4, gsm8k: 79.6, humanEval: 62.2 },
      recommendedVram: 8
    },
    {
      id: "mistral-7b",
      name: "Mistral 7B v0.2",
      provider: "Mistral AI",
      sizeGb: 4.1,
      parameters: "7.2 Billion",
      source: "Local",
      capability: "Chat",
      license: "Apache 2.0",
      description: "Highly versatile local model using grouped-query attention and sliding window attention. Strong reasoning capabilities.",
      benchmarks: { mmlu: 62.5, gsm8k: 52.8, humanEval: 45.1 },
      recommendedVram: 6
    },
    {
      id: "phi-3-mini",
      name: "Phi 3 Mini (3.8B)",
      provider: "Microsoft",
      sizeGb: 2.2,
      parameters: "3.8 Billion",
      source: "Local",
      capability: "Chat",
      license: "MIT",
      description: "Extremely compact and fast SLM (Small Language Model) trained on high-quality synthetic data and curated web corpora.",
      benchmarks: { mmlu: 68.8, gsm8k: 82.5, humanEval: 58.8 },
      recommendedVram: 4
    },
    {
      id: "codegemma-7b",
      name: "CodeGemma 7B",
      provider: "Google",
      sizeGb: 4.9,
      parameters: "7 Billion",
      source: "Local",
      capability: "Code",
      license: "Gemma Terms",
      description: "Specialized local model trained on code repositories. Excels in multi-line code completions, math explanations, and code review.",
      benchmarks: { mmlu: 58.2, gsm8k: 49.2, humanEval: 61.6 },
      recommendedVram: 8
    },
    {
      id: "gemma-2-9b",
      name: "Gemma 2 (9B Instruct)",
      provider: "Google",
      sizeGb: 5.4,
      parameters: "9.2 Billion",
      source: "Local",
      capability: "Chat",
      license: "Gemma Terms",
      description: "Modern architecture featuring interleaved local-global attention and RMSNorm. Outperforms many larger models on logical evaluations.",
      benchmarks: { mmlu: 71.3, gsm8k: 76.4, humanEval: 55.4 },
      recommendedVram: 10
    },
    {
      id: "nomic-embed",
      name: "Nomic Embed Text v1.5",
      provider: "Nomic AI",
      sizeGb: 0.28,
      parameters: "137 Million",
      source: "Local",
      capability: "Embeddings",
      license: "Apache 2.0",
      description: "High-performance embedding model supporting variable output dimensions. Excellent for local indexing and semantic matching.",
      benchmarks: { mmlu: 0, gsm8k: 0, humanEval: 0 },
      recommendedVram: 1
    },
    {
      id: "mixtral-8x7b",
      name: "Mixtral 8x7B Instruct",
      provider: "Mistral AI",
      sizeGb: 26.2,
      parameters: "46.7 Billion",
      source: "Local",
      capability: "Chat",
      license: "Apache 2.0",
      description: "High-quality Mixture-of-Experts (MoE) model. Uses 8 experts, active route processes 2 experts per token. Needs robust local hardware.",
      benchmarks: { mmlu: 77.9, gsm8k: 74.4, humanEval: 50.6 },
      recommendedVram: 32
    },
    {
      id: "gpt-4o",
      name: "GPT-4o (Cloud API)",
      provider: "OpenAI",
      sizeGb: 0,
      parameters: "Proprietary",
      source: "Cloud",
      capability: "Chat",
      license: "Commercial Cloud",
      description: "Multimodal frontier model. Extremely fast and accurate, requiring a cloud API connection and internet access.",
      benchmarks: { mmlu: 88.7, gsm8k: 96.0, humanEval: 90.2 },
      recommendedVram: 0
    },
    {
      id: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet (Cloud)",
      provider: "Anthropic",
      sizeGb: 0,
      parameters: "Proprietary",
      source: "Cloud",
      capability: "Chat",
      license: "Commercial Cloud",
      description: "Frontier model setting industry benchmarks for coding, writing, visual reasoning, and multi-step agent execution.",
      benchmarks: { mmlu: 88.7, gsm8k: 96.4, humanEval: 92.0 },
      recommendedVram: 0
    }
  ];

  // --- COMPATIBILITY EVALUATION ENGINE ---
  // Returns status badge information based on active VRAM slider state
  const evaluateCompatibility = (model: AIModel) => {
    if (model.source === "Cloud") {
      return {
        status: "Cloud API",
        class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        message: "No VRAM needed (Runs on Cloud)"
      };
    }

    const availableVram = vramSize[0];
    
    // Base recommended VRAM is for standard 4-bit (Q4_K_M) quantization.
    // If available VRAM is equal or higher than recommendation -> Optimal
    // If VRAM is between 60% and 100% of recommendation -> Works with lower quantization
    // If VRAM is less than 60% -> Out of Memory
    if (availableVram >= model.recommendedVram) {
      return {
        status: "Optimal",
        class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        message: "Runs comfortably at Q4 / Q8 precision"
      };
    } else if (availableVram >= model.recommendedVram * 0.6) {
      return {
        status: "Low Memory",
        class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        message: "Requires high compression (e.g. Q2_K)"
      };
    } else {
      return {
        status: "OOM Warning",
        class: "bg-red-500/10 text-red-400 border-red-500/20",
        message: "Insufficient VRAM (Will crash or run on CPU)"
      };
    }
  };

  // --- QUANTIZATION DATA CALCULATOR ---
  const getQuantizationDetails = () => {
    switch (selectedQuantization) {
      case "FP16":
        return {
          vramUsage: "100% (Baseline)",
          perplexity: "None (Full Quality)",
          speed: "1x speed",
          speedColor: "text-zinc-400",
          savings: 0,
          description: "Uncompressed model weights. Offers maximum fidelity but requires substantial GPU hardware capacity."
        };
      case "Q8_0":
        return {
          vramUsage: "52% of baseline VRAM",
          perplexity: "Negligible (< 0.005 perplexity rise)",
          speed: "2.2x speed boost",
          speedColor: "text-blue-400",
          savings: 48,
          description: "8-bit quantization. Standard trade-off preserving almost full accuracy while halving RAM footprint."
        };
      case "Q4_K_M":
        return {
          vramUsage: "28% of baseline VRAM",
          perplexity: "Very Minor (< 0.02 perplexity rise)",
          speed: "4.5x speed boost",
          speedColor: "text-emerald-400",
          savings: 72,
          description: "4-bit Medium quantization. The gold standard for consumer GPUs. Highly recommended for daily use."
        };
      case "Q2_K":
        return {
          vramUsage: "18% of baseline VRAM",
          perplexity: "Significant accuracy degradation",
          speed: "6.8x speed boost",
          speedColor: "text-amber-500",
          savings: 82,
          description: "2-bit quantization. Squeezes models into tiny cards, but responses may contain hallucinations or gibberish."
        };
    }
  };

  // --- ACTIONS ---

  // Handle GPU dropdown change
  const handleGpuChange = (val: string) => {
    setSelectedGpuCard(val);
    switch (val) {
      case "rtx-3060":
        setVramSize([12]);
        break;
      case "rtx-4060":
        setVramSize([8]);
        break;
      case "rtx-4070":
        setVramSize([12]);
        break;
      case "rtx-4090":
        setVramSize([24]);
        break;
      case "mac-m2-max":
        setVramSize([64]);
        break;
      case "gpu-a100":
        setVramSize([80]);
        break;
    }
    toast.success(`Hardware specs synced to ${val.toUpperCase()} configuration.`);
  };

  // Install / Pull model CLI simulator
  const handleDeployModel = (model: AIModel) => {
    if (model.source === "Cloud") {
      toast.info(`Cloud API model ${model.name} is accessible immediately. Setup API keys in API settings.`);
      return;
    }

    setActiveInstallerModel(model);
    setIsInstalling(true);
    setInstallProgress(0);
    setInstallLogs([
      `privgpt-core: connecting to repository registry...`,
      `privgpt-core: querying model meta tags for '${model.id}'`,
      `manifest: found remote registry path (hash: sha256_b39d1b0...)`,
      `manifest: pulling ${model.sizeGb} GB download stream...`
    ]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setInstallProgress(100);
        setInstallLogs(prev => [
          ...prev,
          `downloading: [====================] 100% finished.`,
          `verifying: sha256 signature is clean.`,
          `ollama-daemon: registering ${model.id} library inside local worker.`,
          `SUCCESS: ${model.name} is now running locally on port 11434!`
        ]);
        setIsInstalling(false);
        toast.success(`Successfully downloaded and registered ${model.name}!`);
      } else {
        setInstallProgress(currentProgress);
        const downloadedGb = ((model.sizeGb * currentProgress) / 100).toFixed(1);
        setInstallLogs(prev => {
          // Replace or append download bar logs
          const filtered = prev.filter(log => !log.startsWith("downloading:"));
          const pct = Math.floor(currentProgress / 5);
          const barStr = `[${"=".repeat(pct)}${" ".repeat(20 - pct)}]`;
          return [
            ...filtered,
            `downloading: ${barStr} ${currentProgress}% (${downloadedGb} GB / ${model.sizeGb} GB)`
          ];
        });
      }
    }, 450);
  };

  // Auto-scroll terminal log console
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [installLogs]);

  // --- FILTER ENGINE ---
  const filteredModels = modelsData.filter((model) => {
    // search matching
    const searchMatch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        model.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // source matching
    const sourceMatch = filterSource === "All" || model.source === filterSource;

    // capability matching
    const capMatch = filterCapability === "All" || model.capability === filterCapability;

    // size matching
    let sizeMatch = true;
    if (filterSize !== "All") {
      if (model.source === "Cloud") {
        sizeMatch = false; // Cloud models don't fit numeric local category size directly
      } else {
        if (filterSize === "Tiny") sizeMatch = model.sizeGb <= 3;
        else if (filterSize === "Small") sizeMatch = model.sizeGb > 3 && model.sizeGb <= 6;
        else if (filterSize === "Medium") sizeMatch = model.sizeGb > 6 && model.sizeGb <= 15;
        else if (filterSize === "Large") sizeMatch = model.sizeGb > 15;
      }
    }

    return searchMatch && sourceMatch && capMatch && sizeMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Weights Registry
            </Badge>
            <span className="text-xs text-muted-foreground">• 9 Models Registered</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Model Library</h1>
          <p className="text-muted-foreground mt-1">
            Explore local open-source and cloud models. Calculate GPU compatibility and quantize weights dynamically.
          </p>
        </div>
        
        {/* API links */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/api-access" className="flex items-center gap-1.5">
              API Sandbox
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: FILTERS & MODEL LIST GRID */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SEARCH & FILTERS BAR */}
          <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-4">
              
              {/* Search text input */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search model name, provider, task, or specifications..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters categories select */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Runtime Engine</label>
                  <Select value={filterSource} onValueChange={(val) => setFilterSource(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Providers</SelectItem>
                      <SelectItem value="Local">Local (Run on device)</SelectItem>
                      <SelectItem value="Cloud">Cloud (Remote API)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Capabilities</label>
                  <Select value={filterCapability} onValueChange={(val) => setFilterCapability(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Task Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Capabilities</SelectItem>
                      <SelectItem value="Chat">Chat & Chatbot</SelectItem>
                      <SelectItem value="Code">Code & Completion</SelectItem>
                      <SelectItem value="Embeddings">Embeddings Embeds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Weights Size (Local Only)</label>
                  <Select value={filterSize} onValueChange={(val) => setFilterSize(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Size Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Sizes</SelectItem>
                      <SelectItem value="Tiny">Tiny (≤ 3 GB)</SelectItem>
                      <SelectItem value="Small">Small (3 - 6 GB)</SelectItem>
                      <SelectItem value="Medium">Medium (6 - 15 GB)</SelectItem>
                      <SelectItem value="Large">Large (&gt; 15 GB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

            </CardContent>
          </Card>

          {/* MODEL CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredModels.length === 0 ? (
              <div className="col-span-2 text-center py-16 border rounded-lg bg-muted/20 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto opacity-30 mb-2" />
                <p className="font-semibold">No models matched your search query</p>
                <p className="text-sm">Try modifying your text query or adjusting filters.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterSource("All");
                    setFilterCapability("All");
                    setFilterSize("All");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              filteredModels.map((model) => {
                const comp = evaluateCompatibility(model);
                return (
                  <Card key={model.id} className="flex flex-col hover:border-primary/45 transition shadow-sm relative overflow-hidden group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Badge variant="outline" className="mb-1 bg-muted">
                            {model.provider}
                          </Badge>
                          <CardTitle className="text-lg font-bold group-hover:text-primary transition">
                            {model.name}
                          </CardTitle>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 border shrink-0 ${comp.class}`}
                        >
                          {comp.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1.5 text-xs text-muted-foreground">
                        {model.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-4 pt-1 flex-grow space-y-4">
                      {/* Technical Specs list */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 border-y text-[11px] font-mono text-muted-foreground bg-muted/20 rounded px-2">
                        <div>
                          <div className="font-semibold text-foreground text-[10px] uppercase text-zinc-500">Source</div>
                          <div className="mt-0.5 font-medium">{model.source}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-[10px] uppercase text-zinc-500">Params</div>
                          <div className="mt-0.5 font-medium">{model.parameters}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-[10px] uppercase text-zinc-500">RAM File</div>
                          <div className="mt-0.5 font-medium">
                            {model.source === "Local" ? `${model.sizeGb} GB` : "Cloud Hosted"}
                          </div>
                        </div>
                      </div>

                      {/* Benchmark graphs */}
                      {model.benchmarks.mmlu > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[10px] font-bold uppercase text-zinc-500">Benchmarks Performance</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>MMLU (Reasoning)</span>
                              <span className="font-mono">{model.benchmarks.mmlu}%</span>
                            </div>
                            <Progress value={model.benchmarks.mmlu} className="h-1" />
                            
                            <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                              <span>HumanEval (Code)</span>
                              <span className="font-mono">{model.benchmarks.humanEval}%</span>
                            </div>
                            <Progress value={model.benchmarks.humanEval} className="h-1 bg-secondary" />
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-2 border-t flex justify-between bg-muted/40 py-2.5 px-4 items-center">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        License: {model.license}
                      </span>
                      {model.source === "Local" ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs flex items-center gap-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                          onClick={() => handleDeployModel(model)}
                          disabled={isInstalling && activeInstallerModel?.id === model.id}
                        >
                          <Download className="h-3.5 w-3.5" />
                          {isInstalling && activeInstallerModel?.id === model.id ? "Pulling..." : "Pull weights"}
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-500/10" disabled>
                          Cloud Managed
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT PANEL: HARDWARE CALCULATOR & INSTALLATION TERMINAL */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* HARDWARE SPEC CALCULATOR */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                <CardTitle>Hardware compatibility</CardTitle>
              </div>
              <CardDescription>
                Simulate your device configuration to see which models run optimally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Preset card selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Select graphics card</label>
                <Select value={selectedGpuCard} onValueChange={handleGpuChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="GPU Preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rtx-4060">Nvidia RTX 4060 (8GB VRAM)</SelectItem>
                    <SelectItem value="rtx-3060">Nvidia RTX 3060 (12GB VRAM)</SelectItem>
                    <SelectItem value="rtx-4070">Nvidia RTX 4070 Ti (12GB VRAM)</SelectItem>
                    <SelectItem value="rtx-4090">Nvidia RTX 4090 (24GB VRAM)</SelectItem>
                    <SelectItem value="mac-m2-max">Apple Mac Studio M2 Max (64GB VRAM)</SelectItem>
                    <SelectItem value="gpu-a100">Nvidia A100 Tensor Core (80GB VRAM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* VRAM Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold uppercase text-muted-foreground">Allocated GPU VRAM</label>
                  <span className="font-mono font-bold text-primary">{vramSize[0]} GB</span>
                </div>
                <Slider
                  value={vramSize}
                  onValueChange={setVramSize}
                  min={2}
                  max={80}
                  step={2}
                  className="py-1"
                />
              </div>

              {/* Quick Summary Info Box */}
              <div className="p-3.5 border rounded-lg bg-muted/30 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-foreground">
                  <Cpu className="h-4 w-4 text-primary" />
                  Performance Outlook
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  With <strong className="text-foreground">{vramSize[0]} GB</strong> VRAM, you can host local models requiring up to <strong className="text-foreground">{Math.floor(vramSize[0] * 1.2)}B parameters</strong> if compiled with 4-bit (Q4_K_M) quantization. Larger models will spill into system memory (RAM/CPU), causing slower generation speeds (tokens/sec).
                </p>
              </div>

            </CardContent>
          </Card>

          {/* QUANTIZATION EXPLORER */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <CardTitle>Quantization sandbox</CardTitle>
              </div>
              <CardDescription>
                Convert weights precision formats to fit models in smaller GPU setups.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              
              <Tabs value={selectedQuantization} onValueChange={(val) => setSelectedQuantization(val as any)} className="w-full">
                <TabsList className="grid grid-cols-4 mb-3">
                  <TabsTrigger value="FP16" className="text-xs font-mono">FP16</TabsTrigger>
                  <TabsTrigger value="Q8_0" className="text-xs font-mono">Q8_0</TabsTrigger>
                  <TabsTrigger value="Q4_K_M" className="text-xs font-mono">Q4_K</TabsTrigger>
                  <TabsTrigger value="Q2_K" className="text-xs font-mono">Q2_K</TabsTrigger>
                </TabsList>

                {/* Quantization metrics output */}
                {(() => {
                  const details = getQuantizationDetails();
                  return (
                    <div className="space-y-3.5 pt-1.5">
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {details.description}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div className="border p-2 rounded bg-muted/20">
                          <div className="text-[10px] uppercase text-zinc-500">File Reduction</div>
                          <div className="font-bold text-foreground mt-0.5">-{details.savings}% size</div>
                        </div>
                        <div className="border p-2 rounded bg-muted/20">
                          <div className="text-[10px] uppercase text-zinc-500">VRAM Footprint</div>
                          <div className="font-bold text-foreground mt-0.5">{details.vramUsage}</div>
                        </div>
                        <div className="border p-2 rounded bg-muted/20">
                          <div className="text-[10px] uppercase text-zinc-500">Inference Speed</div>
                          <div className={`font-bold mt-0.5 ${details.speedColor}`}>{details.speed}</div>
                        </div>
                        <div className="border p-2 rounded bg-muted/20">
                          <div className="text-[10px] uppercase text-zinc-500">Accuracy Loss</div>
                          <div className="font-bold text-foreground mt-0.5">{details.perplexity}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </Tabs>

            </CardContent>
          </Card>

          {/* INSTALLER TERMINAL LOGS */}
          <Card className="shadow-sm border-zinc-800 bg-zinc-950 text-zinc-100">
            <CardHeader className="pb-2 border-b border-zinc-800/80 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-500" />
                <CardTitle className="text-xs font-mono text-zinc-400">Daemon Model Downloader</CardTitle>
              </div>
              {isInstalling && (
                <Badge variant="outline" className="font-mono text-[9px] px-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse">
                  PULLING WEIGHTS
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4 font-mono text-xs min-h-[160px] max-h-[220px] overflow-y-auto bg-zinc-950 scrollbar-thin">
              {activeInstallerModel ? (
                <div className="space-y-1.5 text-zinc-300">
                  {installLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed">
                      {log.startsWith("SUCCESS") ? (
                        <span className="text-emerald-400 font-bold">{log}</span>
                      ) : log.startsWith("downloading:") ? (
                        <span className="text-blue-400">{log}</span>
                      ) : (
                        <span>{log}</span>
                      )}
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-600 text-center">
                  <Download className="h-8 w-8 mb-2 opacity-30 text-zinc-500" />
                  <p>Choose a local model from catalog and click &quot;Pull weights&quot;</p>
                  <p className="text-[10px] text-zinc-700 mt-1">Terminal connection stream outputs here</p>
                </div>
              )}
            </CardContent>
            {activeInstallerModel && isInstalling && (
              <div className="px-4 pb-3 bg-zinc-950">
                <Progress value={installProgress} className="h-1 bg-zinc-800" />
              </div>
            )}
            <CardFooter className="bg-zinc-900 border-t border-zinc-800/80 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>ollama-runtime: active</span>
              <span>127.0.0.1:11434</span>
            </CardFooter>
          </Card>

        </div>

      </div>

    </div>
  );
}
