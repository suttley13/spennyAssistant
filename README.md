# Spenny Assistant

A powerful product management assistant web application for organizing tasks, projects, and features with AI integration.

## Features

- **Task Management**: Organize your work into Tasks, Projects, and Features
- **Drag-and-Drop**: Reorder items with intuitive drag-and-drop functionality
- **Deadline Management**: Set and track deadlines for all items
- **Project Documentation**: Create and edit PRDs with markdown support
- **AI Integration**: Extract tasks from text and images using Claude AI
- **Shipped History**: Track completed items in a searchable history
- **Data Persistence**: Choose between local storage or Firebase Firestore for data storage
- **Cloud Deployment**: Deploy to Firebase Hosting for access from anywhere

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Styled Components for styling
- React Context API for state management
- SortableJS for drag-and-drop functionality
- Local storage for offline data persistence
- Firebase Firestore for cloud data storage (optional)

### Backend
- Express.js for API proxying
- Claude AI integration for task extraction and PRD generation
- Firebase Hosting for deployment (optional)

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase CLI (optional, for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spenny-assistant.git
cd spenny-assistant
```

2. Quick Setup:

**For Unix/Mac:**
```bash
# Run the setup script to install dependencies and create environment files
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```bash
# Run the setup script to install dependencies and create environment files
setup.bat
```

OR

2. Manual Setup:
```bash
# Install all dependencies (root, client, and server)
npm run install-all

# Set up environment variables
cp client/.env.example client/.env
cp server/.env.example server/.env
```

3. Edit the `server/.env` file and add your Claude API key.

4. (Optional) Firebase Setup:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Firestore database in your Firebase project
   - Get your Firebase configuration (apiKey, authDomain, etc.)
   - Edit the `client/.env` file and add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   - Update the `.firebaserc` file with your Firebase project ID:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

5. Start the development servers:
```bash
# Start both client and server concurrently
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

### Task Management
- Click the "+" button in each section to add a new item
- Drag items to reorder them
- Click the edit button to modify an item
- Set deadlines using the date picker

### AI Features
- Click "Extract Tasks" to extract tasks from text
- Click "Extract from Image" to extract tasks from screenshots or images
- Generate PRDs automatically for projects

### Shipped Items
- Click the ship button on any item to mark it as completed
- Access shipped items from the floating button in the bottom-right corner
- Search and filter shipped items by type

### Data Storage
- Toggle between local storage and Firebase storage using the toggle in the header
- Local storage keeps data in your browser only
- Firebase storage syncs data across devices and browsers

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI if you haven't already:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Build the client application:
```bash
cd client
npm run build
```

4. Deploy to Firebase:
```bash
firebase deploy
```

5. Your application will be available at `https://your-firebase-project-id.web.app`

## Project Structure

For a detailed overview of the project structure, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. # Updated for GitHub Actions test
