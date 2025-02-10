import { MoonIcon, StarIcon, SunIcon, MusicalNoteIcon, RocketLaunchIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'
import React, { useMemo } from 'react'

type Props = {
    className?: string,
    children: React.ReactNode,
}

export default function H1({ children, className }: Props) {
    const icons = [MoonIcon, SunIcon, StarIcon, RocketLaunchIcon, MusicalNoteIcon, HandThumbUpIcon];

    const RandomIcon = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * icons.length);
        return icons[randomIndex];
    }, []);

    return (
        <h1 className={`text-2xl flex items-center gap-0.5 ${className}`}>
            <RandomIcon className='h-6 text-purple' />
            <span className='pt-1'>{children}</span>
        </h1>
    )
}
