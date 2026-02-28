import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import React from 'react';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' }>(
    ({ className, variant = 'primary', ...props }, ref) => {
        const variants = {
            primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive-500/30',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <input
            ref={ref}
            className={cn(
                'flex h-12 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all disabled:opacity-50',
                className
            )}
            {...props}
        />
    )
);

export const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn('glass rounded-2xl p-8 border-white/10 shadow-xl', className)}>
        {children}
    </div>
);
