# Portfolio Project Overview

The **Portfolio** project is a full-stack system designed to showcase development skills, live metrics, and professional projects through a clean, scalable, and modern architecture.  
It acts as both a **personal website** and a **technical demonstration** of production-grade development patterns — combining frontend performance, backend reliability, and DevOps automation.

---

## 🧱 System Architecture

The repository consists of two core components:

| Component | Description |
|------------|--------------|
| **Frontend** | A responsive React + Vite web app responsible for the user interface and client-side rendering. |
| **Backend** | A Go-based API service that exposes structured endpoints for dynamic data, system metrics, and content. |

Both services are containerized and built with **CI/CD automation** through GitHub Actions.
---

## ⚙️ Design Goals

1. **Clean Architecture**  
   Separation between presentation, business, and data layers on the backend.  
   The frontend mirrors this clarity through modular React components and reusable design patterns.

2. **Scalability**  
   Both services can be containerized and scaled horizontally via Docker Compose or Kubernetes.

3. **Maintainability**  
   Every part of the system — from API to UI — is organized with conventions that make it easy to extend, test, and document.

4. **Performance**  
   Leveraging Vite’s blazing-fast build pipeline and Go’s concurrency model for efficient response handling.

5. **Automation**  
   Continuous Integration pipelines automatically verify builds on each push or pull request.

---

## 🧩 Tech Stack Summary

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React • TypeScript • Vite • TailwindCSS • Framer Motion |
| **Backend** | Go 1.22 • Custom routing framework • Docker • REST APIs |
| **Infrastructure** | GitHub Actions • Docker Compose • Cloudflare DNS/SSL |
| **Version Control** | Git + GitHub (branch-based workflow) |

---

## 🧪 Development Philosophy

- **Simplicity over complexity** — focus on clarity and minimal dependencies.  
- **Transparency** — clear directory naming, obvious intent, and consistent naming conventions.  
- **Reusability** — shared utilities, clean abstractions, and modular design.  
- **Performance-driven** — build fast, ship efficiently, measure real results.

---

## 📘 Related Documentation

| File | Description |
|------|--------------|
| [backend.md](backend.md) | Detailed backend architecture, layers, and design patterns |
| [frontend.md](frontend.md) | Frontend structure, components, and visual philosophy |
| [ci-cd.md](ci-cd.md) | Breakdown of the CI/CD workflow |
| [contributing.md](contributing.md) | Contribution and branching guidelines |

---

## 🌐 Live Deployment

If your site is deployed, include the link here:
> [https://isaacwallace.dev](https://isaacwallace.dev)