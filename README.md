# Portfolio

A modern, full-stack personal portfolio showcasing my skills, live infrastructure, and projects.  
This repository contains both the **frontend (React/Vite)** and **backend (Go)** services that power the site.

---

## 📚 Table of Contents
- [About](#-about)
- [Tech Stack](#️-tech-stack)
- [CI/CD](#-cicd)
- [Local Development](#-local-development)
- [Documentation](#-documentation)

---

## 🧠 About

This portfolio project is designed as a showcase for my professional work, live server metrics, and integrations across multiple technologies.  
It emphasizes **clean architecture**, **scalable deployment**, and **modern design principles**.

The backend provides API endpoints for fetching project data, metrics, and content.  
The frontend delivers a responsive UI built with performance and maintainability in mind.

---

## ⚙️ Tech Stack

**Frontend**
- Vite + React + TypeScript
- TailwindCSS + Framer Motion animations
- Deployed via containerized build

**Backend**
- Go 1.22
- Custom router inspired by Spring Boot conventions
- Dockerized for CI/CD integration

**Infrastructure**
- GitHub Actions for continuous integration
- Docker Compose for local orchestration
- Cloudflare DNS + SSL management

---

## 🚀 CI/CD

The CI pipeline automatically:
- Builds and verifies both frontend and backend
- Uploads artifacts for inspection
- Runs on pushes and pull requests affecting `frontend/` or `backend/`

See detailed pipeline info in [`docs/ci-cd.md`](docs/ci-cd.md).

---

## 🧑‍💻 Local Development

**Backend**
```bash
cd backend
go mod tidy
go run main.go
```

**Frontend**

```bash
cd frontend
yarn install
yarn dev
```

---

## 📘 Documentation

Additional in-depth documentation is available in the [/docs](/docs/) directory:

- [Overview](/docs/overview.md)
- [Backend Architecture](/docs/backend.md)
- [Frontend Architecture](/docs/frontend.md)
- [CI/CD Workflow](/docs/ci-cd.md)