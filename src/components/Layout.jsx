import React from 'react'
import { useTheme } from './ThemeContext';

export default function Layout({ children }) {
	const { theme, toggleTheme } = useTheme();
	
    const header = (
        <header className="flex items-center justify-between p-4 bg-slate-900 dark:bg-gray-100 text-white dark:text-gray-900 gap-4">
			<div className="flex items-center">
				<img className="h-8 w-8 text-indigo-400" src="/logo.svg" alt=""/>
				<h1 className="text-xl sm:text-3xl font-bold tracking-tight ml-4">Workout Tracker</h1>
			</div>
			<button
				onClick={toggleTheme}
				className="p-2 rounded-full bg-slate-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-md hover:scale-105 transition-transform"
				aria-label="Toggle dark/light mode"
			>
				{theme === 'light' ? (
					<i className="fas fa-sun text-yellow-400 text-xl" />
				) : (
					<i className="fas fa-moon text-indigo-600 text-xl" />
				)}
			</button>
        </header>
    )

    return (
        <div className="min-h-screen bg-slate-900 dark:bg-gray-100 text-slate-100 dark:text-gray-900 font-inter transition-colors duration-300">
            {header}
            <main>
                {children}
            </main>
        </div>
    )
}
