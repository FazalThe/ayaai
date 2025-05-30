import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 flex-grow rounded-full bg-emerald-200 dark:bg-emerald-800">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-emerald-500 dark:bg-emerald-400" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-emerald-500 bg-white dark:border-emerald-400 dark:bg-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400" />
  </SliderPrimitive.Root>
))

export { Slider }