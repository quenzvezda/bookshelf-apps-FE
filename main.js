// Fungsi untuk mengaktifkan section yang dipilih dan menonaktifkan yang lain
function showSection(sectionId) {
  // Sembunyikan semua section
  document.querySelectorAll("main section").forEach((section) => {
    section.classList.remove("active");
  });

  // Tampilkan section yang sesuai dengan id yang diberikan
  const sectionToShow = document.getElementById(sectionId);
  if (sectionToShow) {
    sectionToShow.classList.add("active");
  }
}

// Event listener untuk setiap navigasi di header
document
  .getElementById("navInputBook")
  .addEventListener("click", () => showSection("inputBook"));
document
  .getElementById("navSearchBooks")
  .addEventListener("click", () => showSection("searchBooks"));
document
  .getElementById("navAllBooks")
  .addEventListener("click", () => showSection("allBooks"));

// Fungsi toggleMenu() untuk dropdown pada mobile
function toggleMenu() {
  var headerContent = document.querySelector(".header-content");
  headerContent.classList.toggle("active");
}
