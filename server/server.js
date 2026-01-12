import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/workout.sqlite');

const app = express();
const port = process.env.PORT || 3001;
const db = new sqlite3.Database(dbPath);

app.use(express.json());

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const getSetting = async (key) => {
  const row = await get('SELECT value FROM settings WHERE key = ?', [key]);
  return row?.value ?? null;
};

const requireAdminPin = async (req, res, next) => {
  try {
    const providedPin = req.headers['x-admin-pin'];
    if (!providedPin) {
      return res.status(401).json({ error: 'Admin PIN required.' });
    }
    const savedPin = await getSetting('admin_pin');
    if (!savedPin || String(providedPin) !== String(savedPin)) {
      return res.status(401).json({ error: 'Invalid admin PIN.' });
    }
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to verify admin PIN.' });
  }
};

app.get('/api/workout-data', async (req, res) => {
  try {
    const workouts = await all(
      'SELECT id, day_index, title FROM workouts ORDER BY day_index'
    );
    const sections = await all(
      'SELECT id, workout_id, name, position, is_superset FROM sections ORDER BY workout_id, position'
    );
    const items = await all(
      `SELECT wi.workout_id, wi.section_id, wi.group_index, wi.item_index,
              COALESCE(wi.sets, e.default_sets) AS sets,
              COALESCE(wi.reps, e.default_reps) AS reps,
              COALESCE(wi.weight, e.default_weight) AS weight,
              e.name
       FROM workout_items wi
       JOIN exercises e ON e.id = wi.exercise_id
       ORDER BY wi.workout_id, wi.section_id, wi.group_index, wi.item_index`
    );

    const descriptions = await all(
      `SELECT e.id, e.name, e.description_text, i.url, i.position
       FROM exercises e
       LEFT JOIN exercise_images i ON i.exercise_id = e.id
       ORDER BY e.id, i.position`
    );

    const workoutProgram = {};
    const workoutIdToDayIndex = new Map();
    workouts.forEach((workout) => {
      workoutProgram[workout.day_index] = { title: workout.title, sections: [] };
      workoutIdToDayIndex.set(workout.id, workout.day_index);
    });

    const sectionById = new Map();
    sections.forEach((section) => {
      sectionById.set(section.id, {
        id: section.id,
        workoutId: section.workout_id,
        name: section.name,
        position: section.position,
        isSuperset: !!section.is_superset,
        items: [],
      });
    });

    items.forEach((item) => {
      const section = sectionById.get(item.section_id);
      if (!section) return;
      const exercise = {
        name: item.name,
        sets: item.sets,
        reps: item.reps,
        weight: item.weight,
        done: false,
      };

      if (section.isSuperset) {
        if (!section.items[item.group_index]) {
          section.items[item.group_index] = [];
        }
        section.items[item.group_index].push(exercise);
      } else {
        section.items.push(exercise);
      }
    });

    sections.forEach((section) => {
      const dayIndex = workoutIdToDayIndex.get(section.workout_id);
      const workoutEntry = workoutProgram[dayIndex];
      if (!workoutEntry) return;
      const sectionEntry = sectionById.get(section.id);
      if (sectionEntry) {
        workoutEntry.sections.push({
          name: sectionEntry.name,
          isSuperset: sectionEntry.isSuperset,
          items: sectionEntry.items,
          position: sectionEntry.position,
        });
      }
    });

    Object.values(workoutProgram).forEach((workout) => {
      workout.sections.sort((a, b) => a.position - b.position);
    });

    const descriptionMap = {};
    descriptions.forEach((row) => {
      if (!descriptionMap[row.name]) {
        descriptionMap[row.name] = {
          text: row.description_text,
          images: [],
        };
      }
      if (row.url) {
        descriptionMap[row.name].images.push(row.url);
      }
    });

    const exerciseDescriptions = {};
    Object.entries(descriptionMap).forEach(([name, entry]) => {
      if (entry.images.length > 0) {
        exerciseDescriptions[name] = {
          text: entry.text,
          images: entry.images,
        };
      } else if (entry.text) {
        exerciseDescriptions[name] = entry.text;
      }
    });

    res.json({ workoutProgram, exerciseDescriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load workout data.' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { pin } = req.body || {};
    const savedPin = await getSetting('admin_pin');
    if (!savedPin || String(pin) !== String(savedPin)) {
      return res.status(401).json({ error: 'Invalid admin PIN.' });
    }
    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to verify admin PIN.' });
  }
});

app.get('/api/admin/verify', requireAdminPin, (req, res) => {
  res.json({ ok: true });
});

app.post('/api/admin/pin', requireAdminPin, async (req, res) => {
  try {
    const { currentPin, newPin } = req.body || {};
    const savedPin = await getSetting('admin_pin');
    if (!savedPin || String(currentPin) !== String(savedPin)) {
      return res.status(401).json({ error: 'Invalid current PIN.' });
    }
    if (!newPin || String(newPin).trim().length < 4) {
      return res.status(400).json({ error: 'New PIN must be at least 4 digits.' });
    }
    await run('UPDATE settings SET value = ? WHERE key = ?', [
      String(newPin).trim(),
      'admin_pin',
    ]);
    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update admin PIN.' });
  }
});

app.get('/api/admin/exercises', requireAdminPin, async (req, res) => {
  try {
    const rows = await all(
      `SELECT e.id, e.name, e.description_text, e.default_sets, e.default_reps, e.default_weight,
              i.id AS image_id, i.url, i.position
       FROM exercises e
       LEFT JOIN exercise_images i ON i.exercise_id = e.id
       ORDER BY e.name, i.position`
    );

    const exerciseMap = new Map();
    rows.forEach((row) => {
      if (!exerciseMap.has(row.id)) {
        exerciseMap.set(row.id, {
          id: row.id,
          name: row.name,
          descriptionText: row.description_text || '',
          defaultSets: row.default_sets || '',
          defaultReps: row.default_reps || '',
          defaultWeight: row.default_weight || '',
          images: [],
        });
      }
      if (row.image_id && row.url) {
        exerciseMap.get(row.id).images.push(row.url);
      }
    });

    res.json({ exercises: Array.from(exerciseMap.values()) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load exercises.' });
  }
});

app.post('/api/admin/exercises', requireAdminPin, async (req, res) => {
  try {
    const {
      name,
      descriptionText,
      defaultSets,
      defaultReps,
      defaultWeight,
      images = [],
    } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    const result = await run(
      `INSERT INTO exercises
         (name, description_text, default_sets, default_reps, default_weight)
       VALUES (?, ?, ?, ?, ?)`,
      [
        String(name).trim(),
        descriptionText ? String(descriptionText) : null,
        defaultSets ? String(defaultSets) : null,
        defaultReps ? String(defaultReps) : null,
        defaultWeight ? String(defaultWeight) : null,
      ]
    );

    const exerciseId = result.lastID;
    for (let i = 0; i < images.length; i += 1) {
      const url = String(images[i] || '').trim();
      if (!url) continue;
      await run(
        'INSERT INTO exercise_images (exercise_id, url, position) VALUES (?, ?, ?)',
        [exerciseId, url, i]
      );
    }

    res.json({ id: exerciseId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exercise.' });
  }
});

app.put('/api/admin/exercises/:id', requireAdminPin, async (req, res) => {
  try {
    const exerciseId = Number(req.params.id);
    if (!exerciseId) {
      return res.status(400).json({ error: 'Invalid exercise id.' });
    }

    const {
      name,
      descriptionText,
      defaultSets,
      defaultReps,
      defaultWeight,
      images = [],
    } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    await run(
      `UPDATE exercises
       SET name = ?,
           description_text = ?,
           default_sets = ?,
           default_reps = ?,
           default_weight = ?
       WHERE id = ?`,
      [
        String(name).trim(),
        descriptionText ? String(descriptionText) : null,
        defaultSets ? String(defaultSets) : null,
        defaultReps ? String(defaultReps) : null,
        defaultWeight ? String(defaultWeight) : null,
        exerciseId,
      ]
    );

    await run('DELETE FROM exercise_images WHERE exercise_id = ?', [exerciseId]);
    for (let i = 0; i < images.length; i += 1) {
      const url = String(images[i] || '').trim();
      if (!url) continue;
      await run(
        'INSERT INTO exercise_images (exercise_id, url, position) VALUES (?, ?, ?)',
        [exerciseId, url, i]
      );
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update exercise.' });
  }
});

app.get('/api/admin/workouts', requireAdminPin, async (req, res) => {
  try {
    const workouts = await all(
      'SELECT id, day_index, title FROM workouts ORDER BY day_index'
    );
    const sections = await all(
      'SELECT id, workout_id, name, position, is_superset FROM sections ORDER BY workout_id, position'
    );
    const items = await all(
      `SELECT wi.workout_id, wi.section_id, wi.group_index, wi.item_index,
              wi.sets, wi.reps, wi.weight, wi.exercise_id, e.name
       FROM workout_items wi
       JOIN exercises e ON e.id = wi.exercise_id
       ORDER BY wi.workout_id, wi.section_id, wi.group_index, wi.item_index`
    );

    const sectionById = new Map();
    sections.forEach((section) => {
      sectionById.set(section.id, {
        id: section.id,
        workoutId: section.workout_id,
        name: section.name,
        position: section.position,
        isSuperset: !!section.is_superset,
        items: [],
      });
    });

    items.forEach((item) => {
      const section = sectionById.get(item.section_id);
      if (!section) return;
      const exercise = {
        exerciseId: item.exercise_id,
        name: item.name,
        sets: item.sets || '',
        reps: item.reps || '',
        weight: item.weight || '',
      };

      if (section.isSuperset) {
        if (!section.items[item.group_index]) {
          section.items[item.group_index] = [];
        }
        section.items[item.group_index].push(exercise);
      } else {
        section.items.push(exercise);
      }
    });

    const workoutsPayload = workouts.map((workout) => {
      const workoutSections = sections
        .filter((section) => section.workout_id === workout.id)
        .map((section) => {
          const sectionEntry = sectionById.get(section.id);
          return {
            name: sectionEntry?.name || section.name,
            position: sectionEntry?.position ?? section.position,
            isSuperset: sectionEntry?.isSuperset ?? !!section.is_superset,
            items: sectionEntry?.items || [],
          };
        });

      return {
        id: workout.id,
        dayIndex: workout.day_index,
        title: workout.title,
        sections: workoutSections,
      };
    });

    res.json({ workouts: workoutsPayload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load workouts.' });
  }
});

app.post('/api/admin/workouts', requireAdminPin, async (req, res) => {
  try {
    const { dayIndex, title, sections = [] } = req.body || {};
    if (dayIndex === undefined || dayIndex === null) {
      return res.status(400).json({ error: 'Day index is required.' });
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    await run('BEGIN TRANSACTION');
    const result = await run(
      'INSERT INTO workouts (day_index, title) VALUES (?, ?)',
      [Number(dayIndex), String(title).trim()]
    );
    const workoutId = result.lastID;
    await insertSections(workoutId, sections);
    await run('COMMIT');
    res.json({ id: workoutId });
  } catch (error) {
    await run('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to create workout.' });
  }
});

app.put('/api/admin/workouts/:id', requireAdminPin, async (req, res) => {
  const workoutId = Number(req.params.id);
  if (!workoutId) {
    return res.status(400).json({ error: 'Invalid workout id.' });
  }

  try {
    const { dayIndex, title, sections = [] } = req.body || {};
    if (dayIndex === undefined || dayIndex === null) {
      return res.status(400).json({ error: 'Day index is required.' });
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    await run('BEGIN TRANSACTION');
    await run('UPDATE workouts SET day_index = ?, title = ? WHERE id = ?', [
      Number(dayIndex),
      String(title).trim(),
      workoutId,
    ]);
    await run('DELETE FROM workout_items WHERE workout_id = ?', [workoutId]);
    await run('DELETE FROM sections WHERE workout_id = ?', [workoutId]);
    await insertSections(workoutId, sections);
    await run('COMMIT');
    res.json({ ok: true });
  } catch (error) {
    await run('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to update workout.' });
  }
});

app.delete('/api/admin/workouts/:id', requireAdminPin, async (req, res) => {
  const workoutId = Number(req.params.id);
  if (!workoutId) {
    return res.status(400).json({ error: 'Invalid workout id.' });
  }

  try {
    await run('BEGIN TRANSACTION');
    await run('DELETE FROM workout_items WHERE workout_id = ?', [workoutId]);
    await run('DELETE FROM sections WHERE workout_id = ?', [workoutId]);
    await run('DELETE FROM workouts WHERE id = ?', [workoutId]);
    await run('COMMIT');
    res.json({ ok: true });
  } catch (error) {
    await run('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to delete workout.' });
  }
});

async function insertSections(workoutId, sections) {
  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    const name = String(section.name || '').trim();
    if (!name) continue;
    const isSuperset = section.isSuperset ? 1 : 0;
    const position = section.position ?? index;
    const sectionResult = await run(
      'INSERT INTO sections (workout_id, name, position, is_superset) VALUES (?, ?, ?, ?)',
      [workoutId, name, position, isSuperset]
    );
    const sectionId = sectionResult.lastID;

    if (isSuperset) {
      const groups = Array.isArray(section.items) ? section.items : [];
      for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
        const group = groups[groupIndex];
        if (!Array.isArray(group)) continue;
        for (let itemIndex = 0; itemIndex < group.length; itemIndex += 1) {
          const item = group[itemIndex];
          const exerciseId = Number(item.exerciseId);
          if (!exerciseId) continue;
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
              item.sets ? String(item.sets) : null,
              item.reps ? String(item.reps) : null,
              item.weight ? String(item.weight) : null,
            ]
          );
        }
      }
    } else {
      const items = Array.isArray(section.items) ? section.items : [];
      for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        const item = items[itemIndex];
        const exerciseId = Number(item.exerciseId);
        if (!exerciseId) continue;
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
            item.sets ? String(item.sets) : null,
            item.reps ? String(item.reps) : null,
            item.weight ? String(item.weight) : null,
          ]
        );
      }
    }
  }
}

app.listen(port, () => {
  console.log(`Workout API server listening on port ${port}`);
});
