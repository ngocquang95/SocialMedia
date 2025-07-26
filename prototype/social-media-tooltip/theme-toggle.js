// Toggle theme
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.textContent = '☀️';
  } else {
    document.body.classList.remove('light-theme');
    themeIcon.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}
toggleBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-theme');
  setTheme(isLight ? 'light' : 'dark');
});
// Load theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') setTheme('light');
else setTheme('dark'); 