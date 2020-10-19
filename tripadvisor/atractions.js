const fetch = require("node-fetch");
const fs = require("fs");
const cheerio = require("cheerio");

const { getTripAdvisorCityId, headers } = require("./util");

async function getAtractions(cityName) {
  const cityId = await getTripAdvisorCityId(cityName);

  fetch(
    `https://www.tripadvisor.com.br/Attractions-${cityId}-Activities-${cityName}.html`,
    {
      headers,
      redirect: "follow",
    }
  )
    .then((r) => r.text())
    .then((body) => {
      const $ = cheerio.load(body);

      const atractions = $(
        `[data-automation=shelf_4] a[href*=Attraction_Review-g304560]`
      );
      const set = new Set();

      atractions.toArray().map((a) => {
        const link = cheerio.load($.html(a));
        const name = ("LINK", link("span").attr("aria-label"));

        if (name) set.add({ name, link: a.attribs.href.replace(/#.+$/, "") });
      });

      return set;
    });
}

module.exports = { getAtractions };
