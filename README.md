# 文学炼金术士 - Literary Alchemist

Welcome to Literary Alchemist, an AI-powered writing enhancement tool designed to help you transform, refine, and perfect your text.

## Features

This application provides several AI-driven tools to assist writers:

*   **Style Transformation**: Rewrite your text in the style of famous authors like Lu Xun, Hayao Miyazaki, Shakespeare, or Edgar Allan Poe.
*   **Structure Advisor**: Get suggestions on how to improve the flow, coherence, and overall structure of your writing.
*   **Rhythm Adjustment**: Receive an adjusted version of your text with improved pacing and rhythm, along with specific suggestions for pauses and emphasis.
*   **De-AI Text**: Make AI-generated text sound more natural and human-like, removing tell-tale signs of AI generation.
*   **Multi-Language Support**: The user interface is available in both English and Simplified Chinese. The AI tools are designed to maintain the language of the input text for their output.

## Technology Stack

This project is built with a modern web development stack:

*   **Next.js**: A React framework for building server-side rendered and static web applications.
*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **Genkit (by Firebase)**: An open-source framework for building AI-powered applications, used here to interact with Large Language Models (LLMs).
*   **ShadCN UI**: A collection of re-usable UI components built with Radix UI and Tailwind CSS.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.

## Getting Started

To get started with the application locally:

1.  **Clone the repository.**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:
    Create a `.env` file in the root of the project. You'll likely need to add an API key for the AI model provider (e.g., Google AI Studio for Gemini).
    ```
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```
4.  **Run the Genkit development server** (for AI flows):
    ```bash
    npm run genkit:dev
    ```
    Or, to watch for changes in AI flows:
    ```bash
    npm run genkit:watch
    ```
5.  **Run the Next.js development server** (in a separate terminal):
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002`.

The main application logic can be found in `src/app/page.tsx` and `src/components/literary-alchemist-client.tsx`. AI flows are located in `src/ai/flows/`.

## Project Structure

*   `src/app/`: Contains the Next.js pages and layout components.
*   `src/components/`: Contains reusable React components, including UI components from ShadCN.
*   `src/ai/`: Houses the Genkit configuration and AI flow definitions.
    *   `src/ai/flows/`: Specific AI processing logic for each tool.
*   `src/contexts/`: React context providers (e.g., for language management).
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Utility functions.
*   `src/locales/`: JSON files for internationalization (i18n).
*   `public/`: Static assets.

This project was bootstrapped in Firebase Studio.
