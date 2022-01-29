import fetch from "isomorphic-unfetch";
import { portfolios } from "./constants/portfolios";

async function fetchHistoricalData() {
  const timeFrame = "month";
  const stock = portfolios[1];
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${stock.stockName}&apikey=${process.env.API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Couldnt fetch data");

  const json = await response.json();
  console.log({ json });
}

fetchHistoricalData();
