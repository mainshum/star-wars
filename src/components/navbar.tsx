import { Router } from "@/src/router";
import { useLinkProps } from "@swan-io/chicane";

type LinkProps = ReturnType<typeof useLinkProps> & { display: string };

const NavbarLink = ({ onClick, display }: LinkProps) => {
  return (
    <a onClick={onClick} className="navbar__link">
      <span>{display}</span>
    </a>
  );
};

const linkDisplayMap = {
  [Router.Characters()]: "Characters",
  [Router.Planets()]: "Planets",
  [Router.Vehicles()]: "Vehicles",
} as const;

export function Navbar() {
  const chars = useLinkProps({ href: Router.Characters() });
  const vhs = useLinkProps({ href: Router.Vehicles() });
  const planets = useLinkProps({ href: Router.Planets() });

  const deathStarActiveClassName = chars.active
    ? "characters"
    : vhs.active
    ? "vehicles"
    : "planets";

  return (
    <nav className="navbar">
      <img
        className={`death-star ${deathStarActiveClassName}`}
        alt="death-star"
        src="/death-star.svg"
        width={16}
        height={16}
      />
      <NavbarLink display={linkDisplayMap[Router.Characters()]} {...chars} />
      <NavbarLink display={linkDisplayMap[Router.Vehicles()]} {...vhs} />
      <NavbarLink display={linkDisplayMap[Router.Planets()]} {...planets} />
    </nav>
  );
}
