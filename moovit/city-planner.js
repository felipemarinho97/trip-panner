const { getId } = require("./util");

function planRoute(c2, c1, depart = new Date()) {
  const id = getId("João Pessoa");

  return `https://moovitapp.com/${id}/poi/${c1.name}/${
    c2.name
  }/pt-br?tll=${c1.coords.replace(",", "_")}&fll=${c2.coords.replace(
    ",",
    "_"
  )}&timeType=depart&time=${depart.getTime()}`;
}

// planRoute(
//   "-7.1120804,-34.8264826423278",
//   "-7.11233370743854,-34.8240807116394"
// );

module.exports = { planRoute };
