export function fakeFetch() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Fake fetching to show UI Loading");
    }, 2000);
  });
}
