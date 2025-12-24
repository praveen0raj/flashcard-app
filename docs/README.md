# Flashcard App - Documentation

This folder contains comprehensive documentation for the Flashcard App, covering architecture, design, and technical specifications.

## 📚 Documentation Index

### 1. [Architecture Documentation](./architecture.md)
**System Architecture & Technical Design**

- Overall system architecture diagram
- Technology stack rationale
- Key components and their interactions
- Data flow diagrams
- Database schema design
- Security architecture
- Performance considerations
- Scalability options
- Deployment architecture

**Topics Covered:**
- Client-Server architecture
- Next.js 14 App Router structure
- API design patterns
- Database relationships
- Authentication & authorization flow
- Spaced repetition engine (SM-2 algorithm)
- File storage strategy
- Monitoring & observability

**Best For:** Developers wanting to understand the overall system design and technical decisions.

---

### 2. [Frontend Framework Documentation](./frontend-framework.md)
**Next.js, React, and Frontend Patterns**

- Why Next.js 14 with App Router
- Project structure and file organization
- Server vs Client Components
- State management (Zustand + TanStack Query)
- Component architecture
- Styling with Tailwind CSS
- Forms & validation (React Hook Form + Zod)
- Data visualization (Recharts)
- Media handling (react-dropzone, Howler.js)
- Performance optimization
- Error handling
- Best practices

**Topics Covered:**
- Next.js App Router patterns
- Component composition
- State management strategies
- Form handling
- API integration
- Code splitting
- Accessibility

**Best For:** Frontend developers working on React components and UI features.

---

### 3. [Sequence Diagrams](./sequence-diagrams.md)
**User Flow Sequences (Mermaid Diagrams)**

Interactive diagrams showing the step-by-step flow for key features:

1. **User Registration Flow** - Account creation process
2. **User Login Flow** - Authentication process
3. **Create Flashcard Flow** - Flashcard creation with validation
4. **Study Session Flow** - Complete spaced repetition cycle (SM-2)
5. **Quiz Flow** - Quiz generation, taking, and completion
6. **Dashboard Statistics Flow** - Data aggregation and display
7. **Media Upload Flow** - Image/audio upload and processing
8. **Authentication Middleware Flow** - Route protection

**Format:** Mermaid syntax (renders in GitHub, VSCode with extension, or mermaid.live)

**Best For:** Understanding detailed interactions between system components and user actions.

---

### 4. [Use Case Diagrams](./use-case-diagrams.md)
**Feature Interactions & User Scenarios (Mermaid Diagrams)**

Comprehensive use case documentation:

- **Overall System Use Case** - All features at a glance
- **Authentication Use Cases** - Register, login, logout
- **Flashcard Management** - CRUD operations
- **Category Management** - Organization features
- **Study Mode** - Spaced repetition learning
- **Quiz Mode** - Testing and assessment
- **Statistics & Progress** - Analytics and tracking
- **Media Management** - Image/audio handling

Also includes:
- Actor definitions (Guest, User, Student, System)
- Use case priorities (MVP, Medium, Low)
- Extension points for future features
- Use case dependencies

**Format:** Mermaid diagrams with detailed tables

**Best For:** Product managers, designers, and developers understanding feature scope and user interactions.

---

### 5. [Design System](./design-system.md)
**UI/UX Design Guidelines**

Complete design specifications:

**Design Principles:**
- Clarity, Consistency, Efficiency, Accessibility, Delight

**Visual Design:**
- Color palette (Primary, Secondary, Semantic, Neutral)
- Typography (Font families, scales, weights)
- Spacing system (Tailwind-based scale)
- Icons (Heroicons)

**Component Library:**
- Buttons (Primary, Secondary, Ghost, Icon)
- Cards (Base, Interactive, Flashcard)
- Forms (Inputs, Textareas, Selects)
- Badges (Success, Error, Info, Neutral)
- Modals, Alerts, Loading states

