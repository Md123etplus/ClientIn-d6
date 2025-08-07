# ClientIn: NFC-based Employee Feedback System

This project is an NFC-based employee feedback system designed to collect instant customer feedback via NFC tags and QR codes, even offline. It features a dashboard for managers to track employee performance, analyze feedback trends, and manage QR codes.

## Features

- **Instant Feedback Collection**: Customers can tap NFC tags or scan QR codes to provide feedback.
- **Offline-First Capability**: Feedback can be collected even without an internet connection and synchronized later.
- **Employee Management**: Add, edit, and delete employee profiles.
- **QR Code Generation & Customization**: Generate unique QR codes for each employee with customizable styles.
- **Feedback Analytics**: View and filter feedback, analyze trends, and identify top-performing employees.
- **Dashboard Overview**: A comprehensive dashboard providing key metrics and recent activities.
- **Authentication**: Secure login for managers.
- **Responsive Design**: Optimized for various screen sizes.
- **Pure Blue & White Theme**: A clean and modern aesthetic.

## Technologies Used

- **Next.js**: React framework for building the web application.
- **React**: Frontend library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
- **Lucide React**: Icon library.
- **Supabase**: Backend-as-a-Service for database, authentication, and storage.
- **Recharts**: For building interactive charts and data visualizations.

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or Yarn
- A Supabase account

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

3.  **Set up Supabase:**

    a.  Create a new project in your Supabase dashboard.
    b.  Go to `Settings > API` and copy your `Project URL` and `anon public` key.
    c.  Create a `.env.local` file in the root of your project and add the following:

        \`\`\`env
        NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
        NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
