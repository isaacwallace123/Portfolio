# Backend Architecture

## Overview
The backend is written in **Go 1.22** using a custom web framework inspired by Java Spring Boot. It focuses on clear separation between:
- **Controllers (Presentation Layer)** — Handle HTTP routes.
- **Business Logic (Domain Layer)** — Implements use cases.
- **Data Access (Persistence Layer)** — Interfaces with storage systems.

## Features
- Modular structure for scalability
- Built-in JSON utilities and structured logging
- Docker integration for environment parity
