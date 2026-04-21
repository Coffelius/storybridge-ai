# Deployment Guide - StoryBridge AI

This guide explains how to deploy StoryBridge AI using Coolify on a VPS with a custom subdomain.

## Prerequisites

- A VPS with Docker installed (recommended: 2GB+ RAM, 1 CPU)
- Coolify installed and running on your VPS
- A domain name configured with DNS records pointing to your VPS
- Access to the Coolify web interface

## Quick Start with Coolify

### 1. Create a New Application

1. Log in to your Coolify instance
2. Click "New Application" or "New Project"
3. Select "Git" as the source
4. Connect your GitHub account if not already connected

### 2. Configure the Application

**Repository Settings:**
- Repository: `Coffelius/storybridge-ai`
- Branch: `main` (or `coder-agent/GAB-75-desplegar-demo-publica`)
- Auto-deploy: Enable (optional, for automatic updates)

**Build Settings:**
- Builder: `Dockerfile`
- Dockerfile Path: `./Dockerfile`
- Build Context: `/` (root)
- Port: `3000`

### 3. Configure Domain

1. In your Coolify application, go to "Domains"
2. Add your custom domain: `demo.storybridge.ai` (or your preferred subdomain)
3. Coolify will automatically:
   - Set up SSL certificates (Let's Encrypt)
   - Configure reverse proxy (Traefik)
   - Handle HTTPS redirection

### 4. DNS Configuration

Add the following DNS record for your domain:

```
Type: A
Name: demo (or your subdomain)
Value: <your-vps-ip-address>
TTL: 3600 (or default)
```

**Example:**
```
demo.storybridge.ai.    A    3600    123.45.67.89
```

### 5. Deploy

1. Click "Deploy" in Coolify
2. Wait for the build to complete (2-3 minutes)
3. Once deployed, visit your domain: `https://demo.storybridge.ai`

## What Gets Deployed

The deployment includes:
- **Next.js 16** application with React 19
- **Standalone output** for optimal performance
- **Sample dataset** (`/sample-data.txt`) for demo purposes
- **Automatic HTTPS** via Let's Encrypt
- **Health checks** for automatic recovery

## Demo Features

When users visit the deployed demo, they can:
1. Upload their own Story Plotter export files
2. Click "Load Demo Data" to explore with an example story
3. Use all features: folder navigation, character management, plot editing, etc.
4. Export their work back to Story Plotter format

## Environment Variables

The application doesn't require any environment variables for basic operation. Optional variables:

```bash
NODE_ENV=production          # Set automatically by Coolify
PORT=3000                    # Internal container port
NEXT_TELEMETRY_DISABLED=1    # Disable Next.js telemetry
```

## Resource Requirements

**Minimum:**
- Memory: 256MB
- CPU: 0.5 cores
- Storage: 500MB

**Recommended:**
- Memory: 512MB
- CPU: 1 core
- Storage: 1GB

## Monitoring and Logs

In Coolify, you can:
- View real-time logs from the application
- Monitor resource usage (CPU, memory)
- Check deployment status
- Set up alerts (if configured)

## Updating the Deployment

To update to a new version:
1. Push changes to the configured branch
2. Coolify will auto-deploy (if enabled) or manually trigger deployment
3. The new version will be live in ~2 minutes

## Troubleshooting

### Build Fails
- Check the Dockerfile exists in the repository root
- Verify `next.config.ts` has `output: "standalone"`
- Review build logs in Coolify

### Domain Not Accessible
- Verify DNS records point to correct VPS IP
- Check Coolify domain configuration
- Ensure port 80/443 are open on your VPS firewall

### Sample Data Not Loading
- Confirm `public/sample-data.txt` exists in the build
- Check browser console for errors
- Verify the file is accessible at `/sample-data.txt`

### High Memory Usage
- Reduce container memory limit in Coolify
- The Next.js standalone output is already optimized
- Consider adding a swap file on the VPS if needed

## Security Notes

- The application is stateless (uses localStorage)
- No database required
- No authentication needed for demo
- All data remains client-side
- HTTPS is automatic via Coolify

## Alternative: Vercel Deployment

If you prefer Vercel instead of Coolify:

1. Connect your repository to Vercel
2. Vercel will auto-detect Next.js
3. Deploy with default settings
4. Update the domain in Vercel dashboard

However, Coolify is recommended for consistency with the rest of the stack.

## Support

For issues or questions:
- Check the [main README](README.md)
- Review [Coolify documentation](https://coolify.io/docs)
- Open an issue on GitHub
