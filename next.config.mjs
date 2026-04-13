const isGithubPagesBuild = process.env.GITHUB_PAGES === 'true'
const basePath = isGithubPagesBuild ? '/CSC' : ''

const nextConfig = {
  ...(isGithubPagesBuild
    ? {
        output: 'export',
        trailingSlash: true,
        basePath,
        assetPrefix: basePath,
        images: {
          unoptimized: true,
        },
      }
    : {}),
}

export default nextConfig