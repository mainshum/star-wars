import { withErrorBoundary } from "react-error-boundary";
import { useQuery } from "react-query";
import { z } from "zod";
import { getFromSwapi } from "../utils";
import { Loader } from "./loader";

// we'd normally log it using an external service
const logError = console.error;

const DataProvider = <T extends z.ZodSchema, W>({
  schema,
  url,
  queryKey,
  selectResults,
  children,
  queryFn = getFromSwapi,
}: {
  schema: T;
  url: string;
  queryKey: string[];
  selectResults: (res: z.infer<T>) => W;
  children: (data: W | undefined) => React.ReactNode;
  queryFn?: (url: string) => Promise<any>;
}) => {
  const { data, error, isLoading } = useQuery({
    queryFn: () => queryFn(url).then(schema.parse),
    select: selectResults,
    queryKey: queryKey,
  });

  // rethrow error synchronously
  if (error) throw new Error(`error calling ${url}`);

  if (isLoading) return <Loader />;

  return <>{children(data)}</>;
};

export const JSONDataProvider = DataProvider;
