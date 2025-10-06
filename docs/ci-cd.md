# CI/CD Workflow

## GitHub Actions Overview
The repository includes an automated pipeline (`.github/workflows/ci.yml`) that:
1. Checks out the code.
2. Builds the backend Go service.
3. Builds the frontend React app.
4. Uploads build artifacts for inspection.

It runs on:
- Pushes to `main`, `develop`, and `feature/*` branches.
- Pull requests affecting `frontend/` or `backend/`.

Refer to the workflow YAML for implementation details.
