import React, { useState, useEffect, useRef } from 'react'
import Modal from './Modal.jsx'
import ModalWorkout from './Modal-Workout.jsx'
import { startOfMonth, endOfMonth, addDays, getDay, format, eachDayOfInterval, isSameDay } from 'date-fns'

export default function Grid() {
	const [selectedWorkout, setSelectedWorkout] = useState(null);
	const [savedWorkouts, setSavedWorkouts] = useState(null);
	const [modalContent, setModalContent] = useState(null);
	const [trainingPlan, setTrainingPlan] = useState(null);
	const [exerciseDescriptions, setExerciseDescriptions] = useState({});
	const today = new Date();
	
	const allWorkoutDays = getWorkoutDaysInMonth(today);
	/* const allWorkoutDays = getWorkoutDaysInMonth(new Date(2025, 8)) */
	
	const fifthWeekDays = allWorkoutDays.filter(day => day.weekIndex === 5);
	const fifthWeekHasCurrentMonthDay = fifthWeekDays.some(day => day.isCurrentMonth);
	
	const workoutDaysToRender = fifthWeekHasCurrentMonthDay
        ? allWorkoutDays
        : allWorkoutDays.filter(day => day.weekIndex !== 5);
	
	const titleRefs = useRef({});
	
	function getWorkoutDaysInMonth(targetDate = new Date()) {
		const today = new Date();
		const start = startOfMonth(targetDate);
		const end = endOfMonth(targetDate);
		
		let firstFullWeekStart = start;
		while (true) {
            const dayOfWeek = getDay(firstFullWeekStart);
            if (dayOfWeek === 2) { 
                const friday = addDays(firstFullWeekStart, 3);
                if (friday.getMonth() === targetDate.getMonth()) {
                    break;
                }
            }
            firstFullWeekStart = addDays(firstFullWeekStart, 1);
        }
		
		let startDate = firstFullWeekStart;
		while(getDay(startDate) !== 0){
            startDate = addDays(startDate, -1);
        }
		
		const endDate = addDays(end, 6 - getDay(end));
		
		const workoutDays = [];
		let currentDay = startDate;
		let weekIndex = 1;
		
		while (currentDay <= endDate) {
            const dayOfWeek = getDay(currentDay);
			
			if (dayOfWeek >= 2 && dayOfWeek <= 5) {
                workoutDays.push({
                    date: currentDay,
                    dayOfWeek,
					isToday: isSameDay(currentDay, today),
                    weekIndex,
                    columnIndex: dayOfWeek - 2,
					isCurrentMonth: currentDay.getMonth() === targetDate.getMonth()
                });
            }
            
            if (dayOfWeek === 6) {
                weekIndex++;
            }
            
            currentDay = addDays(currentDay, 1);
        }
        
        return workoutDays;
    }

	const getWeekOfMonth = (date) => {
        const startWeekDay = getDay(startOfMonth(date));
        const offsetDate = date.getDate() + startWeekDay;
        return Math.ceil(offsetDate / 7);
	};	
	const isWeekOne = getWeekOfMonth(today) === 1
	const storageKey = isWeekOne ? 'fitness_week1' : 'fitness';

	
	const completedWorkouts = Object.keys(savedWorkouts || {}).filter(val => {
		const entry = savedWorkouts[val];
		return entry.isComplete;
	});
	
	function handleSave(index, data) {
		const day = workoutDaysToRender[index];
		if (!day) return;
		
		const workoutDateString = format(day.date, 'yyyy-MM-dd');
		const storageKey = day.weekIndex === 1 ? 'fitness_week1' : 'fitness';

		const newObj = {
			...savedWorkouts,
			[workoutDateString]: {
				...data,
				isComplete: !!data?.isComplete || !!savedWorkouts?.[workoutDateString]?.isComplete
			}
		};
		
		setSavedWorkouts(newObj);
		localStorage.setItem(storageKey, JSON.stringify(newObj));
		setSelectedWorkout(null);
	}
	
	function handleComplete(index, data) {
		const duplicatedData = { ...data, isComplete: true };
		handleSave(index, duplicatedData);
	}
	
	useEffect(() => {
		if (savedWorkouts || !localStorage) return;
		let savedData = {};
		const week1 = JSON.parse(localStorage.getItem('fitness_week1') || '{}');
		const rest = JSON.parse(localStorage.getItem('fitness') || '{}');
		const merged = { ...rest, ...week1 };
		setSavedWorkouts(merged);
	}, []);

	useEffect(() => {
		let isMounted = true;
		const fetchWorkoutData = async () => {
			try {
				const response = await fetch('/api/workout-data');
				if (!response.ok) {
					throw new Error(`Failed to load workout data (${response.status})`);
				}
				const data = await response.json();
				if (!isMounted) return;
				setTrainingPlan(data.workoutProgram || {});
				setExerciseDescriptions(data.exerciseDescriptions || {});
			} catch (error) {
				console.error(error);
				if (isMounted) {
					setTrainingPlan({});
				}
			}
		};

		fetchWorkoutData();
		return () => {
			isMounted = false;
		};
	}, []);
	
	useEffect(() => {
		document.body.style.overflow = selectedWorkout || modalContent ? 'hidden' : 'auto';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [selectedWorkout, modalContent]);
	
	useEffect(() => {
		const adjustFontSize = () => {
			Object.values(titleRefs.current).forEach(node => {
				if (!node) return;
				
				const parent = node.parentNode;
				const maxContainerWidth = parent.getBoundingClientRect().width;
				let currentFontSize = parseFloat(window.getComputedStyle(node).fontSize);
				
				// Reset to a default size to start measuring from
				node.style.fontSize = '';
				let initialFontSize = parseFloat(window.getComputedStyle(node).fontSize);
				
				// Shrink the font size until the text fits the container
				while (node.scrollWidth > maxContainerWidth && initialFontSize > 8) {
					initialFontSize -= 0.5; // Decrease by 0.5px
					node.style.fontSize = `${initialFontSize}px`;
				}
			});
		};
		
		adjustFontSize();
		window.addEventListener('resize', adjustFontSize);
		
		return () => {
			window.removeEventListener('resize', adjustFontSize);
		};
	}, [workoutDaysToRender]);
	
	if (!savedWorkouts || !trainingPlan) {
        return null;
    }
	
	const iconMap = {
        0: 'fa-dumbbell', 1: 'fa-bolt', 2: 'fa-weight-hanging', 3: 'fa-heart-pulse',
        4: 'fa-dumbbell', 5: 'fa-bolt', 6: 'fa-weight-hanging',
    };
    const typeMap = {
        0: 'Push', 1: 'Core', 2: 'Pull', 3: 'Optional',
        4: 'Arm Focus', 5: 'Core Focus', 6: 'Leg Focus',
    };
	
	return (
		<div className='flex flex-col items-center p-4 bg-slate-900 dark:bg-gray-100 text-slate-100 dark:text-gray-900 font-inter'>
			{/* Modal for exercise description */}
			{modalContent && (
					<Modal
						content={modalContent}
						handleCloseModal={() => setModalContent(null)} 
					/>
			)}
			
			{/* Weekday header for the grid */}
			<div className="grid grid-cols-4 gap-4 w-full max-w-2xl text-center mb-4">
			  {['Tue', 'Wed', 'Thu', 'Fri'].map((label, index) => {
			    const todayDay = getDay(today);
				const isTodayHeader = (index + 2) === todayDay;
				return (
				  <div
				    key={index}
					className={`p-3 rounded-lg font-bold text-sm sm:text-base ${isTodayHeader ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
				  >
				    {label}
				  </div>
				);
			  })}
			</div>
			
			{/* Training plan grid */}
			<div className='relative w-full max-w-2xl'>
				{selectedWorkout ? (
					<ModalWorkout
						selectedWorkout={selectedWorkout}
						savedWorkouts={savedWorkouts}
						trainingPlan={trainingPlan}
						exerciseDescriptions={exerciseDescriptions}
						typeMap={typeMap}
						handleComplete={handleComplete}
						handleSave={handleSave}
						setModalContent={setModalContent}
					/>
				) : (
					<div className='grid grid-cols-4 gap-4 auto-rows-fr'>
						{workoutDaysToRender.map((day, index) => {
							const workoutIndex = index;
							const workoutDateString = format(day.date, 'yyyy-MM-dd');
							const isComplete = savedWorkouts?.[workoutDateString]?.isComplete;
							
							const planIndex = day.weekIndex === 1
								? { 2: 4, 3: 5, 4: 6, 5: 3 }[day.dayOfWeek]
								: { 2: 0, 3: 1, 4: 2, 5: 3 }[day.dayOfWeek]
							  
							if (planIndex === undefined) return null;
							
							const type = typeMap[planIndex] || 'Workout';
							
							const isTodayGrid = isSameDay(day.date, today);
							
							const className = [
                                'flex flex-col justify-between p-4 rounded-xl shadow-lg border border-transparent transition-all duration-200',
                                'text-left cursor-pointer',
                                'hover:scale-105 hover:bg-slate-700 dark:hover:bg-gray-200 hover:border-indigo-500',
                                isTodayGrid ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-800 dark:bg-white text-slate-100 dark:text-gray-900',
                                isComplete ? 'opacity-60 completed' : 'opacity-100'
                            ].join(' ');
							  
							return (
								<button
									key={format(day.date, 'yyyy-MM-dd')}
									onClick={() => setSelectedWorkout({ workoutIndex, planIndex, date: day.date })}
									className={className}
									style={{
										gridRow: day.weekIndex,
										gridColumn: day.columnIndex + 1,
										/* opacity: day.isCurrentMonth ? '1' : '0.4' */ // Dim days from other months
									}}
								>
									<div className='flex items-center justify-between mb-2'>
                                        <p className='text-sm text-slate-400'>{format(day.date, 'MMM dd')}</p>
                                        <i className={`fa-solid ${isComplete ? 'fa-circle-check text-green-400' : iconMap[planIndex] || 'fa-star'}`}></i>
									</div>
									<div className='plan-card-header'>
										<h4
											ref={el => (titleRefs.current[`${day.weekIndex}-${day.dayOfWeek}`] = el)}
											className='text-lg font-bold w-full'
											style={{ whiteSpace: 'nowrap' }} // Use a non-breaking space for initial measurement
										>
											<b>{type}</b>
										</h4>
									</div>
								</button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
