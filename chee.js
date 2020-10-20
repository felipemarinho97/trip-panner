const cheerio = require("cheerio");
const fs = require("fs");

// const body = fs.readFileSync("./out.html").toString();
// getHospedagensFromBody(body);

function getHospedagensFromBody(body) {
  const $ = cheerio.load(body);

  const hotels_div = $(".sr_item_content.sr_item_content_slider_wrapper");

  return hotels_div.toArray().map((e) => {
    const div = cheerio.load($.html(e));
    const nome = div(".sr-hotel__name")
      .text()
      .trim();
    const coords = div(".bui-link")
      .data()
      .coords.split(",")
      .reverse()
      .join(",");
    const valor = parseFloat(
      div(".bui-price-display__value.prco-inline-block-maker-helper")
        .text()
        .trim()
        .replace(/R\$./gi, "")
    );

    const link =
      "https://www.booking.com" +
      div(".js-sr-hotel-link.hotel_name_link.url")
        .attr("href")
        .trim();

    const hospedagem = { nome, valor, coords, link };

    return hospedagem;
  });
}

module.exports = { getHospedagensFromBody };
