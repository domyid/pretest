const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/domyid";

// Daftar ID soal, bisa diganti dengan angka atau UUID dari database
const questionIds = ["1", "2", "3", "4", "5"];
let currentIndex = 0;
let userAnswers = [];

document.addEventListener("DOMContentLoaded", function () {
    loadQuestionById(questionIds[currentIndex]);
});

function loadQuestionById(questionID) {
    fetch(`${API_URL}/api/pretest/question/${questionID}`)
        .then(response => response.json())
        .then(data => {
            renderQuestion(data);
        })
        .catch(error => console.error("Error loading question:", error));
}

function renderQuestion(question) {
    const container = document.getElementById("question-container");
    container.innerHTML = "";

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "question-id";
    hiddenInput.value = question.id;

    const div = document.createElement("div");
    div.classList.add("question");
    div.innerHTML = `
        <p>${question.question}</p>
        <div class="options">
            ${question.options.map(option => `
                <label>
                    <input type="radio" name="question" value="${option.charAt(0)}">
                    ${option}
                </label>
            `).join("")}
        </div>
    `;

    container.appendChild(hiddenInput);
    container.appendChild(div);

    // Ganti event listener pada tombol
    const btn = document.getElementById("submit-btn");
    btn.replaceWith(btn.cloneNode(true));
    document.getElementById("submit-btn").addEventListener("click", submitAnswer);
}

function submitAnswer() {
    const selected = document.querySelector("input[type='radio']:checked");
    if (!selected) {
        alert("Pilih salah satu jawaban!");
        return;
    }

    const questionId = document.getElementById("question-id").value;
    const selectedLetter = selected.value;
    const selectedText = selected.parentNode.textContent.trim();

    const answerData = {
        question_id: questionId,
        answer_key: selectedLetter,
        answer_text: selectedText
    };

    userAnswers.push(answerData);
    console.log("Jawaban tersimpan:", answerData);

    // Pindah ke soal berikutnya
    currentIndex++;
    if (currentIndex < questionIds.length) {
        loadQuestionById(questionIds[currentIndex]);
    } else {
        showResult();
    }
}

function showResult() {
    const container = document.getElementById("question-container");
    container.innerHTML = `
        <h3>Terima kasih!</h3>
        <p>Kamu telah menyelesaikan seluruh soal pretest.</p>
        <pre>${JSON.stringify(userAnswers, null, 2)}</pre>
    `;

    const btn = document.getElementById("submit-btn");
    btn.style.display = "none";
}
