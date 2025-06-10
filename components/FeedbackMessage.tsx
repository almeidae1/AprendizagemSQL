
import React from 'react';
import { Feedback } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import SparklesIcon from './icons/SparklesIcon'; // Import SparklesIcon
// import InformationCircleIcon from './icons/InformationCircleIcon'; // If you add one

interface FeedbackMessageProps {
  feedback: Feedback | null;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ feedback }) => {
  if (!feedback || !feedback.type) {
    return null;
  }

  const baseClasses = "p-4 rounded-md shadow-md my-4 flex items-start space-x-3"; // items-start for better title/message layout
  let specificClasses = "";
  let IconComponent = null;
  let titleElement = feedback.title ? <h3 className="text-lg font-semibold mb-1">{feedback.title}</h3> : null;


  switch (feedback.type) {
    case 'success':
      specificClasses = "bg-green-100 dark:bg-green-900/70 text-green-800 dark:text-green-200 border border-green-400 dark:border-green-600";
      IconComponent = (
        <div className="sparkle-animate"> {/* Wrapper for animation */}
            <SparklesIcon className="w-7 h-7 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
        </div>
      );
      break;
    case 'error':
      specificClasses = "bg-red-100 dark:bg-red-900/70 text-red-800 dark:text-red-200 border border-red-400 dark:border-red-600";
      IconComponent = <XCircleIcon className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />;
      break;
    case 'info':
      specificClasses = "bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 border border-blue-400 dark:border-blue-600";
      // IconComponent = <InformationCircleIcon className="w-6 h-6 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />;
      // For info, we might not always need an icon, or use a generic one
      IconComponent = <CheckCircleIcon className="w-6 h-6 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" /> // Placeholder, replace if you have InfoIcon
      break;
  }

  return (
    <div className={`${baseClasses} ${specificClasses}`} role="alert">
      {IconComponent}
      <div className="flex-grow">
        {titleElement}
        <span className="text-sm">{feedback.message}</span>
      </div>
    </div>
  );
};

export default FeedbackMessage;
