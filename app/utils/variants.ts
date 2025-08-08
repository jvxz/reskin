import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  `${interactiveStyles.base} relative inline-flex items-center justify-center`,
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: interactiveStyles.size.default,
        icon: interactiveStyles.size.icon,
        lg: interactiveStyles.size.lg,
        sm: interactiveStyles.size.sm,
      },
      variant: {
        default: interactiveStyles.variant.default,
        soft: interactiveStyles.variant.soft,
        destructive: interactiveStyles.variant.destructive,
        ghost: interactiveStyles.variant.ghost,
        link: interactiveStyles.variant.link,
        outline: interactiveStyles.variant.outline,
      },
    },
  },
)
