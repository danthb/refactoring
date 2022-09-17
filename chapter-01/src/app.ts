import invoices from "../data/invoices.json";
import plays from "../data/plays.json";
import { Invoice, Play } from "./types";

function amountFor(aPerformance: any, play: any) {
  let result = 0;
  switch (play.type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return result;
}

function statement(invoice:Invoice, plays: any) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;
  for (let aPerformance of invoice.performances) {
    let thisAmount= amountFor(aPerformance, playFor(aPerformance));
    // add volume credits
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === playFor(aPerformance).type) volumeCredits += Math.floor(aPerformance.audience / 5);
    
    // print line for this order
    result += `  ${playFor(aPerformance).name}: ${format(thisAmount / 100)} (${
      aPerformance.audience
    } seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  function playFor(aPerformance:any){
    return plays[aPerformance.playID];
  }

  return result;
}

const invoice: Invoice = invoices[0];
console.log(statement(invoice, plays));
