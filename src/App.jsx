import Grid from "./components/Grid"
import Layout from "./components/Layout"
import { WorkoutProvider } from "./components/WorkoutContext"
import { useState, useEffect  } from 'react'
import NoteModal from './components/Modal-Notes.jsx'
import { ThemeProvider } from './components/ThemeContext'

function App() {
	const [showNotes, setShowNotes] = useState(false)
	
	useEffect(() => {
		if (showNotes) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}
		
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [showNotes])
	
	return (
		<ThemeProvider>
			<WorkoutProvider>
				<Layout>
					<main>
					    <div className="hidden dark:bg-black dark:text-white dark:hover:bg-gray-900 dark:bg-gray-100 dark:bg-slate-700 dark:text-gray-900 dark:text-slate-100" />
						{showNotes && (
							<NoteModal
								showExerciseDescription={{
									name: "The Rules",
									description: (
										<div className="space-y-4 p-4 text-slate-300 dark:text-gray-700">
											<p>To get the most out of the exercises, follow these 3 simple rules:</p>
											<div className="grid md:grid-cols-3 gap-4">
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">Rest</p>
													<p className="text-sm">Incorporate rest days to allow your muscles to recover and grow.</p>
												</div>
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">Reps</p>
													<p className="text-sm">Each rep follows a controlled <abbr title="2 seconds down → 2 second pause → 2 seconds up" className="underline decoration-dashed">2 - 2 - 2 tempo</abbr> for better form and focus.</p>
												</div>
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">Weight</p>
													<p className="text-sm">Use the heaviest weight you can manage while maintaining proper form through the entire set.</p>
												</div>
											</div>
											<h3 className="text-xl font-bold text-white dark:text-gray-900 mt-8">Notes</h3>
											<p>Use slow, controlled reps and pause at the peak for better isolation.</p>
											<div className="space-y-4">
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">Progressive Overload</p>
													<p className="text-sm">Increase weights by 5–10lb every 2–3 weeks when 10 reps feel easy.</p>
												</div>
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">Fat Loss Tip</p>
													<p className="text-sm">Prioritize protein (200g/day), and keep weekly steps high (8–10k/day).</p>
												</div>
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">Recovery</p>
													<p className="text-sm">Stretch hips, hamstrings, and shoulders after each session to improve lifts and mobility.</p>
												</div>
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">3x10 (Straight Sets)</p>
													<p className="text-sm">Great for tracking progress, building consistency, and muscular endurance.</p>
												</div>
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">12-10-8 (Pyramid Sets)</p>
													<p className="text-sm">Increase weight as reps decrease for internal progressive overload.</p>
													<ul className="list-disc list-inside mt-2 text-sm pl-4 space-y-1">
														<li>100 lbs – 12 reps</li>
														<li>Increase to 110 lbs – 10 reps</li>
														<li>Increase to 120 lbs – 8 reps</li>
													</ul>
												</div>
												<div className="p-4 bg-slate-700 dark:bg-gray-200 rounded-lg">
													<p className="font-bold text-white dark:text-gray-900">Drop Sets</p>
													<p className="text-sm">Perform an exercise to failure, reducing weight each time.</p>
													<ul className="list-disc list-inside mt-2 text-sm pl-4 space-y-1">
														<li>25 lbs – failure</li>
														<li>Drop to 20 lbs – failure</li>
														<li>Drop to 15 lbs – failure</li>
														<li>Drop to 10 lbs – burnout</li>
													</ul>
													<p className="mt-2 text-sm text-slate-400 dark:text-gray-500">Use Drop Sets or Finishers only at the end of your workout.</p>
												</div>
											</div>
										</div>
									)
								}}
								handleCloseModal={() => setShowNotes(false)}
							/>
						)}
						<Grid />
						<div className="flex justify-center gap-4 p-4">
							<button
							  className="px-6 py-3 bg-slate-700 dark:bg-gray-200 text-white dark:text-gray-900 font-bold rounded-lg shadow-lg hover:bg-slate-600 dark:hover:bg-gray-300 transition-colors"
							  onClick={() => setShowNotes(prev => !prev)}
							>
							  {showNotes ? 'Hide Notes' : 'Show Notes'}
							</button>
						</div>
					</main>
				</Layout>
			</WorkoutProvider>
		</ThemeProvider>
  )
}

export default App