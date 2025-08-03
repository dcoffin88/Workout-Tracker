export const workoutProgram = {
	0: {
		title: "Upper Body (Push Focus + Core)",
		warmup: [
			{ name: "Leg Raise", sets: 3, reps: "20/15/15", weight: "NA", done: false }
		],
		pickOne: [
			{ name: "Shoulder Press", sets: 3, reps: 10, weight: "80", done: false },
			{ name: "Overhead Press", sets: 3, reps: 10, weight: "50+2", done: false }
		],
		supersets: [
			[ // Superset 1
				{ name: "Back Machine", sets: 3, reps: 10, weight: "120", done: false },
				{ name: "French Press (Triceps)", sets: 3, reps: 10, weight: "80", done: false },
			],
			[ // Superset 2
				{ name: "Pull-down Abs", sets: 3, reps: 15, weight: "160", done: false },
				{ name: "Shoulder Upright Row", sets: 3, reps: 10, weight: "50", done: false },
			],
			[ // Superset 3
				{ name: "Pec Dec", sets: 3, reps: 10, weight: "12", done: false },
				{ name: "Vertical Bench", sets: 3, reps: 10, weight: "10", done: false }
			]
		],
		optional: [
			{ name: "Ab Machine", sets: 1, reps: "NA", weight: "200", done: false },
			{ name: "Arm Extension Drop Set", sets: 4, reps: "NA", weight: "100", done: false }
		]
	},
	1: {
		title: "Lower Body (Glutes, Legs, Abs)",
		warmup: [
			{ name: "Knee Raise", sets: 3, reps: "20/20/20", weight: "8", done: false }
		],
		workout: [
			{ name: "Inner Thigh Machine", sets: 3, reps: 15, weight: "200", done: false },
			{ name: "Outer Thigh Machine", sets: 3, reps: 15, weight: "200", done: false }
		],
		supersets: [
			[ // Superset 1
				{ name: "Seated Leg Extension", sets: 3, reps: 10, weight: "140", done: false },
				{ name: "Prone Leg Curl", sets: 3, reps: 10, weight: "85", done: false },
			],
			[ // Superset 2
				{ name: "Glute Machine", sets: 3, reps: 10, weight: "150", done: false },
				{ name: "Seated Leg Press", sets: 3, reps: 10, weight: "300", done: false }
			],
			[ // Superset 3
				{ name: "Ab Machine", sets: 1, reps: 20, weight: "200", done: false },
				{ name: "French Press (Triceps)", sets: 3, reps: 10, weight: "80", done: false },
				{ name: "Arm Extension", sets: 3, reps: 10, weight: "100", done: false }
			]
		],
		finisher: [
			{ name: "Ab Coaster", sets: 4, reps: "20/10R/10L/20", weight: "20", done: false },
		],
		optional: [
			{ name: "Ab Machine", sets: 1, reps: "NA", weight: "200", done: false },
			{ name: "Calf Raises", sets: 3, reps: 10, weight: "150", done: false },
			{ name: "Pec Dec", sets: 3, reps: 10, weight: "120", done: false },
			{ name: "French Press (Triceps)", sets: 3, reps: 10, weight: "80", done: false },
			{ name: "Shoulder Press", sets: 3, reps: 10, weight: "80", done: false }
		]
	},
	2: {
		title: "Upper Body (Pull Focus + Arms)",
		warmup: [
			{ name: "Leg Raise", sets: 3, reps: "20/15/15", weight: "NA", done: false }
		],
		supersets: [
			[ // Superset 1
				{ name: "Seated Cable Row", sets: 3, reps: 10, weight: "140", done: false },
				{ name: "Tricep Pressdown", sets: 3, reps: 10, weight: "50", done: false },
				{ name: "Shoulder Upright Row", sets: 3, reps: 10, weight: "50", done: false },
			],
			[ // Superset 2
				{ name: "Torso Rotation", sets: "2L/2R", reps: 15, weight: "110", done: false },
				{ name: "Pull-down Abs", sets: 2, reps: 25, weight: "160", done: false }
			],
			[ // Superset 3
				{ name: "Vertical Row", sets: 3, reps: 10, weight: "130", done: false },
				{ name: "Bicep Machine", sets: 3, reps: 10, weight: "#10/60", done: false },
			],
			[ // Superset 4
				{ name: "Arm Extension", sets: 3, reps: 10, weight: "11", done: false },
				{ name: "Lateral Raise", sets: 3, reps: 10, weight: "12", done: false },
			]
		],
		optional: [
			{ name: "Ab Machine", sets: 1, reps: "NA", weight: "200", done: false },
			{ name: "Plank with Shoulder Taps", sets: 3, reps: "30s", weight: "NA", done: false }
		]
	},
	3: {
		title: "Full Body + Conditioning Finish",
		warmup: [
			{ name: "Knee Raise", sets: 3, reps: "20/20/20", weight: "8", done: false }
		],
		workout: [
			{ name: "Roman Chair (Back Extensions)", sets: 3, reps: 10, weight: "25", done: false },
			{ name: "Ab Machine", sets: 3, reps: "NA", weight: "200", done: false },
			{ name: "Assault Runner Intervals", sets: 7, reps: "1/1Min", weight: "NA", done: false }
		],
		gravitron: [
			{ name: "Bar Dips 1", sets: 1, reps: 10, weight: "110", done: false },
			{ name: "Wide Grip Pull-Ups", sets: 1, reps: 10, weight: "110", done: false },
			{ name: "Bar Dips 2", sets: 1, reps: 10, weight: "110", done: false },
			{ name: "Military Grip Pull-Ups", sets: 1, reps: 10, weight: "110", done: false },
			{ name: "Bar Dips 3", sets: 1, reps: 10, weight: "110", done: false },
			{ name: "Parallel Grip Pull-Ups", sets: 1, reps: 10, weight: "110", done: false }
		],
		optional: [
			{ name: "Seated Cable Row", sets: 3, reps: 10, weight: "140", done: false },
			{ name: "Tricep Pressdown", sets: 3, reps: 10, weight: "50", done: false },
			{ name: "Shoulder Upright Row", sets: 3, reps: 10, weight: "50", done: false },
			{ name: "Push-ups", sets: 1, reps: 20, weight: "NA", done: false },
			{ name: "Jump Squats / Air Squats", sets: 1, reps: 20, weight: "NA", done: false },
			{ name: "Mountain Climbers", sets: 1, reps: "20 each leg", weight: "NA", done: false }
		]
	},
	4: {
		title: "Focused Arm Day",
		warmup: [
			{ name: "Leg Raise", sets: 3, reps: "20/15/15", weight: "NA", done: false }
		],
		pickOne: [
			{ name: "Bicep Machine", sets: 3, reps: 10, weight: "#10/60", done: false },
			{ name: "Single-Arm Biceps", sets: 3, reps: "10R / 10L", weight: "#5/30", done: false }
		],
		workout: [
			{ name: "Vertical Row", sets: 3, reps: 10, weight: "130", done: false },
			{ name: "Vertical Bench", sets: 3, reps: 10, weight: "10", done: false },
			{ name: "Overhead Press", sets: 3, reps: 10, weight: "50+2", done: false },
			{ name: "Shoulder Press", sets: 3, reps: 10, weight: "80", done: false },
			{ name: "Pec Dec", sets: 3, reps: 10, weight: "120", done: false },
			{ name: "Lateral Raise", sets: 3, reps: 10, weight: "12", done: false },
			{ name: "French Press (Triceps)", sets: 3, reps: 10, weight: "80", done: false },
			{ name: "Arm Extension", sets: 3, reps: 10, weight: "100", done: false }
		]
	},
	5: {
		title: "Focused Core Day",
		warmup: [
			{ name: "Knee Raise", sets: 3, reps: "20/20/20", weight: "8", done: false }
		],
		workout: [
			{ name: "Roman Chair (Back Extensions)", sets: 3, reps: 10, weight: "25", done: false },
			{ name: "Ab Coaster", sets: 4, reps: "20/10R/10L/20", weight: "20", done: false },
			{ name: "Torso Rotation", sets: 2, reps: 15, weight: "130", done: false },
			{ name: "Seated Cable Row", sets: 3, reps: 10, weight: "140", done: false },
			{ name: "Pull-down Abs", sets: 3, reps: 15, weight: "160", done: false }
		]
	},
	6: {
		title: "Focused Leg Day",
		warmup: [
			{ name: "Leg Raise", sets: 3, reps: "20/15/15", weight: "NA", done: false }
		],
		workout: [
			{ name: "Glute Machine", sets: 3, reps: 10, weight: "150", done: false },
			{ name: "Seated Leg Press", sets: 3, reps: 10, weight: "300", done: false },
			{ name: "Inner Thigh Machine", sets: 3, reps: 15, weight: "200", done: false },
			{ name: "Outer Thigh Machine", sets: 3, reps: 15, weight: "200", done: false },
			{ name: "Seated Leg Extension", sets: 3, reps: 10, weight: "140", done: false },
			{ name: "Prone Leg Curl", sets: 3, reps: 10, weight: "85", done: false }
		]
	}
}

