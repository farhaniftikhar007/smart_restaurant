import React, { useState, useEffect } from 'react';

const LiveOrderTimer: React.FC<{ createdAt: string; status?: string }> = ({ createdAt, status = 'pending' }) => {
    const [timeAgo, setTimeAgo] = useState('');
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const date = new Date(createdAt);
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

            // Elapsed Time Logic
            if (diffInSeconds < 60) {
                setTimeAgo(`${diffInSeconds}s ago`);
            } else {
                const minutes = Math.floor(diffInSeconds / 60);
                if (minutes < 60) {
                    setTimeAgo(`${minutes} mins ago`);
                } else {
                    const hours = Math.floor(minutes / 60);
                    if (hours < 24) {
                        setTimeAgo(`${hours} hours ago`);
                    } else {
                        setTimeAgo(date.toLocaleString());
                    }
                }
            }

            // Dynamic Total Time based on Status
            let totalDurationSeconds = 30 * 60; // Default 30 mins for pending

            if (status === 'confirmed') {
                totalDurationSeconds = 20 * 60; // 20 mins
            } else if (status === 'preparing') {
                totalDurationSeconds = 10 * 60; // 10 mins (Cooking)
            } else if (status === 'ready' || status === 'delivered') {
                totalDurationSeconds = 0;
            }

            const remainingSeconds = totalDurationSeconds - diffInSeconds;

            if (remainingSeconds > 0) {
                const mins = Math.floor(remainingSeconds / 60);
                const secs = remainingSeconds % 60;
                setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
            } else {
                setTimeLeft('Soon');
            }
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId);
    }, [createdAt]);

    // Status-based logic
    if (status === 'delivered') {
        return (
            <div className="flex flex-col items-end">
                <span className="text-gray-600 text-sm">Placed: {timeAgo}</span>
                <span className="font-bold text-green-600">🎉 Enjoy your meal!</span>
            </div>
        );
    }

    if (status === 'cancelled') {
        return (
            <div className="flex flex-col items-end">
                <span className="text-gray-600 text-sm">Placed: {timeAgo}</span>
                <span className="font-bold text-red-600">❌ Order Cancelled</span>
            </div>
        );
    }

    if (status === 'ready') {
        return (
            <div className="flex flex-col items-end">
                <span className="text-gray-600 text-sm">Placed: {timeAgo}</span>
                <span className="font-bold text-green-600 animate-pulse">🍽️ Order Ready!</span>
            </div>
        );
    }

    // Pending, Confirmed, Preparing
    let label = '⏳ Estimating...';
    if (status === 'preparing') label = '👨‍🍳 Cooking...';
    else if (status === 'confirmed') label = '✅ Preparing Soon...';
    else label = '⏳ Ready in:';

    return (
        <div className="flex flex-col items-end">
            <span className="text-gray-600 text-sm">Placed: {timeAgo}</span>
            {timeLeft ? (
                <span className="font-bold text-orange-600">
                    {label} {timeLeft}
                </span>
            ) : (
                <span className="font-bold text-orange-600">Arriving Soon...</span>
            )}
        </div>
    );
};

export default LiveOrderTimer;
