import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';

const LoadingSussFully = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl relative overflow-hidden"
          >
            {isLoading === 'loading' ? (
              <FiLoader className="animate-spin text-white/50 text-[100px] mx-auto" />
            ) : (
              <FiCheckCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            )}
            <div className="relative z-10 text-center">
              {isLoading === 'loading' ? (
                <h3 className="text-2xl font-bold">Loading...</h3>
              ) : (
                <>
                  <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-orange-600 grid place-items-center mx-auto">
                    <FiCheckCircle />
                  </div>
                  <h3 className="text-3xl font-bold">Successful!</h3>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingSussFully;
