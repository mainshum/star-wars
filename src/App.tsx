import "./App.css";
import { createRouter } from "@swan-io/chicane";
import { List } from "./components/list";

function Navbar() {
  return <div>Nav</div>;
}

function NotFound() {
  return <div>Not found</div>;
}

const router = createRouter({
  Home: "/",
  Characters: "/characters",
});

export function App() {
  const route = router.useRoute(["Characters", "Home"]);

  return (
    <>
      <Navbar />
      <main>
        {((): Exclude<React.ReactNode, undefined> => {
          if (!route?.name) return <NotFound />;

          switch (route.name) {
            case "Characters":
              return <List.Characters />;
            case "Home":
              return <List.Characters />;
          }
        })()}
        <List.Characters />
      </main>
    </>
  );
}
