import { List } from "./components/list";
import { Navbar } from "./components/navbar";
import { Router as Router } from "./router";

function NotFound() {
  return <div>Not found</div>;
}

export function App() {
  const route = Router.useRoute(["Characters", "Home"]);

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
      </main>
    </>
  );
}
