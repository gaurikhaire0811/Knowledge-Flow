# Knowledge-Flow ❤️

Knowledge Flow is a full-stack AI chat application that I built to understand how a real-world AI-based application works.

The main idea of this project is to provide a simple chat interface where users can interact with an AI model, create conversations and access their previous chats.

## 🔗 Project Links

* 🌐 Live Demo: https://knowledge-flow-iota.vercel.app/
* 💻 GitHub Repository: https://github.com/gaurikhaire0811/Knowledge-Flow

## ✨ What I Built

* User signup and login
* AI chat interface
* New chat / conversation threads
* Chat history
* User authentication
* Protected backend routes
* MongoDB database for storing users and conversations
* Backend APIs using Express.js
* AI responses using OpenRouter API

## 🛠️ Technologies Used

**Frontend**

* React.js
* JavaScript
* HTML
* CSS

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport.js
* Express Session

**AI**

* OpenRouter API

## 🔄 How the Project Works

When a user sends a message, the request goes from the React frontend to the Express backend.

The backend sends the message to the AI model through OpenRouter and receives the response. The response is then sent back to the frontend and displayed in the chat.

User information and conversations are stored in MongoDB.

## 📁 Main Parts of the Project

* `frontend` – React application and UI
* `backend` – Express server and APIs
* `models` – MongoDB/Mongoose models
* `routes` – API routes
* `components` – React UI components
* `context` – Application state and authentication related logic

## ⚙️ Run Locally

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

Install dependencies in both frontend and backend:

```bash
npm install
```

Create a `.env` file in the backend and add your own credentials:

```env
MONGO_URI=your_mongodb_url
SESSION_SECRET=your_secret
OPENROUTER_API_KEY=your_api_key
```

Start the backend and frontend using the commands mentioned in their respective folders.

## 🚀 What I Learned

While building this project, I learned more about:

* Connecting React with a backend
* Creating REST APIs with Express
* MongoDB and Mongoose
* Authentication and sessions
* Working with API keys and environment variables
* Connecting an AI model to a web application
* Managing chat data and conversations
* Deploying a full-stack project

## 🔮 Future Improvements

Some features I would like to add later:

* Rename conversations
* Voice input
* File upload
* Support for multiple AI models

## 👩‍💻 About

This project was built by Gauri Khaire as a learning and practical full-stack development project.


