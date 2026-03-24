# P A Y E R S

**P A Y E R S** is a mobile-first Progressive Web App (PWA) that simplifies splitting group expenses using AI-powered receipt scanning. By leveraging Google's Gemini API, it automatically parses items and prices, allowing for precise and visual cost allocation among participants.

## Key Features

*   ** AI-Powered Extraction**: Instantly transform receipt photos into editable digital item lists using Google Gemini.
*   ** Participant Mapping**: Assign unique color-coded themes to participants for clear visual identification.
*   ** Real-time Breakdown**: A dynamic, interactive breakdown shows exactly what each person owes as you assign items.
*   ** Persistent Storage**: Securely sync your bills and user profile across devices using Firebase.
*   ** PWA Ready**: Installable on iOS and Android for a native-like app experience.
*   ** Guest Mode**: Try out the core functionality without needing to create an account.

## Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & Custom CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PWA**: `vite-plugin-pwa`

### Backend & Infrastructure
- **Hosting**: Vercel
- **Serverless**: Vercel Functions (Node.js)
- **AI**: Google Gemini API
- **Database/Auth**: Firebase (Firestore & Authentication)

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Google AI Studio API Key
- A Firebase Project (Firestore + Auth enabled)

### Local Development

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/yourusername/payers.git
    cd payers
    cd frontend && npm install
    ```

2.  **Environment Setup**:
    Create `frontend/.env.local` with your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

    Create `.env` at the root for the serverless API:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    ```

3.  **Run Development Server**:
    ```bash
    # From the project root
    npm run dev  # (If you have a root script) or 'cd frontend && npm run dev'
    ```

4.  **Backend (Optional)**:
    To test the Gemini extraction locally:
    ```bash
    npm i -g vercel
    vercel dev
    ```

## Application Flow

1.  **Dashboard**: Start a new session or view past receipts.
2.  **Scanner**: Capture or upload a receipt image.
3.  **Editor**: Review and adjust the AI-extracted items for 100% accuracy.
4.  **Splitter**: Add participants and tap items to assign them to specific people.
5.  **Results**: View the final balance and sharing details.

---

*Built with precision for easy group payments.*
