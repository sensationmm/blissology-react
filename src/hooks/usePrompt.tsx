import { useCallback, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

import { ConfirmOptions } from 'src/providers/ConfirmProvider';

import { useConfirm } from './confim';

// import { useConfirm } from '../utils/confirm/confirm.hooks';
// import { ConfirmOptions } from '../utils/confirm/confirm.types';

export const usePrompt = ({
  isDirty = false,
  title = 'You have unsaved changes!',
  subtitle = 'Are you sure you want to leave?',
  confirmText = 'Leave',
  cancelText = 'Stay',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmOptions & { isDirty?: boolean }) => {
  const blocker = useBlocker(isDirty);

  const { show } = useConfirm();

  const confirm = useCallback(() => {
    if (!isDirty) return Promise.resolve(true);

    return new Promise<boolean>((resolve) => {
      show({
        cancelText,
        confirmText,
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
  }, [cancelText, confirmText, isDirty, onCancel, onConfirm, show, subtitle, title, type]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      confirm().then((result) => {
        if (result) blocker.proceed();
        else blocker.reset();
      });
    }
  }, [blocker, confirm]);

  useEffect(() => {
    if (isDirty) {
      window.onbeforeunload = () => subtitle;
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [isDirty, subtitle]);

  return {
    confirm
  };
};
