// src/hooks/useModelStatus.ts
import { useState, useEffect } from 'react';
import { initializeModel } from '../services/tfjsService';

/**
 * A custom hook to manage the loading state of the TensorFlow.js model.
 * It ensures the model is initialized once and provides a boolean status.
 * @returns {boolean} `true` if the model is loaded and ready, otherwise `false`.
 */
export const useModelStatus = (): boolean => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // initializeModel now returns the promise, so we can track its completion.
    const promise = initializeModel(); 
    
    // When the promise resolves (i.e., the model is loaded), update our state.
    promise.then(() => {
      setIsReady(true);
    });
  }, []); // The empty array ensures this only runs once on component mount.

  return isReady;
};