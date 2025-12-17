import { toast } from 'react-toastify';
import { create } from 'zustand';

export const handleSuccess = (message) => {
    toast.success(message, {
        position: 'top-right',
    });
};

export const handleError = (message) => {
    toast.error(message, {
        position: 'top-right',
    });
};

export const toastStore = create((set) => ({
    message: '',
    type: 'success',
    open: false,
    show: (message, type = 'success') => set({ message, type, open: true }),
    hide: () => set({ open: false }),
}));
