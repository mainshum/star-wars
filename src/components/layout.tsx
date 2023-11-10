import React from "react";
import clsx from "clsx";

interface RootLiProps extends React.HTMLAttributes<HTMLLIElement> {
  rootElem?: "li" | "section";
}

// grey background and border, serves as anchor
const RootLi = React.forwardRef<HTMLLIElement, RootLiProps>(
  ({ rootElem = "li", className, ...rest }, ref) => {
    const El = rootElem;

    return (
      <El ref={ref} className={clsx("tile-root h-full", className)} {...rest} />
    );
  }
);

const TileText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => <span className="text-lg text-white" ref={ref} {...props} />);

const ImgSmall = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={clsx("w-[170px] h-[100px]", className)}
    {...props}
    width={170}
    height={100}
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

export const Polygon = ({
  width,
  height,
  right,
}: {
  right: number;
  width: number;
  height: number;
}) => (
  <svg
    width={width}
    height={height}
    className={`absolute bottom-0 right-${right} w-[${width}px] h-[${height}px]`}
  >
    <path
      d={`M 0 ${height} L ${height} 0 H ${
        width - height
      } L ${width} ${height} H 0`}
      className="fill-slate-950"
    />
  </svg>
);

const ImgLarge = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={clsx("w-[500px] h-[310px]", className)}
    {...props}
    width={500}
    height={310}
  />
));

const LightSabre = () => (
  <div className="flex gap-1 w-fit py-4">
    <span className="w-5 h-1 bg-sabre"></span>
    <span className="w-1 h-1 rounded bg-sabre"></span>
  </div>
);

const Skeleton = () => <span>Loading</span>;

export const Tile = {
  DetailItem,
  Skeleton,
  LightSabre,
  TileText,
  ImgSmall,
  ImgLarge,
  RootLi,
};
