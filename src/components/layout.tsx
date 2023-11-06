import React from "react";
import clsx from "clsx";

interface RootLiProps extends React.HTMLAttributes<HTMLLIElement> {
  rootElem?: "li" | "section";
}

const Sabre = () => <div className="sabre" />;

// grey background and border, serves as anchor
const RootLi = React.forwardRef<HTMLLIElement, RootLiProps>(
  ({ rootElem = "li", className, ...rest }, ref) => {
    const El = rootElem;

    return <El ref={ref} className={clsx("tile-root", className)} {...rest} />;
  }
);

const TileText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => <span className="tile-text" ref={ref} {...props} />);

const ImgSmall = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={clsx("img-small", className)}
    {...props}
    width={170}
    height={100}
  />
));

const ImgLarge = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={clsx("img-large", className)}
    {...props}
    width={600}
    height={400}
  />
));

const DetailItem = ({ title, value }: { title: string; value: string }) => (
  <div className="detail-item">
    <div>{title}</div>
    <div>{value}</div>
  </div>
);

export const StarList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>((props, ref) => <ul ref={ref} className="star-list" {...props} />);

const Divider = () => <span className="divider" />;

export const Tile = {
  DetailItem,
  Sabre,
  TileText,
  ImgSmall,
  ImgLarge,
  Divider,
  RootLi,
};
