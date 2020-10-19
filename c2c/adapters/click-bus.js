const fetch = require("node-fetch");
const cheerio = require("cheerio");

const inicio = "campina-grande-pb";
const fim = "recife-pe";
const date = new Date();

function getTrips(inicio, fim, date) {
  return fetch(
    `http://www.clickbus.com.br/refresh/${inicio}/${fim}?departureDate=${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}&cached=0`
  )
    .then((r) => r.json())
    .then((r) => r.search.departure)
    .then((r) => {
      const $ = cheerio.load(r);

      const elements = $(".search-item");

      const tripsOptions = elements.toArray().map((e) => {
        const div = cheerio.load($.html(e));

        let company = div(".company").data().name;

        let departureTime = div(".departure-time").data();
        departureTime = new Date(`${departureTime.date}T${departureTime.time}`);

        let returnTime = div(".return-time").data();
        returnTime = new Date(`${returnTime.date}T${returnTime.time}`);

        const price = div(".price").data().price;

        return {
          company,
          departureTime,
          returnTime,
          price,
        };
      });

      return tripsOptions;
    });
}

// getTrips(inicio, fim, date);

module.exports = { getTrips };
