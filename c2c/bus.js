const { getTrips: getTripsCB } = require("./adapters/click-bus");
const { getTrips: getTripsGV } = require("./adapters/guiche-virtual");

async function getBusTrips(origin, destination, date = new Date()) {
  return [
    ...(await getTripsCB(
      origin.toLowerCase(),
      destination.toLowerCase(),
      date
    )),
    ...(await getTripsGV(
      origin.toLowerCase(),
      destination.toLowerCase(),
      date
    )),
  ];
}

module.exports = { getBusTrips };
