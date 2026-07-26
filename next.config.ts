import type { NextConfig } from 'next'
import { existsSync } from 'fs'
import { join } from 'path'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

// If CNAME file exists in public/, we're using a custom domain → no basePath needed
const hasCustomDomain = existsSync(join(process.cwd(), 'public', 'CNAME'))

// Priority: .env file → GitHub Actions computed → empty
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (isGitHubActions && !hasCustomDomain ? `/${repoName}` : '')

const nextConfig: NextConfig = {
  output: 'export',
  // basePath is only needed for GitHub project pages without custom domain
  // Custom domain (CNAME exists) or user site → no basePath
  basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Expose basePath to client components so raw <img> tags can prefix assets.
  // We don't override here — NEXT_PUBLIC_BASE_PATH is already set above from .env
  // files or CI computation. Let Next.js inline it from the env we determined.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
