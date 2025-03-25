const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/domyid";

document.addEventListener("DOMContentLoaded", function () {
    const questionID = "1"; // ID soal yang ingin diambil (sesuaikan dengan kebutuhan)
    
    fetch(`${API_URL}/api/pretest/question/${questionID}`)
        .then(response => response.json())
        .then(data => loadQuestion(data))
        .catch(error => console.error("Error loading question:", error));
});

function loadQuestion(question) {
    const container = document.getElementById("question-container");
    container.innerHTML = ""; // Hapus konten lama

    const div = document.createElement("div");
    div.classList.add("question");
    div.innerHTML = `
        <p><strong>${question.question}</strong></p>
        <div class="options">
            ${question.options.map((option, index) => `
                <label>
                    <input type="radio" name="question" value="${String.fromCharCode(65 + index)}">
                    ${String.fromCharCode(65 + index)}. ${option}
                </label>
            `).join("")}
        </div>
    `;
    container.appendChild(div);

    document.getElementById("submit-btn").addEventListener("click", submitAnswer);
}

function submitAnswer() {
    const selected = document.querySelector("input[type='radio']:checked");
    if (!selected) {
        alert("Pilih salah satu jawaban!");
        return;
    }

    const answerData = {
        user_id: "12345", // Gantilah dengan user ID yang valid
        question_id: "1", // Gunakan ID yang sesuai
        answer: selected.value
    };

    console.log("User Answer:", answerData);
    alert(`Jawaban Anda: ${answerData.answer}`);
}
