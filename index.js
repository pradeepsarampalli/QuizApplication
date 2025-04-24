const express = require('express');
const path = require('path');
const fs = require('fs');
const {LocalStorage} = require('node-localstorage');


const localStorage = new LocalStorage('./scratch')

const app = express();
const PORT = process.env.PORT  || 3000
// Middleware to parse JSON body data
app.use(express.json());

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'signin.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/create.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'create.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'signup.html'));
});
// route to save quiz in local file 
app.post('/save-quiz', (req, res) => {
  const quiz = req.body;

  // Validate the quiz data
  if (!quiz || !quiz.title || !quiz.questions || quiz.questions.length === 0) {
    return res.status(400).json({ message: 'Invalid quiz data' });
  }

  const quizzesFilePath = path.join(__dirname, 'quizzes.json');
  const questionsFilePath = path.join(__dirname, 'public', 'questions.json');

  // Read and update quizzes.json
  fs.readFile(quizzesFilePath, 'utf8', (err, data) => {
    let quizzes = [];
    if (!err && data.trim()) {
      try {
        quizzes = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing existing quizzes:", parseErr);
        return res.status(500).json({ message: 'Error parsing existing quiz data' });
      }
    }

    // Add the new quiz to the quizzes array
    quizzes.push(quiz);

    // Write the updated quizzes data back to quizzes.json
    fs.writeFile(quizzesFilePath, JSON.stringify(quizzes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving quiz' });
      }

      // After saving the quiz, update questions.json
      fs.readFile(questionsFilePath, 'utf8', (err, questionsData) => {
        let questions = [];
        if (!err && questionsData.trim()) {
          try {
            questions = JSON.parse(questionsData);
          } catch (parseErr) {
            console.error("Error parsing existing questions:", parseErr);
            return res.status(500).json({ message: 'Error parsing existing questions data' });
          }
        }

        // Prepare new questions in the correct format
        const newQuestions = {
          title: quiz.title,
          questions: quiz.questions
        };

        // Add new questions from the quiz to questions.json
        questions.push(newQuestions);

        // Write the updated questions data back to questions.json
        fs.writeFile(questionsFilePath, JSON.stringify(questions, null, 2), (err) => {
          if (err) {
            console.error('Error saving questions data:', err);
            return res.status(500).json({ message: 'Error saving questions data' });
          }

          // Respond with success
          res.status(200).json({ message: 'Quiz saved and questions updated successfully!' });
        });
      });
    });
  });
});
// API to get all quizzes
app.get('/quizzes', (req, res) => {
  const filePath = path.join(__dirname, 'quizzes.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err || !data.trim()) return res.json([]);
    try {
      const quizzes = JSON.parse(data);
      res.json(quizzes);
    } catch (parseErr) {
      console.error("Error parsing quizzes.json:", parseErr);
      res.json([]);
    }
  });
});

const usersFilePath = path.join(__dirname, 'users.json');
ensureFileExists(usersFilePath);

//sign up handling
app.post('/signup', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        let users = [];
        if (!err && data.trim()) {
            try {
                users = JSON.parse(data);
            } catch (parseErr) {
                return res.status(500).json({ message: 'Error parsing user data' });
            }
        }

        const userExists = users.find(user => user.username === username);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        users.push({ username, email, password });

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user data' });
            }
            res.status(200).json({ message: 'Sign-up successful' });
        });
    });
});
function ensureFileExists(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));  // Create an empty array if the file doesn't exist
    }
}


// Start the server
app.listen(PORT, () => {
  console.log(`server runnig on port ${PORT}`);
});

// API to sign in
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const usersFilePath = path.join(__dirname, 'users.json');
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading user data' });
        }

        let users = [];
        try {
            users = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ message: 'Error parsing user data' });
        }

        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }
        // Send the username and email back in response for successful login
        res.status(200).json({
            message: 'Login successful',
            username: user.username,
            email: user.email
        });

        
    });
});

// --------
// app.get('/profile.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
//   });

app.get('/profile.html', (req, res) => {
    // const userEmail = localStorage.getItem('userName');  // You can store the user session in cookies as an alternative
    // if (!userEmail) {
    //     return res.redirect('/index.html'); // Redirect if user is not logged in
    // }
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
});

app.get('/managequiz.html',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'html', 'managequiz.html'));
})

app.get('/signin.html',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'html', 'signin.html'));
})
//new 
// API to get all quizzes
app.get('/quizzes', (req, res) => {
    const filePath = path.join(__dirname, 'quizzes.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err || !data.trim()) return res.json([]);
      try {
        const quizzes = JSON.parse(data);
        res.json(quizzes);
      } catch (parseErr) {
        console.error("Error parsing quizzes.json:", parseErr);
        res.json([]);
      }
    });
  });
  
  // Route to delete a quiz
