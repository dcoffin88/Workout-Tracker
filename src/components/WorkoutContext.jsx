import React, { createContext, useEffect, useState, useCallback, useContext } from 'react'

export const WorkoutContext = createContext()

export const WorkoutProvider = ({ children }) => {
	const [weights, setWeights] = useState(() => {
		const stored = localStorage.getItem('globalWeights')
		return stored ? JSON.parse(stored) : {}
	})

	useEffect(() => {
		localStorage.setItem('globalWeights', JSON.stringify(weights))
	}, [weights])

	const updateExerciseField = useCallback((title, field, value) => {
		setWeights(prev => ({
			...prev,
			[title]: {
				...(prev[title] || {}),
				[field]: value
			}
		}))
	}, [])

	return (
		<WorkoutContext.Provider value={{ weights, updateExerciseField }}>
			{children}
		</WorkoutContext.Provider>
	)
}

export const useWorkoutContext = () => {
	const context = useContext(WorkoutContext)
	if (!context) {
		throw new Error("useWorkoutContext must be used within a WorkoutProvider")
	}
	return context
}