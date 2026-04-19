# Advanced React

Frontend e-commerce application built with React, TypeScript, Redux and FSD.

# Live demo

https://shiny-alpaca-ae2ffc.netlify.app/ (cold start 60s)

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit + React Redux
- RTK Query
- React Hook Form + Zod
- i18next
- SCSS Modules
- Storybook
- Vitest + Testing Library
- Playwright
- MSW
- ESLint + Stylelint + Prettier

## Requirements

- Node.js
- npm as the package manager

## Installation

1. Clone the repository:

```bash
git clone advanced-react
```

2. Install dependencies:

```bash
npm install
```

4. Fill in the required variables in `.env`.

5. Start the development server:

```bash
npm run dev
```

6. Open the app in the browser at the local Vite URL shown in the terminal.

## Environment Variables

The project uses the following environment variables:

| Variable                  | Required | Description                                                                                       |
|---------------------------|----------|---------------------------------------------------------------------------------------------------|
| `VITE_API_URL`            | Yes      | Base URL for backend API.                                                                         |
| `VITE_PROJECT_ENV`        | Yes      | Current runtime mode identifier.                                                                  |
| `CHROMATIC_PROJECT_TOKEN` | Optional | Token for publishing Storybook builds to Chromatic. Required only for visual regression workflow. |

## Scripts

| Script                    | Description                                                 |
|---------------------------|-------------------------------------------------------------|
| `npm run dev`             | Starts the Vite development server.                         |
| `npm run build`           | Builds the production bundle into `dist/`.                  |
| `npm run preview`         | Serves the production build locally for preview.            |
| `npm run lint:ts`         | Runs TypeScript project type-checking.                      |
| `npm run lint`            | Runs ESLint for TypeScript and React files.                 |
| `npm run lint:fix`        | Runs ESLint with auto-fix.                                  |
| `npm run lint:scss`       | Runs Stylelint for SCSS files.                              |
| `npm run lint:scss:fix`   | Runs Stylelint with auto-fix.                               |
| `npm run format`          | Checks formatting with Prettier.                            |
| `npm run format:fix`      | Applies formatting with Prettier.                           |
| `npm run test:unit`       | Runs unit and component tests with Vitest.                  |
| `npm run test:e2e`        | Runs end-to-end tests with Playwright.                      |
| `npm run test:e2e:ui`     | Opens Playwright UI mode.                                   |
| `npm run test:e2e:headed` | Runs Playwright tests in headed mode.                       |
| `npm run test:e2e:debug`  | Runs Playwright tests in debug mode.                        |
| `npm run storybook`       | Starts Storybook locally on port `6006`.                    |
| `npm run build-storybook` | Builds static Storybook output.                             |
| `npm run test:regression` | Runs Chromatic visual regression checks.                    |
| `npm run check:all`       | Runs type-check, linters, formatting check, and unit tests. |
| `npm run check:all:fix`   | Runs available auto-fixes and unit tests.                   |

## Project Structure

The project follows Feature-Sliced Design v2.1 with a pages-first approach.

```text
.
|-- public/                    # Static assets and MSW worker output
|-- .storybook/                # Storybook configuration
|-- e2e/                       # Playwright end-to-end tests
|-- src/
|   |-- app/                   # App bootstrap, providers, routing, global styles, initialization
|   |-- pages/                 # Route-level pages and page-specific logic
|   |-- widgets/               # Large reusable UI blocks composed from lower layers
|   |-- features/              # Reusable user actions and interaction flows
|   |-- entities/              # Domain entities 
|   |-- shared/                # Shared UI kit, config, api layer, utilities, assets
|-- eslint.config.js           # ESLint flat config
|-- playwright.config.ts       # Playwright configuration
|-- vite.config.ts             # Vite and Vitest configuration
```

## Testing

The project uses several testing levels:

- Unit tests for utilities, selectors, services, API adapters, and reducers
- Component and hook tests with Vitest, jsdom, and Testing Library
- Storybook stories for isolated UI states
- Chromatic for visual regression testing
- End-to-end tests with Playwright for user flows
- MSW for API mocking in stories and tests

### Run Tests

Unit tests:

```bash
npm run test:unit
```

E2E tests:

```bash
npm run test:e2e
```

Storybook:

```bash
npm run storybook
```

Visual regression tests:

```bash
npm run test:regression
```

Full local quality check:

```bash
npm run check:all
```

