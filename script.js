// ---------------- Load Existing Data ----------------
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || {};
let allScores = JSON.parse(localStorage.getItem("allScores")) || [];

// ---------------- Admin Signup/Login ----------------
document.getElementById("adminSignupForm")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("Admin signed up!");
  window.location.href = "admin-login.html";
});

document.getElementById("adminLoginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("Admin logged in!");
  sessionStorage.setItem("currentAdminEmail", document.getElementById("adminEmailLogin")?.value || "admin@example.com");
  window.location.href = "quiz-dashboard.html";
});

// ---------------- User Signup/Login ----------------
document.getElementById("userSignupForm")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("User signed up!");
  window.location.href = "user-login.html";
});

document.getElementById("userLoginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("userNameLogin")?.value || "Anonymous";
  const email = document.getElementById("userEmailLogin")?.value;
  const code = document.getElementById("quizCode")?.value.toUpperCase();

  if (!quizzes[code]) return alert("Invalid Quiz Code!");

  sessionStorage.setItem("currentUserName", name);
  sessionStorage.setItem("currentQuizCode", code);

  window.location.href = "play-quiz.html";
});

// ---------------- Generate Random Quiz Code ----------------
function generateQuizCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ---------------- Admin Create Quiz ----------------
document.getElementById("createQuizForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("quizTitle")?.value.trim();
  if (!title) return alert("Enter quiz title!");

  const code = generateQuizCode();
  quizzes[code] = { title: title, questions: [] };
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
  localStorage.setItem("lastQuizCode", code);

  document.getElementById("generatedCode").textContent = `Quiz Created! Share this code: ${code}`;
  e.target.reset();
});

// ---------------- Admin Add Questions ----------------
document.getElementById("addQuestionForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const code = localStorage.getItem("lastQuizCode");
  if (!code || !quizzes[code]) return alert("Create a quiz first!");

  const question = document.getElementById("questionText")?.value.trim();
  const option1 = document.getElementById("option1")?.value.trim();
  const option2 = document.getElementById("option2")?.value.trim();
  const option3 = document.getElementById("option3")?.value.trim();
  const option4 = document.getElementById("option4")?.value.trim();
  const correct = document.getElementById("correctOption")?.value.trim();

  if (!question || !option1 || !option2 || !option3 || !option4 || !correct)
    return alert("Please fill in all fields!");

  quizzes[code].questions.push({
    question: question,
    options: [option1, option2, option3, option4],
    answer: correct
  });

  localStorage.setItem("quizzes", JSON.stringify(quizzes));

  // Show question in quiz preview
  const li = document.createElement("li");
  li.textContent = `${question} [${option1}, ${option2}, ${option3}, ${option4}] (Answer: ${correct})`;
  document.getElementById("questionList").appendChild(li);

  e.target.reset();
});

// ---------------- Play Quiz ----------------
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const submitButton = document.getElementById("submitQuiz");
const quizTitle = document.getElementById("quizTitle");

if (quizContainer && submitButton) {
  const code = sessionStorage.getItem("currentQuizCode");
  const quizzesData = JSON.parse(localStorage.getItem("quizzes")) || {};
  const quizData = quizzesData[code]?.questions || [];

  // Show quiz title
  quizTitle.textContent = quizzesData[code]?.title || "Quiz";

  // Load all questions dynamically
  function loadQuiz() {
    if (quizData.length === 0) {
      quizContainer.innerHTML = "<p>No questions added yet for this quiz.</p>";
      submitButton.style.display = "none";
      return;
    }

    quizContainer.innerHTML = "";

    quizData.forEach((q, i) => {
      const div = document.createElement("div");
      div.classList.add("question-block");
      div.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.question}</p>`;

      q.options.forEach(opt => {
        const label = document.createElement("label");
        label.classList.add("option-label");
        label.innerHTML = `<input type="radio" name="q${i}" value="${opt}"> ${opt}`;
        div.appendChild(label);
      });

      quizContainer.appendChild(div);
    });
  }

  // Submit quiz and calculate score
  submitButton.addEventListener("click", () => {
    if (quizData.length === 0) return;

    let score = 0;
    quizData.forEach((q, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected && selected.value === q.answer) score++;
    });

    resultContainer.innerHTML = `<h3>Your Score: ${score} / ${quizData.length}</h3>`;

    // Save user score
    const userName = sessionStorage.getItem("currentUserName") || "Anonymous";
    allScores.push({ name: userName, score: score, total: quizData.length });
    localStorage.setItem("allScores", JSON.stringify(allScores));

    submitButton.disabled = true;
  });

  loadQuiz();
}
