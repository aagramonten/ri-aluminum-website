# RI Aluminum — richardsonindustrialpr.com

Website for Richardson Industrial PR — aluminum doors, windows, and railings in Puerto Rico.

## Tech Stack

| Layer      | Tool               |
|------------|--------------------|
| Frontend   | HTML + CSS + JS    |
| Hosting    | Vercel             |
| Version Control | GitHub        |
| Email      | Resend             |
| Code Editor | VS Code           |

---

## 🚀 First-Time Setup

### Step 1 — Install VS Code
Download from https://code.visualstudio.com  
Install the **Live Server** extension (by Ritwick Dey) to preview locally.

### Step 2 — Install Node.js
Download from https://nodejs.org (LTS version)  
This is needed to install packages.

### Step 3 — Install Git
Download from https://git-scm.com

### Step 4 — Create a GitHub Account & Repo
1. Go to https://github.com and sign up (or log in)
2. Click **New repository**
3. Name it `ri-aluminum-website` (or anything you like)
4. Leave it **Private**
5. Click **Create repository**

### Step 5 — Push this code to GitHub
Open a terminal in VS Code (`Ctrl+`` ` ``) and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ri-aluminum-website.git
git push -u origin main
```

### Step 6 — Set up Resend (email service)
1. Go to https://resend.com and create a free account
2. Add your domain: **richardsonindustrialpr.com**
3. Resend will give you DNS records — add them in Hostinger's DNS settings
4. Once verified, go to **API Keys** and create one
5. Copy the key — you'll need it next

### Step 7 — Deploy to Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click **Add New Project**
3. Import your `ri-aluminum-website` repository
4. Before deploying, click **Environment Variables** and add:
   - Name: `RESEND_API_KEY`
   - Value: (paste your Resend API key)
5. Click **Deploy** — your site will be live in ~1 minute

### Step 8 — Connect your custom domain
1. In Vercel, go to your project → **Settings → Domains**
2. Add `richardsonindustrialpr.com`
3. Vercel will show you DNS records to add in Hostinger
4. In Hostinger: go to **Domains → DNS / Nameservers** and update the records
5. DNS changes take ~10–30 minutes to propagate

---

## 🔄 How to Update the Site Going Forward

1. Edit files in VS Code
2. Preview with Live Server
3. When ready, run in terminal:
```bash
git add .
git commit -m "describe what you changed"
git push
```
4. Vercel automatically redeploys — live in ~30 seconds ✅

---

## 📁 Project Structure

```
ri-aluminum-website/
├── index.html          # Main page
├── style.css           # All styles
├── script.js           # Frontend logic, product catalog
├── images/             # All images
│   └── products/       # Product photos
├── api/
│   └── send_email.js   # Email handler (replaces send_email.php)
├── vercel.json         # Vercel configuration
├── package.json        # Node dependencies
└── .gitignore          # Files to exclude from git
```

---

## 📧 Email Flow

When a visitor submits the estimate form:
1. `script.js` posts to `/api/send_email.js` (same URL as before: `/send_email.php` redirects automatically)
2. Resend sends a notification email to `info@richardsonindustrialpr.com`
3. Resend sends a confirmation email to the visitor

---

## 🆘 Troubleshooting

**Form not sending emails?**
- Check that `RESEND_API_KEY` is set in Vercel Environment Variables
- Make sure your domain is verified in Resend dashboard
- Check Vercel logs: Project → Deployments → Functions tab

**Site not showing on custom domain?**
- DNS changes can take up to 48 hours (usually 10–30 min)
- Check Vercel → Settings → Domains for status

**Need help?** Contact your developer or open an issue on GitHub.
