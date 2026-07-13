import type { NextConfig } from 'next'
import { existsSync } from 'fs'
import { join } from 'path'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

// If CNAME file exists in public/, we're using a custom domain → no basePath needed
const hasCustomDomain = existsSync(join(process.cwd(), 'public', 'CNAME'))

const nextConfig: NextConfig = {
  output: 'export',
  // basePath is only needed for GitHub project pages without custom domain
  // Custom domain (CNAME exists) or user site → no basePath
  basePath: isGitHubActions && !hasCustomDomain ? `/${repoName}` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
