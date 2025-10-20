# PolicyGen AI

PolicyGen AI is an application that leverages artificial intelligence to generate comprehensive and compliant privacy policies. It provides a user-friendly, step-by-step form to gather business details and automatically creates a policy tailored to specific needs, including compliance with regulations like GDPR, CCPA, and COPPA.

## Features

-   **AI-Powered Generation**: Utilizes AI to create professional, legally-sound privacy policies from user-provided data.
-   **Multi-Step Form**: A detailed, 11-step wizard guides users through providing all necessary information for a comprehensive policy.
-   **User Authentication**: Secure sign-up and sign-in functionality using Supabase Auth to manage user accounts and policies.
-   **Policy Dashboard**: A centralized dashboard for authenticated users to view, manage, and delete their saved policies.
-   **Policy Versioning**: Automatically versions policies, allowing users to track changes and maintain a history of their documents.
-   **Full-Featured Editor**: View, edit, copy, and download generated policies in various formats (HTML, Word).
-   **AI-Assisted Editing**: After generation, users can leverage AI to suggest improvements or make specific edits based on natural language instructions.
-   **Responsive Design**: A clean, modern UI built with Shadcn/UI and Tailwind CSS, fully responsive for both desktop and mobile devices.

## Tech Stack

-   **Frontend**:
    -   **Framework**: React (with Vite)
    -   **Language**: TypeScript
    -   **UI**: Shadcn/UI, Tailwind CSS
    -   **Routing**: React Router
    -   **State Management**: React Query
    -   **Animations**: Framer Motion
-   **Backend (Serverless)**:
    -   **Platform**: Supabase
    -   **Database**: Supabase Postgres with Row Level Security (RLS).
    -   **Authentication**: Supabase Auth
    -   **Edge Functions**: Deno functions for server-side AI logic.
-   **AI Integration**:
    -   The `generate-policy` and `ai-suggest` Supabase Edge Functions make secure calls to an AI model via a gateway.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or later)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Supabase Account](https://supabase.com/) and a new project created.
-   [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1. Clone the Repository

```bash
git clone https://github.com/PradnyaBondarde/policygen-ai.git
cd policygen-ai
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up Supabase Backend

1.  **Log in to Supabase CLI**:
    ```bash
    supabase login
    ```

2.  **Link to your Supabase project** (replace `<project-id>` with your actual project ID from the Supabase dashboard):
    ```bash
    supabase link --project-ref <project-id>
    ```

3.  **Push database migrations**: This will create the `policies` and `profiles` tables as defined in `supabase/migrations`.
    ```bash
    supabase db push
    ```

4.  **Deploy Edge Functions**: This will deploy the AI generation and suggestion functions.
    ```bash
    supabase functions deploy
    ```

### 4. Configure Environment Variables

1.  Create a `.env` file in the root of the project.
2.  Add your Supabase URL and Anon Key. You can find these in your Supabase project's "API Settings".

    ```env
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

3.  You will also need to set up secrets for the Supabase Edge Functions. The `LOVABLE_API_KEY` is used in the functions to call the AI gateway.
    ```bash
    supabase secrets set LOVABLE_API_KEY="YOUR_API_KEY_HERE"
    ```

### 5. Run the Development Server

You can now start the frontend development server.

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Application Structure

-   `src/pages/`: Contains the main pages of the application (`Index`, `Generate`, `Result`, `Dashboard`, `Auth`, `Editor`).
-   `src/components/`:
    -   `FormSteps/`: Houses all the individual components for the 11-step policy generation form.
    -   `ui/`: Reusable UI components from Shadcn/UI.
-   `src/integrations/supabase/`: Supabase client configuration and generated database types.
-   `supabase/`: Contains all backend-related files.
    -   `migrations/`: Database schema and RLS policies.
    -   `functions/`:
        -   `generate-policy/`: The Edge Function that takes form data and calls the AI to generate the initial policy.
        -   `ai-suggest/`: The Edge Function that provides AI-powered suggestions and edits for existing policies.
