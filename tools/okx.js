import { tool } from "@langchain/core/tools";
import z from "zod"

async function fetchOKX(body) {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };

  try {
    const url = 'https://asia-southeast1-ylproject-322709.cloudfunctions.net/okx';
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
}

export const okxAccountBalanceTool = tool(
  async () => {
    
    const requestBody = [
      { action: "get_account_balance" },
    ];

    const data = await fetchOKX(requestBody);
    
    return data;
  },
  {
    name: "getAccountBalance",
    description:`Use to get all my account balance and summary`,
    schema: z.object({}),
  }
);

export const okxTradeSpotTool = tool(
  async ({ action, symbol, usd_amount }) => {
    
    const requestBody = [
      {
          "action": action,
          "symbol": symbol,
          "usd_amount": usd_amount
      }
    ]

    // const data = await fetchOKX(requestBody);
    
    return { result: "success (mock)", requestBody };
  },
  {
    name: "tradeSpotOKX",
    description: `Execute spot trading orders. For buying, specify the USD amount you want to spend. For selling, the entire available balance of the specified symbol will be sold.`,
    schema: z.object({
        action: z.enum(["buy", "sell"]).describe("Choose 'buy' to purchase crypto with USD, or 'sell' to convert crypto to USD"),
        symbol: z.string().describe("Trading pair symbol (e.g., BTC, ETH, BNB)"),
        usd_amount: z.string().optional().describe("Required only for buy orders: specify the USD amount you want to spend")
    }),
  }
);