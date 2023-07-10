import { CheckCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

type RsvpSuccessfulProps = {
    
};

const RsvpSuccessful:React.FC<RsvpSuccessfulProps> = () => {
    
    return (
        <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-xl font-medium text-green-800">RSVP Successful</h3>
          <div className="mt-2 text-md text-green-700">
            <p>See you on August 04, 2023! Please read the details below.</p>
          </div>
        </div>
      </div>
    </div>
    )
}
export default RsvpSuccessful;