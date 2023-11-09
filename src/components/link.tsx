import { useLinkProps } from "@swan-io/chicane";

export const Link = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const { onClick } = useLinkProps({ href: to });

  return (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  );
};
