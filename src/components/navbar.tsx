import { Router } from "@/src/router";
import { Link } from "@swan-io/chicane";

export function Navbar() {
  return (
    <nav>
      <Link to={Router.Characters()}>Characters</Link>
      <Link to={Router.Vehicles()}>Vehicles</Link>
    </nav>
  );
}
