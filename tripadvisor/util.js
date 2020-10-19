const fetch = require("node-fetch");

const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
  Accept: "text/html, */*",
  "Accept-Language": "pt-BR,pt;q=0.8,en;q=0.5,en-US;q=0.3",
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "Application/json; charset=utf-8",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
};

function getTripAdvisorCityId(city) {
  const link = `https://www.tripadvisor.com.br/Search?q=${encodeURI(
    city
  )}&searchSessionId=12EA4766528BB9570600747DD2B8374D1603144206312ssid&sid=36273727FB4168FD14B9C824648462501603144209674`;

  return fetch(link + "&firstEntry=true", {
    credentials: "omit",
    headers,
    referrer: link + "&blockRedirect=true",
    method: "GET",
    mode: "cors",
  })
    .then((r) => r.text())
    .then((res) => {
      const snippet = res.match(/type: 'GEOS',[^}]+locationId:.?'[0-9]+'/)[0];
      const id = `g${snippet.match(/'[0-9]+'/)[0].replace(/'/g, "")}`;

      return id;
    });
}

module.exports = { getTripAdvisorCityId, headers };
