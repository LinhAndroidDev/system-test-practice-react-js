import React, { useRef } from 'react';
import { addStyles, EditableMathField } from 'react-mathquill';
import 'mathquill/build/mathquill.css';
import './MathInput.css';

// Add MathQuill styles
addStyles();

const MathInput = ({ value, onChange, placeholder = "Nhập công thức toán học..." }) => {
  const mathFieldRef = useRef(null);

  return (
    <div className="math-input-wrapper">
      <EditableMathField
        latex={value}
        onChange={(mathField) => {
          onChange(mathField.latex());
        }}
        mathquillDidMount={(mathField) => {
          mathFieldRef.current = mathField;
        }}
        config={{
          spaceBehavesLikeTab: true,
          supSubsRequireOperand: false,
          autoCommands: 'pi theta sqrt sum',
          autoOperatorNames: 'sin cos tan',
        }}
      />
      {placeholder && !value && (
        <div className="math-input-placeholder">{placeholder}</div>
      )}
    </div>
  );
};

export default MathInput;

