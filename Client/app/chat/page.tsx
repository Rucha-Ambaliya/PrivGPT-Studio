"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Settings,
  Info,
  MessageSquare,
  Zap,
  Home,
  Globe,
  Cpu,
  Clock,
  Activity,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Edit,
  Download,
  Eraser,
  Mic,
  Plus,
  X,
  FileText,
  File,
  ImageIcon,
  PlusCircle,
  Square,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MentionsInput, Mention } from "react-mentions";
import SplashScreen from "../splashScreen";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

// Type definitions for react-markdown components
type ComponentProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  file?: UploadedFile;
}

type ChatSession = {
  id: string;
  sessionName: string;
  lastMessage: string;
};

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

export default function ChatPage() {
  // Loading dots animation component
  const LoadingDots = () => {
    const [dots, setDots] = useState('.');
    
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '.') return '..';
          if (prev === '..') return '...';
          return '.';
        });
      }, 500);
      
      return () => clearInterval(interval);
    }, []);
    
    return <span>{dots}</span>;
  };

  const welcomeMessage: Message = {
    id: "1",
    content: "Hello! I'm your AI assistant. How can I help you today?",
    role: "assistant",
    timestamp: new Date(),
  };
  const welcomeSession = {
    id: "1", // or any unique ID
    sessionName: "How can I help You?",
    lastMessage: "Hello! I'm your AI assistant. How can I help you today?",
  };
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [localModels, setLocalModels] = useState<string[]>([]);
  const [cloudModels, setCloudModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("phi3");
  const [selectedModelType, setSelectedModelType] = useState<"local" | "cloud">(
    "local"
  );
  const [isChatSessionsCollapsed, setIsChatSessionsCollapsed] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatSessionSuggestions, setChatSessionSuggestions] = useState<
    { id: string; display: string }[]
  >([]);
  const [sessionId, setSessionId] = useState<string>("1");
  const [status, setStatus] = useState("Online");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [latency, setLatency] = useState<string | null>("0");
  const [clearChatSessionModal, setClearChatSessionModal] = useState(false);
  const [exportChatSessionModal, setExportChatSessionModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newChatSessionBtnRef = useRef<HTMLButtonElement | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [deleteChatSessionModal, setDeleteChatSessionModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [streamingEnabled, setStreamingEnabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsStreaming(false);
      // Reset typing indicator if it was set
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch models
    const fetchModels = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/models`
        );
        const data = await response.json();
        setLocalModels(data.local_models || []);
        setCloudModels(data.cloud_models || []);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    const fetchChatSessionHistory = async () => {
      const storedSessions = JSON.parse(
        localStorage.getItem("chat_sessions") || "[]"
      );

      // ✅ If no previous sessions, just show welcome
      if (storedSessions.length === 0) {
        setSessionId(welcomeSession.id); // "1"
        setMessages([welcomeMessage]);
        setChatSessions([welcomeSession]);
        if (newChatSessionBtnRef.current) {
          newChatSessionBtnRef.current.disabled = true;
        }
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/history`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_ids: storedSessions }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch session history");

        const sessions = await response.json();

        if (sessions.length > 0) {
          const transformedSessions: ChatSession[] = sessions.map(
            (session: any) => {
              const lastMsg =
                session.messages?.[session.messages.length - 1]?.content ||
                welcomeSession.lastMessage;
              return {
                id: session._id,
                created_at: session.created_at,
                lastMessage: lastMsg,
                sessionName: session.session_name || lastMsg,
              };
            }
          );

          // ✅ Always keep welcomeSession first in the list
          setChatSessions([welcomeSession, ...transformedSessions]);

          // ✅ Only reset to welcomeSession if you are currently on it
          if (sessionId === welcomeSession.id || !sessionId) {
            setSessionId(welcomeSession.id); // stays as "1"
            if (newChatSessionBtnRef.current)
              newChatSessionBtnRef.current.disabled = true;

            // show only welcome message if welcome is selected
            setMessages([welcomeMessage]);
            return;
          }

          // ✅ Otherwise, load messages for currently active sessionId
          const activeSession =
            sessions.find((s: any) => s._id === sessionId) || sessions[0];
          const formattedMessages: Message[] = activeSession.messages?.map(
            (msg: any, index: number) => ({
              id: msg.id || (index + 2).toString(),
              content: msg.content,
              role: msg.role,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
              ...(msg.uploaded_file
                ? {
                    file: {
                      name: msg.uploaded_file.name,
                      size: msg.uploaded_file.size,
                      type: msg.uploaded_file.type,
                      file: msg.uploaded_file.file,
                    } as UploadedFile,
                  }
                : {}),
            })
          );

          // ✅ Put welcomeMessage on top of history
          setMessages([welcomeMessage, ...(formattedMessages || [])]);
        }
      } catch (error) {
        console.error("Failed to fetch session history:", error);
      }
    };

    fetchChatSessionHistory();
  }, [sessionId, editedName]);
  if (newChatSessionBtnRef.current) {
    newChatSessionBtnRef.current.disabled = true;
  }
  useEffect(() => {
    if (chatSessions.some((session) => session.id === "1")) {
      // welcomeSession exists, disable new chat button
      if (newChatSessionBtnRef.current) {
        newChatSessionBtnRef.current.disabled = true;
      }
    } else {
      // no welcome session, allow new chat
      if (newChatSessionBtnRef.current) {
        newChatSessionBtnRef.current.disabled = false;
      }
    }
  }, [chatSessions]);

  useEffect(() => {
    let wasOffline = false; // track previous state

    function checkStatus() {
      const isNowOnline = navigator.onLine;
      setStatus(isNowOnline ? "Online" : "Offline");

      if (!isNowOnline && !wasOffline) {
        wasOffline = true;

        if (selectedModelType === "cloud" && localModels.length > 0) {
          setSelectedModel(localModels[0]);
          setSelectedModelType("local");
          toast.warning("You are offline. Switched to local model.");
        } else {
          toast.error("You are offline and no local models are available.");
        }
      }

      if (isNowOnline) {
        wasOffline = false;
      }
    }

    checkStatus(); // Run once immediately
    const interval = setInterval(checkStatus, 5000); // Poll every 30s

    return () => clearInterval(interval);
  }, [localModels, selectedModelType]); // Add selectedModelType to dependencies

  const handleSend = async () => {
    if (!input.trim()) return;

    // remove backslashes added by react-mentions markup
    const unescapedInput = input.replace(/\\([\[\]\(\)])/g, "$1");

    const mentionMatches = [...unescapedInput.matchAll(/@\[(.*?)\]\((.*?)\)/g)];
    const mentionIds = mentionMatches.map((m) => m[2]);

    const messageWithDisplayOnly = unescapedInput
      .replace(/@\[(.*?)\]\((.*?)\)/g, (_match, display, _id) => `@${display}`)
      .trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageWithDisplayOnly,
      role: "user",
      timestamp: new Date(),
      ...(uploadedFile ? { file: uploadedFile } : {}),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Use streaming endpoint for text-only messages (if streaming is enabled), regular endpoint for file uploads or when streaming is disabled
    const endpoint = uploadedFile || !streamingEnabled
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/stream`;
    
    // Only set typing indicator for file uploads (non-streaming cases) or when streaming is disabled
    if (uploadedFile || !streamingEnabled) {
      setIsTyping(true);
    }

    const formData = new FormData();
    formData.append("message", userMessage.content);
    formData.append("model_type", selectedModelType);
    formData.append("model_name", selectedModel);
    formData.append("timestamp", userMessage.timestamp.toISOString());
    if (sessionId) formData.append("session_id", sessionId);

    // append mention ids
    mentionIds.forEach((id) => formData.append("mention_session_ids[]", id));

    // append file if uploaded
    if (uploadedFile) {
      formData.append("uploaded_file", uploadedFile.file);
      // Remove file after adding to form data
      removeFile();
    }

    // Handle file uploads with regular endpoint
    if (uploadedFile || !streamingEnabled) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI response");
        }

        const data = await response.json();
        const bot_response = data.response || "No Reply";

        if (sessionId === "1" && data.session_id) {
          setSessionId(data.session_id);
          localStorage.setItem(
            "chat_sessions",
            JSON.stringify([
              ...JSON.parse(localStorage.getItem("chat_sessions") || "[]"),
              data.session_id,
            ])
          );
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: bot_response,
          role: "assistant",
          timestamp: new Date(data.timestamp),
        };

        if (newChatSessionBtnRef.current && newChatSessionBtnRef.current.disabled) {
          newChatSessionBtnRef.current.disabled = false;
        }

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        setLatency(data.latency.toString());
      } catch (error) {
        console.error("Failed to receive response from AI", error);
        setIsTyping(false);
      }
      return;
    }

    // Handle streaming for text-only messages
    const tempAssistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "...",
      role: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tempAssistantMessage]);
    setIsStreaming(true);

    // Create abort controller for stopping generation
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";
      let finalSessionId = sessionId;
      let latencyValue = "0";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                switch (data.type) {
                  case 'session_info':
                    if (data.session_id && data.session_id !== sessionId) {
                      finalSessionId = data.session_id;
                    }
                    break;
                    
                  case 'chunk':
                    // If this is the first chunk and we still have "..." as content, clear it first
                    if (streamedContent === "" && data.text) {
                      streamedContent = data.text;
                    } else {
                      streamedContent += data.text;
                    }
                    // Update the temporary message with streamed content
                    setMessages((prev) => 
                      prev.map((msg) => 
                        msg.id === tempAssistantMessage.id 
                          ? { ...msg, content: streamedContent }
                          : msg
                      )
                    );
                    break;
                    
                  case 'complete':
                    if (data.session_id && sessionId === "1") {
                      setSessionId(data.session_id);
                      localStorage.setItem(
                        "chat_sessions",
                        JSON.stringify([
                          ...JSON.parse(localStorage.getItem("chat_sessions") || "[]"),
                          data.session_id,
                        ])
                      );
                    }
                    
                    // Update final message with timestamp
                    setMessages((prev) => 
                      prev.map((msg) => 
                        msg.id === tempAssistantMessage.id 
                          ? { ...msg, content: streamedContent, timestamp: new Date(data.timestamp) }
                          : msg
                      )
                    );
                    
                    latencyValue = data.latency?.toString() || "0";
                    break;
                    
                  case 'error':
                    streamedContent = data.message;
                    setMessages((prev) => 
                      prev.map((msg) => 
                        msg.id === tempAssistantMessage.id 
                          ? { ...msg, content: streamedContent }
                          : msg
                      )
                    );
                    break;
                }
              } catch (e) {
                // Ignore JSON parse errors for malformed lines
                console.warn("Failed to parse SSE data:", e);
              }
            }
          }
        }
      }

      if (newChatSessionBtnRef.current && newChatSessionBtnRef.current.disabled) {
        newChatSessionBtnRef.current.disabled = false;
      }

      setIsStreaming(false);
      setAbortController(null);
      setLatency(latencyValue);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generation was stopped by user');
        // Update the temp message to show it was stopped
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === tempAssistantMessage.id 
              ? { ...msg, content: (msg.content || '') + '\n\n[Generation stopped by user]' }
              : msg
          )
        );
      } else {
        console.error("Failed to receive response from AI", error);
        
        // Update the temp message with error
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === tempAssistantMessage.id 
              ? { ...msg, content: "Failed to get response from AI. Please try again." }
              : msg
          )
        );
      }
      
      setIsStreaming(false);
      setAbortController(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearChatSession = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/clear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: sessionId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear chat session");
      }

      toast.success("Chat cleared successfully!");

      // Reset messages with welcome message
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error("Error clearing session:", error);
      toast.error("Failed to clear chat.");
    } finally {
      setClearChatSessionModal(false);
    }
  };

  const handleExportChatSession = () => {
    if (!sessionId) {
      toast.error("No session to export.");
      return;
    }

    // Find the current session's name from chatSessions array
    const currentSession = chatSessions.find((s) => s.id === sessionId);
    const sessionName = currentSession
      ? currentSession.sessionName
      : "Unnamed Session";

    // Build the export content
    let exportText = `CHATBOT CONVERSATION\n====================================\n\n`;
    exportText += `Session ID: ${sessionId}\n`;
    exportText += `Session Name: ${sessionName}\n`;
    exportText += `Exported At: ${new Date().toLocaleString()}\n\n`;
    exportText += `------------------------------------\n\n`;

    // Add messages
    messages.forEach((msg) => {
      const who = msg.role === "user" ? "You" : "Bot";
      const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString()
        : "Unknown Time";
      exportText += `[${time}] ${who}: ${msg.content}\n\n`;
    });

    // Create a blob and download
    const blob = new Blob([exportText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Create a filename that includes session name (safe fallback)
    const safeName = sessionName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    a.download = `chat_${safeName}_${sessionId}.txt`;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    toast.success("Chat exported successfully!");
    setExportChatSessionModal(false);
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript.trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      recognition.stop();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type.includes("text") || type.includes("document"))
      return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleCurrentChatSession = async (id: string) => {
    try {
      if (id === "1") {
        setMessages([welcomeMessage]);
        setSessionId("1");
        return;
      }

      if (sessionId === "1" && id !== "1") {
        // Filter out dummy session
        setChatSessions((prev) =>
          prev.filter((chatSession) => chatSession.id !== "1")
        );
        if (newChatSessionBtnRef.current) {
          newChatSessionBtnRef.current.disabled = false;
        }
      }

      setSessionId(id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();

      const formattedMessages: Message[] = data.messages.map(
        (msg: any, index: number) => ({
          id: msg.id || `${Date.now()}-${index}`,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.timestamp),
          ...(msg.uploaded_file
            ? {
                file: {
                  name: msg.uploaded_file.name,
                  size: msg.uploaded_file.size,
                  type: msg.uploaded_file.type,
                  file: msg.uploaded_file.file,
                } as UploadedFile,
              }
            : {}),
        })
      );

      const newWelcomeMessage: Message = {
        id: "1",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        role: "assistant",
        timestamp:
          formattedMessages.length > 0
            ? formattedMessages[0].timestamp
            : new Date(),
      };

      setMessages([newWelcomeMessage, ...formattedMessages]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleNewChatSession = () => {
    const isAlreadyPresent = chatSessions.some(
      (session) => session.id === welcomeSession.id
    );

    if (!isAlreadyPresent) {
      setChatSessions((prev) => [welcomeSession, ...prev]);
      setSessionId(welcomeSession.id);
      welcomeMessage.timestamp = new Date();
      setMessages([welcomeMessage]);
      if (!isChatSessionsCollapsed)
        setIsChatSessionsCollapsed(!isChatSessionsCollapsed);
    }

    if (newChatSessionBtnRef.current) {
      newChatSessionBtnRef.current.disabled = true;
    }
  };

  const handleRenameSession = (id: string) => {
    const session = chatSessions.find((s) => s.id === id);
    if (!session) return;

    setEditingSessionId(id);
    setEditedName(session.sessionName);
  };

  const handleDeleteChatSession = async (id: string) => {
    try {
      // Call backend DELETE
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        toast.error(errData.error || "Failed to delete chat session");
        return;
      }

      const data = await response.json();
      toast.success(data.message || "Chat deleted successfully");

      // Remove from local state
      const updatedSessions = chatSessions.filter(
        (chatSession) => chatSession.id !== id
      );
      setChatSessions(updatedSessions);

      // Remove from localStorage
      const storedSessions: string[] = JSON.parse(
        localStorage.getItem("chat_sessions") || "[]"
      );
      const filteredStoredSessions = storedSessions.filter(
        (sessionId) => sessionId !== id
      );
      localStorage.setItem(
        "chat_sessions",
        JSON.stringify(filteredStoredSessions)
      );

      // Decide what to show next
      if (updatedSessions.length > 0) {
        // Switch to first session in queue
        const firstSession = updatedSessions[0];
        handleCurrentChatSession(firstSession.id);
      } else {
        // If no sessions left, fallback to welcome session
        setChatSessions([welcomeSession]);
        setSessionId("1");
        setMessages([welcomeMessage]);
        if (newChatSessionBtnRef.current) {
          newChatSessionBtnRef.current.disabled = true;
        }
      }

      // Close modal
      setDeleteChatSessionModal(false);
    } catch (error) {
      console.error("Error deleting chat session:", error);
      toast.error("Something went wrong while deleting the chat.");
      setDeleteChatSessionModal(false);
    }
  };

  const saveEditedName = async (id: string) => {
    if (!editedName.trim()) {
      toast.error("Session name cannot be empty.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/rename`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: id, new_name: editedName }),
        }
      );

      if (res.ok) {
        setChatSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, name: editedName } : s))
        );
      } else {
        const errorText = await res.text();
        throw errorText;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while renaming the session.");
    } finally {
      setEditingSessionId(null);
      setEditedName("");
    }
  };

  const cancelEdit = () => {
    setEditingSessionId(null);
    setEditedName("");
  };

  useEffect(() => {
    if (Array.isArray(chatSessions)) {
      const suggestions = chatSessions
        .filter((session: any) => session.id !== "1") // exclude id==="1"
        .map((session: any) => ({
          id: session.id,
          display:
            session.sessionName || session.session_name || "Unnamed Session",
        }));
      setChatSessionSuggestions(suggestions);
    }
  }, [chatSessions]);

  if (showSplash) return <SplashScreen />;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-[20%] border-r bg-muted/30 flex flex-col overflow-y-auto scrollbar-none">
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PrivGPT Studio</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Collapsible
              open={isChatSessionsCollapsed}
              onOpenChange={setIsChatSessionsCollapsed}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="default"
                  className="w-full justify-between"
                  aria-expanded={!isChatSessionsCollapsed}
                >
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chats
                  </div>
                  {isChatSessionsCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-1 mt-2">
                {chatSessions.map((session, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleCurrentChatSession(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      {editingSessionId === session.id ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          onBlur={(e) => {
                            setTimeout(() => {
                              if (document.activeElement !== inputRef.current) {
                                saveEditedName(session.id);
                              }
                            }, 100);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEditedName(session.id);
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              cancelEdit();
                            }
                          }}
                          autoFocus
                          className="text-sm font-medium bg-transparent border-b border-black outline-none"
                        />
                      ) : (
                        <p className="text-sm font-medium truncate cursor-pointer">
                          {session.sessionName}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground truncate">
                        {session.lastMessage}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className={`${session.id == "1" && ""}`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRenameSession(session.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteChatSessionModal(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Button
              ref={newChatSessionBtnRef}
              variant="ghost"
              className="w-full justify-start"
              onClick={handleNewChatSession}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Info className="w-4 h-4 mr-2" />
              Model Info
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </nav>
        </div>

        {/* Model Selection */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">AI Model</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Stream</span>
              <Switch
                checked={streamingEnabled}
                onCheckedChange={setStreamingEnabled}
              />
            </div>
          </div>
          <Select
            value={selectedModel}
            onValueChange={(model: string) => {
              setSelectedModel(model);
              setSelectedModelType(
                localModels.includes(model) ? "local" : "cloud"
              );
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1 text-xs text-muted-foreground">
                Local Models
              </div>
              {localModels.map((model) => (
                <SelectItem key={model} value={model}>
                  <div className="flex items-center">
                    <Cpu className="w-4 h-4 mr-2" />
                    {model}
                  </div>
                </SelectItem>
              ))}

              <div className="px-2 py-1 text-xs text-muted-foreground mt-2">
                Cloud Models
              </div>
              {cloudModels.map((model) => (
                <SelectItem key={model} value={model}>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {model}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Usage Stats */}
        <div className="p-4 flex-1">
          <h3 className="font-semibold mb-3">Usage Stats</h3>
          <div className="space-y-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-sm">Internet Status</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      status === "Online" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm">Messages</span>
                  </div>
                  <span className="text-sm font-medium">{messages.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm">Latency</span>
                  </div>
                  <span className="text-sm font-medium">{latency}ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col w-[80%]">
        {/* Chat Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Chat Interface</h1>
              <p className="text-sm text-muted-foreground">
                Currently using: {selectedModel}
              </p>
            </div>
            <Badge
              variant={selectedModelType === "cloud" ? "default" : "secondary"}
            >
              {selectedModelType === "cloud" ? "Cloud" : "Local"}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-2xl ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.file && (
                    <div className="mt-2 flex items-center space-x-2 bg-muted/50 rounded-lg p-2 max-w-xs mb-3">
                      {getFileIcon(message.file.type)}
                      <div>
                        <p className="text-sm font-medium max-w-[100px] truncate">
                          {message.file.name}
                        </p>
                        <p className="text-[0.6em]">
                          {formatFileSize(message.file.size)}
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="whitespace-pre-wrap">
                      {message.content === '...' ? (
                        <LoadingDots />
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-3 prose-pre:rounded-md prose-code:text-pink-600 dark:prose-code:text-pink-400">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              pre: ({ children, ...props }: ComponentProps) => (
                                <pre
                                  {...props}
                                  className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto"
                                >
                                  {children}
                                </pre>
                              ),
                              code: ({ children, className, ...props }: ComponentProps) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code
                                    className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              blockquote: ({ children, ...props }: ComponentProps) => (
                                <blockquote
                                  {...props}
                                  className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2"
                                >
                                  {children}
                                </blockquote>
                              ),
                              table: ({ children, ...props }: ComponentProps) => (
                                <div className="overflow-x-auto">
                                  <table
                                    {...props}
                                    className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
                                  >
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children, ...props }: ComponentProps) => (
                                <th
                                  {...props}
                                  className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-left font-semibold"
                                >
                                  {children}
                                </th>
                              ),
                              td: ({ children, ...props }: ComponentProps) => (
                                <td
                                  {...props}
                                  className="border border-gray-300 dark:border-gray-600 px-3 py-2"
                                >
                                  {children}
                                </td>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                  <p
                    suppressHydrationWarning
                    className="text-xs opacity-70 mt-1"
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-2xl">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          {/* File Preview */}
          {uploadedFile && (
            <div className="mb-3 flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                {getFileIcon(uploadedFile.type)}
                <div>
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Voice Input Button */}
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceInput}
              className={`${isRecording ? "text-red-500" : ""}`}
            >
              <Mic className="w-4 h-4" />
              {isRecording && (
                <span className="ml-1 text-xs">Recording...</span>
              )}
            </Button>
          </div>

          {/* Input Row */}
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedModelType == "local"}
            >
              <Plus className="w-4 h-4" />
            </Button>

            {chatSessionSuggestions.length > 0 ? (
              <MentionsInput
                value={input}
                onChange={(_event, newValue) => setInput(newValue)}
                placeholder="Type your message and use @ to mention chats..."
                style={{
                  control: {
                    backgroundColor: "transparent",
                    fontSize: 14,
                  },
                  highlighter: {
                    padding: "0.5rem 0.75rem",
                    border: "none",
                  },
                  input: {
                    padding: "0.5rem 0.75rem",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                  },
                  suggestions: {
                    list: {
                      backgroundColor: "white",
                      border: "1px solid rgba(0,0,0,0.15)",
                      fontSize: 14,
                    },
                    item: {
                      padding: "5px 15px",
                      "&focused": {
                        backgroundColor: "#f5f5f5",
                      },
                    },
                  },
                }}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-input disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={handleKeyPress}
              >
                <Mention
                  trigger="@"
                  markup="@\[__display__\]\(__id__\)"
                  data={chatSessionSuggestions}
                  displayTransform={(id: string, display: string) =>
                    `@${display}`
                  }
                  style={{ backgroundColor: "#e0e2e4" }}
                  appendSpaceOnAdd
                />
              </MentionsInput>
            ) : (
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message in markdown..."
                className="flex-1 resize-none min-h-[80px]"
              />
            )}
            {isStreaming ? (
              <Button
                onClick={stopGeneration}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
              >
                Stop
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                disabled={isTyping || (!uploadedFile && input.trim() === "")}
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClearChatSessionModal(true)}
              >
                <Eraser className="w-4 h-4 mr-1" />
                Clear Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportChatSessionModal(true)}
              >
                <Download className="w-4 h-4 mr-1" />
                Export Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Chat Session Confirmation Modal */}
      <Dialog
        open={clearChatSessionModal}
        onOpenChange={setClearChatSessionModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Chat History</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all messages in this chat? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClearChatSessionModal(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearChatSession}>
              Clear Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Chat Session Confirmation Modal */}
      <Dialog
        open={exportChatSessionModal}
        onOpenChange={setExportChatSessionModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Chat History</DialogTitle>
            <DialogDescription>
              This will download your chat history as a text file. Do you want
              to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportChatSessionModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleExportChatSession}>Export Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chat Session Confirmation Modal */}
      <Dialog
        open={deleteChatSessionModal}
        onOpenChange={setDeleteChatSessionModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat permanently? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportChatSessionModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteChatSession(sessionId)}
            >
              Delete Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}