**Layout Patterns:**
- Dashboard layout
- Study mode layout
- Quiz mode layout

**Animations:**
- Transitions and hover effects
- Flashcard flip animation
- Fade in/slide up effects

**Accessibility:**
- Color contrast guidelines
- Focus states
- ARIA labels
- Keyboard navigation

**Best For:** Designers and frontend developers implementing UI components.

---

## 🎯 Quick Links by Role

### For **Product Managers**
1. Start with [Use Case Diagrams](./use-case-diagrams.md) to understand features
2. Review [Architecture](./architecture.md) for technical feasibility
3. Check [Sequence Diagrams](./sequence-diagrams.md) for user flows

### For **Frontend Developers**
1. Read [Frontend Framework](./frontend-framework.md) for patterns
2. Follow [Design System](./design-system.md) for UI implementation
3. Reference [Sequence Diagrams](./sequence-diagrams.md) for API integration

### For **Backend Developers**
1. Study [Architecture](./architecture.md) for database and API design
2. Review [Sequence Diagrams](./sequence-diagrams.md) for API endpoints
3. Check [Use Case Diagrams](./use-case-diagrams.md) for business logic

### For **Designers**
1. Start with [Design System](./design-system.md) for visual guidelines
2. Review [Use Case Diagrams](./use-case-diagrams.md) for feature scope
3. Check [Sequence Diagrams](./sequence-diagrams.md) for user journeys

### For **New Team Members**
1. Begin with [Architecture](./architecture.md) for overview
2. Read [Frontend Framework](./frontend-framework.md) for tech stack
3. Browse [Use Case Diagrams](./use-case-diagrams.md) for feature understanding

---

## 📊 Diagram Viewing

All diagrams in this documentation use **Mermaid** syntax.

### How to View Diagrams:

**Option 1: GitHub** (Recommended)
- Diagrams render automatically when viewing .md files on GitHub

**Option 2: VSCode**
1. Install extension: "Markdown Preview Mermaid Support"
2. Open .md file
3. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows) for preview

**Option 3: Online Viewer**
1. Copy Mermaid code from documentation
2. Paste into [mermaid.live](https://mermaid.live)
3. View and export diagrams

**Option 4: IDE Plugins**
- IntelliJ IDEA: "Mermaid" plugin
- Atom: "markdown-preview-enhanced"
- Sublime Text: "Mermaid Preview"

---

## 🔄 Documentation Updates

This documentation should be updated when:

- ✅ New features are added
- ✅ Architecture changes significantly
- ✅ New components are created
- ✅ API endpoints are added/modified
- ✅ Database schema changes
- ✅ Design system evolves

**How to Contribute:**
1. Edit relevant .md file
2. Update diagrams if needed (Mermaid syntax)
3. Ensure diagrams render correctly
4. Commit with descriptive message

---

## 📖 Additional Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)

### Design Resources
- [Heroicons](https://heroicons.com) - Icon library
- [Tailwind UI](https://tailwindui.com) - Component examples
- [Coolors](https://coolors.co) - Color palette generator
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker)

### Learning Resources
- [SM-2 Algorithm Paper](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2) - Original spaced repetition algorithm
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/react/use-server)

---

## 📝 Document Versions

| Document | Last Updated | Version |
|----------|--------------|---------|
| Architecture | 2025-12-24 | 1.0 |
| Frontend Framework | 2025-12-24 | 1.0 |
| Sequence Diagrams | 2025-12-24 | 1.0 |
| Use Case Diagrams | 2025-12-24 | 1.0 |
| Design System | 2025-12-24 | 1.0 |

---

## 🤝 Contributing

Found an error or want to improve the documentation?

1. Open an issue on GitHub
2. Submit a pull request with changes
3. Tag relevant team members for review

---

## 📧 Contact

For questions about the documentation or architecture decisions:
- Open a GitHub Discussion
- Contact the development team
- Review code comments for inline documentation

---

**Note:** This documentation is a living document and should evolve with the project. Keep it updated and accurate!
