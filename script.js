document.getElementById("startButton").addEventListener("click", function () {
    Swal.fire({
        title: "Siap untuk memulai?",
        text: "Tes akan segera dimulai!",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Mulai",
        cancelButtonText: "Batal",
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "soal.html"; // Arahkan ke soal.html
        }
    });
});
