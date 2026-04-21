# Deployment Changes - GAB-75

This document summarizes all changes made to deploy the public demo of StoryBridge AI.

## Files Created

### 1. `Dockerfile`
- Multi-stage Docker build for Next.js standalone output
- Based on Node.js 20 Alpine
- Optimized for production deployment
- Runs as non-root user (nextjs)
- Exposes port 3000

### 2. `.dockerignore`
- Excludes unnecessary files from Docker build
- Reduces image size and build time
- Excludes: node_modules, .next, .git, IDE files, etc.

### 3. `coolify.yaml`
- Coolify deployment configuration
- Documents build settings, environment variables, and health checks
- Includes deployment instructions as comments
- Documents resource requirements

### 4. `DEPLOYMENT.md`
- Complete deployment guide for Coolify
- Step-by-step instructions for VPS setup
- DNS configuration details
- Troubleshooting section
- Security notes and requirements

## Files Modified

### 1. `next.config.ts`
- Added `output: "standalone"` for optimized production builds
- Required for Docker deployment with minimal image size

### 2. `src/components/FileUpload.tsx`
- Added `handleLoadDemoData()` function to fetch sample data
- Added "Load Demo Data" button to the upload screen
- Fetches `/sample-data.txt` and loads it via the existing `loadData()` function
- Provides user-friendly error handling

### 3. `README.md`
- Added live demo link at the top: [demo.storybridge.ai](https://demo.storybridge.ai)
- Added "Try the Demo" section before local development instructions
- Made it easy for users to try the app without installation

### 4. `package.json`
- Updated `homepage` field from GitHub repo to demo URL
- Changed from: `"https://github.com/Coffelius/storybridge-ai"`
- Changed to: `"https://demo.storybridge.ai"`

## Deployment Architecture

```
User Browser
    ↓
demo.storybridge.ai (HTTPS)
    ↓
Coolify (Traefik Reverse Proxy)
    ↓
Docker Container (Node.js 20 Alpine)
    ↓
Next.js 16 Application (Standalone Output)
    ↓
Sample Data: public/sample-data.txt
```

## Key Features

1. **One-Click Demo**: Users can load sample data without needing their own Story Plotter export
2. **Automatic HTTPS**: Provided by Coolify via Let's Encrypt
3. **Optimized Build**: Standalone output reduces Docker image size
4. **Health Monitoring**: Built-in health checks for automatic recovery
5. **Easy Updates**: Auto-deploy on git push (optional)

## Next Steps for Deployment

1. **Push these changes** to the repository
2. **Create DNS record** for demo.storybridge.ai pointing to VPS IP
3. **Create application in Coolify** using the settings in coolify.yaml
4. **Configure domain** in Coolify to enable SSL
5. **Deploy and test** the application
6. **Verify demo data** loads correctly

## Testing Checklist

- [ ] Application builds successfully in Docker
- [ ] Homepage loads correctly
- [ ] "Load Demo Data" button works
- [ ] Sample data displays properly
- [ ] File upload still works for user files
- [ ] All UI features function correctly
- [ ] HTTPS is enabled
- [ ] Performance is acceptable

## URLs

- **Demo**: https://demo.storybridge.ai
- **Repository**: https://github.com/Coffelius/storybridge-ai
- **Coolify Docs**: https://coolify.io/docs

## Notes

- The application uses localStorage for persistence (no backend database)
- The sample data is the existing `public/sample-data.txt` file
- All data remains client-side for privacy
- No authentication required for the demo
- The deployment is stateless and can scale horizontally if needed
