
# 🚀 AITutor: AI-Powered Tutor Application

## Table of Contents

- **Overview**
- **Project Structure**
- **Features**
- **Technology Stack**
- **Installation**
- **Environment Setup**
- **Running the Project**
- **Configuration Files**
- **Database Setup**
- **Component Details**
- **API & Endpoints**
- **Style & Theming**
- **Annotation Standards**
- **Scripts**
- **Contributing**
- **License & Credits**

***

## 🗂️ Overview

**AITutor1** is a modular AI tutoring web application leveraging TypeScript, Next.js, and Supabase for real-time educational interactions, resource annotation, and secure content handling. This codebase supports chat-driven conversational tutorials plus PDF annotation and dashboard analytics.

***

## 🛠️ Project Structure

```
AITutor1/
│
├── app/
│   ├── api/
│   │   └── chat/            # Chat API endpoint
│   ├── auth/                # Authentication logic
│   ├── dashboard/           # Dashboard UI
│   ├── layout.tsx           # Main layout
│   ├── page.tsx             # Main app page
│   └── globals.css          # Global style
│
├── components/
│   ├── chat-interface.tsx      # Chat UI
│   ├── dashboard-client.tsx    # Dashboard logic
│   ├── pdf-upload-dialog.tsx   # PDF upload dialog
│   ├── pdf-viewer.tsx          # PDF viewer
│   ├── theme-provider.tsx      # Theme/context
│   └── ui/                     # UI primitives
│
├── lib/
│   ├── utils.ts                # Utility functions
│   └── supabase/
│       ├── client.ts           # Supabase client config
│       ├── middleware.ts       # Supabase middleware
│       └── server.ts           # Supabase server utils
│
├── public/                  # Static assets (img, favicon)
│
├── scripts/                 # Database SQL scripts
│   ├── 000_complete_setup.sql
│   ├── 001_create_tables.sql
│   ├── 002_profile_trigger.sql
│   ├── 003_create_storage_bucket.sql
│   └── 004_create_annotations_table.sql
│
├── styles/                  # Stylesheets (global.css)
│
├── ANNOTATIONS_GUIDE.md     # Annotation best practices
├── components.json          # UI/Component registry
├── middleware.ts            # Global middleware
├── next.config.mjs          # Next.js config
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies/scripts
└── README.md                # Project documentation
```


***

## 🎯 Features

- **Conversational AI Chat:** Advanced tutor chat interface with real-time LLM responses
- **PDF Annotation:** Upload & view PDFs, annotate content for study/review
- **User Authentication:** Secure login/auth flow
- **Personalized Dashboard:** Track user activity, resource usage stats
- **Supabase Integration:** Backend database, auth, storage
- **Component-based Design:** Extensible UI for custom learning modules
- **Theming:** Customizable look via theme-provider
- **Full SQL Setup:** Automated database scripts for instant setup

***

## ⚙️ Technology Stack

- **Frontend:** Next.js, TypeScript, React
- **Backend:** Supabase (Auth, DB, Storage), Custom Middleware
- **Styling:** CSS (globals.css), Theme support
- **Database:** PostgreSQL (via Supabase), SQL setup scripts
- **Other:** PDF handling, Modular file/component driven design

***

## 📦 Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/JuhiPatel7/AI-Tutor
    cd AITutor
    ```

2. **Install dependencies**
    - Using `npm`:
      ```bash
      npm install
      ```
    - Using `pnpm`:
      ```bash
      pnpm install
      ```

    Ensure you have Node.js ≥ 18 and a package manager (`npm` or `pnpm`) installed.

***

## 🌐 Environment Setup

- **Environment Variables (`.env.local`):**
  - SUPABASE_URL: Your Supabase project URL
  - SUPABASE_ANON_KEY: Supabase anonymous key

  Example:
  ```env
  SUPABASE_URL=https://your-supabase-url.supabase.co
  SUPABASE_ANON_KEY=your_supabase_key
  ```

- **Database Initialization:**
  - Run SQL scripts in `/scripts` with Supabase SQL editor or `psql`.
    - `000_complete_setup.sql` – Run for full DB+bucket+tables setup
    - `001_create_tables.sql` – Create tables only
    - `002_profile_trigger.sql` – Add profile triggers
    - `003_create_storage_bucket.sql` – Set up storage bucket
    - `004_create_annotations_table.sql` – Set up annotation table

***

## ▶️ Running the Project

1. **Start the Development Server:**  
   ```bash
   npm run dev
   ```
   or
   ```bash
   pnpm dev
   ```
   - Default URL: `http://localhost:3000`

2. **Production Build:**
   ```bash
   npm run build
   npm start
   ```
   or use the equivalent `pnpm` commands.

***

## 📄 Configuration Files

- `next.config.mjs`: Next.js framework config (custom routes, env setup)[1]
- `tsconfig.json`: TypeScript project options[2]
- `package.json`: Dependencies, scripts, metadata[3]
- `components.json`: Registry of available UI components[4]
- `middleware.ts`: Custom logic for auth, API, etc.[5]

***

## 🗃️ Database Setup

- SQL scripts for full DB (users, buckets, annotations)[6][7][8][9][10]
- Uses PostgreSQL (via Supabase)
- Annotation schema and triggers as per guide[11]

***

## 🪢 Component Details

- `chat-interface.tsx`: Chat IU integration with LLM/API[12]
- `dashboard-client.tsx`: Dashboard stats and charts[13]
- `pdf-upload-dialog.tsx`: Dialog for uploading PDFs[14]
- `pdf-viewer.tsx`: In-browser PDF viewing/annotation[15]
- `theme-provider.tsx`: Theming context for UI[16]
- `/components/ui`: Primitives for custom widgets[17]
- `/lib/supabase/*`: Client, server, middleware utilities for Supabase[18][19][20]

***

## 🌐 API & Endpoints

- `/api/chat/route.ts`: REST endpoint for chat/tutor conversation pipeline[21]
- `/auth`: All auth routes/functions[22]
- Uses middleware for custom API auth and request handling[19][5]

***

## 🎨 Style & Theming

- `globals.css`: Universal style rules for the entire app[23]
- Custom themes via `theme-provider.tsx`[16]

***

## ✏️ Annotation Standards

- See `ANNOTATIONS_GUIDE.md` for:
  - Annotation style
  - Data labeling conventions
  - Project annotation best practices[11]

***

## 🗂️ Scripts

- For DB set-up – see `/scripts` directory[7][8][9][10][6]
- Usage:
  ```bash
  psql -d <your-db> -f scripts/000_complete_setup.sql
  ```
  Adjust for each script as needed.

***

## 🤝 Contributing

- Fork and clone repo
- Create a new branch
- Submit PR with detailed description
- Ensure code style matches lint rules and project structure

***

## 🏷️ License & Credits

- Standard MIT or project-specific license (add your preferred license to `/LICENSE`)
- Built using Next.js & Supabase


