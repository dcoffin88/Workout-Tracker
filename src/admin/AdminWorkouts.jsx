import React, { useEffect, useMemo, useState } from 'react';
import { adminFetch } from './adminApi';

const emptyWorkout = {
  id: null,
  dayIndex: 0,
  title: '',
  sections: [],
};

const emptyItem = () => ({
  exerciseId: '',
});

export default function AdminWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const loadWorkouts = async () => {
    const data = await adminFetch('/api/admin/workouts');
    setWorkouts(data.workouts || []);
    return data.workouts || [];
  };

  const loadExercises = async () => {
    const data = await adminFetch('/api/admin/exercises');
    setExercises(data.exercises || []);
  };

  useEffect(() => {
    Promise.all([loadWorkouts(), loadExercises()]).catch((error) => {
      console.error(error);
      setStatus('Failed to load workouts.');
    });
  }, []);

  const filteredWorkouts = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return workouts;
    return workouts.filter((workout) =>
      `${workout.dayIndex} ${workout.title}`.toLowerCase().includes(term)
    );
  }, [workouts, filter]);

  const selectWorkout = (workout) => {
    setSelectedId(workout.id);
    setDraft(JSON.parse(JSON.stringify(workout)));
  };

  const handleNew = () => {
    setSelectedId('new');
    setDraft({ ...emptyWorkout });
  };

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateSection = (index, updates) => {
    setDraft((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], ...updates };
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    setDraft((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { name: 'New Section', position: prev.sections.length, isSuperset: false, items: [] },
      ],
    }));
  };

  const removeSection = (index) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const toggleSuperset = (index) => {
    setDraft((prev) => {
      const sections = [...prev.sections];
      const current = sections[index];
      if (!current) return prev;
      const isSuperset = !current.isSuperset;
      let items = current.items || [];
      if (isSuperset && !Array.isArray(items[0])) {
        items = items.length ? [items] : [[]];
      }
      if (!isSuperset && Array.isArray(items[0])) {
        items = items.flat();
      }
      sections[index] = { ...current, isSuperset, items };
      return { ...prev, sections };
    });
  };

  const addItem = (sectionIndex, groupIndex = null) => {
    setDraft((prev) => {
      const sections = [...prev.sections];
      const section = sections[sectionIndex];
      if (!section) return prev;
      if (section.isSuperset) {
        const groups = Array.isArray(section.items) ? [...section.items] : [[]];
        const targetIndex = groupIndex ?? 0;
        if (!groups[targetIndex]) groups[targetIndex] = [];
        groups[targetIndex] = [...groups[targetIndex], emptyItem()];
        sections[sectionIndex] = { ...section, items: groups };
      } else {
        const items = Array.isArray(section.items) ? [...section.items] : [];
        items.push(emptyItem());
        sections[sectionIndex] = { ...section, items };
      }
      return { ...prev, sections };
    });
  };

  const addGroup = (sectionIndex) => {
    setDraft((prev) => {
      const sections = [...prev.sections];
      const section = sections[sectionIndex];
      if (!section) return prev;
      const groups = Array.isArray(section.items) ? [...section.items] : [];
      groups.push([emptyItem()]);
      sections[sectionIndex] = { ...section, items: groups };
      return { ...prev, sections };
    });
  };

  const removeGroup = (sectionIndex, groupIndex) => {
    setDraft((prev) => {
      const sections = [...prev.sections];
      const section = sections[sectionIndex];
      if (!section) return prev;
      const groups = Array.isArray(section.items) ? [...section.items] : [];
      groups.splice(groupIndex, 1);
      sections[sectionIndex] = { ...section, items: groups };
      return { ...prev, sections };
    });
  };

  const updateItem = (sectionIndex, itemIndex, updates, groupIndex = null) => {
    setDraft((prev) => {
      const sections = [...prev.sections];
      const section = sections[sectionIndex];
      if (!section) return prev;
      if (section.isSuperset) {
        const groups = Array.isArray(section.items) ? [...section.items] : [];
        const group = [...(groups[groupIndex] || [])];
        group[itemIndex] = { ...group[itemIndex], ...updates };
        groups[groupIndex] = group;
        sections[sectionIndex] = { ...section, items: groups };
      } else {
        const items = Array.isArray(section.items) ? [...section.items] : [];
        items[itemIndex] = { ...items[itemIndex], ...updates };
        sections[sectionIndex] = { ...section, items };
      }
      return { ...prev, sections };
    });
  };

  const removeItem = (sectionIndex, itemIndex, groupIndex = null) => {
    setDraft((prev) => {
      const sections = [...prev.sections];
      const section = sections[sectionIndex];
      if (!section) return prev;
      if (section.isSuperset) {
        const groups = Array.isArray(section.items) ? [...section.items] : [];
        const group = [...(groups[groupIndex] || [])];
        group.splice(itemIndex, 1);
        groups[groupIndex] = group;
        sections[sectionIndex] = { ...section, items: groups };
      } else {
        const items = Array.isArray(section.items) ? [...section.items] : [];
        items.splice(itemIndex, 1);
        sections[sectionIndex] = { ...section, items };
      }
      return { ...prev, sections };
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setStatus('');

    const payload = {
      dayIndex: Number(draft.dayIndex),
      title: draft.title.trim(),
      sections: draft.sections.map((section, index) => {
        const items = section.isSuperset
          ? (Array.isArray(section.items) ? section.items : []).map((group) =>
              (Array.isArray(group) ? group : []).map((item) => ({
                exerciseId: item.exerciseId,
              }))
            )
          : (Array.isArray(section.items) ? section.items : []).map((item) => ({
              exerciseId: item.exerciseId,
            }));
        return {
          name: section.name,
          position: index,
          isSuperset: !!section.isSuperset,
          items,
        };
      }),
    };

    try {
      let targetId = draft.id;
      if (draft.id) {
        await adminFetch(`/api/admin/workouts/${draft.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        const response = await adminFetch('/api/admin/workouts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        targetId = response.id;
        setSelectedId(response.id);
      }
      const updated = await loadWorkouts();
      const next = updated.find((workout) => workout.id === targetId);
      if (next) {
        selectWorkout(next);
      }
      setStatus('Saved.');
    } catch (error) {
      console.error(error);
      setStatus('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draft?.id) return;
    const confirmed = window.confirm('Delete this workout?');
    if (!confirmed) return;
    try {
      await adminFetch(`/api/admin/workouts/${draft.id}`, { method: 'DELETE' });
      setDraft(null);
      setSelectedId(null);
      await loadWorkouts();
    } catch (error) {
      console.error(error);
      setStatus('Delete failed.');
    }
  };

  useEffect(() => {
    if (!selectedId && workouts.length > 0) {
      selectWorkout(workouts[0]);
    }
  }, [workouts, selectedId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      <div className="bg-slate-800 dark:bg-white rounded-2xl p-4 border border-slate-700 dark:border-gray-200">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-lg font-bold">Workouts</h3>
          <button
            onClick={handleNew}
            className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm font-bold"
          >
            Add
          </button>
        </div>
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Search..."
          className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300 text-sm"
        />
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredWorkouts.map((workout) => (
            <button
              key={workout.id}
              onClick={() => selectWorkout(workout)}
              className={[
                'w-full text-left px-3 py-2 rounded-lg border',
                selectedId === workout.id
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 dark:bg-gray-100 border-slate-700 dark:border-gray-200',
              ].join(' ')}
            >
              <div className="text-xs text-slate-300 dark:text-gray-500">
                Day {workout.dayIndex}
              </div>
              <div className="font-bold">{workout.title}</div>
            </button>
          ))}
          {filteredWorkouts.length === 0 && (
            <p className="text-sm text-slate-400">No matches.</p>
          )}
        </div>
      </div>

      <div className="bg-slate-800 dark:bg-white rounded-2xl p-6 border border-slate-700 dark:border-gray-200">
        {draft ? (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-[120px_1fr] gap-4">
              <div>
                <label className="text-sm font-bold">Day Index</label>
                <input
                  type="number"
                  value={draft.dayIndex}
                  onChange={(event) => updateDraft('dayIndex', event.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-bold">Title</label>
                <input
                  value={draft.title}
                  onChange={(event) => updateDraft('title', event.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Sections</h3>
              <button
                onClick={addSection}
                className="px-3 py-1 rounded-lg bg-slate-700 dark:bg-gray-200 text-white dark:text-gray-900 text-sm"
              >
                Add Section
              </button>
            </div>

            <div className="space-y-6">
              {draft.sections.map((section, sectionIndex) => (
                <div
                  key={`section-${sectionIndex}`}
                  className="border border-slate-700 dark:border-gray-200 rounded-xl p-4"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <input
                      value={section.name}
                      onChange={(event) =>
                        updateSection(sectionIndex, { name: event.target.value })
                      }
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                      placeholder="Section name"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={section.isSuperset}
                        onChange={() => toggleSuperset(sectionIndex)}
                      />
                      Superset
                    </label>
                    <button
                      onClick={() => removeSection(sectionIndex)}
                      className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  {!section.isSuperset && (
                    <div className="space-y-3">
                      {(Array.isArray(section.items) ? section.items : []).map((item, itemIndex) => (
                        <div
                          key={`item-${sectionIndex}-${itemIndex}`}
                          className="grid md:grid-cols-[2fr_auto] gap-2"
                        >
                          <select
                            value={item.exerciseId}
                            onChange={(event) =>
                              updateItem(sectionIndex, itemIndex, {
                                exerciseId: event.target.value,
                              })
                            }
                            className="px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                          >
                            <option value="">Select exercise</option>
                            {exercises.map((exercise) => (
                              <option key={exercise.id} value={exercise.id}>
                                {exercise.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeItem(sectionIndex, itemIndex)}
                            className="px-3 py-2 rounded-lg bg-red-500 text-white"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addItem(sectionIndex)}
                        className="px-3 py-2 rounded-lg bg-slate-700 dark:bg-gray-200 text-white dark:text-gray-900 text-sm"
                      >
                        Add Exercise
                      </button>
                    </div>
                  )}

                  {section.isSuperset && (
                    <div className="space-y-4">
                      {(Array.isArray(section.items) ? section.items : []).map((group, groupIndex) => (
                        <div key={`group-${sectionIndex}-${groupIndex}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold">
                              Group {groupIndex + 1}
                            </h4>
                            <button
                              onClick={() => removeGroup(sectionIndex, groupIndex)}
                              className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
                            >
                              Remove Group
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(Array.isArray(group) ? group : []).map((item, itemIndex) => (
                              <div
                                key={`group-item-${sectionIndex}-${groupIndex}-${itemIndex}`}
                                className="grid md:grid-cols-[2fr_auto] gap-2"
                              >
                                <select
                                  value={item.exerciseId}
                                  onChange={(event) =>
                                    updateItem(sectionIndex, itemIndex, {
                                      exerciseId: event.target.value,
                                    }, groupIndex)
                                  }
                                  className="px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                                >
                                  <option value="">Select exercise</option>
                                  {exercises.map((exercise) => (
                                    <option key={exercise.id} value={exercise.id}>
                                      {exercise.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() =>
                                    removeItem(sectionIndex, itemIndex, groupIndex)
                                  }
                                  className="px-3 py-2 rounded-lg bg-red-500 text-white"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => addItem(sectionIndex, groupIndex)}
                            className="mt-2 px-3 py-2 rounded-lg bg-slate-700 dark:bg-gray-200 text-white dark:text-gray-900 text-sm"
                          >
                            Add Exercise
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addGroup(sectionIndex)}
                        className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                      >
                        Add Superset Group
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Workout'}
              </button>
              {draft.id && (
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-lg bg-red-500 text-white font-bold"
                >
                  Delete Workout
                </button>
              )}
              {status && <span className="text-sm text-slate-400">{status}</span>}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Select a workout to edit.</p>
        )}
      </div>
    </div>
  );
}
