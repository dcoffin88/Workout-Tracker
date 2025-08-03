import React, { useState, useContext, useEffect } from 'react'
import { exerciseDescriptions } from '../utils/defaultProgram'
import { WorkoutContext } from './WorkoutContext'

export default function WorkoutCard(props) {
	const {
		workoutIndex,
		type,
		handleComplete,
		handleSave,
		trainingPlan,
		savedDoneStatus,
		setShowExerciseDescription
	} = props;
	
	const {
		weights,
		updateExerciseField,
	} = useContext(WorkoutContext);
	
	const [doneStatus, setDoneStatus] = useState(savedDoneStatus || {});
	
	function toggleDoneStatus(title) {
		setDoneStatus(prev => ({
			...prev,
			[title]: !prev[title]
		}));
	}
	
	function ExerciseInput({ exercise }) {
		const { updateExerciseField, weights } = useContext(WorkoutContext);
		const entry = weights[exercise.name] || {};
		
		const [localWeight, setLocalWeight] = useState(entry.weight ?? exercise.weight ?? '');
		const [localSets, setLocalSets] = useState(entry.sets ?? exercise.sets ?? '');
		const [localReps, setLocalReps] = useState(entry.reps ?? exercise.reps ?? '');
		
		useEffect(() => {
			const entry = weights[exercise.name] || {};
			const repsValue = entry.reps ?? exercise.reps ?? '';
			setLocalWeight(entry.weight ?? exercise.weight ?? '');
			setLocalSets(entry.sets ?? exercise.sets ?? '');
			setLocalReps(repsValue === 'NA' ? '♾️' : repsValue);
		}, [weights, exercise.name, exercise.sets, exercise.reps, exercise.weight]);

		return (
			<>
				<p className='text-sm flex items-center justify-center'>
					<input
					  type="text"
					  value={localSets}
					  onChange={(e) => setLocalSets(e.target.value)}
					  onBlur={() => updateExerciseField(exercise.name, 'sets', localSets)}
					  className='w-full px-2 py-1 bg-slate-700 dark:bg-white rounded-md text-sm text-center border border-slate-600 dark:border-gray-200 text-slate-100 dark:text-gray-900 focus:outline-none focus:border-indigo-500'
					  placeholder="Sets"
					/>
				  </p>
				  <p className='text-sm flex items-center justify-center'>
					<input
					  type="text"
					  value={localReps}
					  onChange={(e) => setLocalReps(e.target.value)}
					  onBlur={() => {
						const val = localReps.trim()
						const newVal = val === '♾️' ? 'NA' : val
						updateExerciseField(exercise.name, 'reps', newVal)
						setLocalReps(newVal === 'NA' ? '♾️' : newVal)
					  }}
					  className='w-full px-2 py-1 bg-slate-700 dark:bg-white rounded-md text-sm text-center border border-slate-600 dark:border-gray-200 text-slate-100 dark:text-gray-900 focus:outline-none focus:border-indigo-500'
					  placeholder="Reps"
					/>
				  </p>
				  <p className='text-sm flex items-center justify-center'>
					{exercise.weight === 'NA' ? null : (
						<input
						  value={localWeight}
						  onChange={(e) => setLocalWeight(e.target.value)}
						  onBlur={() => updateExerciseField(exercise.name, 'weight', localWeight)}
						  className='w-full px-2 py-1 bg-slate-700 dark:bg-white rounded-md text-sm text-center border border-slate-600 dark:border-gray-200 text-slate-100 dark:text-gray-900 focus:outline-none focus:border-indigo-500'
						  placeholder="Weight"
						/>
					)}
				  </p>
				  <p className='text-sm flex items-center justify-center'>
					  <input
						type="checkbox"
						checked={!!doneStatus[exercise.name]}
						onChange={() => toggleDoneStatus(exercise.name)}
						className='w-5 h-5 text-indigo-500 bg-slate-700 dark:bg-white border-slate-600 dark:border-gray-200 rounded focus:ring-indigo-500'
					  />
					</p>
			</>
		)
	}
	
	const { workout = [], warmup = [], pickOne = [], supersets = [], finisher = [], gravitron = [], optional = [] } = trainingPlan
	
	const iconMap = {
		"Arm Focus": 'fa-dumbbell',
		"Core Focus": 'fa-bolt',
		"Leg Focus": 'fa-weight-hanging',
		Push: 'fa-dumbbell',
		Core: 'fa-bolt',
		Pull: 'fa-weight-hanging',
		Optional: 'fa-heart-pulse'
	}
	const icon = iconMap[type]
	
	return (
		<div className='flex flex-col p-4 sm:p-6 bg-slate-900 dark:bg-gray-100 text-slate-100 dark:text-gray-900 font-inter'>
			<div className='p-6 rounded-2xl shadow-xl bg-slate-800 dark:bg-white w-full'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-2xl font-bold'><b>{type} Workout</b></h2>
					<i className={`fa-solid ${icon} text-indigo-400 text-2xl`}></i>
				</div>
			</div>
			
			{[
				{ label: "Warmup", data: warmup },
				{ label: "Pick One", data: pickOne },
				{ label: "Workout", data: workout },
				{ label: "Gravitron", data: gravitron }
			].map(({ label, data }) => (
				data.length > 0 && (
					<div className='grid grid-cols-[4fr_1fr_2fr_2fr_1fr] gap-2 md:gap-4 w-full text-center mt-4 text-sm md:text-base' key={label}>
						<div className='flex items-center text-left col-span-1 font-bold'><h4>{label}</h4></div>
						<h6 className="text-center font-bold">Sets</h6>
						<h6 className="text-center font-bold">Reps</h6>
						<h6 className="text-center font-bold">Weight</h6>
						<h6 className="text-center font-bold">Done</h6>

						{data.map((exercise, index) => (
							<React.Fragment key={`${label}-${index}`}>
								<div className='flex items-center text-left gap-2 col-span-1'>
									<button onClick={() => {
										const entry = exerciseDescriptions[exercise.name];
										const description = typeof entry === 'string' ? entry : entry?.text;
										const images = Array.isArray(entry?.images) ? entry.images : []
										
										setShowExerciseDescription({
											name: exercise.name,
											description,
											images
										});
									}} className='text-indigo-400 dark:text-indigo-600 hover:text-indigo-300 dark:hover:text-indigo-500 transition-colors'>
										<i className="fa-regular fa-circle-question"></i>
									</button>
									<p>{index + 1}. {exercise.name}</p>
								</div>
								<ExerciseInput exercise={exercise} />
							</React.Fragment>
						))}
					</div>
				)
			))}
			
			{/* Supersets Section */}
			{supersets.length > 0 && (
				<div className='grid grid-cols-[4fr_1fr_2fr_2fr_1fr] gap-2 md:gap-4 w-full text-center mt-4 text-sm md:text-base'>
					<div className='flex items-center text-left col-span-1 font-bold'>
						<h4>Supersets</h4>
					</div>
					<h6 className="text-center font-bold">Sets</h6>
					<h6 className="text-center font-bold">Reps</h6>
					<h6 className="text-center font-bold">Weight</h6>
					<h6 className="text-center font-bold">Done</h6>
					
					{supersets.map((group, groupIndex) => (
						<React.Fragment key={`superset-${groupIndex}`}>
							{group.map((exercise, i) => (
								<React.Fragment key={`superset-${groupIndex}-${i}`}>
									<div className='flex items-center text-left gap-2 col-span-1'>
										<button onClick={() => {
											const entry = exerciseDescriptions[exercise.name];
											const description = typeof entry === 'string' ? entry : entry?.text;
											const images = Array.isArray(entry?.images) ? entry.images : []
											
											setShowExerciseDescription({
												name: exercise.name,
												description,
												images
											});
										}} className='text-indigo-400 dark:text-indigo-600 hover:text-indigo-300 dark:hover:text-indigo-500 transition-colors'>
											<i className="fa-regular fa-circle-question"></i>
										</button>
										<p>{groupIndex + 1}.{i + 1} {exercise.name}</p>
									</div>
									<ExerciseInput exercise={exercise} />
								</React.Fragment>
							))}
						</React.Fragment>
					))}
				</div>
			)}
			
			{/* Finisher Section */}
			{finisher.length > 0 && (
			  <div className='grid grid-cols-[4fr_1fr_2fr_2fr_1fr] gap-2 md:gap-4 w-full text-center mt-4 text-sm md:text-base' key="Finisher">
				<div className='flex items-center text-left col-span-1 font-bold'><h4>Finisher</h4></div>
				<h6 className="text-center font-bold">Sets</h6>
				<h6 className="text-center font-bold">Reps</h6>
				<h6 className="text-center font-bold">Weight</h6>
				<h6 className="text-center font-bold">Done</h6>

				{finisher.map((exercise, index) => (
				  <React.Fragment key={`Finisher-${index}`}>
					<div className='flex items-center text-left gap-2 col-span-1'>
					  <button onClick={() => {
							const entry = exerciseDescriptions[exercise.name];
							const description = typeof entry === 'string' ? entry : entry?.text;
							const images = Array.isArray(entry?.images) ? entry.images : []
							
							setShowExerciseDescription({
								name: exercise.name,
								description,
								images
							});
						}} className='text-indigo-400 dark:text-indigo-600 hover:text-indigo-300 dark:hover:text-indigo-500 transition-colors'>
							<i className="fa-regular fa-circle-question"></i>
					  </button>
					  <p>{index + 1}. {exercise.name}</p>
					</div>
					<ExerciseInput exercise={exercise} />
				  </React.Fragment>
				))}
			  </div>
			)}
			
			{/* Optional Section */}
			{optional.length > 0 && (
			  <div className='grid grid-cols-[4fr_1fr_2fr_2fr_1fr] gap-2 md:gap-4 w-full text-center mt-4 text-sm md:text-base' key="Optional">
				<div className='flex items-center text-left col-span-1 font-bold'><h4>Optional</h4></div>
				<h6 className="text-center font-bold">Sets</h6>
				<h6 className="text-center font-bold">Reps</h6>
				<h6 className="text-center font-bold">Weight</h6>
				<h6 className="text-center font-bold">Done</h6>

				{optional.map((exercise, index) => (
				  <React.Fragment key={`Optional-${index}`}>
					<div className='flex items-center text-left gap-2 col-span-1'>
					  <button onClick={() => {
							const entry = exerciseDescriptions[exercise.name];
							const description = typeof entry === 'string' ? entry : entry?.text;
							const images = Array.isArray(entry?.images) ? entry.images : []
							
							setShowExerciseDescription({
								name: exercise.name,
								description,
								images
							});
						}} className='text-indigo-400 dark:text-indigo-600 hover:text-indigo-300 dark:hover:text-indigo-500 transition-colors'>
							<i className="fa-regular fa-circle-question"></i>
					  </button>
					  <p>{index + 1}. {exercise.name}</p>
					</div>
					<ExerciseInput exercise={exercise} />
				  </React.Fragment>
				))}
			  </div>
			)}
			
			{/* Buttons */}
			<div className='flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-sm mx-auto'>
				<button 
					onClick={() => handleSave(workoutIndex, { weights, doneStatus })}
					className='flex-1 px-6 py-3 bg-slate-700 dark:bg-gray-200 text-white dark:text-gray-900 font-bold rounded-lg shadow-lg hover:bg-slate-600 dark:hover:bg-gray-300 transition-colors'
				>
					Save & Pause
				</button>
				<button
					onClick={() => handleComplete(workoutIndex, { weights, doneStatus })}
					className='flex-1 px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors'
				>
					Complete Workout
				</button>
			</div>
		</div>
	)
}