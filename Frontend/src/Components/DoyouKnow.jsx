import React, { useEffect, useState } from 'react';
import jobFacts from './jobFacts.json';
import { Sparkles, Lightbulb, RotateCw } from 'lucide-react';

const DidYouKnowCard = () => {
  const [fact, setFact] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    changeFact();
  }, []);

  const changeFact = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * jobFacts.length);
      setFact(jobFacts[randomIndex].fact);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-0 mt-6">
      <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl rounded-2xl p-6 max-w-md w-full text-center border border-indigo-100 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
        <Sparkles className="absolute top-2 right-2 h-5 w-5 text-yellow-400 opacity-30" />
        <Sparkles className="absolute bottom-2 left-2 h-5 w-5 text-yellow-400 opacity-30" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Did You Know?
          </h2>
          
          <div className={`min-h-[100px] flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <p className="text-gray-700 text-lg font-medium leading-relaxed">
              {fact || 'Loading interesting fact...'}
            </p>
          </div>
          
          <button
            onClick={changeFact}
            disabled={isAnimating}
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto gap-2"
          >
            {isAnimating ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4" />
                <span>Show Another</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DidYouKnowCard;
