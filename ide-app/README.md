This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Server configuration
### Initial (once during setup)
1. Install mariadb and npm
2. copy the .env file, containing database credentials, or make your own
3. Run npm install from the ide-app folder
4. Generate drizzle files using `npx drizzle-kit generate`


### Repetitive (each time before starting up)
1. Ensure the docker image is built with `docker build -t python-gcc-evaluator evaluator/` (from ide-app folder)
2. Ensure that the docker api is exposed using `socat TCP-LISTEN:2375,reuseaddr,fork UNIX-CLIENT:/var/run/docker.sock`