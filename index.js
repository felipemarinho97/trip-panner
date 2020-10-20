const {
  getHospedagens,
  getRodoviaria,
  getEuclidianDistance,
  getPossibleCoords,
} = require("./util");
const { planRoute } = require("./moovit/city-planner");
const { getBusTrips } = require("./c2c/bus");
const { getAtractions } = require("./tripadvisor/atractions");

const saidaNome = "Campina Grande PB";
const destinoNome = "Natal RN";
const departure = new Date("2020-10-24");

const saida = encodeURI(saidaNome);
const destino = encodeURIComponent(destinoNome);

async function main() {
  const rodOut = await getRodoviaria(saida);
  const rodIn = await getRodoviaria(destino);

  const trips = await getBusTrips(
    saidaNome.replace(/ /g, "-"),
    destinoNome.replace(/ /g, "-"),
    departure
  );

  const trip = trips[0];

  console.log(trip);

  const returnTime = new Date(trip.returnTime);
  const checkin = returnTime; // M-D-YYYY
  const checkout = new Date(checkin); // M-D-YYYY
  checkout.setDate(checkout.getDate() + 1);

  const atractions = Array.from(await getAtractions(destinoNome.slice(0, -3)));

  let mainAtraction;
  for (const atraction of atractions) {
    mainAtraction = {
      ...atraction,
      coords: (await getPossibleCoords(atraction.name + " " + destinoNome))[0],
    };

    if (mainAtraction.coords != null) {
      break;
    }
  }

  console.log(mainAtraction);

  getHospedagens(destino, checkin, checkout)
    .then((h) =>
      h.map((e) => {
        return {
          distance: getEuclidianDistance(e.coords.split(","), [
            mainAtraction.coords.lat,
            mainAtraction.coords.lon,
          ]),
          ...e,
        };
      })
    )
    .then((hosp) => {
      const sortedByDistance = [...hosp].sort(
        (a, b) => b.distance - a.distance
      );
      const sortedByPrice = [...hosp].sort((a, b) => b.valor - a.valor);

      const sortedByCostBenefit = sortedByPrice
        .map((e, i) => {
          const distance = sortedByDistance.indexOf(e);
          return { ...e, i: i + distance };
        })
        .sort((a, b) => b.i - a.i);

      return sortedByCostBenefit;
    })
    .then(async (hosp) => {
      console.log(hosp[0]);

      const porra = await planRoute(
        destinoNome.slice(0, -3),
        {
          name: rodIn.display_name.split(",")[0],
          coords: `${rodIn.lat},${rodIn.lon}`,
        },
        { name: hosp[0].nome, coords: hosp[0].coords },
        returnTime
      );
      console.log(`Rodoviária -> ${hosp[0].nome}`, porra);

      console.log(
        `${hosp[0].nome} -> ${mainAtraction.name}`,
        await planRoute(
          destinoNome.slice(0, -3),
          { name: hosp[0].nome, coords: hosp[0].coords },
          {
            name: mainAtraction.name,
            coords: `${mainAtraction.coords.lat},${mainAtraction.coords.lon}`,
          },
          returnTime
        )
      );
    });
}

main();
