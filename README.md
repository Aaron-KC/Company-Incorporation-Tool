# Company Incorporation Tool

A full-stack web application for incorporating companies, built with React, Node.js, and MySQL.

## Tech Stack

- **Frontend** — React, TypeScript, Tailwind CSS, React Hook Form, Zod
- **Backend** — Node.js, Express, MySQL2
- **Database** — MySQL 8.4
- **DevOps** — Docker, Docker Compose

## Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

That's it. No need to install Node.js, MySQL, or any other dependencies manually.

## Getting Started

**1. Clone the repository:**
```bash
git clone https://github.com/Aaron-KC/Company-Incorporation-Tool.git 
cd company-incorporation-tool
```

**2. Start the app:**
```bash
docker compose up --build
```

**3. Open your browser and go to:**
```
http://localhost:5173
```

That's it. The app is ready to use.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/company/draft` | Save company draft |
| GET | `/api/company/draft/:sessionId` | Get saved draft |
| POST | `/api/shareholder` | Submit shareholders |
| GET | `/api/company/all` | Get all companies |
| GET | `/api/company/all-with-shareholders` | Get all companies with their respective shareholders |

## Database

The database is automatically set up when you run `docker compose up --build`. No manual setup required.

**Tables:**
- `companies` — stores company information and draft status
- `shareholders` — stores shareholder information linked to a company
