import { tool } from "@langchain/core/tools";
import z from "zod"
import { google } from "googleapis";

export async function addRowGoogleSheet(data) {
  try {
    // Authenticate using service account
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials/secret.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // const sheets = google.sheets({ version: "v4", auth });
    const sheets = google.sheets({ version: "v4", auth });

    // Google Sheet ID and range
    const spreadsheetId = "1eMIysSUHRXslLJXId_i3wn_u1QHSJ5wzz2zXpESLZvs";
    // const range = "Sheet1!A:Z"; // target the first sheet
    const range = "อับดุล"
    const timestamp = new Date().toUTCString()
    // New row data
    const values = [[data.subject, data.description, timestamp, ...(data.data || [])]];

    // Append data
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW", // Options: RAW or USER_ENTERED
      resource: {
        values,
      },
    });

    console.log({ statusText: res.statusText })

    return res.statusText
  } catch (error) {
    console.error(error.response.data.error)
    return error?.response?.data?.error ? `${error?.response?.data?.error?.status}:${error?.response?.data?.error?.message}` : error
  }
}

export const googleSheetTool = tool(
  async (data) => {
    const response = await addRowGoogleSheet(data);
    return response;
  },
  {
    name: "addRowGoogleSheet",
    description: `Adds a new row to Google Sheet with dynamic columns. The first column will be 'subject', second column 'description', followed by additional data values in sequence. Example: If data=['apple','banana'], the row will be: [subject, description, apple, banana]`,
    schema: z.object({
      subject: z.string().describe("Main topic or category for this row"),
      description: z.string().describe("Detailed explanation or notes about the subject"),
      data: z.array(z.string()).describe("Additional values that will be added as subsequent columns after subject and description")
    }),
  }
);
