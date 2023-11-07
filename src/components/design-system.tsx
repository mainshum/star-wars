import clsx from "clsx";
import React from "react";

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

const ImgSmall = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={clsx("w-[200px] h-[124px]", className)}
    {...props}
    width={200}
    height={124}
  />
));

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

export const LightSabre = () => (
  <div className="flex gap-1 w-fit hover:shadow-sabre">
    <span className="w-5 h-1 bg-sabre"></span>
    <span className="w-1 h-1 rounded bg-sabre"></span>
  </div>
);

const Bottom = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("flex flex-col p-9 gap-4", className)}
    {...props}
  />
));

const Detail = ({ name }: { name: string | undefined }) => (
  <div className="flex flex-col gap-2">
    <LightSabre />
    <span>{name}</span>
  </div>
);

export const Tile = {
  ImgLarge,
  Bottom,
  LightSabre,
  ImgSmall,
  Detail,
};
