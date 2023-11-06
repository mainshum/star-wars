import { ErrorBoundary } from "react-error-boundary";
import { List } from "./components/list";
import { Navbar } from "./components/navbar";
import { Details } from "./components/details";
import { Router as Router } from "./router";

function NotFound() {
  return <div>Not found</div>;
}

// we'd normally log it using an external service
const logError = console.error;

// error boundaries would normally be more granular
const GenericErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    onError={logError}
    fallback={<div data-testid="error">Unexpected error occurred</div>}
  >
    {children}
  </ErrorBoundary>
);

export function App() {
  const route = Router.useRoute([
    "Characters",
    "Home",
    "Vehicles",
    "Planets",
    "Character",
  ]);

  console.log(route);

  return (
    <>
      <Navbar />
      <main>
        <GenericErrorBoundary>
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
              case "Character":
                return <Details.Character id={route.params.id} />;
            }
          })()}
        </GenericErrorBoundary>
      </main>
    </>
  );
}
