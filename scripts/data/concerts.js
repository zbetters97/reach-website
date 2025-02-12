const concerts = [
  {
    cId: "123455",
    date: "09-09-2025",
    time: "20:00:00",
    venue: "The Met",
    city: "Philadelphia",
    state: "PA",
    ticketPrice: {
      STR: 2500,
      DLX: 4000,
      VIP: 8000,
    },
  },
  {
    cId: "123456",
    date: "09-10-2025",
    time: "20:00:00",
    venue: "Stage AE",
    city: "Pittsburgh",
    state: "PA",
    ticketPrice: {
      STR: 2500,
      DLX: 4000,
      VIP: 8000,
    },
  },
  {
    cId: "123457",
    date: "09-12-2025",
    time: "20:00:00",
    venue: "Brooklyn Paramount Theater",
    city: "Brooklyn",
    state: "NY",
    ticketPrice: {
      STR: 2500,
      DLX: 4000,
      VIP: 8000,
    },
  },
  {
    cId: "123458",
    date: "09-14-2025",
    time: "20:00:00",
    venue: "The Stone Pony",
    city: "Asbury Park",
    state: "NJ",
    ticketPrice: {
      STR: 2500,
      DLX: 4000,
      VIP: 8000,
    },
  },
  {
    cId: "123459",
    date: "09-16-2025",
    time: "20:00:00",
    venue: "MGM Music Hall at Fenway",
    city: "Boston",
    state: "MA",
    ticketPrice: {
      STR: 2500,
      DLX: 4000,
      VIP: 8000,
    },
  },
];
export default concerts;

export function getConcert(cId) {
  const concert =
    concerts[concerts.findIndex((c) => c.cId == cId)] || concerts[0];

  return concert;
}