export const exerciseDescriptions = {
	"Around the worlds": "Hold a stick with a double shoulder-width grip. Start with the stick at your hips, then lift it over your head, keeping your arms straight, and lower it behind your back as far down as comfortable. Then slowly reverse the motion to return to the starting position.",
	"Scapula pushups": "Begin in a high plank position. Keep your arms straight and only move your shoulder blades, bringing them together and apart in a controlled manner.",
	"Wall bodyweight rows": "Stand a foot away from a wall, lean back, and push off the wall using your elbows while engaging your back.",
	"leaning rear delt holds": "Stand against a wall, elbows at shoulder height, thumbs by ears. Press off the wall using your rear delts.",
	"Scapula pull ups": "Hang from a bar, keep arms straight, and lift your body slightly using just shoulder blades.",
	"Glute bridges": "Lie on your back with knees bent. Raise your hips using your glutes to form a straight line from shoulders to knees.",
	"Bodyweight squats": "Squat with just your bodyweight. Pause 2-3 seconds at the bottom before standing.",
	"Bodyweight RDLs": "Balance on one leg, hinge forward at the hips, stretch the rear leg back, then return to standing.",
	"Leg Raise": {
		text: "Use the Life Fitness Signature Series Leg Raise machine. Keep your back supported against the pad and raise your knees or legs with control to engage your lower abs. Avoid swinging for maximum effectiveness.",
		images: [
			"/images/Vertical_Leg_Raise_(On_Parallel_Bars).gif"
		]
	},
	"Knee Raise": {
		text: "Use the Life Fitness Signature Series Leg Raise machine. Keep your back supported against the pad and raise your knees or legs with control to engage your lower abs. Avoid swinging for maximum effectiveness.",
		images: [
			"/images/Vertical_Leg_Raise_(On_Parallel_Bars).gif"
		]
	},
	"Calf Raises": {
		text: "Use the standing or seated calf raise machine to lift your heels by pushing through the balls of your feet, targeting the calf muscles.",
		images: [
			"/images/Dumbbell_Standing_Calf_Raise.gif",
			"/images/Lever_Standing_Calf_Raise.gif"
		]
	},
	"Ab Coaster": "Use the ab coaster machine to glide your knees forward in a crunch motion, squeezing your core at the top.",
	"Ab Machine": {
		text: "Sit in the abdominal crunch machine and contract your abs to push the resistance forward.",
		images: [
			"/images/Lever_Seated_Crunch_(Chest_Pad).gif"
		]
	},
	"Pallof Press": "Stand perpendicular to a cable machine. Press the handle straight out in front of your chest to resist rotation.",
	"Plank with Shoulder Taps": {
		text: "Hold a plank and alternate tapping each shoulder while keeping hips stable.",
		images: [
			"/images/Kneeling_Plank_Tap_Shoulder_(Male).gif"
		]
	},
	"Roman Chair (Back Extensions)": {
		text: "On a Roman chair or hyperextension bench, lower and raise your torso while keeping your back straight.",
		images: [
			"/images/Hyperextension.gif"
		]
	},
	"Bar Dips": {
		text: "Use parallel bars to dip your body by bending elbows, then press back up to target triceps and chest.",
		images: [
			"/images/Assisted_Triceps_Dip_(Kneeling).gif"
		]
	},
	"Bar Dips 1": {
		text: "Use parallel bars to dip your body by bending elbows, then press back up to target triceps and chest.",
		images: [
			"/images/Assisted_Triceps_Dip_(Kneeling).gif"
		]
	},
	"Bar Dips 2": {
		text: "Use parallel bars to dip your body by bending elbows, then press back up to target triceps and chest.",
		images: [
			"/images/Assisted_Triceps_Dip_(Kneeling).gif"
		]
	},
	"Bar Dips 3": {
		text: "Use parallel bars to dip your body by bending elbows, then press back up to target triceps and chest.",
		images: [
			"/images/Assisted_Triceps_Dip_(Kneeling).gif"
		]
	},
	"Wide Grip Pull-Ups": {
		text: "Hang from a bar with wide grip and pull your chin over the bar using your back and arms.",
		images: [
			"/images/Assisted_Pull-Up.gif"
		]
	},
	"Military Grip Pull-Ups": {
		text: "Use an overhand, close grip (shoulder-width) to pull yourself up. Focuses on biceps and lats.",
		images: [
			"/images/Assisted_Pull-Up.gif"
		]
	},
	"Parallel Grip Pull-Ups": {
		text: "Use neutral (parallel) grips to pull your body up with balanced arm engagement.",
		images: [
			"/images/Assisted_Pull-Up.gif"
		]
	},
	"Assault Runner Intervals": "Use a curved treadmill to alternate 1-minute run / 1-minute walk intervals for conditioning.",
	"Push-ups": {
		text: "Perform a traditional push-up with arms slightly wider than shoulders, focusing on controlled motion.",
		images: [
			"/images/Push-Up.gif",
			"/images/Close-Grip_Push-Up.gif"
		]
	},
	"Jump Squats / Air Squats": {
		text: "Perform bodyweight squats explosively, jumping off the ground at the top.",
		images: [
			"/images/Jump_Squat_V._2.gif"
		]
	},
	"Mountain Climbers": {
		text: "From a plank position, rapidly alternate pulling knees toward your chest, like sprinting in place.",
		images: [
			"/images/Mountain_Climber.gif"
		]
	},
	"Shoulder Press": {
		text: "Use the shoulder press machine to push the handles upward from shoulder height until your arms are fully extended. Keep your back against the pad and avoid locking out your elbows.",
		images: [
			"/images/Lever_Shoulder_Press_V._3.gif"
		]
	},
	"Overhead Press": {
		text: "Use the overhead press machine to push the handles straight up from shoulder level. Maintain a controlled motion, keeping your back against the pad and avoiding elbow lockout.",
		images: [
			"/images/Lever_Shoulder_Press_V._3.gif"
		]
	},
	"Pull-down Abs": {
		text: "Use the abdominal Pull-down crunch machine by securing your upper body and pulling the handles forward in a controlled crunching motion, engaging your core throughout.",
		images: [
			"/images/Lever_Seated_Crunch.gif"
		]
	},
	"Shoulder Upright Row": {
		text: "Use the upright row machine to lift the handles from waist to chest height, keeping elbows higher than hands and engaging the delts and traps throughout the motion.",
		images: [
			"/images/Cable_Upright_Row.gif"
		]
	},
	"Pec Dec": {
		text: "Use the pec dec machine to bring arms together in a hugging motion, isolating chest muscles.",
		images: [
			"/images/Lever_Seated_Fly.gif"
		]
	},
	"Vertical Bench": {
		text: "Press on a machine with vertical motion (like shoulder press) or incline variation.",
		images: [
			"/images/Machine_Inner_Chest_Press.gif"
		]
	},
	"Back Machine": {
		text: "Generic label for seated back extension or assisted row machines targeting spinal erectors or lats.",
		images: [
			"/images/Gentle_Style_Cable_Pulldown_(Pro_Lat_Bar).gif"
		]
	},
	"French Press (Triceps)": {
		text: "Use the triceps extension machine to press the handles overhead by extending your elbows, targeting the triceps with controlled motion.",
		images: [
			"/images/Ez_Bar_French_Press_On_Exercise_Ball.gif"
		]
	},
	"Seated Leg Extension": {
		text: "Use the leg extension machine to extend your knees and lift the padded bar, isolating the quadriceps while keeping your hips down.",
		images: [
			"/images/Lever_Leg_Extension.gif"
		]
	},
	"Prone Leg Curl": {
		text: "Use the prone leg curl machine to lie face down and curl your legs upward, isolating the hamstrings.",
		images: [
			"/images/Lever_Lying_Leg_Curl.gif"
		]
	},
	"Glute Machine": {
		text: "Press your foot backward using the glute kickback machine, isolating glutes.",
		images: [
			"/images/Lever_Hip_Extension_V._2.gif"
		]
	},
	"Seated Leg Press": {
		text: "Push a platform upward with your feet from a seated position, targeting quads and glutes.",
		images: [
			"/images/Lever_Seated_Squat_Calf_Raise_On_Leg_Press_Machine.gif"
		]
	},
	"Inner Thigh Machine": {
		text: "Adductor machine — bring legs together against resistance to target inner thighs.",
		images: [
			"/images/Lever_Seated_Hip_Adduction.gif"
		]
	},
	"Outer Thigh Machine": {
		text: "Abductor machine — push legs apart against resistance to target outer thighs.",
		images: [
			"/images/Lever_Seated_Hip_Abduction.gif"
		]
	},
	"Seated Cable Row": {
		text: "Pull a cable handle toward your torso while seated, squeezing shoulder blades.",
		images: [
			"/images/Cable_Low_Seated_Row.gif"
		]
	},
	"Tricep Pressdown": {
		text: "Use a rope to push down and extend your elbows fully, isolating triceps.",
		images: [
			"/images/Cable_Pushdown_(With_Rope_Attachment).gif"
		]
	},
	"Vertical Row": {
		text: "Pull handles back on machine, simulating a vertical plane rowing motion.",
		images: [
			"/images/Lever_Seated_Row.gif"
		]
	},
	"Bicep Machine": {
		text: "Sit with arms resting and curl handles upward to target biceps with fixed movement.",
		images: [
			"/images/Lever_Preacher_Curl.gif"
		]
	},
	"Single-Arm Biceps": "Perform curls one arm at a time using machine, isolating each bicep.",
	"Arm Extension": {
		text: "Use a machine to extend your elbow and contract the triceps.",
		images: [
			"/images/Lever_Triceps_Extension.gif"
		]
	},
	"Lateral Raise": {
		text: "Use the lateral raise machine to lift your arms outward to shoulder height, isolating the side deltoids.",
		images: [
			"/images/Lever_Lateral_Raise.gif"
		]
	},
	"Torso Rotation": "Use machine to rotate your torso from side to side, engaging obliques.",
	"Cable row": "Seated row using a low cable — pull handle to midsection with controlled posture.",
	"Dumbbell chest flies": "Lie on a bench with arms outstretched and perform a wide hugging motion to contract the chest.",
	"Lat pull down": "Pull a bar down from overhead to collarbone level, squeezing your shoulder blades.",
	"Cable crossover press": "Cross cable handles in front of your body to squeeze the chest together.",
	"Cable rope pushdown": "Use a rope to press downward from elbow height, separating hands at the bottom.",
	"Unilateral cable pushdown": "Perform single-arm tricep pushdowns with a handle attachment.",
	"Dumbbell skull crushers": "Lie on a bench and lower dumbbells toward your forehead, then press up using triceps.",
	"Incline dumbbell press": "Press dumbbells upward on an incline bench to emphasize the upper chest.",
	"Barbell bench press": "Lower a barbell to your chest and press it back up using your pecs and triceps.",
	"Unilateral dumbbell row": "Kneel with one hand on a bench and row a dumbbell with the other, pulling toward your hip.",
	"Chest supported dumbbell row": "Lay face down on an incline bench and perform a row using dumbbells.",
	"Dumbbell side raises": "Raise dumbbells laterally to shoulder height to work your side delts.",
	"Rear delt flies": "Bend forward and raise dumbbells out to the side to hit rear shoulders.",
	"Cable bar shrugs": "Grip a bar attached to a low cable and shrug shoulders upward.",
	"Overhand cable curl": "Perform bicep curls with a cable bar using an overhand grip.",
	"Hammer grip dumbbell curl": "Hold dumbbells vertically and curl to shoulder height.",
	"Alternating dumbbell curl": "Alternate curls from left to right while keeping form strict.",
	"Barbell squat": "Back-loaded barbell squat focusing on form, depth, and hip drive.",
	"Leg press": "Push resistance away from the body with legs while seated or angled.",
	"Goblet squat": "Hold a dumbbell/kettlebell at your chest and perform a squat.",
	"Hip thrust": "Thrust hips upward with weight across the pelvis, braced on a bench.",
	"Bulgarian split squat": "Elevate your rear foot and squat with the front leg forward.",
	"Unilateral RDLs": "Single-leg Romanian deadlifts — hinge at the hips for hamstring isolation.",
	"Romanian deadlifts": "Lower weights while keeping legs mostly straight, focusing on hamstrings and glutes.",
	"Walking lunges": "Lunge forward in alternating steps while keeping torso upright.",
	"Leg extension": "Extend legs against resistance using a knee-dominant quad machine.",
	"Hamstring curl": "Curl your legs back toward glutes using a prone or seated machine.",
	"Good girls / bad girls": "Use hip adductor/abductor machines to work inner/outer thighs.",
	"Arm Extension Drop Set": {
		text: "Use a machine to extend your elbow and contract the triceps. Perform each set to failure, reducing weight each time.",
		images: [
			"/images/Lever_Triceps_Extension.gif"
		]
	}
}