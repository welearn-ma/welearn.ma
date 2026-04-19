# GitHub Copilot Instructions

These instructions define **global rules** for this repository.
Follow them strictly unless explicitly overridden in a prompt or comment.

---

## 🧱 Tech Stack (Non-Negotiable)
- Framework: **Next.js (App Router)**
- Language: **TypeScript only**
- Styling: **Tailwind CSS**
- Runtime: **React 18**
- Package Manager: **pnpm**
- Icons: **Lucide / Heroicons (if needed)**

Do NOT introduce alternative frameworks, styling systems, or languages.

---

## 🧠 Architectural Principles
- Prefer **simple, readable solutions** over clever abstractions
- Follow **component-driven architecture**
- Keep concerns separated (UI, logic, data)
- Avoid premature optimization
- Favor **composition over inheritance**

---

## 🧩 Component Rules
- Use **functional React components only**
- Components should be:
  - Small
  - Reusable
  - Focused on a single responsibility
- Extract reusable UI into `components/`
- Feature-specific components go under `features/`

---

## 🎨 UI / UX Design Rules
- Follow **modern SaaS & portfolio UI patterns**
- Design should feel:
  - Clean
  - Minimal
  - Professional
  - Developer-focused
- Use:
  - Consistent spacing
  - Clear visual hierarchy
  - Subtle shadows & transitions
- Avoid visual clutter and over-styling

### Tailwind Guidelines
- Use Tailwind utility classes only
- Avoid inline styles
- Avoid excessive class duplication (extract components when needed)
- Use responsive utilities (`sm:`, `md:`, `lg:`) thoughtfully

---

## 🧭 Accessibility (Required)
- Use semantic HTML elements
- Always include:
  - `aria-label` where appropriate
  - Associated `<label>` for inputs
  - Keyboard-focusable components
- Maintain good color contrast

---

## 🧪 State & Logic
- Prefer **local component state**
- Use React hooks (`useState`, `useEffect`, `useMemo`)
- Avoid global state unless explicitly required
- No Redux, MobX, or heavy state libraries unless requested

---

## 🌐 Data & Side Effects
- Do NOT add backend calls unless explicitly requested
- Mock data is acceptable by default
- Prefer static or client-side logic
- Avoid unnecessary API abstractions

---

## 🖥️ Backend & Hosting Constraints

### Deployment Environment
- Hosting: **Linux server with cPanel**
- Node.js support is limited and version-dependent
- No serverless or edge runtimes
- Prefer predictable, traditional deployment models

### Frontend Build Rules
- Prefer **static generation (SSG)** where possible
- Avoid Next.js features that require serverless runtimes
- `next export` compatibility should be considered
- Do NOT rely on Vercel-only features

### Backend Architecture
- Backend should be:
  - Separate from frontend when possible
  - Deployed as a standalone Node.js service OR
  - Traditional REST API
- Prefer:
  - Express.js
  - Clear MVC or layered architecture

### API Design
- Use RESTful endpoints
- Explicit request/response types
- Proper error handling
- No GraphQL unless explicitly requested

### Environment Configuration
- Use `.env` files
- Never hardcode secrets
- Assume manual environment setup on server

---

## 🚫 Hosting-Specific Do-NOT Rules
- Do NOT assume Vercel, Netlify, or edge deployments
- Do NOT use serverless-only features
- Do NOT rely on platform-specific environment variables

---

## 🧠 Database & Backend (Supabase + PostgreSQL)

### Database
- Database: **Supabase (PostgreSQL)**
- Supabase is the **single source of truth**
- Do NOT introduce:
  - Prisma
  - Sequelize
  - TypeORM
  - Direct SQL connections from frontend

### Supabase Client Usage
- Use **supabase-js (latest version)**
- Client-side:
  - Use **anon public key only**
  - Assume Row Level Security (RLS) is enabled
- Server-side:
  - Use **service role key ONLY on backend**
  - Never expose service role key to the client

### Auth
- Use Supabase Auth
- Do NOT implement custom auth unless explicitly requested
- Assume JWT-based auth handled by Supabase
- Respect user sessions and roles

### Security Rules (Strict)
- Assume all tables have RLS enabled
- Never bypass RLS from client code
- All authorization logic must be enforced at the database level
- Avoid trusting client-side role checks alone

### Data Access Patterns
- Prefer Supabase RPC or filtered queries
- Handle errors explicitly
- Never assume successful responses
- Use typed responses where possible

---

## 🚫 Supabase Do-NOT Rules
- Do NOT use service role key in frontend code
- Do NOT disable RLS for convenience
- Do NOT duplicate auth logic in the app
- Do NOT hardcode Supabase credentials


---

## 🧹 Code Style & Quality
- Use clear, descriptive variable and function names
- Avoid deeply nested JSX
- Prefer early returns for clarity
- Keep files readable and well-structured
- Code must compile without errors

---

## 📦 File & Folder Conventions
- `app/` → routing & layouts
- `components/` → reusable UI components
- `features/` → feature-specific logic & UI
- `lib/` → helpers & utilities
- `types/` → shared TypeScript types

Follow existing project structure strictly.

---

## 📤 Output Expectations
When generating code:
- Provide **complete, runnable implementations**
- Match existing code style and patterns
- Do not leave TODOs unless explicitly requested
- Prefer clarity over verbosity

---

## 🚫 Strict Do-NOT Rules
- Do NOT modify existing layout or navigation components unless asked
- Do NOT introduce external UI libraries (MUI, AntD, Chakra, etc.)
- Do NOT rewrite working code just to “improve” it
- Do NOT change formatting or naming conventions arbitrarily

---

## 🧠 Final Rule
If unsure, **match the existing codebase style** rather than inventing a new one.
Consistency > novelty.
