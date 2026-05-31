import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resumeService';

/**
 * useAutosave
 * - Watches changes to resumeData and pushes them automatically to the server
 * - Implements a 1500ms debounce buffer
 * - Validates required fields and email formats before starting the push timer
 * - Guards against race conditions and concurrent requests via locking refs
 */
export default function useAutosave({
  resumeData,
  resumeId,
  isDirty,
  isValid,
  onSaveSuccess,
}) {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const isSaving = useRef(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // 1. Guard: Check if the user has actually edited anything (prevents mount-saves)
    if (!isDirty.current) return;

    // 2. Guard: If validation fails, halt saving loop and mark status as Unsaved Changes
    if (!isValid) {
      setSaveStatus('unsaved');
      return;
    }

    // 3. Mark state as Unsaved Changes since user made changes and validation passed
    setSaveStatus('unsaved');

    // 4. Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 5. Initialize the debounce timeout
    debounceTimerRef.current = setTimeout(async () => {
      // 6. Concurrency Guard: Block concurrent requests from overlapping
      if (isSaving.current) {
        console.warn('[useAutosave] Overlapping request detected. Skipping save event.');
        return;
      }

      isSaving.current = true;
      setSaveStatus('saving');

      try {
        let response;
        if (!resumeId) {
          // ── Create Mode ──
          response = await resumeService.createResume(resumeData);
          if (response.data?.success) {
            const newId = response.data.data.id;
            isDirty.current = false; // Reset dirty ref since we saved
            setSaveStatus('saved');
            toast.success('Resume created and saved! 💾');
            if (onSaveSuccess) onSaveSuccess(newId);
          } else {
            setSaveStatus('unsaved');
            toast.error(response.data?.message || 'Failed to create resume.');
          }
        } else {
          // ── Edit Mode ──
          response = await resumeService.updateResume(resumeId, resumeData);
          if (response.data?.success) {
            isDirty.current = false; // Reset dirty ref since we saved
            setSaveStatus('saved');
          } else {
            setSaveStatus('unsaved');
            toast.error(response.data?.message || 'Failed to autosave changes.');
          }
        }
      } catch (error) {
        console.error('[useAutosave]', error);
        setSaveStatus('unsaved');
        toast.error(error.response?.data?.message || 'Connection error during autosave.');
      } finally {
        isSaving.current = false;
      }
    }, 1500);

    // Cleanup timeout on changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [resumeData, resumeId, isValid, onSaveSuccess, isDirty]);

  return { saveStatus, setSaveStatus };
}
