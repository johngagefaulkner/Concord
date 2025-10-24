# Concord

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/johngagefaulkner/Concord)

A visually stunning, lightweight, and performant Discord clone built with shadcn/ui, Tailwind CSS, and Cloudflare Workers.

Concord is a minimalist, high-performance re-imagining of a modern chat application like Discord. It is built with an obsessive focus on visual elegance, user experience, and resource efficiency. The application features a classic multi-column layout for navigating servers, channels, and conversations. The frontend is powered by React, Vite, and styled with the latest shadcn/ui components and Tailwind CSS, running on Cloudflare's edge network for unparalleled speed. The backend leverages Cloudflare Workers and Durable Objects for stateful, real-time communication. The core philosophy is 'less is more,' providing a clean, intuitive, and beautiful communication tool without the bloat.

## ✨ Key Features

- **Resizable Multi-Panel Layout**: A fully responsive, four-panel interface for servers, channels, chat, and users, built with `react-resizable-panels`.
- **Stunning Visuals**: A beautiful, minimalist dark theme (`dark-concord`) designed for focus and clarity.
- **Modern Component Library**: Crafted with the latest, highly-polished [shadcn/ui](https://ui.shadcn.com/) components.
- **Efficient State Management**: Centralized client-side state powered by [Zustand](https://github.com/pmndrs/zustand) for a reactive and performant experience.
- **Smooth Micro-interactions**: Delightful animations and transitions using [Framer Motion](https://www.framer.com/motion/) for a polished user experience.
- **High-Performance**: Built on Vite and deployed to Cloudflare's edge network for lightning-fast load times and interactions.

## 🛠️ Technology Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI & Layout**: [React Resizable Panels](https://react-resizable-panels.vercel.app/), [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Cloudflare Workers](https://workers.cloudflare.com/), [Durable Objects](https://developers.cloudflare.com/durable-objects/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) package manager
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/concord.git
    cd concord
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```sh
    bun install
    ```

3.  **Configure Environment Variables:**
    For local development, create a `.dev.vars` file in the root of the project. This file is used by Wrangler to load secrets.
    ```sh
    touch .dev.vars
    ```
    Add the following variables to your `.dev.vars` file. These are required for the backend worker to connect to Cloudflare's AI Gateway.

    ```ini
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```

    Replace the placeholder values with your actual Cloudflare Account ID, Gateway ID, and API Key.

### Running the Development Server

To start the local development server, which includes both the Vite frontend and the Cloudflare Worker backend, run:

```sh
bun run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your environment).

## Usage

Once the application is running, you can:
- **Navigate Servers**: Hover over server icons on the far left to see tooltips, and click to switch servers.
- **Select Channels**: Click on a channel in the second panel to view its conversation.
- **View Messages**: The main panel displays the chat history for the selected channel.
- **Send Messages**: Type in the input box at the bottom and press Enter to send a message.
- **See Users**: The right-most panel shows the list of users in the current channel.

## ☁️ Deployment

This project is designed for seamless deployment to Cloudflare Pages.

1.  **Login to Cloudflare:**
    If you haven't already, authenticate Wrangler with your Cloudflare account.
    ```sh
    bunx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script. This command will build the Vite application and deploy it along with the worker to your Cloudflare account.
    ```sh
    bun run deploy
    ```

    Wrangler will guide you through the first-time deployment process.

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/johngagefaulkner/Concord)

## 📂 Project Structure

-   `src/`: Contains all the frontend React application code.
    -   `components/`: Reusable UI components, including shadcn/ui and custom Concord components.
    -   `hooks/`: Custom React hooks, including the Zustand store definition.
    -   `lib/`: Utility functions and mock data.
    -   `pages/`: Top-level page components.
-   `worker/`: Contains the backend Cloudflare Worker and Durable Object code.
-   `public/`: Static assets for the frontend.
-   `wrangler.jsonc`: Configuration file for the Cloudflare Worker.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.