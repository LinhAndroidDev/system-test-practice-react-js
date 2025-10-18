import React, { useState, useEffect } from 'react';
import MathTextDisplay from './MathTextDisplay';
import './MathTextInput.css';

const MathTextInput = ({ value, onChange, placeholder = "Nhập nội dung...", name = "content", resetHelper = false }) => {
  const [showHelper, setShowHelper] = useState(false);
  const textareaId = `math-text-area-${name}`; // Unique ID for each input

  // Reset helper when resetHelper prop changes
  useEffect(() => {
    if (resetHelper) {
      setShowHelper(false);
    }
  }, [resetHelper]);

  const handleChange = (e) => {
    // Ensure event has proper structure
    const event = {
      target: {
        name: name,
        value: e.target.value
      }
    };
    onChange(event);
  };

  const isInsideMath = (text, position) => {
    // Check if cursor is inside $...$
    let insideMath = false;
    let count = 0;
    
    for (let i = 0; i < position; i++) {
      if (text[i] === '$') {
        count++;
      }
    }
    
    // If count is odd, we're inside $...$
    return count % 2 === 1;
  };

  const insertFormula = (formulaWithDollar) => {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || '';
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    // Check if we're inside $...$
    const insideMath = isInsideMath(text, start);
    
    let formula;
    if (insideMath) {
      // Remove $ from formula if inside math
      formula = formulaWithDollar.replace(/^\$|\$$/g, '');
    } else {
      // Keep $ if outside math
      formula = formulaWithDollar;
    }
    
    const newText = before + formula + after;
    onChange({ target: { name: name, value: newText } });
    
    // Set cursor position after inserted formula
    setTimeout(() => {
      textarea.focus();
      const newPos = start + formula.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="math-text-input-wrapper">
      <div className="input-section">
        <textarea
          id={textareaId}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          rows="4"
          className="math-text-area"
        />
      </div>

      {/* Preview Section */}
      {value && (
        <div className="preview-section">
          <div className="preview-label">📝 Preview:</div>
          <div className="preview-content">
            <MathTextDisplay text={value} />
          </div>
        </div>
      )}
      
      <div className="formula-toolbar">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => setShowHelper(!showHelper)}
          title="Hiện/Ẩn công cụ"
        >
          ƒ(x) {showHelper ? '▼' : '▶'}
        </button>
        
        {showHelper && (
          <div className="formula-helper">
            <button type="button" onClick={() => insertFormula('$x^2$')}>x²</button>
            <button type="button" onClick={() => insertFormula('$x_{1}$')}>x₁</button>
            <button type="button" onClick={() => insertFormula('$\\sqrt{x}$')}>√x</button>
            <button type="button" onClick={() => insertFormula('$\\frac{a}{b}$')}>a/b</button>
            <button type="button" onClick={() => insertFormula('$\\pi$')}>π</button>
            <button type="button" onClick={() => insertFormula('$\\theta$')}>θ</button>
            <button type="button" onClick={() => insertFormula('$\\alpha$')}>α</button>
            <button type="button" onClick={() => insertFormula('$\\angle ABC$')}>∠ABC</button>
            <button type="button" onClick={() => insertFormula('$90^\\circ$')}>90°</button>
            <button type="button" onClick={() => insertFormula('$\\leq$')}>≤</button>
            <button type="button" onClick={() => insertFormula('$\\geq$')}>≥</button>
            <button type="button" onClick={() => insertFormula('$\\neq$')}>≠</button>
            <button type="button" onClick={() => insertFormula('$\\pm$')}>±</button>
            <button type="button" onClick={() => insertFormula('$\\times$')}>×</button>
            <button type="button" onClick={() => insertFormula('$\\div$')}>÷</button>
            <button type="button" onClick={() => insertFormula('$\\sum$')}>Σ</button>
          </div>
        )}
      </div>
      
      <div className="formula-hint">
        💡 <strong>Gợi ý:</strong> Viết text bình thường, bọc công thức trong <code>$...$</code>
        <br />
        📝 <strong>Ví dụ:</strong> "Tính giá trị của $x^2 + 2x + 1$ khi $x = 3$"
      </div>
    </div>
  );
};

export default MathTextInput;

