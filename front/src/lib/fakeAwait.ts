export const fakeAwait = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}