import React from 'react';
import { Check, Circle } from 'lucide-react';

const ProgressSteps = ({ step1, step2, step3 }) => {
  const steps = [
    { number: 1, label: 'Login', completed: step1 },
    { number: 2, label: 'Shipping', completed: step2 && step1 },
    { number: 3, label: 'Summary', completed: step3 && step2 && step1 }
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step.completed 
                ? 'border-green-500 bg-green-500 text-white' 
                : 'border-gray-300 text-gray-300'
            }`}>
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>
            <span className={`mt-2 text-sm font-medium ${
              step.completed ? 'text-green-500' : 'text-gray-300'
            }`}>
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`h-0.5 w-24 mx-4 ${
              steps[index + 1].completed ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;
