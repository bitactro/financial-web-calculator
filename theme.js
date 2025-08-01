document.documentElement.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
themeToggle.addEventListener('change',e=>{
document.documentElement.classList.toggle('dark',e.target.checked);
document.documentElement.classList.toggle('light',!e.target.checked);
});