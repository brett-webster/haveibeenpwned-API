import { BreachType } from "../types";

// filter out breaches that don't contain passwords or usernames
function filterBreaches(breaches: BreachType[]): BreachType[] {
  return breaches.filter(
    (element: BreachType) =>
      element.DataClasses.includes("Passwords") ||
      element.DataClasses.includes("Usernames")
  );
}

export default filterBreaches;
