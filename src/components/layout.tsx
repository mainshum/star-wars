import React from "react";

export const Skeleton = () => <div>Loading</div>;

interface RootLiProps extends React.HTMLAttributes<HTMLLIElement> {
  rootElem?: "li" | "section";
}

const Sabre = () => <div className="sabre" />;

// grey background and border, serves as anchor
const RootLi = React.forwardRef<HTMLLIElement, RootLiProps>(
  ({ rootElem = "li", ...rest }, ref) => {
    const El = rootElem;

    return <El ref={ref} className="tile-root" {...rest} />;
  }
);

const TileText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => <span className="tile-text" ref={ref} {...props} />);

const ImgSmall = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ ...props }, ref) => <img ref={ref} {...props} width={300} height={300} />);

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

export const Tile = {
  DetailItem,
  Sabre,
  TileText,
  ImgSmall,
  RootLi,
  Skeleton,
};
