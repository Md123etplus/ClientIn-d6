# ClientIn NFC Feedback System

This is a Next.js application for an NFC-based employee feedback system, "ClientIn". It allows customers to provide feedback to employees via NFC tags or QR codes, and managers to view and analyze this feedback through a dashboard.

## Features

-   **Customer Feedback Interface**:
    -   NFC/QR code scanning to access a feedback form for a specific employee.
    -   Star rating and optional comment submission.
    -   Offline feedback submission with automatic synchronization when online.
    -   Pure blue and white color scheme for a clean, modern look.
-   **Manager Dashboard**:
    -   **Dashboard Overview**: Key statistics on total, positive, and negative feedbacks, and active employees.
    -   **Employee Management**: Add, edit, and delete employee profiles (CIN, name, position, department, photo).
    -   **Feedback List**: View and filter all collected feedback by rating, source, and employee.
    -   **Insights & Reports**: Visualizations of feedback trends, department performance, and top-performing employees.
    -   **QR Code Management**: Generate, customize (color, background, logo), download, and track scans for employee QR codes.
    -   **Settings**: Configure company details, contact email, notification preferences, and theme.
-   **Supabase Integration**:
    -   Database for employees, feedbacks, QR codes, and application settings.
    -   Authentication for managers.
    -   Row Level Security (RLS) for secure data access.
-   **Responsive Design**: Optimized for various screen sizes.
-   **Shadcn/ui Components**: Built with a modern, accessible UI library.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js (v18.x or later)
-   npm or Yarn
-   Git
-   A Supabase project

### Installation

1.  **Clone the repository:**

    \`\`\`bash
    git clone https://github.com/your-username/clientin-nfc-feedback.git
    cd clientin-nfc-feedback
    \`\`\`

2.  **Install dependencies:**

    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Set up environment variables:**

    Create a \`.env.local\` file in the root of your project and add your Supabase credentials:

    \`\`\`
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    \`\`\`

    You can find these in your Supabase project settings under `API`.

4.  **Set up your Supabase database:**

    a.  Go to your Supabase project dashboard.
    b.  Navigate to the `SQL Editor`.
    c.  Run the SQL scripts in the `scripts/` directory in your Supabase SQL Editor to set up your database schema and functions:
        -   `scripts/setup-database.sql`
        -   `scripts/setup-database-auth.sql`
        -   `scripts/update-database-qr.sql`
        -   `scripts/add-qr-tracking-function.sql`
        -   `scripts/setup-settings-table.sql` (New table for app settings)

5.  **Run the development server:**

    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

\`\`\`
.
├── app/
│   ├── dashboard/
│   │   ├── employees/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── feedbacks/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── insights/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── qr-codes/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── feedback/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   └── ... (shadcn/ui components)
│   ├── floating-nfc-card.tsx
│   ├── loading-screen.tsx
│   ├── logo.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── public/
│   ├── images/
│   │   └── clientin-logo-white.png
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── scripts/
│   ├── add-qr-tracking-function.sql
│   ├── setup-database-auth.sql
│   ├── setup-database.sql
│   ├── setup-settings-table.sql (New)
│   └── update-database-qr.sql
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── tsconfig.json
└── package.json
\`\`\`

## Usage

### Manager Dashboard

Access the dashboard at `/dashboard` after logging in via `/login`.

-   **Employees**: Manage employee profiles, including CIN, name, position, department, and photo.
-   **Feedbacks**: View and filter all collected feedback, including ratings, comments, and source.
-   **QR Codes**: Generate and customize QR codes for each employee. Track scan statistics.
-   **Insights**: Analyze feedback trends, department performance, and top-performing employees with interactive charts.
-   **Settings**: Configure general company settings, account details, notifications, and theme preferences.

### Customer Feedback

Customers can provide feedback by:

-   Tapping an NFC-enabled device on an NFC tag (simulated via URL with `?id=EMPLOYEE_ID&source=nfc`).
-   Scanning a QR code (simulated via URL with `?id=EMPLOYEE_ID&source=qr`).

The feedback page (`/feedback`) supports offline submission, storing feedback locally and synchronizing when online.

## Customization

### Theming

The application uses a pure blue and white color palette. You can customize these colors by modifying the CSS variables in `styles/globals.css` and the `tailwind.config.ts` file.

The landing page hero section and the floating NFC card use a specific gradient for visual effect, which is intentionally distinct from the main pure blue and white theme.

### Components

All UI components are built using `shadcn/ui`, which allows for easy customization. You can modify existing components or create new ones in the `components/ui` directory.

## Deployment

This project is designed to be easily deployed to Vercel. Ensure your Supabase environment variables are configured in Vercel.

## Contributing

Feel free to fork the repository and contribute!

## License

This project is open-source and available under the MIT License.
\`\`\`
