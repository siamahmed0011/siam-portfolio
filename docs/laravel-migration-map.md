# Laravel to Next.js Portfolio Migration Map

## 1. Executive Summary & Audit Overview
This document maps all features, database tables, models, business rules, routes, Filament admin panel configurations, and visual assets from the legacy Laravel project (`E:\FullStack_dynamic_portfolio`) to the new Next.js 16 App Router application (`E:\portfolio`).

---

## 2. Laravel Architecture & Features

### 2.1 Public Routes & Controllers
- `/` (`PortfolioController@home`) - Featured projects (ordered with custom priority, e.g. "Food Waste Reduce" first, latest 3), latest 6 skills, hero section with settings (`site_name`, `hero_description`, `cv_file`), profile image.
- `/about` (`PortfolioController@about`) - Introduction (`about_intro`), Profile card (`university`, `department`, `interests`), Education card (latest academic entry), Skills & Expertise list with tech pills, Contact details with CV download.
- `/projects` (`PortfolioController@projects`) - All projects in descending order with title, description, tech stack tags, demo/live link, GitHub link, thumbnail image.
- `/academic` (`PortfolioController@academic`) - Education journey timeline ordered by year descending with degree, institution, result, year badge.
- `/skills` (`PortfolioController@skills`) - Skills grouped in cards with comma-separated skill pills.
- `/achievements` (`PortfolioController@achievements`) - Awards/achievements ordered by date descending with title, issuer, date, description, certificate link.
- `/contact` (`PortfolioController@contact`) - Contact info (`contact_email`, `linkedin_url`, `github_url`, `location`), and contact submission form with POST to `/contact` with throttle (3 submissions / min).

### 2.2 Admin Panel (Filament v3 -> Next.js Admin Panel)
- **Projects**:
  - Fields: `title` (text, required), `description` (textarea, required), `image` (file upload, image, `projects/`), `tech_stack` (text, required), `github_url` (url/text, nullable), `demo_url` (url/text, nullable).
- **Skills**:
  - Fields: `name` (text, required), `description` (textarea / comma-separated tags, nullable).
- **Academic / Education**:
  - Fields: `degree` (text, required), `institution` (text, required), `year` (text, required), `result` (text, required).
- **Achievements**:
  - Fields: `title` (text, required), `issuer` (text, nullable), `date` (date, nullable), `description` (textarea, nullable), `certificate_url` (url/text, nullable).
- **Settings**:
  - Key-value store supporting string settings and file uploads (e.g. `cv_file` -> PDF upload in `settings/`).
- **Messages**:
  - Read/view incoming contact submissions (`name`, `email`, `subject`, `message`, `created_at`), bulk delete / delete actions.
- **Dashboard Widgets**:
  - Stats overview cards: Total Projects, Total Skills, Total Achievements, Total Messages.

---

## 3. Database Schema Reconciliation (Laravel vs Current Prisma)

| Entity / Concept | Laravel Table & Columns | Current Next.js Prisma Model | Action Required |
| :--- | :--- | :--- | :--- |
| **Project** | `id`, `title`, `description` (nullable), `image` (nullable), `tech_stack` (nullable), `github_url` (nullable), `demo_url` (nullable), `created_at`, `updated_at` | `id`, `title`, `description` (Text), `image`, `techStack` (`tech_stack`), `githubUrl` (`github_url`), `liveUrl` (`live_url`) | Align schema to ensure `demo_url` / `live_url` compatibility. Keep `demoUrl` mapped to `demo_url` with field name `demoUrl`. Ensure description is nullable/Text. |
| **Skill** | `id`, `name`, `description` (nullable), `created_at`, `updated_at` | `id`, `category`, `name`, `description`, `icon` | Make `category` and `icon` nullable (or optional) since Laravel skills table has `name` + `description`. |
| **Academic** | `id`, `degree`, `institution`, `year`, `result`, `created_at`, `updated_at` | `id`, `degree`, `institution`, `year`, `result`, `description` | Perfect match (description optional). |
| **Achievement** | `id`, `title`, `issuer`, `date`, `description`, `certificate_url`, `created_at`, `updated_at` | `id`, `title`, `description`, `date`, `image` | Add `issuer` (String?), `certificateUrl` (`certificate_url` String?) to match Laravel achievement model. |
| **Setting** | `id`, `key` (unique), `value` (Text nullable), `created_at`, `updated_at` | `id`, `key` (unique), `value` (Text nullable), `createdAt`, `updatedAt` | Exact match. |
| **Message** | `id`, `name`, `email`, `subject` (nullable), `message` (Text), `created_at`, `updated_at` | `id`, `name`, `email`, `subject`, `message`, `createdAt`, `updatedAt` | Exact match. |

---

## 4. Asset Migration Strategy
- `E:\FullStack_dynamic_portfolio\public\images\profile.jpg` -> `E:\portfolio\public\images\profile.jpg`
- `E:\FullStack_dynamic_portfolio\storage\app\public\projects\*` -> `E:\portfolio\public\uploads\projects\*`
- Static / dynamic settings CV files (e.g. `placeholder_cv.pdf`) -> `E:\portfolio\public\uploads\settings\*`

---

## 5. Visual Identity & Styling
- **Typography**: Google Fonts Outfit (Titles/Headings) & Plus Jakarta Sans (Body text).
- **Theme**: Premium Deep Space Dark Mode (`--bg-main: #030712`, `--bg-surface: rgba(17, 24, 39, 0.7)`, Indigo `--color-primary: #6366f1`, Purple `--color-secondary: #a855f7`, Cyan `--color-accent: #14b8a6`).
- **Components**: Glassmorphism cards with subtle border glow, animated typing hero roles, timeline dot hierarchy, tech tag pills.
