/*------------------ SEARCH ICON ------------------------ */
const searchIcon = document.getElementById('search-icon');
const searchBox = document.getElementById('search-box');
const searchIconImg = document.getElementById('search-icon-img');
const searchInput = document.getElementById('search-input');
searchIconImg.addEventListener('click', () => {
  if (searchBox.style.display === 'none' || !searchBox.style.display) {
    searchBox.style.display = 'block';
    searchInput.focus();
  } else {
    searchBox.style.display = 'none';
  }
});
/*------------------- SEARCH BAR ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();
    const sort = 'asc'; // Aquí puedes establecer el valor de sort que desees
    const page = 1; // Aquí puedes establecer el número de página que desees
    const limit = 10; // Aquí puedes establecer el límite de resultados por página que desees

    // Construye la URL de búsqueda con los parámetros
    const searchURL = `/products/filter?title=${searchTerm}&sort=${sort}&page=${page}&limit=${limit}`;

    try {
      window.location.href = searchURL;
    } catch (error) {
      console.error('Hubo un error al redirigir a la página de resultados.', error);
    }
  });
});
