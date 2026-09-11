import React, { useState } from 'react';
import { Rocket, Github, Globe, Server, Check, Copy, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { safeCopyToClipboard } from '../utils/safeStorage';

interface DeploymentGuideProps {
  language?: 'bn' | 'en';
}

export const DeploymentGuide: React.FC<DeploymentGuideProps> = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await safeCopyToClipboard(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vercelJsonCode = `{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

  const ghActionCode = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Application
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist`;

  const dockerfileCode = `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 absolute top-0 left-0" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <Rocket className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  Full Deployment & Free Hosting Guide
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                  Zero Cost
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium max-w-2xl">
                Step-by-step instructions to deploy Bathuary GP Portal for FREE on GitHub Pages, Vercel, or custom Docker/Cloud Run servers with HTTPS SSL.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Free SSL Certificate</span>
            <span className="text-sm font-black text-emerald-400">Included</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Global CDN Speed</span>
            <span className="text-sm font-black text-teal-300">&lt; 50ms Edge</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">PWA Support</span>
            <span className="text-sm font-black text-indigo-300">Offline Cache</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost Per Month</span>
            <span className="text-sm font-black text-amber-300">₹0 (100% Free)</span>
          </div>
        </div>
      </div>

      {/* Option 1: Vercel (Recommended) */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 border-2 border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden space-y-4">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
        
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Method 1: 1-Click Free Deploy on Vercel (Recommended)
              </h3>
              <p className="text-xs text-slate-500 font-medium">Automatic builds, instant edge CDN & free custom domain</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs">
            Recommended
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <p>
            Vercel offers free automatic HTTPS SSL, global fast CDN, and zero server maintenance cost.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-800 font-medium text-xs">
            <li>
              <strong>Push Code to GitHub:</strong>{' '}
              Create a GitHub repository and push your project code or ZIP contents.
            </li>
            <li>
              <strong>Login to Vercel:</strong>{' '}
              <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-black hover:underline inline-flex items-center gap-1">
                vercel.com <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and connect your GitHub account.
            </li>
            <li>
              <strong>Import Project:</strong>{' '}
              Click 'Add New' &rarr; Project, select your repository. Framework Preset will auto-detect as 'Vite'.
            </li>
            <li>
              <strong>Build & Output Settings:</strong>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 my-1.5 space-y-1 border border-slate-800">
                <p>Build Command: <span className="text-white">npm run build</span></p>
                <p>Output Directory: <span className="text-white">dist</span></p>
                <p>Install Command: <span className="text-white">npm install</span></p>
              </div>
            </li>
            <li>
              <strong>Click Deploy:</strong>{' '}
              Your portal will be live in 60 seconds with a free domain like `bathuary-gp.vercel.app`.
            </li>
          </ol>
        </div>

        {/* vercel.json snippet */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
            <span className="font-mono text-slate-800">vercel.json (SPA Fallback Routing Configuration)</span>
            <button
              onClick={() => copyToClipboard(vercelJsonCode, 'vercel')}
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-black cursor-pointer bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs hover:bg-emerald-100 transition-colors"
            >
              {copiedSection === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'vercel' ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-md">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-[10px] text-slate-400 font-mono ml-2">vercel.json</span>
            </div>
            <pre className="p-4 text-emerald-400 font-mono text-xs overflow-x-auto">
              {vercelJsonCode}
            </pre>
          </div>
        </div>
      </div>

      {/* Option 2: GitHub Pages */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-sky-50/20 border-2 border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden space-y-4">
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-blue-500 absolute top-0 left-0" />
        
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center shadow-md shadow-slate-900/20">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Method 2: 100% Free Hosting on GitHub Pages
              </h3>
              <p className="text-xs text-slate-500 font-medium">Native GitHub CI/CD action pipeline</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-sky-100 text-sky-950 border border-sky-300 shadow-2xs">
            Free Forever
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <p>
            GitHub Pages allows free static hosting directly from your repository with automatic build triggers.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-800 font-medium text-xs">
            <li>
              <strong>Check Vite base path:</strong>{' '}
              If your repository name is `bathuary-gp`, setting `base: './'` in `vite.config.ts` ensures proper asset paths.
            </li>
            <li>
              <strong>Create GitHub Action Workflow:</strong>{' '}
              Add `.github/workflows/deploy.yml` with the following workflow configuration.
            </li>
            <li>
              <strong>Enable GitHub Pages in Settings:</strong>{' '}
              Go to Repo Settings &rarr; Pages &rarr; Source: 'GitHub Actions'.
            </li>
          </ol>
        </div>

        {/* Workflow code snippet */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
            <span className="font-mono text-slate-800">.github/workflows/deploy.yml</span>
            <button
              onClick={() => copyToClipboard(ghActionCode, 'gh')}
              className="flex items-center gap-1.5 text-sky-700 hover:text-sky-800 font-black cursor-pointer bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shadow-2xs hover:bg-sky-100 transition-colors"
            >
              {copiedSection === 'gh' ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'gh' ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-md">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-[10px] text-slate-400 font-mono ml-2">deploy.yml</span>
            </div>
            <pre className="p-4 text-sky-300 font-mono text-xs overflow-x-auto max-h-56">
              {ghActionCode}
            </pre>
          </div>
        </div>
      </div>

      {/* Option 3: Docker & Custom Server */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-purple-50/20 border-2 border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden space-y-4">
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-indigo-500 absolute top-0 left-0" />
        
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Method 3: Docker Container & Cloud Run
              </h3>
              <p className="text-xs text-slate-500 font-medium">Enterprise containerization for VPS or Cloud deployment</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          For production full-stack deployment with rate-limiting and custom Node server on any VPS, Docker host, or Cloud Run:
        </p>

        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
            <span className="font-mono text-slate-800">Dockerfile</span>
            <button
              onClick={() => copyToClipboard(dockerfileCode, 'docker')}
              className="flex items-center gap-1.5 text-purple-700 hover:text-purple-800 font-black cursor-pointer bg-purple-50 px-3 py-1 rounded-full border border-purple-200 shadow-2xs hover:bg-purple-100 transition-colors"
            >
              {copiedSection === 'docker' ? <Check className="w-3.5 h-3.5 text-purple-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'docker' ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-md">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-[10px] text-slate-400 font-mono ml-2">Dockerfile</span>
            </div>
            <pre className="p-4 text-emerald-400 font-mono text-xs overflow-x-auto">
              {dockerfileCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
