import invoices from "../data/invoices.json";
import _plays from "../data/plays.json";
import { Invoice, Performance } from './types';
interface Play{
  name: string;
  type: string;
}
interface Plays {
  [key: string]: Play;
}
const plays = _plays as Plays;

function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
}

function amountFor(aPerformance: Performance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
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
      throw new Error(`unknown type: ${playFor(aPerformance).type}`);
  }
  return result;
}

function volumeCreditsFor(perf: Performance) {
  let volumeCredits = 0;
  volumeCredits += Math.max(perf.audience - 30, 0);
  if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}


function statement(invoice:Invoice, plays: Plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;
  for (let aPerformance of invoice.performances) {
    // add volume credits
    volumeCredits += volumeCreditsFor(aPerformance);
    // print line for this order
    result += `  ${playFor(aPerformance).name}: ${format(amountFor(aPerformance) / 100)} (${
      aPerformance.audience
    } seats)\n`;
    totalAmount += amountFor(aPerformance);
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;
}

const invoice: Invoice = invoices[0];
console.log(statement(invoice, plays));