app.delete('/delete-quiz/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
  
    const filePath = path.join(__dirname, 'quizzes.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error reading quiz data' });
      }
  
      let quizzes = [];
      try {
        quizzes = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).json({ success: false, message: 'Error parsing quiz data' });
      }
  
      if (index < 0 || index >= quizzes.length) {
        return res.status(400).json({ success: false, message: 'Invalid quiz index' });
      }
  
      // Remove the quiz at the specified index
      quizzes.splice(index, 1);
  
      // Write the updated quizzes back to the file
      fs.writeFile(filePath, JSON.stringify(quizzes, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error saving quiz data' });
        }
        res.json({ success: true });
      });
    });
  });
  
  
// Route to get a specific quiz for editing
app.get('/quiz/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
  
    const filePath = path.join(__dirname, 'quizzes.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error reading quiz data' });
      }
  
      let quizzes = [];
      try {
        quizzes = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).json({ success: false, message: 'Error parsing quiz data' });
      }
  
      if (index < 0 || index >= quizzes.length) {
        return res.status(400).json({ success: false, message: 'Invalid quiz index' });
      }
  
      res.json({ success: true, quiz: quizzes[index] });
    });
  });
  

  app.get('/create.html',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'html', 'create.html'));
  })

  // Route to update a quiz by index
app.put('/editquiz/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const updatedQuiz = req.body;
    const filePath = path.join(__dirname, 'quizzes.json');
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ message: 'Error reading quizzes file' });
  
      let quizzes;
      try {
        quizzes = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).json({ message: 'Error parsing quizzes' });
      }
  
      if (index < 0 || index >= quizzes.length) {
        return res.status(400).json({ message: 'Invalid quiz index' });
      }
  
      quizzes[index] = updatedQuiz;
  
      fs.writeFile(filePath, JSON.stringify(quizzes, null, 2), (err) => {
        if (err) return res.status(500).json({ message: 'Error saving quiz' });
        res.json({ message: 'Quiz updated successfully' });
      });
    });
  });
  

  app.get('/editquiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'editquiz.html'));
  });

  app.get('/leaderboard.html',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'html', 'leaderboard.html'));
  })

  app.get('/attempt.html',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'html', 'attempt.html')); 
  })

  // API to get all questions
app.get('/api/questions', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'questions.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err || !data.trim()) {
            return res.status(500).json({ message: 'Error loading questions' });
        }
        try {
            const questions = JSON.parse(data);
            res.json(questions);
        } catch (parseErr) {
            return res.status(500).json({ message: 'Error parsing questions' });
        }
    });
});


// POST /attempt - Submit quiz answers and get result
app.post('/attempt', (req, res) => {
    const { quizId, userAnswers, username } = req.body;
  
    if (!quizId || !userAnswers || !username) {
      return res.status(400).json({ message: 'Quiz ID, answers, and username are required' });
    }
  
    try {
      const quizzes = readData('data/quiz.json');
      const results = readData('data/results.json');
  
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      let score = 0;
      const feedback = [];
  
      quiz.questions.forEach((q, idx) => {
        const correct = q.correctAnswer === userAnswers[idx];
        if (correct) score++;
        feedback.push({
          question: q.question,
          correctAnswer: q.correctAnswer,
          yourAnswer: userAnswers[idx],
          isCorrect: correct
        });
      });
  
      const resultEntry = {
        username,
        quizId,
        score,
        total: quiz.questions.length,
        date: new Date().toISOString(),
        feedback
      };
  
      results.push(resultEntry);
      writeData('results.json', results);
  
      res.json({ message: 'Quiz submitted successfully', score, total: quiz.questions.length, feedback });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  
function ensureFileExists(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));  // Create an empty array if the file doesn't exist
    }
}


app.post('/api/save-score', (req, res) => {
    const newEntry = req.body;

    const filePath = path.join(__dirname, 'scores.json');
    let scores = [];

    if (fs.existsSync(filePath)) {
        scores = JSON.parse(fs.readFileSync(filePath));
    }

    scores.push(newEntry);

    fs.writeFileSync(filePath, JSON.stringify(scores, null, 2));
    res.send('Score saved successfully!');
});

//leaderboard update route
app.get('/scores.json', (req, res) => {
    const filePath = path.join(__dirname, 'scores.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading scores file' });
      }
      res.json(JSON.parse(data));
    });
  });

  
  let token;
  app.post('/api/userdata', (req, res) => {
    if (!req.body || !req.body.token) {
      return res.status(400).json({ message: 'Invalid token data' });
    }
    token = req.body;
    res.json({ message: 'Token received', token });
  });
  

  //code to access admin tools
  app.get('/admin.html', (req, res) => {
    if (token && token.token === 'admin') {
      res.sendFile(path.join(__dirname, 'public', 'html', 'admin.html'));
    } else {
      res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
    }
  });
  


  
  const sourceFile = path.join(__dirname,'quizzes.json'); // Modify as needed
  const targetFile = path.join(__dirname, 'public', 'questions.json'); // Modify as needed
  

// Watch for changes in sourceFile
fs.watchFile(sourceFile, (curr, prev) => {
  console.log(`${sourceFile} has been modified.`);

  // Read from source and append to target
  fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) return console.error('Read error:', err);

    fs.appendFile(targetFile, `\n---\n${data}`, err => {
      if (err) return console.error('Append error:', err);
      console.log('Content appended to', targetFile);
    });
  });
});