import React from "react";

export const Skeleton = () => <div>Loading</div>;

// grey background and border, serves as anchor
const Root = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((rest, ref) => <a ref={ref} className="tile-root" {...rest} />);

interface TextWithSabreProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

// sabre and text underneath
const TextWithSabre = React.forwardRef<HTMLDivElement, TextWithSabreProps>(
  ({ ...rest }, ref) => (
    <section ref={ref} {...rest} className="text-with-sabre">
      <div className="text-with-sabre__sabre" />
      <span className="text-with-sabre__text">{rest.name}</span>
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
  TextWithSabre,
  ImgSmall,
  Root,
  Skeleton,
};
