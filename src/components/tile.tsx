import React from "react";

export const Skeleton = () => <div>Loading</div>;

interface RootLiProps extends React.HTMLAttributes<HTMLLIElement> {
  rootElem?: "li" | "section";
}

// grey background and border, serves as anchor
const RootLi = React.forwardRef<HTMLLIElement, RootLiProps>(
  ({ rootElem = "li", ...rest }, ref) => {
    const El = rootElem;

    return <El ref={ref} className="tile-root" {...rest} />;
  }
);

interface TextWithSabreProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

const Sabre = () => <div className="sabre" />;

const TileText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => <span className="tile-text" ref={ref} {...props} />);

// sabre and text underneath
const TextWithSabre = React.forwardRef<HTMLDivElement, TextWithSabreProps>(
  ({ ...rest }, ref) => (
    <section ref={ref} {...rest} className="text-with-sabre">
      {/* <span className="text-with-sabre__text">{rest.name}</span> */}
    </section>
  )
);

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

export const Tile = {
  DetailItem,
  Sabre,
  TileText,
  ImgSmall,
  RootLi,
  Skeleton,
};
