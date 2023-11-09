import { createRouter } from "@swan-io/chicane";

export const Router = createRouter({
  Home: "/",
  Vehicles: "/vehicles",
  Planets: "/planets",
  Character: "/characters/:id",
  Planet: "/planets/:id",
  Vehicle: "/vehicles/:id",
});
