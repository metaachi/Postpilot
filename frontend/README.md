# AI TWIN Frontend

This is the frontend application for AI TWIN, your personal AI manager. Built with Next.js 13+, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Linting/Formatting**: ESLint & Prettier

## Project Structure

```
frontend/
├── app/                    # Next.js 13+ App Router
│   ├── layout.tsx         # Root layout with Navbar
│   ├── page.tsx           # Homepage
│   └── login/             # Login page
├── components/            # Reusable components
│   └── Navbar.tsx        # Navigation bar
├── public/               # Static assets
└── styles/              # Global styles
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Progress So Far

- ✅ Project initialization with Next.js 13+
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Basic component structure
- ✅ Login page with form
- ✅ Navigation bar
- ✅ ESLint & Prettier configuration
- ✅ Dark mode support

## Next Steps

- [ ] Add signup page
- [ ] Implement authentication
- [ ] Create dashboard layout
- [ ] Add user profile page
- [ ] Implement AI features

## Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow ESLint rules
   - Format with Prettier
   - Use Tailwind CSS for styling

2. **Git Workflow**
   - Create feature branches
   - Write descriptive commit messages
   - Review code before merging

3. **Components**
   - Create reusable components
   - Use TypeScript interfaces
   - Follow React best practices

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
