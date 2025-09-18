import React from "react";

export const Textarea = React.forwardRef(function Textarea(props, ref) {
  return (
    <textarea
      ref={ref}
      className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    />
  );
});
