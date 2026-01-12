import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { workoutProgram, exerciseDescriptions } from '../src/utils/defaultProgram.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/workout.sqlite');

const db = new sqlite3.Database(dbPath);
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const sectionOrder = [
  'warmup',
  'pickOne',
  'workout',
  'gravitron',
  'supersets',
  'finisher',
  'optional',
];

async function seed() {
  await run('DROP TABLE IF EXISTS workout_items');
  await run('DROP TABLE IF EXISTS exercise_images');
  await run('DROP TABLE IF EXISTS exercises');
  await run('DROP TABLE IF EXISTS sections');
  await run('DROP TABLE IF EXISTS workouts');
  await run('DROP TABLE IF EXISTS settings');

  await run(`
    CREATE TABLE workouts (
      id INTEGER PRIMARY KEY,
      day_index INTEGER UNIQUE NOT NULL,
      title TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE sections (
      id INTEGER PRIMARY KEY,
      workout_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      position INTEGER NOT NULL,
      is_superset INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (workout_id) REFERENCES workouts(id)
    )
  `);

  await run(`
    CREATE TABLE exercises (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description_text TEXT,
      default_sets TEXT,
      default_reps TEXT,
      default_weight TEXT
    )
  `);

  await run(`
    CREATE TABLE exercise_images (
      id INTEGER PRIMARY KEY,
      exercise_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      position INTEGER NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    )
  `);

  await run(`
    CREATE TABLE workout_items (
      id INTEGER PRIMARY KEY,
      workout_id INTEGER NOT NULL,
      section_id INTEGER NOT NULL,
      group_index INTEGER NOT NULL DEFAULT 0,
      item_index INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      sets TEXT,
      reps TEXT,
      weight TEXT,
      done INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (workout_id) REFERENCES workouts(id),
      FOREIGN KEY (section_id) REFERENCES sections(id),
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    )
  `);

  await run(`
    CREATE TABLE settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  await run('INSERT INTO settings (key, value) VALUES (?, ?)', [
    'admin_pin',
    '1988',
  ]);

  const exerciseIdMap = new Map();
  for (const [name, entry] of Object.entries(exerciseDescriptions)) {
    const descriptionText = typeof entry === 'string' ? entry : entry?.text || null;
    const result = await run(
      'INSERT INTO exercises (name, description_text, default_sets, default_reps, default_weight) VALUES (?, ?, ?, ?, ?)',
      [name, descriptionText, null, null, null]
    );
    const exerciseId = result.lastID;
    exerciseIdMap.set(name, exerciseId);

    const images = Array.isArray(entry?.images) ? entry.images : [];
    for (let i = 0; i < images.length; i += 1) {
      await run(
        'INSERT INTO exercise_images (exercise_id, url, position) VALUES (?, ?, ?)',
        [exerciseId, images[i], i]
      );
    }
  }

  const ensureExerciseId = async (name) => {
    if (exerciseIdMap.has(name)) return exerciseIdMap.get(name);
    const result = await run(
      'INSERT INTO exercises (name, description_text, default_sets, default_reps, default_weight) VALUES (?, ?, ?, ?, ?)',
      [name, null, null, null, null]
    );
    exerciseIdMap.set(name, result.lastID);
    return result.lastID;
  };

  const applyDefaults = async (exerciseId, sets, reps, weight) => {
    await run(
      `UPDATE exercises
       SET default_sets = COALESCE(default_sets, ?),
           default_reps = COALESCE(default_reps, ?),
           default_weight = COALESCE(default_weight, ?)
       WHERE id = ?`,
      [
        sets != null ? String(sets) : null,
        reps != null ? String(reps) : null,
        weight != null ? String(weight) : null,
        exerciseId,
      ]
    );
  };

  const workoutEntries = Object.entries(workoutProgram).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  for (const [dayIndex, workout] of workoutEntries) {
    const workoutResult = await run(
      'INSERT INTO workouts (day_index, title) VALUES (?, ?)',
      [Number(dayIndex), workout.title]
    );
    const workoutId = workoutResult.lastID;

    for (let position = 0; position < sectionOrder.length; position += 1) {
      const sectionName = sectionOrder[position];
      const sectionData = workout[sectionName];
      if (!sectionData || sectionData.length === 0) continue;

      const isSuperset = sectionName === 'supersets' ? 1 : 0;
      const sectionResult = await run(
        'INSERT INTO sections (workout_id, name, position, is_superset) VALUES (?, ?, ?, ?)',
        [workoutId, sectionName, position, isSuperset]
      );
      const sectionId = sectionResult.lastID;

      if (isSuperset) {
        for (let groupIndex = 0; groupIndex < sectionData.length; groupIndex += 1) {
          const group = sectionData[groupIndex];
          for (let itemIndex = 0; itemIndex < group.length; itemIndex += 1) {
            const exercise = group[itemIndex];
            const exerciseId = await ensureExerciseId(exercise.name);
            await applyDefaults(
              exerciseId,
              exercise.sets,
              exercise.reps,
              exercise.weight
            );
            await run(
              `INSERT INTO workout_items
                 (workout_id, section_id, group_index, item_index, exercise_id, sets, reps, weight)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                workoutId,
                sectionId,
                groupIndex,
                itemIndex,
                exerciseId,
                exercise.sets != null ? String(exercise.sets) : null,
                exercise.reps != null ? String(exercise.reps) : null,
                exercise.weight != null ? String(exercise.weight) : null,
              ]
            );
          }
        }
      } else {
        for (let itemIndex = 0; itemIndex < sectionData.length; itemIndex += 1) {
          const exercise = sectionData[itemIndex];
          const exerciseId = await ensureExerciseId(exercise.name);
          await applyDefaults(
            exerciseId,
            exercise.sets,
            exercise.reps,
            exercise.weight
          );
          await run(
            `INSERT INTO workout_items
               (workout_id, section_id, group_index, item_index, exercise_id, sets, reps, weight)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              workoutId,
              sectionId,
              0,
              itemIndex,
              exerciseId,
              exercise.sets != null ? String(exercise.sets) : null,
              exercise.reps != null ? String(exercise.reps) : null,
              exercise.weight != null ? String(exercise.weight) : null,
            ]
          );
        }
      }
    }
  }

  db.close();
}

seed()
  .then(() => {
    console.log('SQLite seed complete.');
  })
  .catch((error) => {
    console.error('SQLite seed failed:', error);
    db.close();
    process.exit(1);
  });
