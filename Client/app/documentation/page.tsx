"use client";

import Image from "next/image";
import Link from "next/link";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">📖 PrivGPT-Studio Documentation</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Learn how to set up and use <span className="font-semibold">PrivGPT-Studio</span>. 
          This guide walks you through installation, features, and usage with clear examples.
        </p>
      </div>

      {/* Getting Started */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Clone the repository: <code className="bg-gray-200 px-1 rounded">git clone https://github.com/your-username/PrivGPT-Studio.git</code></li>
          <li>Install dependencies for <b>frontend</b>:
            <pre className="bg-gray-900 text-white text-sm p-3 rounded mt-2 overflow-x-auto">
              cd client <br /> npm install <br /> npm run dev
            </pre>
          </li>
          <li>Install dependencies for <b>backend</b>:
            <pre className="bg-gray-900 text-white text-sm p-3 rounded mt-2 overflow-x-auto">
              cd server <br /> pip install -r requirements.txt <br /> python app.py
            </pre>
          </li>
          <li>Open <Link href="http://localhost:3000" target="_blank" className="text-blue-600 underline">http://localhost:3000</Link> in your browser.</li>
        </ol>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">✨ Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Multi-chat sessions with AI assistants.</li>
          <li>Offline-first design with Ollama, fallback to Gemini API.</li>
          <li>Import/Export chat history (JSON format).</li>
          <li>Performance metrics: token count & latency tracking.</li>
          <li>Secure and private: no data sharing without permission.</li>
        </ul>
      </section>

      {/* Demo Screenshots */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🖼 Demo Screenshots</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image src="/assets/dashboard.png" alt="Dashboard" width={600} height={400} className="w-full" />
            <p className="p-3 text-gray-600">Main dashboard showcasing chat and navigation.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image src="/assets/chat.png" alt="Chat Interface" width={600} height={400} className="w-full" />
            <p className="p-3 text-gray-600">Chat interface with local + cloud fallback.</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          (Replace images in <code>client/public/docs/</code> with your own screenshots.)
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        Built with ❤️ for <Link href="/" className="text-blue-600 underline">PrivGPT-Studio</Link>
      </footer>
    </div>
  );
}
