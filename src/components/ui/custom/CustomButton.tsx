// // src/components/ui/CustomButton.tsx
// import { Button as ShadcnButton } from "@/components/ui/button";
// import { ReactNode } from "react";
// import { cn } from "@/lib/utils/shadcn-utils";

// // Define our custom props
// interface CustomButtonProps {
//   variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
//   size?: "sm" | "md" | "lg";
//   isLoading?: boolean;
//   leftIcon?: ReactNode;
//   rightIcon?: ReactNode;
//   fullWidth?: boolean;
//   children: ReactNode;
//   className?: string;
// }

// // Extract ShadcnButton props type
// type ShadcnButtonProps = React.ComponentProps<typeof ShadcnButton>;

// // Map our custom variants to shadcn variants
// const variantMapping: Record<
//   "primary" | "secondary" | "outline" | "danger" | "ghost",
//   NonNullable<ShadcnButtonProps["variant"]>
// > = {
//   primary: "default",
//   secondary: "secondary",
//   outline: "outline",
//   danger: "destructive",
//   ghost: "ghost",
// };

// // Map our custom sizes to shadcn sizes
// const sizeMapping: Record<"sm" | "md" | "lg", NonNullable<ShadcnButtonProps["size"]>> = {
//   sm: "sm",
//   md: "default",
//   lg: "lg",
// };

// export function CustomButton({
//   children,
//   variant = "primary",
//   size = "md",
//   isLoading = false,
//   leftIcon,
//   rightIcon,
//   fullWidth = false,
//   className,
//   ...props
// }: CustomButtonProps & Omit<ShadcnButtonProps, "variant" | "size">) {
//   // Get the mapped variant and size
//   const shadcnVariant = variantMapping[variant];
//   const shadcnSize = sizeMapping[size];

//   return (
//     <ShadcnButton
//       variant={shadcnVariant}
//       size={shadcnSize}
//       disabled={isLoading}
//       className={cn(fullWidth && "w-full", className)}
//       {...props}
//     >
//       {isLoading ? (
//         <>
//           <svg
//             className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             />
//           </svg>
//           Chargement...
//         </>
//       ) : (
//         <>
//           {leftIcon && <span className="mr-2">{leftIcon}</span>}
//           {children}
//           {rightIcon && <span className="ml-2">{rightIcon}</span>}
//         </>
//       )}
//     </ShadcnButton>
//   );
// }

// export default CustomButton;
'use client'

import { Button as ShadcnButton } from '@/components/ui/button'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils/shadcn-utils'

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  children: ReactNode
  className?: string
}

const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  danger: 'destructive',
  ghost: 'ghost',
} as const

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
} as const

export function CustomButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  ...props
}: CustomButtonProps) {
  return (
    <ShadcnButton
      variant={variantMap[variant] as any}
      size={sizeMap[size] as any}
      disabled={isLoading}
      className={cn(fullWidth && 'w-full', className)}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Chargement...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </ShadcnButton>
  )
}

export default CustomButton