const country = require("./country.json");
const levenshtein = require("fast-levenshtein");

function compare(s1, s2) {
  return levenshtein.get(s1.toLowerCase(), s2.toLowerCase());
}

const keyword = "conde";

function getId(keyword) {
  let total = [];

  country.forEach((e) => {
    matches = [];
    e.metros.forEach((m) => {
      const distance = compare(m.name, keyword);

      if (distance < 1) matches.push({ distance, ...m });
      else {
        m.keywords.forEach((mk) => {
          const distance = compare(mk, keyword);
          if (distance < 3) matches.push({ distance, ...m });
        });
      }
    });

    total.push(...matches);
  });

  total = total.sort((a, b) => a.distance - b.distance);

  return `${encodeURIComponent(total[0].name)}-${total[0].metroId}`;
}

module.exports = { getId };
