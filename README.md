#Quiz application
A simple Node.js-based Quiz Application where users can register, take quizzes, and track scores.
All data is stored in JSON files — no external database required!

Features
User registration and login
Take multiple quizzes
Automatic score tracking
JSON-based data storage (users, quizzes, scores)
Modular, extendable code

Project Structure
quiz-main/
│
├── index.js            # Main server or app entry point
├── package.json        # Project metadata and dependencies
├── quizzes.json        # Quiz questions and answers
├── users.json          # Registered user data
├── scores.json         # User scores
├── public/             # Static assets (if any)
├── scratch/            # Development or experimental code
└── node_modules/       # Dependencies

Getting Started
Prerequisites
Node.js installed

Installation
Clone the repository:

bash
git clone https://github.com/pradeepsarampalli/quiz-main.git
cd quiz-main/quiz-main

Install dependencies:
bash
npm install

Running the App
bash
node index.js
The app will start. Navigate to the given localhost URL to access the quiz!

Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss what you would like to change.
