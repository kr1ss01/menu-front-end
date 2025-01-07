import * as React from 'react';

// ? Outside Compoenent Click Alert Hook
// * Hook for component to register and make a callback for clicking or tapping outside its limmits.
export default function useOutsideHook(
    ref: any,
    setDisplay: React.Dispatch<React.SetStateAction<boolean>>,
) {
    React.useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                setDisplay(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [ref]);
};