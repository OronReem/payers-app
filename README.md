# PAYERS - Receipt Splitter App

PAYERS is a full-stack Progressive Web App (PWA) designed to help groups of people easily split receipts and bills. It utilizes AI to automatically read and extract line items and prices from a receipt photo, allowing users to assign specific items to different participants and visually track the cost split.

## Features
- **AI Receipt Scanning**: Upload a photo of a receipt, and the backend uses Google's Gemini API to automatically extract line items and prices.
- **Interactive Splitter UI**: Add participants with uniquely assigned color themes.
- **Visual Breakdown**: A dynamic pie chart displays exactly how much each person owes based on the items assigned to them.
- **Modern UI/UX**: Designed with a mobile-first premium aesthetic, utilizing smooth transitions and micro-animations.

## Technology Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling**: TailwindCSS & custom Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend
- **Environment**: Node.js & Express
- **AI Integration**: `@google/generative-ai` (Gemini API)
- **Uploads Handling**: `multer`

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- A Gemini API Key from Google AI Studio.

### 1. Setting Up the Backend
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The backend server will run on http://localhost:5000)*

### 2. Setting Up the Frontend
1. Open a **new** terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(The frontend server will run on http://localhost:5173)*

## Usage Flow
1. Open the application locally at `http://localhost:5173`.
2. Go to the **Verify Receipt** page to upload a photo of your receipt.
3. The backend AI will extract the items and return them to the frontend.
4. On the **Splitter** page, you can assign these items to different participants by selecting an item and then picking the participant who pays for it.
5. The Pie Chart updates in real time to show the breakdown of the bill.
