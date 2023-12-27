export function shiftTimeBySeconds(ts: Date, n: number): Date {
  let t = ts.getTime();
  return new Date(t - n * 1000);
}
