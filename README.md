# InstaOutreachOS

Automated software platform for marketers to scale Instagram outreach in a compliant way.

## Compliance Guarantee
- **No Bots**: We do not send automated DMs or perform automated likes/follows.
- **Assisted Workflow**: The platform prepares the strategy and drafts; humans perform the action.
- **Official APIs**: Designed for Meta Graph API compatibility.

## Setup Instructions

### 1. Prerequisites
- Node.js 20+
- PostgreSQL database
- Redis (optional, for BullMQ - basic implementation uses Cron/DB)

### 2. Installation
```bash
npm install
npx prisma generate
```

### 3. Environment Variables & APIs

You need to create a `.env` file in the project root. Below is a detailed guide on each variable and where to get the keys.

| Variable | Description | Where to Get It |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string. | Use [Supabase](https://supabase.com) (free) or [Railway](https://railway.app). |
| `NEXTAUTH_SECRET` | Used for encrypting session tokens. | Generate a random string using `openssl rand -base64 32` or just type random characters. |
| `NEXTAUTH_URL` | The public URL of your app. | `http://localhost:3000` for development. Unset on Vercel (it manages itself). |
| `OPENAI_API_KEY` | For the AI personalization engine. | Create an account at [platform.openai.com](https://platform.openai.com) and generate an API key. |
| `GOOGLE_CLIENT_ID` | For "Sign in with Google" feature. | Create a project in [Google Cloud Console](https://console.cloud.google.com/), set up OAuth credentials. |
| `GOOGLE_CLIENT_SECRET` | Secret key for Google Login. | Same as above (Client ID creation). |

#### Step-by-Step API Setup:

**A. Database (PostgreSQL)**
1. Go to [Supabase](https://supabase.com).
2. Create a new project.
3. Go to **Project Settings** > **Database** > **Connection string**.
4. Copy the **URI** and paste it as your `DATABASE_URL`.

**B. AI Personalization (OpenAI)**
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys).
2. Create a new secret key.
3. Paste it as `OPENAI_API_KEY`. 
   > [!TIP]
   > Set a usage limit in your OpenAI dashboard to avoid unexpected costs.

**C. Authentication (Google Login)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create **OAuth 2.0 Client IDs**.
3. Set **Authorized redirect URIs** to:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://your-app-url.vercel.app/api/auth/callback/google`
4. Copy the Client ID and Secret to your `.env`.

### 4. Running Locally
```bash
npm run dev
```

## Deployment to Vercel (via Git)

### 1. Install Git
The `git` command was not recognized in your terminal. Please ensure Git is installed:
- Download from [git-scm.com](https://git-scm.com/download/win).
- During installation, ensure "Git from the command line and also from 3rd-party software" is selected.
- Restart your terminal after installation.

### 2. Initialize and Push to GitHub
Run these commands in your project root:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/swiftagencyy-coder/test.git
git push -u origin main
```

### 3. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** > **Project**.
3. Import the `test` repository.
4. **IMPORTANT**: Expand the **Environment Variables** section. **You must copy ALL values from your local `.env` here manually.**
   - Vercel cannot see your local `.env` file (it is ignored by security rules).
   - Add these keys: `DATABASE_URL`, `NEXTAUTH_SECRET`, `OPENAI_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
   - For `NEXTAUTH_SECRET`, make sure it's a long random string.
5. Click **Deploy**.

> [!WARNING]
> If you already deployed and see "Server Error", go to **Settings** > **Environment Variables** in Vercel, add the keys, and then **Redeploy** the latest commit.

## Human-in-the-loop Workflow
1. **Import Leads**: Upload your target handles via CSV.
2. **Setup Campaign**: Define your outreach sequence steps.
3. **Generate Queue**: Every morning, the system picks the best leads to contact.
4. **Perform Outreach**: Open the generated tasks, click "Open Profile", copy the AI-drafted message, and send it manually.
5. **Log Outcome**: Mark as sent to advance the lead in your CRM.
