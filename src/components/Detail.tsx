import classNames from "classnames";
import React from "react";

type DetailProps = React.PropsWithChildren<{
  title: string;
  containerClassName?: string;
  titleClassName?: string;
}>;

const Detail = (props: DetailProps) => {
  const { title, containerClassName, titleClassName, children } = props;
  return (
    <div className={classNames("flex text-neutral dark:text-neutral-content gap-2 items-baseline", containerClassName)}>
      <h4 className={classNames("text-primary font-semibold text-lg", titleClassName)}>
        {title}
      </h4>
      {children}
    </div>
  )
}

export default Detail;