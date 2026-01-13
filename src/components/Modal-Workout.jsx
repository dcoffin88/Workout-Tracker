import React from 'react'
import WorkoutCard from './WorkoutCard'
import { format } from 'date-fns'

export default function ModalWorkout({
  selectedWorkout,
  savedWorkouts,
  trainingPlan,
  exerciseDescriptions,
  typeMap,
  handleComplete,
  handleSave,
  setModalContent,
}) {
  if (!selectedWorkout) return null;

  const workoutDateString = format(selectedWorkout.date, 'yyyy-MM-dd');
  const workoutPlan = trainingPlan?.[selectedWorkout.planIndex];
  const workoutTitle = workoutPlan?.title || typeMap[selectedWorkout.planIndex] || 'Workout';
  const iconKey = typeMap[selectedWorkout.planIndex] || 'Workout';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
      <div className="relative w-full max-w-[700px] p-6 bg-slate-800 dark:bg-white rounded-2xl shadow-xl border border-slate-700 dark:border-gray-200 text-center mx-auto overflow-y-auto max-h-[90vh] overflow-y-auto no-scrollbar">
        <WorkoutCard
          key={selectedWorkout.workoutIndex}
          workoutIndex={selectedWorkout.workoutIndex}
          trainingPlan={workoutPlan}
          type={workoutTitle}
          iconKey={iconKey}
          savedWeights={savedWorkouts?.[workoutDateString]?.weights}
          savedDoneStatus={savedWorkouts?.[workoutDateString]?.doneStatus}
          handleComplete={handleComplete}
          handleSave={handleSave}
          setShowExerciseDescription={setModalContent}
          exerciseDescriptions={exerciseDescriptions}
        />
      </div>
    </div>
  );
}
