import type { NextConfig } from 'next'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages project site needs basePath pointing to repo name
  // For user site (username.github.io) or custom domain, set DEPLOY_TYPE=user
  basePath: isGitHubActions && process.env.DEPLOY_TYPE !== 'user' ? `/${repoName}` : '',
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js image optimization
  },
  trailingSlash: true,
}

export default nextConfig
