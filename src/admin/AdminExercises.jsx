import React, { useEffect, useMemo, useState } from 'react';
import { adminFetch } from './adminApi';

const emptyExercise = {
  id: null,
  name: '',
  descriptionText: '',
  defaultSets: '',
  defaultReps: '',
  defaultWeight: '',
  images: [''],
};

export default function AdminExercises() {
  const [exercises, setExercises] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const loadExercises = async () => {
    setStatus('');
    const data = await adminFetch('/api/admin/exercises');
    setExercises(data.exercises || []);
    return data.exercises || [];
  };

  useEffect(() => {
    loadExercises().catch((error) => {
      console.error(error);
      setStatus('Failed to load exercises.');
    });
  }, []);

  const filteredExercises = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return exercises;
    return exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(term)
    );
  }, [exercises, filter]);

  const selectExercise = (exercise) => {
    setSelectedId(exercise.id);
    const clone = JSON.parse(JSON.stringify(exercise));
    if (!clone.images || clone.images.length === 0) {
      clone.images = [''];
    }
    setDraft(clone);
  };

  const handleNew = () => {
    setSelectedId('new');
    setDraft({ ...emptyExercise });
  };

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateImage = (index, value) => {
    setDraft((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const addImage = () => {
    setDraft((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImage = (index) => {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setStatus('');

    const payload = {
      name: draft.name.trim(),
      descriptionText: draft.descriptionText,
      defaultSets: draft.defaultSets,
      defaultReps: draft.defaultReps,
      defaultWeight: draft.defaultWeight,
      images: draft.images.map((img) => img.trim()).filter(Boolean),
    };

    try {
      let targetId = draft.id;
      if (draft.id) {
        await adminFetch(`/api/admin/exercises/${draft.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        const response = await adminFetch('/api/admin/exercises', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        targetId = response.id;
        setSelectedId(response.id);
      }
      const updated = await loadExercises();
      const next = updated.find((exercise) => exercise.id === targetId);
      if (next) {
        selectExercise(next);
      }
      setStatus('Saved.');
    } catch (error) {
      console.error(error);
      setStatus('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedId && exercises.length > 0) {
      selectExercise(exercises[0]);
    }
  }, [exercises, selectedId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      <div className="bg-slate-800 dark:bg-white rounded-2xl p-4 border border-slate-700 dark:border-gray-200">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-lg font-bold">Exercises</h3>
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
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => selectExercise(exercise)}
              className={[
                'w-full text-left px-3 py-2 rounded-lg border',
                selectedId === exercise.id
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 dark:bg-gray-100 border-slate-700 dark:border-gray-200',
              ].join(' ')}
            >
              {exercise.name}
            </button>
          ))}
          {filteredExercises.length === 0 && (
            <p className="text-sm text-slate-400">No matches.</p>
          )}
        </div>
      </div>

      <div className="bg-slate-800 dark:bg-white rounded-2xl p-6 border border-slate-700 dark:border-gray-200">
        {draft ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold">Name</label>
              <input
                value={draft.name}
                onChange={(event) => updateDraft('name', event.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-bold">Description</label>
              <textarea
                value={draft.descriptionText}
                onChange={(event) =>
                  updateDraft('descriptionText', event.target.value)
                }
                rows={4}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-bold">Default Sets</label>
                <input
                  value={draft.defaultSets}
                  onChange={(event) =>
                    updateDraft('defaultSets', event.target.value)
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-bold">Default Reps</label>
                <input
                  value={draft.defaultReps}
                  onChange={(event) =>
                    updateDraft('defaultReps', event.target.value)
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-bold">Default Weight</label>
                <input
                  value={draft.defaultWeight}
                  onChange={(event) =>
                    updateDraft('defaultWeight', event.target.value)
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">Images</label>
                <button
                  onClick={addImage}
                  className="px-3 py-1 rounded-lg bg-slate-700 dark:bg-gray-200 text-white dark:text-gray-900 text-sm"
                >
                  Add Image
                </button>
              </div>
              <div className="space-y-2 mt-2">
                {draft.images.map((image, index) => (
                  <div key={`image-${index}`} className="flex gap-2">
                    <input
                      value={image}
                      onChange={(event) => updateImage(index, event.target.value)}
                      placeholder="Image URL"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-gray-100 border border-slate-700 dark:border-gray-300"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="px-3 py-2 rounded-lg bg-red-500 text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Exercise'}
              </button>
              {status && <span className="text-sm text-slate-400">{status}</span>}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Select an exercise to edit.</p>
        )}
      </div>
    </div>
  );
}
