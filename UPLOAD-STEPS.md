Manual source upload steps for the main repository

1. Open your main GitHub repository in the browser.
2. Click Add file > Upload files.
3. Open this folder and select everything inside github-upload-ready.
4. Upload the contents of this folder to the repository root.
5. Do not upload node_modules, .next, dist, github-pages-ready, or out.
6. If this repository is connected to Netlify, Netlify should build this source automatically.
7. The repository includes netlify.toml and next.config.mjs for the normal root-domain deployment.

Important for Netlify

- NEXT_PUBLIC_SITE_URL should be https://naincsc.netlify.app
- NEXT_PUBLIC_BASE_PATH should be empty
- GITHUB_PAGES should be false or not set

Important Firebase env vars

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_DATABASE_URL
Manual GitHub upload steps

1. Open your GitHub repository in the browser.
2. Click Add file > Upload files.
3. Open this folder and select everything inside github-upload-ready.
4. Upload the contents of this folder to the repository root.
5. Do not upload node_modules, .next, or dist.
6. If this repository is connected to Netlify, let Netlify build the source code from the repository.
7. Do not upload github-pages-ready or the out folder to the Netlify source repository.
8. After upload, add your environment variables on the hosting platform.

Important env vars

- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_BASE_PATH
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_DATABASE_URL
