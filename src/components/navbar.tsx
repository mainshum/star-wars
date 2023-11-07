import { Router } from "@/src/router";
import { useLinkProps } from "@swan-io/chicane";
import { Car, Star, PersonStanding } from "lucide-react";
import clsx from "clsx";
import React from "react";

const icons = {
  Car,
  Star,
  PersonStanding,
} as const;

type LinkProps = {
  href: string;
  icon: keyof typeof icons;
};

const NavbarLink = ({ href, icon }: LinkProps) => {
  const { onClick, active } = useLinkProps({ href: href });

  return (
    <a onClick={onClick}>
      {React.createElement(icons[icon], {
        className: clsx(
          "w-4 h-4 cursor-pointer",
          active && "w-6 h-6 p-0.5 bg-slate-800 rounded"
        ),
      })}
    </a>
  );
};

const linkDisplayMap = {
  [Router.Characters()]: "Characters",
  [Router.Planets()]: "Planets",
  [Router.Vehicles()]: "Vehicles",
} as const;

export const Navbar = () => {
  return (
    <nav className="flex flex-col justify-center items-center  gap-4">
      <NavbarLink icon="PersonStanding" href={Router.Characters()} />
      <NavbarLink icon="Car" href={Router.Vehicles()} />
      <NavbarLink icon="Star" href={Router.Planets()} />
    </nav>
  );
};
