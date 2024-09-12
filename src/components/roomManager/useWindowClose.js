import { useEffect } from 'react';

export const useWindowClose = (handleLeave) => {
  useEffect(() => {
    const handleWindowClose = async (e) => {
      await handleLeave();
      e.preventDefault();
      e.returnValue = ''; // Prevent window from closing without confirmation
    };

    window.addEventListener('beforeunload', handleWindowClose);
    return () => window.removeEventListener('beforeunload', handleWindowClose);
  }, [handleLeave]);
};