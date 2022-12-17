// 计算一个月有多少天，例如：getMonthDay(2020, 2) -> 29
export function getMonthDay(year: number, month: number): number {
  let days = new Date(year, month, 0).getDate()
  return days
}

// 加法
export const add = (a, b) => {
  let c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
};

// 减法
export const sub = (a, b) => {
  let c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

// 乘法
export const mul = (a, b) => {
  let c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    if (d.includes('.')) {
      c += d.split('.')[1].length;
    }
  } catch (f) {
    console.error(f);
  }
  try {
    if (e.includes('.')) {
      c += e.split('.')[1].length;
    }
  } catch (f) {
    console.error(f);
  }
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
}

// 除法
export const div = (a, b) => {
  let c, d, e = 0,
    f = 0;
  try {
    if (a.toString().includes('.')) {
      e = a.toString().split('.')[1].length;
    }
  } catch (g) {
    console.error(g);
  }
  try {
    if (b.toString().includes('.')) {
      f = b.toString().split('.')[1].length;
    }
  } catch (g) {
    console.error(g);
  }
  return c = Number(a.toString().replace('.', '')), d = Number(b.toString().replace('.', '')), mul(c / d, Math.pow(10, f - e));
}
