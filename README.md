# ClientIn NFC Feedback System

This is a Next.js application for an NFC-based employee feedback system, built with Supabase for backend services.

## Features

-   **Employee Management**: Add, edit, and delete employee profiles.
-   **Feedback Collection**: Collect anonymous feedback via NFC tags or QR codes.
-   **Offline Support**: Store feedback locally when offline and sync when online.
-   **Dashboard**: Overview of key metrics, recent feedbacks, and active employees.
-   **Feedbacks Page**: Detailed list of all collected feedbacks with filtering options.
-   **Insights & Reports**: Visualizations of feedback trends, department performance, and top employees.
-   **QR Code Management**: Generate and customize QR codes for employees.
-   **Settings**: Manage general company settings and notification preferences.
-   **Authentication**: User authentication using Supabase Auth.

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your-username/clientin-nfc-feedback.git
cd clientin-nfc-feedback
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Set up Supabase

1.  **Create a new Supabase project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get your API keys**: In your Supabase project dashboard, navigate to `Settings > API` to find your `Project URL` and `anon public` key.
3.  **Configure environment variables**: Create a `.env.local` file in the root of your project and add the following:

    \`\`\`
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    \`\`\`

4.  **Run SQL scripts**: Execute the SQL scripts located in the `scripts/` directory in your Supabase SQL Editor to set up your database schema and RLS policies.
    *   `scripts/setup-database.sql`
    *   `scripts/setup-database-auth.sql`
    *   `scripts/update-database-qr.sql`
    *   `scripts/add-qr-tracking-function.sql`
    *   `scripts/setup-settings-table.sql` (New table for app settings)

    Make sure to run them in the order listed above to ensure dependencies are met.

### 4. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
    -   `dashboard/`: Dashboard pages (employees, feedbacks, insights, qr-codes, settings).
    -   `feedback/`: Public feedback submission page.
    -   `login/`: Login page.
-   `components/`: Reusable React components, including Shadcn UI components.
-   `lib/`: Utility functions and Supabase client setup.
-   `scripts/`: SQL scripts for database setup and migrations.
-   `public/`: Static assets like images.

## Technologies Used

-   Next.js 14 (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   Shadcn UI
-   Supabase (Database, Auth)
-   Recharts (for charts in Insights)

## Deployment

This application can be easily deployed to Vercel. Ensure your Supabase environment variables are configured in your Vercel project settings.

## Contributing

Feel free to contribute by opening issues or pull requests.
