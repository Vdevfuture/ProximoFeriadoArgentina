const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];

const dayOfWeek = (day, month, year) =>
  days[new Date(year, month, day).getDay()];

const getURL = (year) => `https://nolaborables.com.ar/api/v2/feriados/${year}`;

const diffDays = (date_1, date_2) => {
  const date1 = new Date(date_1);
  const date2 = new Date(date_2);
  const diffTime = Math.abs(date2 - date1);
  const diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diff;
};

const renderProtectedPage = () => {
  const mountContainer = document.getElementById("app");
  mountContainer.innerHTML = "";

  const protectedContent = document.createElement("div");
  protectedContent.classList.add("next-holiday");

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.placeholder = "Introduce la contraseña";

  const verifyButton = document.createElement("button");
  verifyButton.id = "password-button";
  verifyButton.textContent = "Verificar Contraseña";

  const resultContainer = document.createElement("div");
  resultContainer.id = "mount";

  protectedContent.appendChild(passwordInput);
  protectedContent.appendChild(verifyButton);
  protectedContent.appendChild(resultContainer);
  mountContainer.appendChild(protectedContent);

  verifyButton.addEventListener("click", () => {
    const password = passwordInput.value;
    if (password === "ucasal123") {
      fetch(getURL(new Date().getFullYear()))
        .then((response) => response.json())
        .then((data) => {
          const now = new Date();
          const nextHoliday = data.find((holiday) => {
            const holidayDate = new Date(now.getFullYear(), holiday.mes - 1, holiday.dia);
            return holidayDate > now;
          });

          if (nextHoliday) {
            resultContainer.innerHTML = `
              <div class="content">
                <div class="next">Próximo feriado</div>
                <div class="reason">${nextHoliday.motivo}</div>
                <div class="date">
                  <div class="weekday">
                    ${dayOfWeek(nextHoliday.dia, nextHoliday.mes - 1, now.getFullYear())}
                  </div>
                  <div class="day">${nextHoliday.dia}</div>
                  <div class="month">${months[nextHoliday.mes - 1]}</div>
                </div>
                <div class="type">${nextHoliday.tipo}</div>
              </div>`;
          } else {
            resultContainer.innerHTML = "No hay feriados próximos.";
          }
        })
        .catch((error) => {
          console.error("Error al obtener datos de la API:", error);
        });
    } else {
      alert("Contraseña incorrecta. Inténtalo de nuevo.");
    }
  });
};

renderProtectedPage();