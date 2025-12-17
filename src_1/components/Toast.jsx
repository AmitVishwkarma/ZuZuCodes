import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { toastStore } from '../utils';

function Toast() {
    const { message, type, open, hide } = toastStore();

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={hide}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={hide} severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default Toast;