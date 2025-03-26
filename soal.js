import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

// Inisialisasi
let question_page = 1;
const question_last_page = 15;
let currentQuestionId = "1";
let question = null;
let listJawaban = [];

const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/domyid";

// DOM Elements
const loadingElement = document.getElementById('loading');
const questionContainerElement = document.getElementById('question-container');
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionNumberElement = document.getElementById('question-number');
const nextButtonElement = document.getElementById('next-button');

// Fungsi untuk menampilkan soal
function displayQuestion() {
    if (!question || !question.question) {
        console.error("❌ Soal tidak ditemukan!", question);
        questionTextElement.innerHTML = "<strong>Soal tidak tersedia.</strong>";
        return;
    }

    questionTextElement.innerHTML = question.question;

    optionsContainer.innerHTML = question.options.map((option, index) => {
        const abjad = String.fromCharCode(65 + index); // A, B, C, ...
        return `
            <label class="option-label">
                <input type="radio" name="answer" value="${abjad}">
                ${option}
            </label>
        `;
    }).join("");
}

// Fungsi untuk mengambil soal berdasarkan ID
async function getQuestionById(id) {
    try {
        loadingElement.style.display = "flex";
        questionContainerElement.style.display = "none";

        const response = await fetch(`${API_URL}/api/pretest/question/${id}`);
        if (!response.ok) throw new Error(`Gagal memuat soal! (${response.status})`);

        const data = await response.json();
        question = data;

        loadingElement.style.display = "none";
        questionContainerElement.style.display = "block";

        displayQuestion();
    } catch (error) {
        console.error("❌ Error fetch soal:", error);
        Swal.fire({
            icon: "error",
            title: "Gagal Memuat Soal",
            text: error.message,
        });
    }
}

// Fungsi kirim hasil pretest
async function processResults() {
    const token = getCookie("login");

    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Sesi login tidak ditemukan",
            text: "Silakan login terlebih dahulu.",
            confirmButtonText: "Login",
        }).then(() => {
            window.location.href = "/signin/";
        });
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/pretest/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "login": token
            },
            body: JSON.stringify({
                answers: listJawaban
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Gagal menyimpan hasil pretest!");

        console.log("✅ Jawaban terkirim:", data);
        window.location.href = "hasilpretest.html";
    } catch (error) {
        console.error("❌ Gagal kirim jawaban:", error);
        Swal.fire({
            icon: "error",
            title: "Gagal Menyimpan Jawaban",
            text: error.message,
        });
    }
}

// Fungsi untuk ke soal berikutnya
async function initNextQuestion() {
    const selectedOption = document.querySelector("input[name='answer']:checked");

    if (!selectedOption) {
        Swal.fire({
            icon: "warning",
            title: "Pilih Jawaban!",
            text: "Silakan pilih salah satu jawaban sebelum lanjut.",
        });
        return;
    }

    listJawaban.push({
        question_id: question.id,
        answer_key: selectedOption.value,
        answer_text: selectedOption.parentNode.textContent.trim()
    });

    if (question_page >= question_last_page) {
        nextButtonElement.innerText = "Selesai";
        nextButtonElement.removeEventListener("click", initNextQuestion);
        processResults();
        return;
    }

    question_page++;
    currentQuestionId = String(parseInt(currentQuestionId) + 1);
    questionNumberElement.innerText = `Pertanyaan ${question_page} dari ${question_last_page}`;
    await getQuestionById(currentQuestionId);

    if (question_page === question_last_page) {
        nextButtonElement.innerText = "Selesai";
    }
}

// Saat dokumen siap
document.addEventListener("DOMContentLoaded", () => {
    nextButtonElement.addEventListener("click", initNextQuestion);
    questionNumberElement.innerText = `Pertanyaan ${question_page} dari ${question_last_page}`;
    getQuestionById(currentQuestionId);
});
