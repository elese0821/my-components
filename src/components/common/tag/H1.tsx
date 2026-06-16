import React from 'react';

type Props = {
    className?: string;
    children: React.ReactNode;
};

export default function H1({ children, className = '' }: Props) {
    return (
        <h1 className={`flex items-center gap-2.5 ${className}`}>
            <span
                className='shrink-0 rounded-full'
                style={{
                    width: 4,
                    height: '1.15em',
                    background: 'linear-gradient(180deg, #6366f1 0%, #3b82f6 100%)',
                    display: 'inline-block',
                    minHeight: 20,
                }}
            />
            <span className='font-bold text-gray-900 leading-tight'>{children}</span>
        </h1>
    );
}
