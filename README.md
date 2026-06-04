# Deepanshu Ventures - Premium Digital Solutions Portfolio

A professionally organized multi-project portfolio website showcasing three innovative ventures: **AnyTime Tiffin**, **AI Automation Agency**, and **Social Drive**. Built for seamless deployment on Vercel.

## 📋 Project Overview

**Deepanshu Ventures** is a complete digital portfolio hub that brings together multiple independent projects under one professional umbrella. Each venture is fully independent yet integrated through a beautiful landing page.

### 🚀 The Ventures

| Project | Description | Type | Location |
|---------|-------------|------|----------|
| **AnyTime Tiffin** | Fresh homemade tiffin delivery service for M3M Soulitude | Static + Frontend | `/anytimetiffin/` |
| **AI Automation Agency** | AI chatbots, WhatsApp automation, CRM workflows, and voice agents | Static + Frontend | `/ai-automation-agency/` |
| **Social Drive** | ROI-driven social media marketing with performance analytics | Node.js Backend | `/social-drive/` |

---

## 📁 Folder Structure

```
deepanshuventures/
├── index.html                 # Main landing page (Tailwind CSS + Responsive)
├── README.md                  # This file
├── vercel.json                # Vercel deployment configuration
│
├── anytimetiffin/            # AnyTime Tiffin Website
│   ├── index.html            # Main website
│   ├── script.js             # Frontend logic
│   ├── style.css             # Custom styles
│   └── [images & assets]     # Static files (preserved)
│
├── ai-automation-agency/     # AI Automation Agency Website
│   └── index.html            # Main website
│
└── social-drive/             # Social Drive Website (Node.js Backend)
    ├── index.html            # Main website
    ├── server.js             # Express.js backend
    ├── smsService.js         # SMS integration
    ├── package.json          # Dependencies
    ├── data/
    │   └── users.json        # User data storage
    ├── .env                  # Environment variables (create locally)
    ├── .env.example          # Example environment file
    └── node_modules/         # Installed dependencies

```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ (for social-drive backend)
- Git
- A code editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd deepanshuventures
   ```

2. **Install dependencies for Social Drive (if needed)**
   ```bash
   cd social-drive
   npm install
   cd ..
   ```

3. **Set up environment variables for Social Drive**
   ```bash
   cd social-drive
   cp .env.example .env
   # Edit .env with your actual values (API keys, phone number, etc.)
   cd ..
   ```

### Running Locally

#### Option 1: Simple Static Hosting (AnyTime Tiffin + AI Automation + Root Landing)
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```
Then visit: `http://localhost:8000`

#### Option 2: Full Stack (with Social Drive Backend)
```bash
# Terminal 1: Start the Node.js backend for Social Drive
cd social-drive
npm start
# Server will run on http://localhost:3000

# Terminal 2: Serve static files
cd ..
npx http-server -p 8000
```

Then visit: `http://localhost:8000`

### Testing

1. **Root Landing Page**: `http://localhost:8000`
   - Should display the Deepanshu Ventures hub with 3 venture cards
   - Click each card to verify routing works

2. **AnyTime Tiffin**: `http://localhost:8000/anytimetiffin/`
   - Should display the complete tiffin delivery website
   - Verify "← Back to Ventures" link works

3. **AI Automation Agency**: `http://localhost:8000/ai-automation-agency/`
   - Should display the AI services website
   - Verify back link works

4. **Social Drive**: `http://localhost:8000/social-drive/`
   - Should display the marketing website
   - If backend is running, authentication features should work

---

## 🚀 Deployment on Vercel

### Prerequisites
- Vercel account (free tier available at [vercel.com](https://vercel.com))
- GitHub account with this repository

### Deployment Steps

#### Method 1: One-Click Deploy (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"New Project"**
4. Select your GitHub repository
5. Vercel will auto-detect the configuration from `vercel.json`
6. Click **"Deploy"**
7. Your site is live! 🎉

#### Method 2: CLI Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Follow the prompts and select your GitHub repository
```

### Environment Variables on Vercel

If Social Drive backend needs environment variables:
1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add variables from your `.env` file:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `PHONE_NUMBER`
   - Any other required keys

3. Redeploy for changes to take effect: `vercel --prod`

### Post-Deployment

- **Primary URL**: `https://your-project.vercel.app`
- **Sub-project URLs**:
  - Landing: `https://your-project.vercel.app/`
  - Tiffin: `https://your-project.vercel.app/anytimetiffin/`
  - AI Agency: `https://your-project.vercel.app/ai-automation-agency/`
  - Social Drive: `https://your-project.vercel.app/social-drive/`

---

## ⚙️ Configuration Details

### vercel.json
- **Rewrites**: Clean URL routing for each sub-project
- **Headers**: Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- **Cache Control**: 
  - HTML files: 3600s (1 hour)
  - Assets (JS, CSS, images): 31536000s (1 year)
- **Redirects**: Trailing slash handling

### Each Sub-Project

#### AnyTime Tiffin
- **Type**: Static website + Frontend JS
- **Features**: Menu catalog, cart system, WhatsApp ordering
- **Assets**: Images, CSS, JavaScript bundled
- **No backend required** ✅

#### AI Automation Agency
- **Type**: Static website with modern design
- **Features**: Service showcase, pricing, contact forms
- **No backend required** ✅

#### Social Drive
- **Type**: Full-stack (Node.js backend)
- **Features**: User authentication, SMS integration, dashboard
- **Backend**: Express.js server running on Vercel functions
- **Database**: JSON-based (easily upgradable to MongoDB/PostgreSQL)

---

## 🔐 Security & Best Practices

### ✅ Implemented
- HTTPS enforced (automatic on Vercel)
- Security headers configured
- No sensitive data in git (using .env files)
- CORS configured for cross-origin requests
- Input validation on backend

### 📝 Checklist Before Production
- [ ] Test all 3 ventures on production URL
- [ ] Verify back-to-home links work correctly
- [ ] Check mobile responsiveness on all pages
- [ ] Test WhatsApp integration (AnyTime Tiffin)
- [ ] Test SMS service (Social Drive) with test numbers
- [ ] Monitor performance on Vercel Analytics
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics for insights

---

## 🛠️ Maintenance & Updates

### Adding New Features
```bash
# Update local code
git add .
git commit -m "Add feature description"
git push origin main

# Vercel auto-deploys on git push
```

### Updating Dependencies
```bash
# For Social Drive backend
cd social-drive
npm update
npm audit fix  # Fix security vulnerabilities
cd ..
git add .
git commit -m "Update dependencies"
git push
```

### Monitoring
- View logs: `vercel logs <your-project>`
- Check performance: Vercel Dashboard → Analytics
- Monitor errors: Vercel Dashboard → Deployments → Runtime Logs

---

## 📞 Support & Contact

Each venture has its own contact information:
- **AnyTime Tiffin**: Available in the website (WhatsApp)
- **AI Automation Agency**: Contact form on website
- **Social Drive**: Contact/support section on website

---

## 📄 License

This project is created by Deepanshu Ventures. All rights reserved.

---

## 🚀 Quick Command Reference

```bash
# Local development
python -m http.server 8000          # Start static server
cd social-drive && npm start        # Start Node backend

# Deployment
vercel deploy                       # Deploy to staging
vercel --prod                       # Deploy to production

# Testing
npm test                            # Run tests (if configured)
npm run build                       # Build command (if configured)
```

---

**Last Updated**: June 4, 2026  
**Status**: ✅ Production Ready

For issues or improvements, update the code and push to GitHub. Vercel will auto-deploy your changes!
