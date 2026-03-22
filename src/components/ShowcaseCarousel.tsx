import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import DynamicSlide from './DynamicSlide';
import DarkModeToggle from './DarkModeToggle';

const ShowcaseCarousel: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const handleNext = useCallback(() => {
    if (projects.length === 0) return;
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const handlePrevious = useCallback(() => {
    if (projects.length === 0) return;
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === ' ') {
      e.preventDefault();
      setIsAutoPlay(prev => !prev);
    }
  }, [handleNext, handlePrevious]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || projects.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, handleNext, projects.length]);

  const slideVariants = {
    enter: (direction: 'next' | 'prev') => ({
      x: direction === 'next' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'next' | 'prev') => ({
      x: direction === 'next' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">No projects found.</div>
      </div>
    );
  }

  const currentProject = projects[currentIndex];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Navigation Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`p-3 rounded-full backdrop-blur-sm border transition-colors ${
            isAutoPlay 
              ? 'bg-primary text-white border-primary' 
              : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
          }`}
          aria-label={isAutoPlay ? 'Pause auto-play' : 'Start auto-play'}
        >
          {isAutoPlay ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        <button
          onClick={handlePrevious}
          className="p-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <DarkModeToggle />
      </div>

      {/* Progress Indicators */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 'next' : 'prev');
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-primary/30 hover:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="fixed top-4 left-4 z-50">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {currentIndex + 1} / {projects.length}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          {projects[currentIndex].title}
        </div>
        {isAutoPlay && (
          <motion.div 
            className="text-xs text-primary mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Auto-playing
          </motion.div>
        )}
      </div>

      {/* Main Slide Container */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <DynamicSlide 
              project={currentProject}
              onNext={handleNext}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Touch/Swipe Support */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div
          className="absolute left-0 top-0 h-full w-1/4 pointer-events-auto"
          onClick={handlePrevious}
        />
        <div
          className="absolute right-0 top-0 h-full w-1/4 pointer-events-auto"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default ShowcaseCarousel;
