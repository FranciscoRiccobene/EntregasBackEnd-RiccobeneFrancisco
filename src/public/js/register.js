const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  let obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
  })
  .then((response) => response.json());
  window.location.reload();
  alert("¡Usuario registrado!");
});
