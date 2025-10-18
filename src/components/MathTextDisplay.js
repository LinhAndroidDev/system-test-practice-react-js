import React from 'react';
import { addStyles, StaticMathField } from 'react-mathquill';
import 'mathquill/build/mathquill.css';
import './MathTextDisplay.css';

// Add MathQuill styles
addStyles();

const MathTextDisplay = ({ text, style = {} }) => {
  if (!text) return null;

  // Split text by $ delimiters for inline math
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <span className="math-text-display" style={style}>
      {parts.map((part, index) => {
        // Check if part is LaTeX formula (wrapped in $...$)
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1); // Remove $ delimiters
          return (
            <span key={index} className="math-inline">
              <StaticMathField>{latex}</StaticMathField>
            </span>
          );
        }
        // Regular text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default MathTextDisplay;

