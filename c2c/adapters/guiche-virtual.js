const fetch = require("node-fetch");
const cheerio = require("cheerio");

const inicio = "campina-grande-pb";
const fim = "recife-pe";
const date = new Date();

function getTrips(inicio, fim, date) {
  const link = `http://www.guichevirtual.com.br/passagem-de-onibus/${inicio}/${fim}?ida=${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`;
  return fetch(link)
    .then((r) => r.text())
    .then((r) => {
      const $ = cheerio.load(r);

      const elements = $(".sortable-element");

      const tripsOptions = elements.toArray().map((e) => {
        const div = cheerio.load($.html(e));

        let company = div(".search-ticket__trip-info__logo").attr("title");

        let departureTime = div(".route-info__hour.route-info__hour--start")
          .text()
          .trim();
        departureTime = new Date(
          `${date.toISOString().slice(0, 10)}T${departureTime}`
        );

        let returnTime = div(".route-info__hour.route-info__hour--end")
          .text()
          .trim();
        returnTime = new Date(
          `${date.toISOString().slice(0, 10)}T${returnTime}`
        );

        const price = parseFloat(
          div(".search-ticket__price__text")
            .text()
            .trim()
            .replace(/R\$./gi, "")
            .replace(",", ".")
        );

        return {
          link,
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
