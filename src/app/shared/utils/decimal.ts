import Decimal from "decimal.js-light";

function add(...numbers) {
  let result = new Decimal(0);
  numbers.forEach(number => {
    result = result.add(new Decimal(toNumber(number)));
  });
  return result.toNumber();
}

function minus(number1, number2) {
  let result = new Decimal(toNumber(number1));
  result = result.minus(new Decimal(toNumber(number2)));
  return result.toNumber();
}

function mul(...numbers) {
  let result = new Decimal(1);
  numbers.forEach(number => {
    result = result.mul(new Decimal(toNumber(number)));
  });
  return result.toNumber();
}

function div(number1, number2) {
  if(!toNumber(number2)) { return 0; }
  let result = new Decimal(toNumber(number1));
  result = result.div(new Decimal(toNumber(number2)));
  return result.toNumber();
}

function toNumber(number) {
  let result = Number(number);
  return result.toString() === 'NaN' ? 0 : result;
}

/**
 * 四舍五入带小数位
 * @param number 待四舍五入的数字
 * @param fixedNumber 小数位数
 * @param isFixed 是否保留对应小数位数 10 -> 10.000...
 * @returns 
 */
function roundFixed(number: number, fixedNumber: number, isFixed: boolean=true) {
  const fixedNumberPow = Math.pow(10, fixedNumber);
  return div(Math.round(mul(number, fixedNumberPow)), fixedNumberPow).toFixed(fixedNumber);
}

export const decimal = {
  add: add,
  mul: mul,
  minus: minus,
  div: div,
  roundFixed: roundFixed
}