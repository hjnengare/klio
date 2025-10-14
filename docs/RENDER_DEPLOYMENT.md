# Render Deployment Guide for KLIO

## Quick Setup

### 1. Environment Variables to Add in Render Dashboard

Go to your service → **Environment** tab and add:

```bash
NODE_OPTIONS=--max-old-space-size=2048
NEXT_TELEMETRY_DISABLED=1
NODE_VERSION=22.16.0
NODE_ENV=production

# Add your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Service Configuration

- **Service Type:** Web Service
- **Environment:** Node
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm run start`
- **Instance Type:** At least **Starter** (512MB RAM minimum for build)

### 3. Next.js Configuration

The `next.config.ts` has been updated with:
- `output: 'standalone'` - Reduces runtime size
- `images.unoptimized: true` - Reduces build memory usage

### 4. If Build Still Hangs

**Option A: Upgrade Instance**
- Go to **Settings** → Upgrade to **Standard** plan temporarily for build (more RAM)
- After successful build, can downgrade back to Starter

**Option B: Clear Build Cache**
- Go to **Settings** → **Clear build cache**
- Trigger a new deploy

**Option C: Check for Build-Time Data Fetching**
- If any pages fetch data during build (SSG), add `export const dynamic = 'force-dynamic'` to make them runtime-only

### 5. Troubleshooting

**Build exits with code 137:**
- This is OOM (Out of Memory)
- Solution: Increase `NODE_OPTIONS` to `--max-old-space-size=3072` or upgrade instance

**Build hangs at "Creating an optimized production build":**
- Check if any Server Components are doing heavy data fetching at build time
- Add `revalidate` or `dynamic` exports to pages that fetch data

**Images not loading:**
- Ensure all Unsplash image URLs are whitelisted in `next.config.ts`
- Check that `images.unoptimized: true` is set if using external images

### 6. Monitoring

After successful deployment:
- Check logs in **Logs** tab
- Test all routes work correctly
- Verify environment variables are loaded: `process.env.NEXT_PUBLIC_SUPABASE_URL`

## Build Success Indicators

You should see in the logs:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

Then:
```
==> Build successful 🎉
==> Deploying...
```

## Common Issues

1. **Sharp module errors**: Resolved by `images.unoptimized: true`
2. **Memory errors**: Resolved by `NODE_OPTIONS=--max-old-space-size=2048`
3. **Build timeout**: Resolved by upgrading instance or removing build-time data fetching
