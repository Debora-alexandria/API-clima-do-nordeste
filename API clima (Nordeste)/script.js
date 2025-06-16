const selectCidade = document.getElementById("cidadeSelect");
const resultadoDiv = document.getElementById("resultado");

// Mapeamento de cidades com coordenadas
const cidades = {
  "-12.9711,-38.5016": "Salvador - BA",
  "-3.7172,-38.5434": "Fortaleza - CE",
  "-8.0476,-34.8770": "Recife - PE",
  "-7.1192,-34.8457": "João Pessoa - PB",
  "-5.7945,-35.2110": "Natal - RN",
  "-10.9470,-37.0731": "Aracaju - SE",
  "-9.6652,-35.7353": "Maceió - AL",
  "-5.0917,-42.8100": "Teresina - PI",
  "-2.5328,-44.2953": "São Luís - MA"
};

// Função para mapear condições climáticas para emojis
function getClimaEmoji(temp, weathercode) {
  if (weathercode === undefined) {
    if (temp > 30) return "☀️";
    if (temp > 20) return "⛅";
    if (temp > 10) return "☁️";
    return "🌧️";
  }

  // Weather codes da Open-Meteo (exemplos básicos)
  switch (weathercode) {
    case 0: return "☀️"; // clear sky
    case 1: return "🌤"; // mostly clear
    case 2: return "⛅"; // partly cloudy
    case 3: return "☁️"; // overcast
    case 45: return "🌫"; // fog
    case 51: return "🌧️"; // drizzle
    case 61: return "🌦"; // rain
    case 71: return "🌨"; // snow
    case 80: return "🌦️"; // showers
    default: return "🌈";
  }
}

async function buscarClima(coordenadas) {
  const [lat, lon] = coordenadas.split(",");

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const temp = data.current.temperature_2m;
    const umidade = data.current.relative_humidity_2m;
    const vento = data.current.wind_speed_10m;
    const condicao = getClimaEmoji(temp, data.current.weather_code);

    resultadoDiv.innerHTML = `
      <div class="info-item">
        <span>🌡 Temperatura:</span>
        <span>${temp}°C</span>
      </div>
      <div class="info-item">
        <span>💧 Umidade:</span>
        <span>${umidade}%</span>
      </div>
      <div class="info-item">
        <span>🌬 Vento:</span>
        <span>${vento.toFixed(1)} km/h</span>
      </div>
      <div class="info-item">
        <span>🌤 Condição:</span>
        <span>${condicao}</span>
      </div>
    `;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    resultadoDiv.innerHTML = "<p>Não foi possível carregar os dados.</p>";
  }
}

selectCidade.addEventListener("change", () => {
  const coordenadas = selectCidade.value;
  if (coordenadas) {
    buscarClima(coordenadas);
  } else {
    resultadoDiv.innerHTML = "";
  }
});