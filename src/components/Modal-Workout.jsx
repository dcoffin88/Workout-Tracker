import React from 'react'
import WorkoutCard from './WorkoutCard'
import { format } from 'date-fns'
import { workoutProgram as training_plan } from '../utils/defaultProgram.js'

export default function ModalWorkout({
  selectedWorkout,
  savedWorkouts,
  typeMap,
  handleComplete,
  handleSave,
  setShowExerciseDescription,
}) {
  if (!selectedWorkout) return null;

  const workoutDateString = format(selectedWorkout.date, 'yyyy-MM-dd');
  const trainingPlan = training_plan[selectedWorkout.planIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
      <div className="relative w-full max-w-[700px] p-6 bg-slate-800 dark:bg-white rounded-2xl shadow-xl border border-slate-700 dark:border-gray-200 text-center mx-auto overflow-y-auto max-h-[90vh] overflow-y-auto no-scrollbar">
        <WorkoutCard
          key={selectedWorkout.workoutIndex}
          workoutIndex={selectedWorkout.workoutIndex}
          trainingPlan={trainingPlan}
          type={typeMap[selectedWorkout.planIndex] || 'Workout'}
          savedWeights={savedWorkouts?.[workoutDateString]?.weights}
          savedDoneStatus={savedWorkouts?.[workoutDateString]?.doneStatus}
          handleComplete={handleComplete}
          handleSave={handleSave}
          setShowExerciseDescription={setShowExerciseDescription}
        />
      </div>
    </div>
  );
}
