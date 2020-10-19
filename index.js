const {
  getHospedagens,
  getRodoviaria,
  getEuclidianDistance,
} = require("./util");
const { planRoute } = require("./moovit/city-planner");
const { getBusTrips } = require("./c2c/bus");

const saidaNome = "Campina Grande PB";
const destinoNome = "Salvador BA";
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

  getHospedagens(destino, checkin, checkout)
    .then((h) =>
      h.map((e) => {
        return {
          distance: getEuclidianDistance(e.coords.split(), [
            rodIn.lat,
            rodIn.lon,
          ]),
          ...e,
        };
      })
    )
    .then((hosp) => {
      console.log(hosp[0]);
      console.log(
        planRoute(
          {
            name: rodIn.display_name.split(",")[0],
            coords: `${rodIn.lat},${rodIn.lon}`,
          },
          { name: hosp[0].nome, coords: hosp[0].coords },
          returnTime
        )
      );
    });
}

main();
