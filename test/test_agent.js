import { callBot } from "../agent.js";

async function main() {
  const response = await callBot({ key: "123", text: "ไหนตอบแบบน่ารักๆ"})
  console.log({ aiResponse: response })
}

main()