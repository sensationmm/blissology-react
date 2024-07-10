import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react';

import UnsavedWarning from 'src/components/UnsavedWarning';

export interface UnsavedOptions {
  title: string;
  subtitle: string;
  confirmButton: string;
  cancelButton: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export type Nullable<T> = T | null;

export interface Unsaved {
  show: (options: Nullable<UnsavedOptions>) => void;
}

export const UnsavedContext = createContext<Nullable<Unsaved>>(null);

interface Props {
  children: ReactNode;
}

export function UnsavedProvider({ children }: Props) {
  const [unsaved, setUnsaved] = useState<Nullable<UnsavedOptions>>(null);

  const [open, toggle] = useState(false);

  const show = useCallback(
    (unsavedOptions: Nullable<UnsavedOptions>) => {
      setUnsaved(unsavedOptions);
      toggle(true);
    },
    [toggle]
  );

  const onProceed = () => {
    unsaved?.onConfirm?.();
    toggle(false);
  };

  const onCancel = () => {
    unsaved?.onCancel?.();
    toggle(false);
  };

  const value = useMemo(() => ({ show }), [show]);

  return (
    <UnsavedContext.Provider value={value}>
      <UnsavedWarning
        title={unsaved?.title as string}
        subtitle={unsaved?.subtitle as string}
        confirmButton={unsaved?.confirmButton as string}
        cancelButton={unsaved?.cancelButton as string}
        isUnsaved={open}
        onCancel={onCancel}
        onProceed={onProceed}
      />
      {children}
    </UnsavedContext.Provider>
  );
}
