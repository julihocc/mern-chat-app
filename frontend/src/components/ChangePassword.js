import React, { useState } from 'react';
import { useChangePassword } from '../hooks/mutations/useChangePassword';

export const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {changePassword} = useChangePassword();

    const handlePasswordChange = async () => {
        try {
            if (newPassword !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            await changePassword({ variables: { oldPassword: currentPassword, newPassword } });
        } catch (error) {
            throw new Error(`Could not change password: ${error.message}`)
        }
    };

    return (
        <div>
            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Change Password</button>
        </div>
    );
};
