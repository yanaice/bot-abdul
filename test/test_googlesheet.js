import { addRowGoogleSheet } from "../tools/googlesheet.js";


function main() {
  addRowGoogleSheet({
    subject: "Test",
    description: "Test",
    data: ["Total USDT: $22,536 / ฿783,366"]
  })
}

main()