const fetch = require("node-fetch");
const { getHospedagensFromBody } = require("./chee");

const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

function getHospedagens(cidade, checkin, checkout, adults = 2, childs = 0) {
  const d = checkin.getDate();
  const m = checkin.getMonth() + 1;
  const y = checkin.getFullYear();

  const dd = checkout.getDate();
  const mm = checkout.getMonth() + 1;
  const yy = checkout.getFullYear();

  return fetch(
    `https://www.booking.com/searchresults.pt-br.html?ss=${cidade}&city=-649584&checkin_year=${y}&checkin_month=${m}&checkin_monthday=${d}&checkout_year=${yy}&checkout_month=${mm}&checkout_monthday=${dd}&group_adults=${adults}&group_children=${childs}&no_rooms=1&from_sf=1&order=price`,
    { headers }
  )
    .then((r) => r.text())
    .then((res) => {
      const hospedagens = getHospedagensFromBody(res);

      return hospedagens;
    });
}

function getRodoviaria(cityName) {
  const link = `https://nominatim.openstreetmap.org/search?format=json&q=${cityName +
    encodeURI(" Rodoviária")}`;
  return (
    fetch(link)
      .then((r) => r.json())
      .then((e) => {
        return e.filter(
          (m) => m.display_name.match(/.*rodovi(a|á)ri(a|o).*/i) != null
        );
      })
      // .then((e) => {
      //   console.log(e);
      //   return e;
      // })
      .then((r) => r[0])
  );
}

function getEuclidianDistance(c1, c2) {
  return Math.sqrt((c2[1] - c1[1]) ** 2 + (c2[0] - c1[0]) ** 2);
}

module.exports = { getHospedagens, getRodoviaria, getEuclidianDistance };
