const concerts = [
  {
    ticketId: "123455",
    date: "09-09-2025",
    time: "20:00:00",
    venue: "The Met",
    city: "Philadelphia",
    state: "PA",
    ticketPrice: {
      Standard: 2500,
      Deluxe: 4000,
      VIP: 8000,
    },
  },
  {
    ticketId: "123456",
    date: "09-10-2025",
    time: "20:00:00",
    venue: "Stage AE",
    city: "Pittsburgh",
    state: "PA",
    ticketPrice: {
      Standard: 2500,
      Deluxe: 4000,
      VIP: 8000,
    },
  },
  {
    ticketId: "123457",
    date: "09-12-2025",
    time: "20:00:00",
    venue: "Brooklyn Paramount Theater",
    city: "Brooklyn",
    state: "NY",
    ticketPrice: {
      Standard: 2500,
      Deluxe: 4000,
      VIP: 8000,
    },
  },
  {
    ticketId: "123458",
    date: "09-14-2025",
    time: "20:00:00",
    venue: "The Stone Pony",
    city: "Asbury Park",
    state: "NJ",
    ticketPrice: {
      Standard: 2500,
      Deluxe: 4000,
      VIP: 8000,
    },
  },
  {
    ticketId: "123459",
    date: "09-16-2025",
    time: "20:00:00",
    venue: "MGM Music Hall at Fenway",
    city: "Boston",
    state: "MA",
    ticketPrice: {
      Standard: 2500,
      Deluxe: 4000,
      VIP: 8000,
    },
  },
];
export default concerts;

export function getConcert(ticketId) {
  const concert =
    concerts[concerts.findIndex((c) => c.ticketId == ticketId)] || concerts[0];

  return concert;
}
