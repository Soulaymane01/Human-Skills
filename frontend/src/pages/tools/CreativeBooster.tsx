import React, { useState, useEffect } from 'react';

const CreativityBooster = () => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(2 * 60); // Initial 2-minute timer
  const [exampleTimeout, setExampleTimeout] = useState<NodeJS.Timeout | null>(null);
  const [thinkingTimeComplete, setThinkingTimeComplete] = useState(false);

  const exercises = [
    {
      title: "Random Word Association",
      description: "Pick a random word and try to associate it with your current problem or project. How can the word's properties or connotations inspire new ideas?",
      prompt: "Choose a random word from a dictionary or generator. What unexpected connections can you make?",
      example: "If the random word is 'bicycle,' you might associate it with movement, balance, or transportation. This could inspire new ideas for a project about logistics or even personal well-being.",
    },
    {
      title: "SCAMPER Technique",
      description: "SCAMPER is a checklist that helps you think of changes you can make to an existing product or service to create a new one.",
      prompt: "Consider a common object. Apply the SCAMPER technique: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse.",
      example: "For a smartphone: Substitute the glass screen with a flexible material; Combine it with a projector; Adapt it for underwater use; Modify its size to be smaller; Put it to use as a medical diagnostic tool; Eliminate physical buttons; Reverse its charging mechanism to be wireless only.",
    },
    {
      title: "Six Thinking Hats",
      description: "A parallel thinking process that helps you look at a problem from different perspectives (emotional, logical, optimistic, etc.).",
      prompt: "Define a problem. Then, analyze it using each of the Six Thinking Hats (White, Red, Black, Yellow, Green, Blue).",
      example: "Problem: Declining website traffic. White Hat (facts): Traffic is down 20% in the last month. Red Hat (feelings): We're frustrated and concerned. Black Hat (cautions): Our SEO efforts may be failing. Yellow Hat (benefits): We can explore new marketing channels. Green Hat (creativity): Let's try interactive content. Blue Hat (process): Let's analyze the data, brainstorm, and implement solutions.",
    },
    {
      title: "Brainwriting",
      description: "Generate ideas silently in writing, then exchange your paper with others to build upon their ideas.",
      prompt: "Start with a central topic. Write down three ideas in 5 minutes. Pass your paper to someone else and build on their ideas.",
      example: "Topic: Improving customer service. Idea 1: Implement a live chat feature. Idea 2: Create a detailed FAQ section. Idea 3: Offer personalized onboarding calls. (After exchanging) Idea 4: Use AI to predict customer needs based on browsing history.",
    },
    {
      title: "Forced Connections",
      description: "Combine two seemingly unrelated ideas or concepts to create something new.",
      prompt: "Pick two unrelated images or articles. How can you combine them into a novel concept or product?",
      example: "Combining a bicycle and a library could lead to the concept of a mobile library on wheels, bringing books to remote areas or events.",
    },
  ];

  const nextExercise = () => {
    clearTimeout(exampleTimeout as NodeJS.Timeout);
    setShowExample(false);
    setTimeRemaining(2 * 60); // Reset to 2 minutes
    setThinkingTimeComplete(false);
    setExerciseIndex((prevIndex) => (prevIndex + 1) % exercises.length);
    startTimer();
  };

  const previousExercise = () => {
    clearTimeout(exampleTimeout as NodeJS.Timeout);
    setShowExample(false);
    setTimeRemaining(2 * 60); // Reset to 2 minutes
    setThinkingTimeComplete(false);
    setExerciseIndex((prevIndex) => (prevIndex - 1 + exercises.length) % exercises.length);
    startTimer();
  };

  const revealExample = () => {
    setShowExample(true);
    clearTimeout(exampleTimeout as NodeJS.Timeout);
    setTimeRemaining(120); // 2 minutes for example display, if needed, reset this to 0 if example should show indefinitely
    if(setTimeRemaining !== 0){
        startExampleTimer();
    }

  };

  const startTimer = () => {
    setThinkingTimeComplete(false);
    if(exampleTimeout) {
        clearTimeout(exampleTimeout);
    }
    const newTimeout = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearTimeout(exampleTimeout as NodeJS.Timeout);
          setThinkingTimeComplete(true);
          return 0;
        }
      });
    }, 1000);
    setExampleTimeout(newTimeout);
  };
    const startExampleTimer = () => {
        if(exampleTimeout) {
            clearTimeout(exampleTimeout);
        }
        const newTimeout = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearTimeout(exampleTimeout as NodeJS.Timeout);
                    setShowExample(false); //Hide Example if time is up
                    return 0;
                }
            });
        }, 1000);
        setExampleTimeout(newTimeout);
    };

  const currentExercise = exercises[exerciseIndex];
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    useEffect(() => {
        if (timeRemaining === 0 && showExample) {
            setShowExample(false); // Hide the example if time runs out
            clearTimeout(exampleTimeout as NodeJS.Timeout); // Clear the timeout
        }
    }, [timeRemaining, showExample]);

  useEffect(() => {
    startTimer(); // Start the initial timer on component mount

    return () => {
      if (exampleTimeout) {
        clearTimeout(exampleTimeout);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full justify-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Creativity Booster</h2>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">{currentExercise.title}</h3>
        <p className="text-gray-600 mb-2">{currentExercise.description}</p>
        <p className="text-blue-500 italic">{currentExercise.prompt}</p>
        <p className="text-sm text-gray-500">Time remaining to think: {formattedTime}</p>

        {showExample && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700">Example:</h4>
            <p className="text-gray-600">{currentExercise.example}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-auto">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mb-2 md:mb-0"
          onClick={previousExercise}
        >
          Previous
        </button>
        <button
          className={`bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mb-2 md:mb-0 ${
            !thinkingTimeComplete ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={revealExample}
          disabled={!thinkingTimeComplete}
        >
          Reveal Example
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          onClick={nextExercise}
        >
          Next Exercise
        </button>
      </div>
    </div>
  );
};

export default CreativityBooster;