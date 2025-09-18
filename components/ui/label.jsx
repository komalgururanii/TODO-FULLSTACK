import React from "react";

export const Label = React.forwardRef(function Label(
  { className = "", ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={`block text-sm font-medium text-foreground mb-1 ${className}`}
      {...props}
    />
  );
});
