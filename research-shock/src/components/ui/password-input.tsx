import * as React from "react";

import { cn } from "@/lib/utils";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Button } from "./button";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const disabled =
    props.value === "" || props.value === undefined || props.disabled;
  return (
    <div className="flex items-center relative ">
      <input
        type={passwordVisible ? "text" : "password"}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
        onClick={() => setPasswordVisible((prev) => !prev)}
        disabled={disabled}
      >
        {passwordVisible && !disabled ? (
          <IoEyeOutline className="h-4 w-4" aria-hidden="true" />
        ) : (
          <IoEyeOffOutline className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {passwordVisible ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}

export { PasswordInput };
