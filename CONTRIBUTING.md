# Contributing to KICK BUNK

We welcome contributions to the KICK BUNK platform! Follow these guidelines to ensure smooth collaboration:

## Development Workflow

1. **Fork the Repository:** Create a personal fork on GitHub.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Run Code Verification Locally:**
   - Backend tests:
     ```bash
     pytest -v
     ```
   - Frontend build:
     ```bash
     cd frontend
     npm run build
     ```
4. **Commit with Clear Messages:** Follow conventional commits (e.g. `feat: add table reservation notifications`).
5. **Open a Pull Request:** Ensure your PR description explains the problem and the implemented solution.
