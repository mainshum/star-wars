import { List } from "./components/list";
import { Navbar } from "./components/navbar";
import { Router as Router } from "./router";

function NotFound() {
  return <div>Not found</div>;
}

export function App() {
  const route = Router.useRoute(["Characters", "Home", "Vehicles", "Planets"]);

  return (
    <>
      <Navbar />
      <main>
        {((): Exclude<React.ReactNode, undefined> => {
          if (!route?.name) return <NotFound />;

          switch (route.name) {
            case "Home":
              return <List.Characters />;
            case "Characters":
              return <List.Characters />;
            case "Vehicles":
              return <List.Vehicles />;
            case "Planets":
              return <List.Planets />;
          }
        })()}
      </main>
    </>
  );
}
