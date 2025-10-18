import React from 'react';
import { addStyles, StaticMathField } from 'react-mathquill';
import 'mathquill/build/mathquill.css';

// Add MathQuill styles
addStyles();

const MathDisplay = ({ latex, style = {} }) => {
  if (!latex) return null;

  return (
    <span className="math-display-inline" style={style}>
      <StaticMathField>{latex}</StaticMathField>
    </span>
  );
};

export default MathDisplay;

