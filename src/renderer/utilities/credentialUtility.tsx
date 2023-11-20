/**
 * Try to load user credentials from previously stored user data.
 * 1. Load from session storage first
 * 2. Then load from local storage if cannot find credentials from session storage
 */
export const tryLoadUserCredentials = (
  setUserId: (userId: number) => void,
  setUserSecret: (userSecret: string) => void
) => {
  let storedId = sessionStorage.getItem("userId");
  let storedSecret = sessionStorage.getItem("userSecret");
  if (storedId !== null && storedSecret !== null) {
    console.log("loading id and secret from session storage ...");
    setUserId(parseInt(storedId));
    setUserSecret(storedSecret);
    console.log("credentials loaded.");
    return;
  }
  console.log("loading from localStorage ...");
  storedId = localStorage.getItem("userId");
  storedSecret = localStorage.getItem("userSecret");
  if (storedId !== null && storedSecret !== null) {
    setUserId(parseInt(storedId));
    setUserSecret(storedSecret);
    console.log("credentials loaded.");
    return;
  }
  console.log("fail to load user credential");
};

export const clearCurrentUserCredentials = (userId: number) => {
  let storedId = localStorage.getItem("userId");
  if (storedId !== null && parseInt(storedId) === userId) {
    localStorage.clear();
  }
  sessionStorage.clear();
};
