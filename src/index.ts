import fetch from "isomorphic-unfetch";
import fs from "fs";

import { TPortfolio } from "./@types";
import { portfolios } from "./constants/portfolios";
import { API_BASE_URL, API_KEY } from "./constants/env";

// Returns a Promise that resolves after "ms" Milliseconds
const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

function fetchHistoricalData() {
  portfolios.forEach(async (portfolio: TPortfolio) => {
    try {
      const ticker = portfolio.ticker;
      const url = `${API_BASE_URL}TIME_SERIES_WEEKLY&symbol=${ticker}&apikey=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Couldnt fetch data");

      const json = await response.json();
      const timeFrame = "week";
      const timeSeriesKey = "Weekly Time Series";

      const timeSeries = json[timeSeriesKey];

      // Get dates
      const duration = Object.keys(timeSeries).map((dur) => dur);
      let data: TData = [];
      // Figure out the close key string inside the date object
      const closeKey = Object.keys(timeSeries[duration[0]]).filter((value) =>
        value.includes("close")
      );

      duration.forEach((dur) => {
        const date = dur;

        const close = timeSeries[dur][closeKey];

        data.push({ date, close });
      });

      const JSONFriendlyData = {
        stock: portfolio.ticker,
        time: timeFrame,
        companyName: portfolio.company,
        data: data,
      };
      fs.writeFileSync(
        `src/data/${portfolio.ticker}.json`,
        JSON.stringify(JSONFriendlyData)
      );
      //   fs.writeFileSync(`src/data/${ticker}.json`, JSON.stringify(json));
    } catch (e) {
      console.error(e);
    }
    await timer(20000);
  });
}

interface IResponse {
  "Weekly Time Series": {
    (duration: string): IDurationMetrics;
  };
}

interface IDurationMetrics {
  close: string;
}

type TData = {
  date: string;
  close: string;
}[];

fetchHistoricalData();
