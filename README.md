# <p align=center> PrivGPT## 🔗 Quick Links

- [🚀 Demo](#-demo)
- [🌐 Live Project](#-live-project)
- [💡 Why It's Needed](#-why-its-needed)dio </p>

<p align=center> <b>Your private AI studio — versatile, secure, and all‑in‑one.</b> </p>

<div align="center">
<p>

[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)
![Visitors](https://api.visitorbadge.io/api/visitors?path=rucha-ambaliya%2Fprivgpt-studio%20&countColor=%23263759&style=flat)
![GitHub forks](https://img.shields.io/github/forks/rucha-ambaliya/privgpt-studio)
![GitHub Repo stars](https://img.shields.io/github/stars/rucha-ambaliya/privgpt-studio)
![GitHub contributors](https://img.shields.io/github/contributors/rucha-ambaliya/privgpt-studio)
![GitHub last commit](https://img.shields.io/github/last-commit/rucha-ambaliya/privgpt-studio)
![GitHub repo size](https://img.shields.io/github/repo-size/rucha-ambaliya/privgpt-studio)
[![License: PolyForm Noncommercial](https://img.shields.io/badge/License-PolyForm%20Noncommercial-brightgreen.svg)](https://polyformproject.org/licenses/noncommercial/1.0.0/)
![GitHub issues](https://img.shields.io/github/issues/rucha-ambaliya/privgpt-studio)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/rucha-ambaliya/privgpt-studio)
![GitHub pull requests](https://img.shields.io/github/issues-pr/rucha-ambaliya/privgpt-studio)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/rucha-ambaliya/privgpt-studio)

</p>
</div>

<div id="top"></div>

## 🔗 Quick Links

- [🚀 Demo](#-demo)
- [💡 Why It’s Needed](#-why-its-needed)
- [📦 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🖥️ Getting Started](#️-getting-started)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📜 Code of Conduct](#-code-of-conduct)
- [💬 Support](#-support)
- [🌟 Project Admin and Mentors](#-project-admin-and-mentors)
- [🙌 Project Contributors](#-project-contributors)
- [⚖ License](#-license)
<br>

## 🎥 Demo

https://github.com/user-attachments/assets/fcaacd82-20ee-4cb0-9510-b5734b502810

## 🚀 Live Project

Check out the live demo: [**PrivGPT Studio**](https://privgpt-studio.vercel.app/)

<h3 align="right"><a href="#top">⬆️</a></h3>

## 💡 Why It’s Needed

AI tools are everywhere — but most send your data to cloud servers you can’t control.  
**Startups, researchers, and creators need AI that’s private, flexible, and powerful.**

👉 **PrivGPT Studio solves this by combining local and cloud models in one workspace, with:**  
✅ Full privacy control (no hidden history sharing)  
✅ Versatile input (text, PDF, images, voice)  
✅ Offline fallback, multi‑chat management, latency tracking

**AI without compromise.**

<h3 align="right"><a href="#top">⬆️</a></h3>

## 📦 Features

🧠 Multi‑chat with cross‑references<br>
🔒 Privacy‑first design (local/cloud separation)<br>
📄 PDF summarization<br>
📊 image/graph interpretation<br>
🎤 voice input<br>
✨ Rename, export, delete sessions<br>
⚡ Offline fallback to local models<br>
📈 Latency count and metrics<br>

<h3 align="right"><a href="#top">⬆️</a></h3>

## 🛠 Tech Stack
<p>
  <!-- Next.js -->
  <a href="https://nextjs.org/"> <img height="65" src="https://img.icons8.com/?size=100&id=MWiBjkuHeMVq&format=png&color=000000" alt="Next.js"/> </a>
  <!-- React.js -->
  <a href="https://www.w3schools.com/REACT/DEFAULT.ASP"> <img src="https://img.icons8.com/?size=64&id=NfbyHexzVEDk&format=png" alt="React" /></a>
  <!-- Tailwind -->
  <a href="https://tailwindcss.com/"> <img src="https://img.icons8.com/?size=100&id=CIAZz2CYc6Kc&format=png&color=000000" alt="Tailwind" height="63" style="margin-right:10px;"/></a>
  <!-- Flask -->
  <a href="https://flask.palletsprojects.com/"> <img src="https://img.icons8.com/?size=64&id=ewGOClUtmFX4&format=png" alt="Flask" height="68"/> </a>
  <!-- MongoDB -->
  <a href="https://www.mongodb.com/"> <img src="https://img.icons8.com/?size=64&id=74402&format=png" alt="MongoDB"/> </a>
</p>

**Frontend:** Next.js (React), TailwindCSS  
**Backend:** Flask (Python)  
**Database:** MongoDB  
**AI:**<br>
&nbsp;&nbsp;&nbsp;● **Local:** Ollama models<br>
&nbsp;&nbsp;&nbsp;● **Cloud:** Gemini API

<h3 align="right"><a href="#top">⬆️</a></h3>

## 🖥️ Getting Started

Before you begin, make sure you have the following installed on your system: 
- **Git** 
- **Node.js** (v18+ recommended)  
- **Python** (3.9 or above)  
- **pip** (Python package manager)    
- (Optional) **Ollama** installed locally if you want to use local models.

### 1. Fork this repository.

### 2. Clone the repository

```bash
git clone https://github.com/<your-github-username>/PrivGPT-Studio.git
cd PrivGPT-Studio
```

### 3. Set up the client (Next.js frontend)

```bash
cd client

npm ci
# If you face a dependency conflict (ERESOLVE error), try:
# npm install --legacy-peer-deps
# If that doesn't work either, try:
# npm install

copy .env.example .env 
# (For linux) cp .env.example .env
# To learn how to obtain the variables required in '.env',
# please see 'docs/env-setup-guide.md'.

npm run dev
# Runs on http://localhost:3000
```

### 4. Set up the server (Flask backend)

```bash
cd server

python -m venv venv 
venv\Scripts\activate 
# For (Linux/Mac) source venv/bin/activate

pip install -r requirements.txt

copy .env.example .env 
# (For linux) cp .env.example .env
# To learn how to obtain the variables required in '.env',
# please see 'docs/env-setup-guide.md'.

python app.py
# Runs on http://localhost:5000
```

### 5. (Optional) Start Ollama locally

```bash
ollama serve
ollama pull <model_name>
```

<h3 align="right"><a href="#top">⬆️</a></h3>

## 📂 Project Structure

```bash
privgpt-studio/
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── CODE_OF_CONDUCT.md
│   └── ...
│
├── assets/
│
├── client/          # Next.js frontend
│   ├── app/
│   ├── components/
│   └── ...
│
├── docs/            
│   └── env-setup-guide.md
│   
├── server/          # Flask backend
│   ├── routes/ 
│   ├── services/
|   ├── utils/
|   ├── __init__.py
|   ├── app.py
|   ├── requirements.txt
│   └── ...
│
├── LICENSE           
└── README.md
```

<h3 align="right"><a href="#top">⬆️</a></h3>

## 🤝 Contributing

Contributions are welcome! 🎉  
Please check our [Contributing Guidelines](.github/CONTRIBUTING.md) to learn about:
- Our development process
- How to propose bug fixes and improvements
- Coding standards and PR workflow

<h3 align="right"><a href="#top">⬆️</a></h3>

## 📜 Code of Conduct
We are committed to creating a welcoming and inclusive environment for everyone. Please be respectful, inclusive, and considerate in all interactions.

By participating in this project, you agree to follow our [Code of Conduct](./.github/CODE_OF_CONDUCT.md).

If you witness or experience unacceptable behavior, please report it privately via [ruchaambaliya@gmail.com](mailto:ruchaambaliya@gmail.com).

<h3 align="right"><a href="#top">⬆️</a></h3>

## 💬 Support

If you have other questions, need help, or want to start a discussion about **PrivGPT Studio**,  
please join our [Discord Server](https://discord.gg/J9z5T52rkZ).  
💡 We’d love to hear your ideas, feedback, and suggestions there!

<h3 align="right"><a href="#top">⬆️</a></h3>

## 🌟 Project Admin and Mentors

<table>
<tr>
<td align="center">
<a href="https://github.com/rucha-ambaliya"><img src="https://github.com/rucha-ambaliya.png" height="140px" width="140px" alt="Rucha Ambaliya"></a><br><sub><b>Project Admin - Rucha Ambaliya</b></sub>
</tr>
</table>

<h3 align="right"><a href="#top">⬆️</a></h3>

## 🙌 Project Contributors

<a href="https://github.com/rucha-ambaliya/privgpt-studio/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rucha-ambaliya/privgpt-studio&cache_burst=1" />
</a>

<h3 align="right"><a href="#top">⬆️</a></h3>

## ⚖ License
This project is licensed under the [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0). Make sure to review and comply with the license terms.

✔️ You may use, modify, and share the code only for **non‑commercial purposes**.  
✔️ You must include the following attribution in any copies or derivative works:  
`Required Notice: Copyright 2025 Rucha Ambaliya (https://github.com/rucha-ambaliya/privgpt-studio)`  
🚫 Commercial use requires **separate permission** from the author.

See the [LICENSE](https://github.com/rucha-ambaliya/privgpt-studio/blob/master/LICENSE) file for more details.

<h3 align="right"><a href="#top">⬆️</a></h3>
