const concerts = [
  {
    id: "123455",
    date: "02-05-2025",
    time: "20:00:00",
    venue: "The Met",
    city: "Philadelphia",
    state: "PA",
  },
  {
    id: "123456",
    date: "02-05-2025",
    time: "20:00:00",
    venue: "Stage AE",
    city: "Pittsburgh",
    state: "PA",
  },
  {
    id: "123457",
    date: "02-04-2025",
    time: "20:00:00",
    venue: "Brooklyn Paramount Theater",
    city: "Brooklyn",
    state: "NY",
  },
  {
    id: "123458",
    date: "02-05-2025",
    time: "20:00:00",
    venue: "The Stone Pony",
    city: "Asbury Park",
    state: "NJ",
  },
  {
    id: "123459",
    date: "02-07-2025",
    time: "20:00:00",
    venue: "MGM Music Hall at Fenway",
    city: "Boston",
    state: "MA",
  },
];
export default concerts;

export function getConcertByID(concertId) {
  const concert =
    concerts[concerts.findIndex((c) => c.id == concertId)] || concerts[0];

  return concert;
}
