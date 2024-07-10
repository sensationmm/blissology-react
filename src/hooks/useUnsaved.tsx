import { useCallback, useContext, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

import { UnsavedContext, UnsavedOptions } from 'src/providers/UnsavedProvider';

export const useUnsaved = ({
  isUnsaved = false,
  title = 'You have unsaved changes',
  subtitle = 'These changes will be lost if you proceed',
  confirmButton = 'Discard changes and proceed',
  cancelButton = 'Go back',
  onConfirm,
  onCancel,
  type = 'warning'
}: Partial<UnsavedOptions> & { isUnsaved?: boolean }) => {
  const blocker = useBlocker(isUnsaved);

  const unsavedContext = useContext(UnsavedContext);

  const unsaved = useCallback(() => {
    if (!isUnsaved) return Promise.resolve(true);

    return new Promise<boolean>((resolve) => {
      unsavedContext?.show({
        cancelButton,
        confirmButton,
        onCancel: () => {
          resolve(false);
          onCancel?.();
        },
        onConfirm: () => {
          resolve(true);
          onConfirm?.();
        },
        subtitle,
        title,
        type
      });
    });
  }, [cancelButton, confirmButton, isUnsaved, onCancel, onConfirm, unsavedContext?.show, subtitle, title, type]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      unsaved().then((result) => {
        if (result) blocker.proceed();
        else blocker.reset();
      });
    }
  }, [blocker, unsaved]);

  useEffect(() => {
    if (isUnsaved) {
      window.onbeforeunload = () => subtitle;
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [isUnsaved, subtitle]);

  return {
    unsaved
  };
};
