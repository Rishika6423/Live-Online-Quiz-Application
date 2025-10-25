const quizContainer=document.getElementById("quiz");
const resultContainer=document.getElementById("result");
const submitButton=document.getElementById("submitQuiz");
async function loadQuiz(){

  const quizData=[
    {question:"What is 2+2?",options:["1","2","3","4"],answer:"4"},
    {question:"Capital of India?",options:["Delhi","Mumbai","Kolkata","Chennai"],answer:"Delhi"}
  ];
  
  quizContainer.innerHTML="";
  quizData.forEach((q,i)=>{
    const div=document.createElement("div");
    div.classList.add("question-block");
    div.innerHTML=`<p><strong>Q${i+1}:</strong> ${q.question}</p>`;
    q.options.forEach(opt=>{
      const label=document.createElement("label");
      label.classList.add("option-label");
      label.innerHTML=`<input type="radio" name="q${i}" value="${opt}"> ${opt}`;
      div.appendChild(label);
    });
    quizContainer.appendChild(div);
  });
  
  submitButton?.addEventListener("click", async ()=>{
    const answers=quizData.map((q,i)=>{
      const selected=document.querySelector(`input[name="q${i}"]:checked`);
      return selected?selected.value:null;
    });
    const userName=sessionStorage.getItem("currentUserName");
    const quizCode=sessionStorage.getItem("currentQuizCode");
    const res=await submitQuizAnswers(userName,quizCode,answers);
    resultContainer.innerHTML=`<h3>Your Score: ${res.score} / ${quizData.length}</h3>`;
  });
}

loadQuiz();
