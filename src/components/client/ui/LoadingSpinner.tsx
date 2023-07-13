import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center">
            <svg className="animate-spin h-10 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-0" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"
                />
            </svg>
            <span className="text-white">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;