function drawLevelQuestion() {
  background(80, 120, 180);
  
  fill(255, 215, 0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text('Level ' + level + ' Complete!', width/2, 80);
  
  fill(255);
  textSize(20);
  let prompt = level >= TOTAL_LEVELS
    ? 'Answer correctly to complete the challenge!'
    : 'Answer correctly to advance to Level ' + (level + 1);
  text(prompt, width/2, 140);
  
  // Question - allow multi-line
  fill(255);
  textSize(22);
  let lines = currentQuestion.question.split('\n');
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width/2, 190 + i * 30);
    }
  // Do not auto-select on hover; selection should happen on click (handled in mousePressed)
  
  // Options
  let startY = 270;
  for (let i = 0; i < questionOptions.length; i++) {
    let y = startY + i * 80;
    
    // Highlight on hover
    if (mouseX > width/2 - 250 && mouseX < width/2 + 250 &&
        mouseY > y - 30 && mouseY < y + 30) {
      fill(150, 200, 255);
    } else {
      fill(100, 150, 200);
    }
    
    rect(width/2 - 250, y - 30, 500, 60, 10);
    
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(String.fromCharCode(65 + i) + ') ' + questionOptions[i], width/2, y);
  }
}

function getExplanationPopupLayout() {
  let panelW = 520;
  let panelH = 280;
  let panelX = width/2 - panelW/2;
  let panelY = height/2 - panelH/2;
  let buttonW = 180;
  let buttonH = 50;
  let buttonX = width/2 - buttonW/2;
  let buttonY = panelY + panelH - 70;
  return {
    panel: { x: panelX, y: panelY, w: panelW, h: panelH },
    button: { x: buttonX, y: buttonY, w: buttonW, h: buttonH }
  };
}

function drawExplanationPopup() {
  if (!explanationPopup) return;
  let layout = getExplanationPopupLayout();
  push();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);
  pop();
  
  fill(255);
  stroke(50, 90, 150);
  strokeWeight(3);
  rect(layout.panel.x, layout.panel.y, layout.panel.w, layout.panel.h, 14);
  
  noStroke();
  fill(40, 80, 140);
  textSize(28);
  textAlign(CENTER, CENTER);
  text('Explanation', width/2, layout.panel.y + 40);
  
  fill(30);
  textSize(18);
  textAlign(LEFT, TOP);
  let textX = layout.panel.x + 30;
  let textY = layout.panel.y + 80;
  let textW = layout.panel.w - 60;
  text(explanationPopup.text || 'Take another look at this concept.', textX, textY, textW, layout.panel.h - 130);
  
  if (mouseX > layout.button.x && mouseX < layout.button.x + layout.button.w &&
      mouseY > layout.button.y && mouseY < layout.button.y + layout.button.h) {
    fill(90, 180, 120);
  } else {
    fill(70, 160, 100);
  }
  noStroke();
  rect(layout.button.x, layout.button.y, layout.button.w, layout.button.h, 8);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text('Continue', layout.button.x + layout.button.w/2, layout.button.y + layout.button.h/2);
}

function showExplanationPopup(text, onClose) {
  explanationPopup = {
    text: text || 'Take another look at this concept.',
    onClose: onClose || null
  };
}

function getSlideOverlayLayout() {
  let panelW = width - 120;
  let panelH = height - 160;
  let panelX = width/2 - panelW/2;
  let panelY = height/2 - panelH/2;
  let imagePadding = 40;
  let imageX = panelX + imagePadding;
  let imageY = panelY + 80;
  let imageW = panelW - imagePadding * 2;
  let imageH = panelH - 160;
  let btnW = 150;
  let btnH = 48;
  let btnY = panelY + panelH - btnH - 30;
  return {
    panel: { x: panelX, y: panelY, w: panelW, h: panelH },
    image: { x: imageX, y: imageY, w: imageW, h: imageH },
    prevButton: { x: panelX + 40, y: btnY, w: btnW, h: btnH },
    nextButton: { x: panelX + panelW - btnW - 40, y: btnY, w: btnW, h: btnH },
    skipButton: { x: panelX + panelW - 120, y: panelY + 20, w: 100, h: 36 }
  };
}

function drawSlideOverlay() {
  if (!slideOverlay) return;
  let layout = getSlideOverlayLayout();
  push();
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);
  pop();
  
  fill(255);
  stroke(40, 80, 140);
  strokeWeight(3);
  rect(layout.panel.x, layout.panel.y, layout.panel.w, layout.panel.h, 18);
  
  noStroke();
  fill(30, 60, 110);
  textAlign(LEFT, CENTER);
  textSize(26);
  text('Level ' + slideOverlay.level + ' Briefing', layout.panel.x + 30, layout.panel.y + 40);
  
  fill(80);
  textSize(16);
  textAlign(LEFT, CENTER);
  let indicator = 'Slide ' + (slideOverlay.index + 1) + ' of ' + slideOverlay.slides.length;
  text(indicator, layout.panel.x + 30, layout.panel.y + 70);
  
  let img = slideOverlay.slides[slideOverlay.index];
  push();
  rectMode(CORNER);
  noStroke();
  fill(245);
  rect(layout.image.x, layout.image.y, layout.image.w, layout.image.h, 12);
  if (img && !img.failed && img.complete && (img.naturalWidth > 0 || img.loaded)) {
    let sourceW = img.naturalWidth || img.width || 1;
    let sourceH = img.naturalHeight || img.height || 1;
    let ratio = min(layout.image.w / sourceW, layout.image.h / sourceH);
    let drawW = sourceW * ratio;
    let drawH = sourceH * ratio;
    let dx = layout.image.x + (layout.image.w - drawW) / 2;
    let dy = layout.image.y + (layout.image.h - drawH) / 2;
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(layout.image.x, layout.image.y, layout.image.w, layout.image.h);
    drawingContext.clip();
    drawingContext.drawImage(img, dx, dy, drawW, drawH);
    drawingContext.restore();
  } else {
    fill(120);
    textAlign(CENTER, CENTER);
    textSize(18);
    let msg = (img && img.failed) ? 'Failed to load slide' : 'Loading slide...';
    text(msg, layout.image.x + layout.image.w/2, layout.image.y + layout.image.h/2);
  }
  pop();
  
  let nextLabel = slideOverlay.index >= slideOverlay.slides.length - 1 ? 'Start Level' : 'Next';
  
  // Skip button
  let skipHover = mouseX > layout.skipButton.x && mouseX < layout.skipButton.x + layout.skipButton.w &&
                  mouseY > layout.skipButton.y && mouseY < layout.skipButton.y + layout.skipButton.h;
  stroke(200, 80, 80);
  strokeWeight(2);
  if (skipHover) {
    fill(255, 150, 150);
  } else {
    fill(245, 120, 120);
  }
  rect(layout.skipButton.x, layout.skipButton.y, layout.skipButton.w, layout.skipButton.h, 10);
  noStroke();
  fill(30);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Skip', layout.skipButton.x + layout.skipButton.w/2, layout.skipButton.y + layout.skipButton.h/2);
  
  // Prev button
  let prevEnabled = slideOverlay.index > 0;
  let prevHover = prevEnabled &&
                  mouseX > layout.prevButton.x && mouseX < layout.prevButton.x + layout.prevButton.w &&
                  mouseY > layout.prevButton.y && mouseY < layout.prevButton.y + layout.prevButton.h;
  stroke(prevEnabled ? color(50, 110, 170) : color(120));
  strokeWeight(2);
  if (prevHover) {
    fill(120, 200, 255);
  } else if (prevEnabled) {
    fill(90, 170, 230);
  } else {
    fill(160);
  }
  rect(layout.prevButton.x, layout.prevButton.y, layout.prevButton.w, layout.prevButton.h, 12);
  noStroke();
  fill(prevEnabled ? 20 : 90);
  textSize(20);
  text('Back', layout.prevButton.x + layout.prevButton.w/2, layout.prevButton.y + layout.prevButton.h/2);
  
  // Next button
  let nextHover = mouseX > layout.nextButton.x && mouseX < layout.nextButton.x + layout.nextButton.w &&
                  mouseY > layout.nextButton.y && mouseY < layout.nextButton.y + layout.nextButton.h;
  stroke(60, 140, 100);
  strokeWeight(2);
  if (nextHover) {
    fill(140, 240, 190);
  } else {
    fill(90, 210, 150);
  }
  rect(layout.nextButton.x, layout.nextButton.y, layout.nextButton.w, layout.nextButton.h, 12);
  noStroke();
  fill(20, 50, 30);
  text(nextLabel, layout.nextButton.x + layout.nextButton.w/2, layout.nextButton.y + layout.nextButton.h/2);
}

function showSlidesForLevel(lvl, onComplete) {
  const slides = (slideImages[lvl] || []).filter(img => !!img);
  if (slides.length === 0) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }
  slideOverlay = {
    level: lvl,
    index: 0,
    slides: slides,
    onComplete: typeof onComplete === 'function' ? onComplete : null
  };
}

function finishSlideOverlay() {
  if (!slideOverlay) return;
  let cb = slideOverlay.onComplete;
  slideOverlay = null;
  if (typeof cb === 'function') cb();
}

function handleSlideOverlayClick() {
  if (!slideOverlay) return false;
  let layout = getSlideOverlayLayout();
  // Skip button
  if (mouseX > layout.skipButton.x && mouseX < layout.skipButton.x + layout.skipButton.w &&
      mouseY > layout.skipButton.y && mouseY < layout.skipButton.y + layout.skipButton.h) {
    finishSlideOverlay();
    return true;
  }
  // Prev button
  if (mouseX > layout.prevButton.x && mouseX < layout.prevButton.x + layout.prevButton.w &&
      mouseY > layout.prevButton.y && mouseY < layout.prevButton.y + layout.prevButton.h) {
    if (slideOverlay.index > 0) {
      slideOverlay.index--;
    }
    return true;
  }
  // Next button
  if (mouseX > layout.nextButton.x && mouseX < layout.nextButton.x + layout.nextButton.w &&
      mouseY > layout.nextButton.y && mouseY < layout.nextButton.y + layout.nextButton.h) {
    if (slideOverlay.index >= slideOverlay.slides.length - 1) {
      finishSlideOverlay();
    } else {
      slideOverlay.index++;
    }
    return true;
  }
  return false;
}

// Game variables
let gameState = 'menu'; // menu, practiceSelect, practice, learning, gameover, question, levelquestion, victory
let player;
let platforms = [];
let enemies = [];
let particles = [];
let angleInput = 45;
let distanceInput = 100;
let score = 0;
let level = 1;
let highestLevelUnlocked = 1;
// Player color selection (RGB array)
let playerColor = [65, 105, 225]; // default royal blue
let playerColorOptions = [
  [65,105,225], // royal blue
  [100,200,255], // cyan
  [100,200,100], // green
  [200,50,50], // red
  [255,215,0] // gold
];
let selectedColorIndex = 0;
let showColorPopup = false;
let popupTarget = ''; // 'learning' or 'practice'
let prevSelectedColorIndex = 0;
let draggingAngle = false;
let draggingDistance = false;
let levelHeight = 1000; // shorter distance to goal per level
let message = '';
let messageTimer = 0;
let cameraY = 0;
let startY = 0;
let nextLevelY = 0;
let lastPlatformSide = 'left';
let trigFacts = []; // Facts shown during climbing
// Track the highest point (minimum y) the player has reached during a run/level
let maxHeightReached = Infinity;

const level1Data = {
  "level": 1,
  "topic": "Foundations (Right-Triangle Trig)",
  "facts": [
    "The hypotenuse is always opposite the right angle.",
    "The hypotenuse is the longest side in a right triangle.",
    "sin(θ) = Opposite / Hypotenuse.",
    "cos(θ) = Adjacent / Hypotenuse.",
    "tan(θ) = Opposite / Adjacent."
  ],
  "questions": [
    {
      "question": "Which side of a right triangle is the hypotenuse?",
      "options": ["The vertical side", "The longest side", "The base", "The shortest side"],
      "answer": "The longest side",
      "explanation": "The hypotenuse is always opposite the right angle and is the longest side."
    },
    {
      "question": "In a 30-60-90 triangle, if the shortest side is 3, what is the hypotenuse?",
      "options": ["6", "3√3", "3√2", "9"],
      "answer": "6",
      "explanation": "In a 30-60-90 triangle, the hypotenuse is twice the shortest side."
    },
    {
      "question": "sin(θ) is equal to:",
      "options": ["Opposite / Hypotenuse", "Adjacent / Hypotenuse", "Opposite / Adjacent", "Hypotenuse / Opposite"],
      "answer": "Opposite / Hypotenuse",
      "explanation": "By definition, sin(θ) = Opposite / Hypotenuse."
    },
    {
      "question": "cos(θ) is equal to:",
      "options": ["Adjacent / Hypotenuse", "Opposite / Hypotenuse", "Opposite / Adjacent", "Hypotenuse / Adjacent"],
      "answer": "Adjacent / Hypotenuse",
      "explanation": "By definition, cos(θ) = Adjacent / Hypotenuse."
    },
    {
      "question": "tan(θ) is equal to:",
      "options": ["Opposite / Adjacent", "Adjacent / Hypotenuse", "Hypotenuse / Opposite", "Opposite / Hypotenuse"],
      "answer": "Opposite / Adjacent",
      "explanation": "By definition, tan(θ) = Opposite / Adjacent."
    },
    {
      "question": "In a 45-45-90 triangle, the hypotenuse is:",
      "options": ["√2 times a leg", "Equal to a leg", "Twice a leg", "Half a leg"],
      "answer": "√2 times a leg",
      "explanation": "For a 45-45-90 triangle, the hypotenuse = leg × √2."
    },
    {
      "question": "If one leg of a right triangle is 5 and the other leg is 12, what is the hypotenuse?",
      "options": ["13", "10", "12", "15"],
      "answer": "13",
      "explanation": "Use Pythagoras: √(5² + 12²) = √(25 + 144) = √169 = 13."
    },
    {
      "question": "Which of these is an example of an angle of elevation?",
      "options": ["Looking up at the top of a building", "Looking down at your shoes", "Horizontal line of sight", "Looking in a mirror"],
      "answer": "Looking up at the top of a building",
      "explanation": "Angle of elevation is the angle between horizontal and line of sight looking upward."
    },
    {
      "question": "Which of these is an example of an angle of depression?",
      "options": ["Looking down at the street from a balcony", "Looking up at a tree", "Looking straight ahead", "Standing on flat ground"],
      "answer": "Looking down at the street from a balcony",
      "explanation": "Angle of depression is the angle between horizontal and line of sight looking downward."
    },
    {
      "question": "In a right triangle, the side opposite a 90° angle is:",
      "options": ["Hypotenuse", "Adjacent side", "Opposite side", "Base"],
      "answer": "Hypotenuse",
      "explanation": "By definition, the hypotenuse is opposite the right angle."
    }
  ]
};

const level2Data = {
  "level": 2,
  "topic": "Graphs of Trig Functions",
  "facts": [
    "The sine and cosine graphs have a period of 2π.",
    "The tangent graph has a period of π.",
    "The amplitude of y = sin(x) or y = cos(x) is 1.",
    "Tangent has vertical asymptotes where cos(x) = 0.",
    "Cosine graph starts at its maximum (y = 1), sine starts at 0."
  ],
  "questions": [
    {
      "question": "What is the period of y = sin(x)?",
      "options": ["2π", "π", "π/2", "4π"],
      "answer": "2π",
      "explanation": "The sine function repeats every 2π units along the x-axis."
    },
    {
      "question": "What is the amplitude of y = cos(x)?",
      "options": ["1", "0.5", "2", "π"],
      "answer": "1",
      "explanation": "Amplitude is the maximum height from the center; for cosine it's 1."
    },
    {
      "question": "The tangent function is undefined where:",
      "options": ["cos(x) = 0", "sin(x) = 0", "x = 0", "tan(x) = 0"],
      "answer": "cos(x) = 0",
      "explanation": "Tangent = sin(x)/cos(x), so it is undefined when cos(x) = 0."
    },
    {
      "question": "Which trig graph starts at y = 1?",
      "options": ["Cosine", "Sine", "Tangent", "Cotangent"],
      "answer": "Cosine",
      "explanation": "Cosine graph starts at its maximum value y = 1 when x = 0."
    },
    {
      "question": "Which trig graph starts at y = 0?",
      "options": ["Sine", "Cosine", "Tangent", "Cosecant"],
      "answer": "Sine",
      "explanation": "Sine graph starts at 0 when x = 0."
    },
    {
      "question": "What is the period of y = tan(x)?",
      "options": ["π", "2π", "π/2", "4π"],
      "answer": "π",
      "explanation": "Tangent repeats every π units."
    },
    {
      "question": "Amplitude of tangent function is:",
      "options": ["Undefined", "1", "0", "π"],
      "answer": "Undefined",
      "explanation": "Tangent doesn't have a maximum/minimum; amplitude is undefined."
    },
    {
      "question": "Vertical asymptotes of tan(x) occur at:",
      "options": ["x = π/2 + nπ", "x = nπ", "x = nπ/2", "x = 0 only"],
      "answer": "x = π/2 + nπ",
      "explanation": "Tangent is undefined where cos(x) = 0 → x = π/2 + nπ."
    },
    {
      "question": "If y = sin(x), what is y when x = π?",
      "options": ["0", "1", "-1", "π"],
      "answer": "0",
      "explanation": "Sine of π is 0; sin(π) = 0."
    },
    {
      "question": "If y = cos(x), what is y when x = π/2?",
      "options": ["0", "1", "-1", "π/2"],
      "answer": "0",
      "explanation": "Cosine of π/2 is 0; cos(π/2) = 0."
    }
  ]
};

const level3Data = {
  "level": 3,
  "topic": "Radians & Unit Circle",
  "facts": [
    "The unit circle has a radius of 1.",
    "cos(θ) is the x-coordinate, sin(θ) is the y-coordinate.",
    "360° = 2π radians; 180° = π radians.",
    "Quadrant signs: I (+,+), II (-,+), III (-,-), IV (+,-).",
    "Reference angles allow you to find trig values of any angle."
  ],
  "questions": [
    {
      "question": "How many radians are in a full circle?",
      "options": ["2π", "π", "360", "180"],
      "answer": "2π",
      "explanation": "A full circle is 360° = 2π radians."
    },
    {
      "question": "180° is equal to how many radians?",
      "options": ["π", "2π", "π/2", "4π"],
      "answer": "π",
      "explanation": "180° = π radians."
    },
    {
      "question": "If an angle is 60°, how many radians is that?",
      "options": ["π/3", "π/2", "2π/3", "π/4"],
      "answer": "π/3",
      "explanation": "Convert degrees to radians: 60 × π/180 = π/3."
    },
    {
      "question": "In the unit circle, what are the coordinates for θ = 0°?",
      "options": ["(1,0)", "(0,1)", "(-1,0)", "(0,-1)"],
      "answer": "(1,0)",
      "explanation": "At 0°, the point on the unit circle is (cos0°, sin0°) = (1,0)."
    },
    {
      "question": "cos(θ) corresponds to:",
      "options": ["x-coordinate", "y-coordinate", "radius", "angle"],
      "answer": "x-coordinate",
      "explanation": "cos(θ) = x-coordinate of the point on the unit circle."
    },
    {
      "question": "sin(θ) corresponds to:",
      "options": ["y-coordinate", "x-coordinate", "radius", "angle"],
      "answer": "y-coordinate",
      "explanation": "sin(θ) = y-coordinate of the point on the unit circle."
    },
    {
      "question": "Which quadrant has sin > 0 and cos < 0?",
      "options": ["Quadrant II", "Quadrant I", "Quadrant III", "Quadrant IV"],
      "answer": "Quadrant II",
      "explanation": "In Quadrant II, x < 0 (cos < 0), y > 0 (sin > 0)."
    },
    {
      "question": "The reference angle for 150° is:",
      "options": ["30°", "60°", "45°", "90°"],
      "answer": "30°",
      "explanation": "Reference angle = 180° - 150° = 30°."
    },
    {
      "question": "cos(45°) equals:",
      "options": ["√2/2", "1/2", "√3/2", "1"],
      "answer": "√2/2",
      "explanation": "For a 45° angle on the unit circle, cos(45°) = √2/2."
    },
    {
      "question": "sin(30°) equals:",
      "options": ["1/2", "√3/2", "1", "0"],
      "answer": "1/2",
      "explanation": "For a 30° angle, sin(30°) = 1/2."
    }
  ]
};

const level4Data = {
  "level": 4,
  "topic": "Identities & Inverse Trig",
  "facts": [
    "sin²(θ) + cos²(θ) = 1",
    "1 + tan²(θ) = sec²(θ)",
    "1 + cot²(θ) = csc²(θ)",
    "tan(θ) = sin(θ)/cos(θ), cot(θ) = cos(θ)/sin(θ)",
    "sin⁻¹(x), cos⁻¹(x), tan⁻¹(x) give angles from ratios"
  ],
  "questions": [
    {
      "question": "sin²(θ) + cos²(θ) equals:",
      "options": ["1", "tan²(θ)", "sec²(θ)", "0"],
      "answer": "1",
      "explanation": "By Pythagorean identity, sin²(θ) + cos²(θ) = 1."
    },
    {
      "question": "1 + tan²(θ) equals:",
      "options": ["sec²(θ)", "sin²(θ)", "cos²(θ)", "csc²(θ)"],
      "answer": "sec²(θ)",
      "explanation": "From the Pythagorean identity: 1 + tan²(θ) = sec²(θ)."
    },
    {
      "question": "1 + cot²(θ) equals:",
      "options": ["csc²(θ)", "sec²(θ)", "sin²(θ)", "cos²(θ)"],
      "answer": "csc²(θ)",
      "explanation": "From the Pythagorean identity: 1 + cot²(θ) = csc²(θ)."
    },
    {
      "question": "tan(θ) equals:",
      "options": ["sin(θ)/cos(θ)", "cos(θ)/sin(θ)", "1/sin(θ)", "1/cos(θ)"],
      "answer": "sin(θ)/cos(θ)",
      "explanation": "By quotient identity, tan(θ) = sin(θ)/cos(θ)."
    },
    {
      "question": "cot(θ) equals:",
      "options": ["cos(θ)/sin(θ)", "sin(θ)/cos(θ)", "1/sin(θ)", "1/cos(θ)"],
      "answer": "cos(θ)/sin(θ)",
      "explanation": "By quotient identity, cot(θ) = cos(θ)/sin(θ)."
    },
    {
      "question": "sin⁻¹(1/2) equals:",
      "options": ["30°", "60°", "45°", "90°"],
      "answer": "30°",
      "explanation": "The angle whose sine = 1/2 is 30°."
    },
    {
      "question": "cos⁻¹(0) equals:",
      "options": ["90°", "0°", "180°", "45°"],
      "answer": "90°",
      "explanation": "The angle whose cosine = 0 is 90°."
    },
    {
      "question": "tan⁻¹(1) equals:",
      "options": ["45°", "30°", "60°", "90°"],
      "answer": "45°",
      "explanation": "The angle whose tangent = 1 is 45°."
    },
    {
      "question": "Which identity is correct?",
      "options": ["1 + tan²(θ) = sec²(θ)", "sin²(θ) - cos²(θ) = 1", "tan²(θ) + 1 = csc²(θ)", "cos²(θ) + cot²(θ) = 1"],
      "answer": "1 + tan²(θ) = sec²(θ)",
      "explanation": "This is a Pythagorean identity."
    },
    {
      "question": "Which is the reciprocal of sine?",
      "options": ["Cosecant", "Secant", "Cotangent", "Cosine"],
      "answer": "Cosecant",
      "explanation": "Cosecant = 1/sin(θ), the reciprocal of sine."
    }
  ]
};

const levelConfigs = [level1Data, level2Data, level3Data, level4Data];
const TOTAL_LEVELS = levelConfigs.length;
const levelSlideManifest = {
  1: ['Slides/1A.png', 'Slides/1B.png', 'Slides/1C.png'],
  2: ['Slides/2A.png', 'Slides/2B.png', 'Slides/2C.png'],
  3: ['Slides/3A.png', 'Slides/3B.png', 'Slides/3C.png'],
  4: ['Slides/4A.png', 'Slides/4B.png', 'Slides/4C.png']
};

let slideImages = {};
let slideOverlay = null;

function getLevelConfig(lvl) {
  return levelConfigs[lvl - 1] || null;
}

let explanationPopup = null;

// Audio
let musicAudioElements = [];
let musicIndex = 0;
let musicPlaying = false;
let sfx = {};
// NOTE: I detected two music files in the project: Audio/Music/lofi1.mp3 and Audio/Music/lofi2.mp3.
// If you add a 3rd one (lofi3.mp3), add it to the musicFiles array below.

// Learning mode variables
let learningStep = 0;
let learningSteps = [];
let targetX = 0;
let targetY = 0;
let showHints = true;
let learningPlatformY = 0; // Track platform position

// Question system
let currentQuestion = null;
let questionOptions = [];
let correctAnswer = 0;

// Difficulty settings per level
function getPlatformWidth(lvl) {
  return max(70, 150 - lvl * 12); // Start smaller, get even smaller
}

function getPlatformSpacing(lvl) {
  return 80 + lvl * 3; // More spacing between platforms
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  setupLearningSteps();
  initAudio();
  loadSlideAssets();
}

function initAudio() {
  // music files (adjust if you add more)
  const musicFiles = [
    'Audio/Music/lofi1.mp3',
    'Audio/Music/lofi2.mp3'
  ];

  musicAudioElements = [];
  for (let i = 0; i < musicFiles.length; i++) {
    try {
      let a = new Audio(musicFiles[i]);
      a.volume = 0.45;
      a.preload = 'auto';
      a.addEventListener('ended', () => {
        if (musicAudioElements.length === 0) return;
        musicIndex = (musicIndex + 1) % musicAudioElements.length;
        if (musicPlaying) musicAudioElements[musicIndex].play();
      });
      musicAudioElements.push(a);
    } catch (e) {
      // ignore load errors
      console.warn('Failed to load music', musicFiles[i], e);
    }
  }

  // sound effects
  const sfxFiles = {
    click: 'Audio/SoundEffects/click.mp3',
    correct: 'Audio/SoundEffects/correct.mp3',
    wrong: 'Audio/SoundEffects/wrong.mp3',
    jump: 'Audio/SoundEffects/jump.mp3',
    levelcomplete: 'Audio/SoundEffects/levelcomplete.mp3'
  };

  for (let k in sfxFiles) {
    try {
      let a = new Audio(sfxFiles[k]);
      a.preload = 'auto';
      a.volume = 0.9;
      sfx[k] = a;
    } catch (e) {
      console.warn('Failed to load sfx', k, e);
      sfx[k] = null;
    }
  }
}

function playMusic() {
  if (musicAudioElements.length === 0) return;
  musicPlaying = true;
  musicIndex = musicIndex % musicAudioElements.length;
  try { musicAudioElements[musicIndex].currentTime = 0; musicAudioElements[musicIndex].play(); } catch(e){}
}

function stopMusic() {
  musicPlaying = false;
  for (let a of musicAudioElements) {
    try { a.pause(); a.currentTime = 0; } catch(e){}
  }
}

function loadSlideAssets() {
  slideImages = {};
  for (let key in levelSlideManifest) {
    if (!levelSlideManifest.hasOwnProperty(key)) continue;
    let lvl = parseInt(key, 10);
    if (isNaN(lvl)) continue;
    slideImages[lvl] = levelSlideManifest[key].map(path => {
      let img = new Image();
      img.loaded = false;
      img.failed = false;
      img.onload = () => { img.loaded = true; };
      img.onerror = () => {
        img.failed = true;
        console.warn('Failed to load slide', path);
      };
      img.src = path;
      return img;
    });
  }
}

function setupLearningSteps() {
  learningSteps = [
    {
      title: "Welcome to Trigonometry!",
      text: "Let's learn how jump calculations relate to right triangles and the unit circle.\n\nSOH: sin(θ) = Opposite / Hypotenuse\nCAH: cos(θ) = Adjacent / Hypotenuse\nTOA: tan(θ) = Opposite / Adjacent\n\nTip: In this game the 'hypotenuse' is the jump distance, 'angle' is the direction you jump.",
      target: null,
      showTrajectory: false,
      requireJump: false
    },
    {
      title: "Understanding the Right Triangle",
      text: "When you jump the motion forms a right triangle:\n• Hypotenuse = your jump distance (the straight-line length)\n• Angle = direction of jump measured from the right (0°) up towards 180°\n• Adjacent (Δx) = horizontal change (how far left/right)\n• Opposite (Δy) = vertical change (how far up/down)\n\nWe use cos(θ) and sin(θ) to compute the adjacent and opposite components.",
      target: null,
      showTrajectory: false,
      requireJump: false
    },
    {
      title: "Calculating Horizontal Distance (Δx)",
      text: "To find how far RIGHT you'll go (horizontal component):\nΔx = cos(angle) × distance\n\nTry it: set angle = 0° and distance = 100.\nYou should move 100 pixels to the right and 0 up.\nWatch the red trajectory and the arc to see how cos changes with angle.",
      target: null,
      showTrajectory: true,
      requireJump: false
    },
    {
      title: "Calculating Vertical Distance (Δy)",
      text: "To find how far UP you'll go (vertical component):\nΔy = sin(angle) × distance\n\nTry: angle = 90° and distance = 100.\nThe jump will move 0 horizontally and 100 vertically.\nUse the coordinate display and labels to read Δx/Δy values.",
      target: null,
      showTrajectory: true,
      requireJump: false
    },
    {
      title: "Practice: Jump to the Golden Target!",
      text: "Now YOU try! Use the coordinate display to help.\nThe target is about 150 pixels right and 50 pixels up.\nWhat angle and distance should you use?\n\nYou MUST hit the target to continue!",
        target: {x: 550, y: 300, size: 50},
      showTrajectory: true,
      requireJump: true
    },
    {
      title: "Great Job! Try Another One!",
      text: "Excellent! Let's try a trickier target.\nThis one is higher up!\nRemember: Larger angles = more vertical\n\nHit the target to continue!",
        target: {x: 450, y: 200, size: 50},
      showTrajectory: true,
      requireJump: true
    },
      // Removed one target step so learners only need to hit two targets
    {
      title: "Congratulations! 🎉",
      text: "You've mastered the basics!\n\n✓ How cos(angle) controls horizontal movement\n✓ How sin(angle) controls vertical movement\n✓ How distance affects jump length\n\nReady for PRACTICE MODE?\n(In practice mode you will see some new facts as you climb up, pay attention to them since you will need to answer some questions correctly to move on to the next level.)",
      target: null,
      showTrajectory: false,
      requireJump: false
    }
  ];
}

function draw() {
  if (gameState === 'menu') {
    drawMenu();
    if (showColorPopup) drawColorPopup();
  } else if (gameState === 'practiceSelect') {
    drawPracticeSelect();
  } else if (gameState === 'practice') {
    drawPracticeMode();
  } else if (gameState === 'learning') {
    drawLearningMode();
  } else if (gameState === 'gameover') {
    drawGameOver();
  } else if (gameState === 'question') {
    drawQuestion();
  } else if (gameState === 'levelquestion') {
    drawLevelQuestion();
  } else if (gameState === 'victory') {
    drawVictory();
  }
  
  if (slideOverlay) {
    drawSlideOverlay();
  }
  if (explanationPopup) {
    drawExplanationPopup();
  }
}

function drawMenu() {
  // menu background and layout
  background(95, 140, 200);
  rectMode(CORNER);
  noStroke();
  strokeWeight(1);

  // (Removed the white backing panel for a cleaner look)

  // Title (no shadow)
  textAlign(CENTER, CENTER);
  textSize(52);
  // Ensure no stroke on title text
  noStroke();
  textStyle(NORMAL);
  fill(18, 24, 48); // darker, high-contrast title
  text('Hypotenuse Hop', width/2, 120);

  // Subtitle
  textSize(18);
  noStroke();
  textStyle(NORMAL);
  fill(40,60,100);
  text('Learn trigonometry by jumping up platforms!', width/2, 170);
  text('Use angle and distance to calculate your jump.', width/2, 195);

  // Draw buttons with hover effect
  let btnW = 320, btnH = 84;
  let btnX = width/2 - btnW/2;

  // Learning Mode button
  let ly = 240;
  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > ly && mouseY < ly + btnH) {
    fill(120, 210, 255);
  } else {
    fill(100, 200, 255);
  }
  stroke(20,100,160,180);
  strokeWeight(2);
  rect(btnX, ly, btnW, btnH, 12);
  noStroke();
  fill(18);
  textSize(22);
  // center main label vertically in button
  text('LEARNING MODE', width/2, ly + btnH/2);

  // Practice Mode button
  let py = 340;
  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > py && mouseY < py + btnH) {
    fill(255, 140, 140);
  } else {
    fill(200, 100, 100);
  }
  stroke(160,60,60,180);
  strokeWeight(2);
  rect(btnX, py, btnW, btnH, 12);
  noStroke();
  fill(18);
  textSize(22);
  text('PRACTICE MODE', width/2, py + btnH/2);

  // Player Color button (separate button)
  let cy = 440;
  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > cy && mouseY < cy + btnH) {
    fill(180, 200, 255);
  } else {
    fill(160, 190, 255);
  }
  stroke(40,80,140,180);
  strokeWeight(2);
  rect(btnX, cy, btnW, btnH, 12);
  noStroke();
  fill(18);
  textSize(20);
  // main label slightly above center so swatch fits below inside the button
  text('PLAYER COLOR', width/2, cy + btnH/2 - 8);
  // small swatch positioned inside the button directly under the label
  noStroke();
  fill(playerColor[0], playerColor[1], playerColor[2]);
  stroke(0,0,0,80);
  strokeWeight(1);
  // place the swatch a bit below the label but still within the button rect
  circle(width/2, cy + btnH/2 + 18, 26);
  noStroke();

  // (Removed large preview and helper text — color is chosen via the PLAYER COLOR button)
  // Ensure text is drawn without stroke and in normal weight to avoid outline/bold effects
  noStroke();
  textStyle(NORMAL);
}

function getPracticeSelectLayout() {
  let btnW = 210;
  let btnH = 125;
  let cols = min(3, TOTAL_LEVELS);
  let spacingX = 28;
  let spacingY = 32;
  let totalW = cols * btnW + (cols - 1) * spacingX;
  let startX = width/2 - totalW/2;
  let startY = 220;
  let buttons = [];
  for (let i = 0; i < TOTAL_LEVELS; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = startX + col * (btnW + spacingX);
    let y = startY + row * (btnH + spacingY);
    buttons.push({
      level: i + 1,
      x: x,
      y: y,
      w: btnW,
      h: btnH,
      unlocked: i + 1 <= highestLevelUnlocked
    });
  }
  let backButton = {
    x: width/2 - 120,
    y: height - 80,
    w: 240,
    h: 56
  };
  return { buttons, backButton };
}

function drawPracticeSelect() {
  // Night-sky gradient background
  for (let y = 0; y < height; y += 2) {
    let lerpVal = map(y, 0, height, 0, 1);
    let r = lerp(30, 90, lerpVal);
    let g = lerp(40, 140, lerpVal);
    let b = lerp(80, 200, lerpVal);
    stroke(r, g, b);
    line(0, y, width, y);
  }
  noStroke();
  textStyle(NORMAL);
  
  // Glass panel
  fill(255, 255, 255, 25);
  rect(width/2 - 360, 60, 720, height - 120, 24);
  fill(255, 255, 255, 90);
  rect(width/2 - 360, 60, 720, 110, 24, 24, 0, 0);
  
  fill(20, 35, 65);
  textAlign(CENTER, CENTER);
  textSize(42);
  text('Practice Level Select', width/2, 120);
  
  textSize(18);
  fill(30, 60, 100);
  text('Choose a level card below. Locked cards show what to beat next.', width/2, 160);
  
  let progress = highestLevelUnlocked / TOTAL_LEVELS;
  let barW = 420;
  let barH = 16;
  let barX = width/2 - barW/2;
  let barY = 180;
  fill(255, 255, 255, 80);
  rect(barX, barY, barW, barH, barH/2);
  fill(120, 210, 130);
  rect(barX, barY, barW * progress, barH, barH/2);
  fill(20, 60, 40);
  textSize(14);
  text('Unlocked ' + highestLevelUnlocked + ' / ' + TOTAL_LEVELS, width/2, barY + 28);
  
  let layout = getPracticeSelectLayout();
  for (let btn of layout.buttons) {
    let hover = mouseX > btn.x && mouseX < btn.x + btn.w &&
                mouseY > btn.y && mouseY < btn.y + btn.h;
    push();
    translate(btn.x, btn.y);
    // shadow
    fill(0, 0, 0, 40);
    rect(6, 8, btn.w, btn.h, 18);
    // card
    if (!btn.unlocked) {
      fill(180, 180, 190, hover ? 230 : 210);
    } else if (hover) {
      fill(255, 230, 180);
    } else {
      fill(255, 250, 230);
    }
    stroke(hover ? color(255, 200, 120) : color(230, 224, 210));
    strokeWeight(2);
    rect(0, 0, btn.w, btn.h, 18);
    noStroke();
    
    // badge
    let badgeColor = btn.unlocked ? color(255, 210, 130) : color(200, 200, 210);
    fill(badgeColor);
    rect(20, 18, btn.w - 40, 36, 14);
    fill(35, 40, 55);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('LEVEL ' + btn.level, btn.w/2, 36);
    
    // topic text
    let cfg = getLevelConfig(btn.level);
    let topic = cfg ? cfg.topic : 'Ready to climb';
    fill(30, 45, 70);
    textSize(btn.level === 1 ? 13 : 15);
    textAlign(CENTER, CENTER);
    text(topic, btn.w/2, btn.h/2 + 5);
    
    // status text
    fill(btn.unlocked ? color(50, 120, 80) : color(160, 70, 70));
    textSize(16);
    let statusText = btn.unlocked ? 'Unlocked' : 'Locked • beat Level ' + highestLevelUnlocked;
    text(statusText, btn.w/2, btn.h - 28);
    pop();
  }
  
  // Back button
  let backHover = mouseX > layout.backButton.x && mouseX < layout.backButton.x + layout.backButton.w &&
                  mouseY > layout.backButton.y && mouseY < layout.backButton.y + layout.backButton.h;
  fill(backHover ? color(255, 200, 200) : color(255, 175, 175));
  stroke(200, 100, 100);
  strokeWeight(2);
  rect(layout.backButton.x, layout.backButton.y, layout.backButton.w, layout.backButton.h, 14);
  noStroke();
  fill(80, 20, 20);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('← Back to Menu', layout.backButton.x + layout.backButton.w/2, layout.backButton.y + layout.backButton.h/2);
}

function drawColorPopup() {
  // dim background
  push();
  fill(0, 0, 0, 160);
  rect(0, 0, width, height);
  pop();

  // popup box
  let pw = 560;
  let ph = 320;
  let px = width/2 - pw/2;
  let py = height/2 - ph/2;
  push();
  fill(245);
  stroke(40,60,100);
  strokeWeight(2);
  rect(px, py, pw, ph, 12);
  pop();

  // Title
  textAlign(CENTER, CENTER);
  fill(20);
  textSize(22);
  text('Choose Player Color', width/2, py + 34);

  // swatches larger
  let swCount = playerColorOptions.length;
  let swSize = 64;
  let swSpacing = 20;
  let swTotal = swCount * swSize + (swCount - 1) * swSpacing;
  let swStartX = width/2 - swTotal/2;
  let swY = py + 90;
  for (let i = 0; i < swCount; i++) {
    let cx = swStartX + i * (swSize + swSpacing);
    fill(playerColorOptions[i][0], playerColorOptions[i][1], playerColorOptions[i][2]);
    stroke(0,0,0,120);
    strokeWeight(1);
    rect(cx, swY, swSize, swSize, 10);
  }

  // Confirm / Cancel buttons
  let bw = 140, bh = 40;
  let bx = width/2 - bw - 16;
  let bx2 = width/2 + 16;
  let by = py + ph - 60;

  // Confirm
  if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
    fill(100,200,120);
  } else {
    fill(80,180,100);
  }
  stroke(30);
  rect(bx, by, bw, bh, 8);
  fill(255);
  noStroke();
  textSize(16);
  text('Confirm', bx + bw/2, by + bh/2);

  // Cancel
  if (mouseX > bx2 && mouseX < bx2 + bw && mouseY > by && mouseY < by + bh) {
    fill(240,120,120);
  } else {
    fill(220,100,100);
  }
  stroke(30);
  rect(bx2, by, bw, bh, 8);
  fill(255);
  noStroke();
  text('Cancel', bx2 + bw/2, by + bh/2);
}

function drawGameOver() {
  background(50, 50, 80);
  
  fill(255, 100, 100);
  textSize(60);
  textAlign(CENTER, CENTER);
  text('GAME OVER!', width/2, 200);
  
  fill(255);
  textSize(32);
  text('Final Score: ' + score, width/2, 280);
  text('Reached Level: ' + level, width/2, 330);
  
  fill(150, 150, 200);
  rect(width/2 - 100, 400, 200, 60, 10);
  fill(255);
  textSize(24);
  text('Back to Menu', width/2, 430);
}

function drawVictory() {
  background(40, 90, 60);
  
  fill(120, 255, 180);
  textSize(60);
  textAlign(CENTER, CENTER);
  text('YOU WON!', width/2, 200);
  
  fill(255);
  textSize(28);
  text('Score: ' + score, width/2, 280);
  text('All ' + TOTAL_LEVELS + ' Levels Complete', width/2, 330);
  
  fill(100, 180, 120);
  rect(width/2 - 120, 400, 240, 60, 12);
  fill(10, 30, 20);
  textSize(24);
  text('Back to Menu', width/2, 430);
}

function drawQuestion() {
  background(80, 80, 120);
  
  fill(255, 200, 100);
  textSize(40);
  textAlign(CENTER, CENTER);
  text('Second Chance!', width/2, 80);
  
  fill(255);
  textSize(18);
  text('Answer this trigonometry question correctly to retry the level:', width/2, 140);
  
  // Question - allow multi-line
  fill(255);
  textSize(22);
  let lines = currentQuestion.question.split('\n');
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width/2, 190 + i * 30);
  }
  
  // Options
  let startY = 270;
  for (let i = 0; i < questionOptions.length; i++) {
    let y = startY + i * 80;
    
    // Highlight on hover
    if (mouseX > width/2 - 250 && mouseX < width/2 + 250 &&
        mouseY > y - 30 && mouseY < y + 30) {
      fill(150, 150, 200);
    } else {
      fill(100, 100, 150);
    }
    
    rect(width/2 - 250, y - 30, 500, 60, 10);
    
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(String.fromCharCode(65 + i) + ') ' + questionOptions[i], width/2, y);
  }
}

function drawLearningMode() {
  background(240, 245, 250);
  
  // Draw coordinate grid
  stroke(200, 220, 240);
  strokeWeight(1);
  
  for (let x = 0; x < width; x += 50) {
    line(x, 0, x, height);
  }
  
  for (let y = 0; y < height; y += 50) {
    line(0, y, width, y);
  }
  
  let step = learningSteps[learningStep];
  
  // Check if player fell off - respawn them
  if (player.y > learningPlatformY + 200) {
    resetLearningPlayer();
  }
  
  // Draw player
  if (!player.isJumping) {
    player.vx = 0;
    player.vy = 0;
  }
  player.update();
  player.display();
  
  // Draw starting platform
  fill(139, 69, 19);
  stroke(101, 67, 33);
  strokeWeight(2);
  rect(width/2 - 100, learningPlatformY, 200, 15, 3);
  
  // Draw target if exists
  if (step.target) {
    // Draw target as a square
    // Ensure the target sits below the instruction panel (we compute panel below)
    // Actual adjustment will be done after computing panel position.
    // Draw placeholder for now; actual y may be adjusted later
    // (rendering continues after instruction panel code)
  }
  
  // Draw trajectory
  if (step.showTrajectory && !player.isJumping) {
    let angleRad = radians(angleInput);
    let dx = cos(angleRad) * distanceInput;
    let dy = -sin(angleRad) * distanceInput;
    
    stroke(255, 0, 0, 150);
    strokeWeight(3);
    line(player.x, player.y, player.x + dx, player.y + dy);
    
    noFill();
    stroke(255, 0, 0, 100);
    circle(player.x + dx, player.y + dy, 30);
    
    // Draw angle arc near player to visualize angle
    push();
    stroke(0, 120, 200, 200);
    strokeWeight(2);
    noFill();
    let arcR = 48;
    // draw arc from 0 to -angleRad (so positive angles go counter-clockwise up)
    arc(player.x, player.y, arcR, arcR, -angleRad, 0);
    // draw small marker at arc end
    let mx = player.x + cos(angleRad) * (arcR/2);
    let my = player.y - sin(angleRad) * (arcR/2);
    fill(0, 120, 200);
    noStroke();
    circle(mx, my, 6);
    // angle label
    fill(0);
    textSize(12);
    textAlign(LEFT, BOTTOM);
    text(angleInput + '°', player.x + 8, player.y - 12);
    pop();
  }
  // Draw instruction panel (dynamic height based on text lines)
  fill(255, 255, 255, 240);
  stroke(100, 100, 255);
  strokeWeight(3);
  // Prepare title and text metrics
  textSize(22);
  textAlign(CENTER, TOP);
  let titleH = textAscent() + textDescent() + 12;
  let bodyLines = step.text.split('\n');
  textSize(14);
  let bodyLineH = textAscent() + textDescent() + 6;
  let bodyH = bodyLines.length * bodyLineH;
  let panelPadding = 12;
  let panelW = width - 100;
  let panelH = titleH + bodyH + panelPadding * 2;
  // Place panel as high as possible
  let panelX = 50;
  let panelY = 12; // top margin

  // If there's a target, ensure the target's y is below the panel; if not, move the target down
  if (step.target) {
    let minTargetY = panelY + panelH + 30;
    if (step.target.y < minTargetY) {
      step.target.y = minTargetY;
    }
  }

  rect(panelX, panelY, panelW, panelH, 10);

  // Title
  fill(100, 100, 255);
  noStroke();
  textSize(22);
  textAlign(CENTER, CENTER);
  text(step.title, width/2, panelY + 15);

  // Body text
  fill(0);
  textSize(14);
  textAlign(LEFT, TOP);
  let textX = panelX + panelPadding;
  let textY = panelY + titleH + panelPadding - 4;
  for (let i = 0; i < bodyLines.length; i++) {
    text(bodyLines[i], textX, textY + i * bodyLineH, panelW - panelPadding * 2);
  }

  // (unit-circle visualization removed as requested)

  // Now draw the target (if any) ensuring it uses updated step.target.y
  if (step.target) {
    // Draw target as a square
    fill(255, 215, 0, 100);
    noStroke();
    rectMode(CENTER);
    rect(step.target.x, step.target.y, step.target.size * 1.6, step.target.size * 1.6);
    
    fill(255, 215, 0);
    stroke(255, 180, 0);
    strokeWeight(3);
    rect(step.target.x, step.target.y, step.target.size, step.target.size);
    rectMode(CORNER);
    
    // Draw star
    fill(255, 180, 0);
    noStroke();
    textSize(30);
    textAlign(CENTER, CENTER);
    text('★', step.target.x, step.target.y);

    // Draw distance lines if hints enabled
    if (showHints && !player.isJumping) {
      stroke(100, 100, 255, 150);
      strokeWeight(2);
      // Horizontal line
      line(player.x, player.y, step.target.x, player.y);
      // Vertical line
      line(step.target.x, player.y, step.target.x, step.target.y);
      
      // Labels
      fill(100, 100, 255);
      noStroke();
      textSize(14);
      textAlign(CENTER, CENTER);
      let dx = abs(step.target.x - player.x);
      let dy = abs(step.target.y - player.y);
      text('Δx = ' + round(dx), (player.x + step.target.x)/2, player.y - 15);
      text('Δy = ' + round(dy), step.target.x + 30, (player.y + step.target.y)/2);
    }
  }
  
  // Draw controls at bottom
  drawLearningControls();
  
  // Check if target hit - square collision detection
  if (step.target && player.isJumping) {
    let halfSize = step.target.size/2;
    // Check if player is inside the square target
    if (player.x > step.target.x - halfSize && 
        player.x < step.target.x + halfSize &&
        player.y > step.target.y - halfSize && 
        player.y < step.target.y + halfSize) {
      // mark as hit (do not toggle the original requireJump flag to preserve step definition)
      step.hit = true;
      if (messageTimer === 0) {
        let messages = [
          '🎯 Perfect hit!',
          '⭐ Excellent!',
          '🎉 Amazing work!',
          '✨ Bullseye!',
          '🏆 Outstanding!'
        ];
        showMessage(random(messages));
      }
    }
  }
  
  // Update message timer and draw message
  if (messageTimer > 0) {
    messageTimer--;
    fill(0, 200, 0, 200);
    noStroke();
    rect(width/2 - 200, 230, 400, 50, 10);
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(message, width/2, 255);
  }
  
  // Draw coordinate display
  fill(0, 0, 0, 200);
  noStroke();
  rect(10, height - 160, 200, 35, 5);
  fill(255, 255, 0);
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Player: (' + round(player.x) + ', ' + round(player.y) + ')', 20, height - 142);
  
  fill(0, 0, 0, 200);
  rect(width - 210, height - 160, 200, 35, 5);
  fill(100, 200, 255);
  textAlign(RIGHT, CENTER);
  text('Mouse: (' + round(mouseX) + ', ' + round(mouseY) + ')', width - 20, height - 142);
}

function drawLearningControls() {
  // Bottom control panel
  fill(255, 255, 255, 230);
  noStroke();
  rect(0, height - 120, width, 120);
  
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Angle: ' + angleInput + '°', 20, height - 95);
  text('Distance: ' + distanceInput + ' px', 20, height - 45);
  
  // Draw angle slider
  fill(200);
  rect(150, height - 105, 200, 20, 5);
  fill(100, 150, 255);
  rect(150, height - 105, map(angleInput, 0, 180, 0, 200), 20, 5);
  
  // Draw distance slider
  fill(200);
  rect(150, height - 55, 200, 20, 5);
  fill(100, 150, 255);
  // Distance slider uses range 50..500 px
  rect(150, height - 55, map(distanceInput, 50, 500, 0, 200), 20, 5);
  
  // Jump button
  if (player.isJumping) {
    fill(150);
  } else {
    fill(100, 200, 100);
  }
  rect(width - 280, height - 90, 120, 60, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text('JUMP!', width - 220, height - 60);
  
  // Navigation buttons
  if (learningStep > 0) {
    fill(150, 150, 200);
    rect(width - 150, height - 90, 60, 25, 5);
    fill(255);
    textSize(14);
    text('Back', width - 120, height - 77);
  }
  
  // Determine if Next should be enabled
  let curStep = learningSteps[learningStep];
  let nextDisabled = (curStep && curStep.requireJump && curStep.target && !curStep.hit);
  if (nextDisabled) {
    fill(120, 120, 140);
  } else {
    fill(150, 150, 200);
  }
  rect(width - 150, height - 55, 60, 25, 5);
  fill(255);
  textSize(14);
  text('Next', width - 120, height - 42);
  
  // Trig calculation display
  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);
  let dx = round(cos(radians(angleInput)) * distanceInput);
  let dy = round(sin(radians(angleInput)) * distanceInput);
  text('Δx = cos(' + angleInput + '°) × ' + distanceInput + ' = ' + dx, 380, height - 95);
  text('Δy = sin(' + angleInput + '°) × ' + distanceInput + ' = ' + dy, 380, height - 75);
  
  // Step counter
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Step ' + (learningStep + 1) + ' of ' + learningSteps.length, width/2, height - 20);
}

function drawPracticeMode() {
  background(240, 245, 250);
  
  updateCamera();
  
  // Draw coordinate grid
  push();
  translate(0, -cameraY);
  
  stroke(200, 220, 240);
  strokeWeight(1);
  
  let gridStartY = floor(cameraY / 50) * 50;
  let gridEndY = gridStartY + height + 100;
  
  for (let x = 0; x < width; x += 50) {
    line(x, gridStartY, x, gridEndY);
  }
  
  for (let y = gridStartY; y < gridEndY; y += 50) {
    line(0, y, width, y);
  }
  
  // Draw level goal line
  stroke(255, 215, 0);
  strokeWeight(3);
  line(0, nextLevelY, width, nextLevelY);
  fill(255, 215, 0);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  let goalLabel = level >= TOTAL_LEVELS ? 'FINAL GOAL' : 'LEVEL ' + (level + 1);
  text(goalLabel, width/2, nextLevelY - 10);
  
  // Draw trig facts
  for (let fact of trigFacts) {
    fill(255, 255, 255, 230);
    stroke(100, 150, 200);
    strokeWeight(2);
    rect(fact.x, fact.y, fact.w, fact.h, 5);
    fill(0);
    noStroke();
    textSize(14);
    // Draw either wrapped lines or single-line centered text
    if (fact.lines && fact.lines.length > 0) {
      textAlign(LEFT, TOP);
      let tx = fact.x + (fact.paddingX || 12);
      let ty = fact.y + (fact.paddingY || 8);
      for (let i = 0; i < fact.lines.length; i++) {
        text(fact.lines[i], tx, ty + i * fact.lineHeight);
      }
    } else {
      textAlign(CENTER, CENTER);
      text(fact.text, fact.x + fact.w/2, fact.y + fact.h/2);
    }
  }
  
  // Draw platforms
  for (let platform of platforms) {
    platform.display();
  }

  // Update and draw enemies
  for (let en of enemies) {
    en.update();
    en.display();
  }

  // Update and draw particles (on top of enemies/player)
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
  
  // Draw player
  player.update();
  player.display();
  
  pop();
  
  checkCollisions();
  
  if (player.y <= nextLevelY && !player.isJumping) {
    generateLevelQuestion();
  }
  
  drawPracticeUI();
  
  if (messageTimer > 0) {
    messageTimer--;
  }
}

function drawCoordinateGrid() {
  // This function is no longer used - grid drawing is inline
}

function drawTrajectoryLine() {
  // This function is no longer used - trajectory drawing is inline
}

function drawPracticeUI() {
  fill(255, 255, 255, 230);
  noStroke();
  rect(0, 0, width, 60);
  
  fill(0);
  textSize(20);
  textAlign(LEFT, CENTER);
  text('Score: ' + score, 20, 20);
  text('Level: ' + level, 20, 40);
  
  textAlign(CENTER, CENTER);
  let distToGoal = round(max(0, player.y - nextLevelY));
  text('Distance to Goal: ' + distToGoal + ' px', width/2, 30);
  
  textAlign(RIGHT, CENTER);
  text('PRACTICE', width - 20, 30);
  
  fill(255, 255, 255, 230);
  rect(0, height - 120, width, 120);
  
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Angle: ' + angleInput + '°', 20, height - 95);
  text('Distance: ' + distanceInput + ' px', 20, height - 45);
  
  textSize(14);
  text('Position: (' + round(player.x) + ', ' + round(player.y) + ')', 380, height - 45);
  
  fill(200);
  rect(150, height - 105, 200, 20, 5);
  fill(100, 150, 255);
  rect(150, height - 105, map(angleInput, 0, 180, 0, 200), 20, 5);
  
  fill(200);
  rect(150, height - 55, 200, 20, 5);
  fill(100, 150, 255);
  // Distance slider uses range 50..500 px
  rect(150, height - 55, map(distanceInput, 50, 500, 0, 200), 20, 5);
  
  if (player.isJumping) {
    fill(150);
  } else {
    fill(100, 200, 100);
  }
  rect(width - 180, height - 90, 160, 60, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text('JUMP!', width - 100, height - 60);
  
  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);
  let dx = round(cos(radians(angleInput)) * distanceInput);
  let dy = round(sin(radians(angleInput)) * distanceInput);
  text('Δx = cos(' + angleInput + '°) × ' + distanceInput + ' = ' + dx, 380, height - 95);
  text('Δy = sin(' + angleInput + '°) × ' + distanceInput + ' = ' + dy, 380, height - 75);
  
  if (messageTimer > 0) {
    fill(0, 0, 0, 200);
    noStroke();
    rect(width/2 - 200, 100, 400, 60, 10);
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(message, width/2, 130);
  }
  
  // Draw coordinate display in practice mode
  fill(0, 0, 0, 200);
  noStroke();
  rect(10, 70, 180, 30, 5);
  fill(255, 255, 0);
  textSize(13);
  textAlign(LEFT, CENTER);
  text('Player: (' + round(player.x) + ', ' + round(player.y) + ')', 18, 85);
  
  fill(0, 0, 0, 200);
  rect(width - 190, 70, 180, 30, 5);
  fill(100, 200, 255);
  textAlign(RIGHT, CENTER);
  text('Mouse: (' + round(mouseX) + ', ' + round(mouseY) + ')', width - 18, 85);
}

function mousePressed() {
  if (slideOverlay) {
    let handled = handleSlideOverlayClick();
    if (handled && sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
    return;
  }

  if (explanationPopup) {
    let layout = getExplanationPopupLayout();
    if (mouseX > layout.button.x && mouseX < layout.button.x + layout.button.w &&
        mouseY > layout.button.y && mouseY < layout.button.y + layout.button.h) {
      if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
      let cb = explanationPopup.onClose;
      explanationPopup = null;
      if (typeof cb === 'function') cb();
    }
    return;
  }

  if (gameState === 'menu') {
    // If popup is showing, let it handle clicks
    if (showColorPopup) {
      // popup coords must match drawColorPopup
      let pw = 560;
      let ph = 320;
      let px = width/2 - pw/2;
      let py = height/2 - ph/2;

      // swatches
      let swCount = playerColorOptions.length;
      let swSize = 64;
      let swSpacing = 20;
      let swTotal = swCount * swSize + (swCount - 1) * swSpacing;
      let swStartX = width/2 - swTotal/2;
      let swY = py + 90;
      // swatch clicks
      if (mouseY > swY && mouseY < swY + swSize && mouseX > swStartX && mouseX < swStartX + swTotal) {
        let idx = floor((mouseX - swStartX) / (swSize + swSpacing));
        idx = constrain(idx, 0, swCount - 1);
        selectedColorIndex = idx;
        playerColor = playerColorOptions[idx].slice();
        if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
        return;
      }

      // Confirm / Cancel buttons
      let bw = 140, bh = 40;
      let bx = width/2 - bw - 16;
      let bx2 = width/2 + 16;
      let by = py + ph - 60;
      // Confirm
      if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
        // Confirm: proceed to chosen mode or just close if color-only
        showColorPopup = false;
        if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
        if (popupTarget === 'learning') startLearning();
        else if (popupTarget === 'practice') startPractice();
        // popupTarget === 'color' -> just close popup
        return;
      }
      // Cancel
      if (mouseX > bx2 && mouseX < bx2 + bw && mouseY > by && mouseY < by + bh) {
        // revert selection
        selectedColorIndex = prevSelectedColorIndex;
        playerColor = playerColorOptions[selectedColorIndex].slice();
        showColorPopup = false;
        if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
        return;
      }
      return;
    }

    // Learning & Practice Mode buttons (match drawMenu buttons)
    let btnW = 320, btnH = 84;
    let btnX = width/2 - btnW/2;
    let ly = 240;
    let py = 340;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > ly && mouseY < ly + btnH) {
      // start Learning immediately (do not force color pick)
      startLearning();
      if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
      return;
    }
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > py && mouseY < py + btnH) {
      // open Practice level select screen
      gameState = 'practiceSelect';
      if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
      return;
    }
    // Player Color button region
    let cy = 440;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > cy && mouseY < cy + btnH) {
      prevSelectedColorIndex = selectedColorIndex;
      popupTarget = 'color';
      showColorPopup = true;
      if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
      return;
    }
  } else if (gameState === 'practiceSelect') {
    let layout = getPracticeSelectLayout();
    // Back to menu
    if (mouseX > layout.backButton.x && mouseX < layout.backButton.x + layout.backButton.w &&
        mouseY > layout.backButton.y && mouseY < layout.backButton.y + layout.backButton.h) {
      gameState = 'menu';
      if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
      return;
    }
    for (let btn of layout.buttons) {
      if (mouseX > btn.x && mouseX < btn.x + btn.w &&
          mouseY > btn.y && mouseY < btn.y + btn.h) {
        if (btn.unlocked) {
          if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
          startPractice(btn.level);
        } else {
          if (sfx.wrong) { try { sfx.wrong.currentTime = 0; sfx.wrong.play(); } catch(e){} }
        }
        return;
      }
    }
  } else if (gameState === 'practice') {
    // Allow clicking anywhere on the slider track to start dragging/update
    if (!player.isJumping) {
      if (mouseX > 140 && mouseX < 360) {
        // angle slider area (expanded tolerance)
        if (mouseY > height - 125 && mouseY < height - 75) {
          draggingAngle = true;
          angleInput = round(constrain(map(mouseX, 150, 350, 0, 180), 0, 180));
          if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
          return;
        }
        // distance slider area
        if (mouseY > height - 75 && mouseY < height - 25) {
          draggingDistance = true;
          distanceInput = round(constrain(map(mouseX, 150, 350, 50, 500), 50, 500));
          if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
          return;
        }
      }
    }

    if (mouseX > width - 180 && mouseX < width - 20 && 
        mouseY > height - 90 && mouseY < height - 30 && !player.isJumping) {
      player.jump();
      if (sfx.jump) { try { sfx.jump.currentTime = 0; sfx.jump.play(); } catch(e){} }
    }
  } else if (gameState === 'learning') {
    // Allow clicking anywhere on the slider track to start dragging/update (learning mode)
    if (!player.isJumping) {
      if (mouseX > 140 && mouseX < 360) {
        if (mouseY > height - 125 && mouseY < height - 75) {
          draggingAngle = true;
          angleInput = round(constrain(map(mouseX, 150, 350, 0, 180), 0, 180));
          if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
          return;
        }
        if (mouseY > height - 75 && mouseY < height - 25) {
          draggingDistance = true;
          distanceInput = round(constrain(map(mouseX, 150, 350, 50, 500), 50, 500));
          if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
          return;
        }
      }
    }

    // Jump button
    if (mouseX > width - 280 && mouseX < width - 160 && 
        mouseY > height - 90 && mouseY < height - 30 && !player.isJumping) {
      player.jump();
    }
    // Back button
    if (learningStep > 0) {
      // Make the back button hit area a bit larger than the visible rect
      let bx = width - 150;
      let by = height - 90;
      let bw = 60;
      let bh = 25;
      let pad = 8;
      if (mouseX >= bx - pad && mouseX <= bx + bw + pad && mouseY >= by - pad && mouseY <= by + bh + pad) {
        learningStep--;
        resetLearningPlayer();
        if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
        return;
      }
    }
    // Next button
    // Next button (larger hit area)
    {
      let nx = width - 150;
      let ny = height - 55;
      let nw = 60;
      let nh = 25;
      let npad = 8;
      if (mouseX >= nx - npad && mouseX <= nx + nw + npad && mouseY >= ny - npad && mouseY <= ny + nh + npad) {
      let step = learningSteps[learningStep];
      
      // Check if this step requires hitting the target
      if (step.requireJump && step.target && !step.hit) {
        showMessage('❌ You must hit the target first!');
        return;
      }

      if (learningStep < learningSteps.length - 1) {
        learningStep++;
        resetLearningPlayer();
        if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
        return;
      } else {
        gameState = 'menu';
        stopMusic();
        if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
        return;
      }
    }
    }
  } else if (gameState === 'gameover') {
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
        mouseY > 400 && mouseY < 460) {
        gameState = 'menu';
        stopMusic();
      if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
    }
  } else if (gameState === 'victory') {
    if (mouseX > width/2 - 120 && mouseX < width/2 + 120 &&
        mouseY > 400 && mouseY < 460) {
      gameState = 'menu';
      stopMusic();
      if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
    }
  } else if (gameState === 'question') {
    for (let i = 0; i < questionOptions.length; i++) {
      let y = 270 + i * 80;
      if (mouseX > width/2 - 250 && mouseX < width/2 + 250 &&
          mouseY > y - 30 && mouseY < y + 30) {
        checkAnswer(i);
        if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
        break;
      }
    }
  } else if (gameState === 'levelquestion') {
    for (let i = 0; i < questionOptions.length; i++) {
      let y = 270 + i * 80;
      if (mouseX > width/2 - 250 && mouseX < width/2 + 250 &&
          mouseY > y - 30 && mouseY < y + 30) {
        checkLevelAnswer(i);
        if (sfx.click) { try { sfx.click.currentTime = 0; sfx.click.play(); } catch(e){} }
        break;
      }
    }
  }
}

function mouseDragged() {
  if (slideOverlay) return;
  if (gameState !== 'practice' && gameState !== 'learning') return;
  if (player.isJumping) return;
  // If the user started dragging a slider, update based on which one
  if (draggingAngle) {
    angleInput = round(constrain(map(mouseX, 150, 350, 0, 180), 0, 180));
  } else if (draggingDistance) {
    distanceInput = round(constrain(map(mouseX, 150, 350, 50, 500), 50, 500));
  } else {
    // fallback: if user drags directly on the track (wider hit area), allow it
    if (mouseX > 140 && mouseX < 360) {
      // angle track area (expanded vertical tolerance)
      if (mouseY > height - 125 && mouseY < height - 75) {
        angleInput = round(constrain(map(mouseX, 150, 350, 0, 180), 0, 180));
      }
      // distance track area
      if (mouseY > height - 75 && mouseY < height - 25) {
        distanceInput = round(constrain(map(mouseX, 150, 350, 50, 500), 50, 500));
      }
    }
  }
}

function mouseReleased() {
  if (slideOverlay) return;
  // clear dragging state for sliders
  draggingAngle = false;
  draggingDistance = false;
}

function startLearning() {
  gameState = 'learning';
  learningStep = 0;
  cameraY = 0;
  learningPlatformY = 350; // Higher up so it's above controls
  // stop any practice music
  stopMusic();

  player = new Player();
  player.x = width/2;
  player.y = learningPlatformY - player.size/2;
  // initialize max height tracking for this session
  maxHeightReached = player.y;
  // reset any previous 'hit' flags on learning steps
  for (let s of learningSteps) {
    s.hit = false;
    // ensure requireJump remains true for those steps that expect a hit
    if (s.target && s.requireJump === undefined) s.requireJump = true;
  }
}

function resetLearningPlayer() {
  player.x = width/2;
  player.y = learningPlatformY - player.size/2;
  player.vx = 0;
  player.vy = 0;
  player.isJumping = false;
  messageTimer = 0;
  // Note: do not clear the `.hit` flag here — once a target is hit it remains recorded
}

function startPractice(startLevel = 1) {
  gameState = 'practice';
  score = 0;
  let targetLevel = startLevel || 1;
  targetLevel = constrain(targetLevel, 1, TOTAL_LEVELS);
  targetLevel = min(targetLevel, highestLevelUnlocked);
  level = targetLevel;
  cameraY = 0;
  lastPlatformSide = 'left';
  
  platforms = [];
  let startPlatform = new Platform(width/2 - 75, height - 100, 150);
  platforms.push(startPlatform);
  
  startY = startPlatform.y;
  nextLevelY = startY - levelHeight;
  
  player = new Player();
  player.x = startPlatform.x + startPlatform.w / 2;
  player.y = startPlatform.y - player.size / 2;
  // initialize max height tracking to the start platform (player's current y)
  maxHeightReached = player.y;
  
  generateLevelPlatforms();
  // start looping music for practice
  playMusic();
  showSlidesForLevel(level);
}

function generateLevelPlatforms() {
  let platformWidth = getPlatformWidth(level);
  let spacing = getPlatformSpacing(level);
  let currentY = startY - spacing;
  
  // Clear old facts
  trigFacts = [];
  
  // If we have structured facts for this level, use them instead of random facts
  let levelFacts = null;
  let lvlObj = getLevelConfig(level);
  if (lvlObj && Array.isArray(lvlObj.facts)) {
    levelFacts = lvlObj.facts.slice();
  }

  while (currentY > nextLevelY - 200) {
    // Strictly alternate sides
    let onLeft = (lastPlatformSide === 'right');
    lastPlatformSide = onLeft ? 'left' : 'right';
    
    let x;
    let factX;
    if (onLeft) {
      // Platform on left, fact on right
      x = random(30, 180);
      factX = width - 220;
    } else {
      // Platform on right, fact on left
      x = random(width - 210, width - 50);
      factX = 20;
    }
    
    platforms.push(new Platform(x, currentY, platformWidth));
    
    // Add a trig fact every 3 platforms
    if (platforms.length % 3 === 0) {
      let factText = null;
      if (levelFacts && levelFacts.length > 0) {
        // Use facts in order (rotate if more placements than facts)
        factText = levelFacts.shift();
        levelFacts.push(factText);
      } else {
        // fallback to randomized facts
        let facts = [
          'sin(30°) = 0.5',
          'cos(45°) = 0.707',
          'sin(90°) = 1',
          'cos(0°) = 1',
          'tan(45°) = 1',
          'sin²θ + cos²θ = 1',
          'sin(60°) = 0.866',
          'cos(60°) = 0.5'
        ];
        factText = random(facts);
      }
      // Compute dynamic size for the fact box based on text, with simple word-wrap
      push();
      textSize(14);
      // Prepare wrapping
      let rawText = String(factText);
      let maxAllowedWidth = min(width * 0.6, 420); // cap width so boxes don't become too wide
      let words = rawText.split(/\s+/);
      let lines = [];
      let cur = '';
      for (let w of words) {
        let test = cur.length ? cur + ' ' + w : w;
        if (textWidth(test) > maxAllowedWidth) {
          if (cur.length) lines.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      }
      if (cur.length) lines.push(cur);

      // If only one short line, allow center-render like before
      let paddingX = 12;
      let paddingY = 8;
      let lineHeight = (textAscent() + textDescent()) + 4;
      let maxW = 0;
      for (let ln of lines) {
        maxW = max(maxW, textWidth(ln));
      }
      if (maxW < 40) maxW = 40;
      let boxW = constrain(maxW + paddingX * 2, 120, maxAllowedWidth + paddingX * 2);
      let boxH = lines.length * lineHeight + paddingY * 2;

      // Position box based on side (factX earlier used as margin); if factX is small -> left side
      let boxX = factX;
      if (factX > width / 2) {
        // right side margin: factX was originally width - 220; place box so its right edge is margin from right
        boxX = width - boxW - 20;
      } else {
        boxX = 20;
      }

      trigFacts.push({
        text: factText,
        lines: lines,
        x: boxX,
        y: currentY - 40,
        w: boxW,
        h: boxH,
        paddingX: paddingX,
        paddingY: paddingY,
        lineHeight: lineHeight
      });
      pop();
    }
    
    currentY -= spacing + random(-30, 30);
  }

  // Generate a handful of airborne square enemies for this level (practice mode)
  enemies = [];
  let enemyCount = max(3, floor((startY - nextLevelY) / 600)); // scale with level height
  for (let i = 0; i < enemyCount; i++) {
    let ey = random(nextLevelY + 80, startY - 120);
    let ex = random(50, width - 80);
    let size = random(30, 48);
    let range = random(80, 220);
    let speed = random(0.8, 2.0) * (random() < 0.5 ? 1 : -1);
    enemies.push(new Enemy(ex, ey, size, size, range, speed));
  }
}

function levelUp() {
  level++;
  highestLevelUnlocked = max(highestLevelUnlocked, level);
  score += 100;
  showMessage('🎉 Level ' + level + ' Complete! Platforms getting harder...');
  
  startY = player.y;
  nextLevelY = startY - levelHeight;
  
  platforms = platforms.filter(p => p.y > player.y + 200);
  // Spawn a centered start platform at the current startY so the player has a safe spawn
  let platformWidth = getPlatformWidth(level);
  let startPlatform = new Platform(width/2 - platformWidth/2, startY, platformWidth);
  platforms.push(startPlatform);

  // Place player on the new centered platform
  player.x = startPlatform.x + startPlatform.w / 2;
  player.y = startPlatform.y - player.size / 2;
  player.vx = 0;
  player.vy = 0;
  player.isJumping = false;
  // reset max height for the new level baseline
  maxHeightReached = player.y;
  
  generateLevelPlatforms();
  
  showSlidesForLevel(level);
  messageTimer = 90;
}

function handleVictory() {
  score += 100;
  stopMusic();
  gameState = 'victory';
  messageTimer = 0;
}

function checkCollisions() {
  // Award points/messages when the player landed during the last update
  if (player.landedThisFrame) {
    // Only award points if player reached a new maximum height (smaller y means higher)
    if (player.y < maxHeightReached) {
      // Award a small bonus for setting a new personal-best height
      score += 10;
      maxHeightReached = player.y;
      let goodJobMessages = [
        '🎯 New high! +10',
        '⭐ Highest yet! +10',
        '🏆 Up you go! +10',
        '✨ New record! +10',
        '🎉 Well done! +10'
      ];
      showMessage(random(goodJobMessages));
    }
    player.landedThisFrame = false; // consume event
  }

  // Enemy collisions: if the player intersects any enemy, make them fall
  for (let en of enemies) {
    if (en.hitCooldown > 0) continue;
    // use player's circle representation
    if (circleRectCollision(player.x, player.y, player.size/2, en.x, en.y, en.w, en.h)) {
      // make player fall
      player.vy = 6;
      player.isJumping = true;
      player.vx = player.vx * 0.5;
      en.hitCooldown = 30; // half-second at 60fps
      showMessage('💥 You hit an enemy!');
      if (sfx.wrong) { try { sfx.wrong.currentTime = 0; sfx.wrong.play(); } catch(e){} }
      // penalize player score for hitting an enemy
      score = max(0, score - 20);
      // spawn particles at collision point
      for (let p = 0; p < 14; p++) {
        let angle = random(0, TWO_PI);
        let speed = random(1, 4);
        let vx = cos(angle) * speed;
        let vy = sin(angle) * speed * 0.6 - 1.5;
        let size = random(3, 7);
        particles.push(new Particle(player.x + random(-4,4), player.y + random(-4,4), vx, vy, size, [220,80,80], 40));
      }
      break;
    }
  }

  // If player fell far below start, ask a question (same as before)
  if (player.y > startY + 100) {
    generateQuestion();
    gameState = 'question';
  }
}

function setQuestionFromData(raw) {
  if (!raw) return;
  currentQuestion = {
    question: raw.question || '',
    explanation: raw.explanation || 'Review this idea before trying again.'
  };
  if (Array.isArray(raw.options) && raw.options.length > 0) {
    questionOptions = raw.options.slice();
  } else {
    questionOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
  }
  if (raw.hasOwnProperty('answer')) {
    correctAnswer = questionOptions.indexOf(raw.answer);
  } else if (typeof raw.correct === 'number') {
    correctAnswer = constrain(raw.correct, 0, questionOptions.length - 1);
  } else {
    correctAnswer = 0;
  }
  if (correctAnswer < 0 || correctAnswer >= questionOptions.length) correctAnswer = 0;
}

function generateQuestion() {
  let levelData = getLevelConfig(level);
  if (levelData && Array.isArray(levelData.questions) && levelData.questions.length > 0) {
    let q = random(levelData.questions);
    setQuestionFromData(q);
    return;
  }

  // fallback small built-in set
  let questions = [
    {
      question: 'What does cos(45°) equal?',
      options: ['0.707', '0.5', '1', '0.866'],
      answer: '0.707',
      explanation: 'cos(45°) = √2/2 ≈ 0.707.'
    },
    {
      question: 'If sin(θ) = 0.5, what is θ?',
      options: ['45°', '30°', '60°', '90°'],
      answer: '30°',
      explanation: 'sin(30°) = 0.5 in the unit circle.'
    },
    {
      question: 'In a right triangle, what does\n"hypotenuse" mean?',
      options: ['Adjacent side', 'Opposite side', 'Longest side', 'Shortest side'],
      answer: 'Longest side',
      explanation: 'The hypotenuse is opposite the right angle and is longest.'
    }
  ];

  setQuestionFromData(random(questions));
}

// Generate a question for level completion. Player must answer correctly to advance.
function generateLevelQuestion() {
  let levelData = getLevelConfig(level);
  if (levelData && Array.isArray(levelData.questions) && levelData.questions.length > 0) {
    setQuestionFromData(random(levelData.questions));
  } else {
    // fallback to small built-in set
    let questions = [
      {
        question: 'Which ratio is defined as adjacent / hypotenuse?',
        options: ['sin(θ)', 'cos(θ)', 'tan(θ)', 'cot(θ)'],
        answer: 'cos(θ)',
        explanation: 'cos(θ) compares the adjacent side to the hypotenuse.'
      },
      {
        question: 'If Δx = cos(θ) × distance, which trig function gives Δy?',
        options: ['sin(θ)', 'cos(θ)', 'tan(θ)', 'sec(θ)'],
        answer: 'sin(θ)',
        explanation: 'sin(θ) gives the vertical component (Δy).'
      },
      {
        question: 'What is cos(0°)?',
        options: ['0', '0.5', '1', '-1'],
        answer: '1',
        explanation: 'cos(0°) = 1 on the unit circle.'
      }
    ];
    setQuestionFromData(random(questions));
  }
  gameState = 'levelquestion';
}

function checkLevelAnswer(selected) {
  if (selected === correctAnswer) {
    let successMsg = level >= TOTAL_LEVELS
      ? '✓ Correct! All levels mastered!'
      : '✓ Correct! Advancing to next level...';
    showMessage(successMsg);
    if (sfx.correct) { try { sfx.correct.currentTime = 0; sfx.correct.play(); } catch(e){} }
    // Play level complete SFX
    if (sfx.levelcomplete) { try { sfx.levelcomplete.currentTime = 0; sfx.levelcomplete.play(); } catch(e){} }
    if (level >= TOTAL_LEVELS) {
      handleVictory();
    } else {
      // Advance level and regenerate platforms
      levelUp();
      // ensure music restarts for the new practice level
      stopMusic();
      playMusic();
      gameState = 'practice';
      messageTimer = 60;
    }
  } else {
    if (sfx.wrong) { try { sfx.wrong.currentTime = 0; sfx.wrong.play(); } catch(e){} }
    let explanation = (currentQuestion && currentQuestion.explanation) ? currentQuestion.explanation : 'Review the concept and try again.';
    showExplanationPopup(explanation, () => {
      showMessage('❌ Incorrect — restarting level...');
      // Reset platforms and player to the level's start platform
      platforms = [];
      let platformWidth = getPlatformWidth(level);
      let startPlatform = new Platform(width/2 - platformWidth/2, startY, platformWidth);
      platforms.push(startPlatform);

      // Reinitialize player on the start platform
      player.x = startPlatform.x + startPlatform.w / 2;
      player.y = startPlatform.y - player.size / 2;
      player.vx = 0;
      player.vy = 0;
      player.isJumping = false;
      // reset camera and max height tracking
      cameraY = 0;
      maxHeightReached = player.y;

      // regenerate platforms/enemies/facts for this level
      generateLevelPlatforms();
      // switch back to practice play
      gameState = 'practice';
      messageTimer = 90;
    });
  }
}

function checkAnswer(selected) {
  if (selected === correctAnswer) {
    showMessage('✓ Correct! Retrying level...');
    if (sfx.correct) { try { sfx.correct.currentTime = 0; sfx.correct.play(); } catch(e){} }
    
    player.x = width/2;
    player.y = startY - player.size/2;
    player.vx = 0;
    player.vy = 0;
    player.isJumping = false;
    cameraY = 0;
    
    gameState = 'practice';
    messageTimer = 60;
  } else {
    if (sfx.wrong) { try { sfx.wrong.currentTime = 0; sfx.wrong.play(); } catch(e){} }
    let explanation = (currentQuestion && currentQuestion.explanation) ? currentQuestion.explanation : 'Review the fact and try again.';
    showExplanationPopup(explanation, () => {
      gameState = 'gameover';
    });
  }
}

function updateCamera() {
  cameraY = player.y - height * 0.5;
}

function showMessage(msg) {
  message = msg;
  messageTimer = 60;
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 30;
    this.vx = 0;
    this.vy = 0;
    this.isJumping = false;
    this.lastY = this.y;
    this.landedThisFrame = false;
  }
  
  update() {
    this.lastY = this.y;
    this.landedThisFrame = false;

    if (this.isJumping) {
      // Sub-step movement to avoid tunneling through platforms when velocity is large
      let maxStep = max(abs(this.vx), abs(this.vy), 1);
      let steps = ceil(max(1, maxStep / 4));
      steps = min(10, steps);

      let stepVX = this.vx / steps;
      let stepVY = this.vy / steps;
      let landed = false;

      for (let s = 0; s < steps; s++) {
        let nextX = this.x + stepVX;
        let nextY = this.y + stepVY;

        // Check collisions for both downward (landing on top) and upward (hitting underside)
        if (gameState === 'practice' || gameState === 'learning') {
          for (let platform of platforms) {
            let minX = min(this.x, nextX);
            let maxX = max(this.x, nextX);
            if (maxX > platform.x && minX < platform.x + platform.w) {
              // Landing on top when moving down
              if (stepVY > 0) {
                if (this.y + this.size/2 <= platform.y && nextY + this.size/2 >= platform.y) {
                  // land on top
                  this.x = (this.x + nextX) / 2;
                  this.y = platform.y - this.size/2;
                  this.vy = 0;
                  this.vx = 0;
                  this.isJumping = false;
                  this.landedThisFrame = true;
                  landed = true;
                  break;
                }
              }
              // Hitting underside when moving up
              else if (stepVY < 0) {
                if (this.y - this.size/2 >= platform.y + platform.h && nextY - this.size/2 <= platform.y + platform.h) {
                  // hit underside: place player just below platform bottom and stop upward motion
                  this.x = (this.x + nextX) / 2;
                  this.y = platform.y + platform.h + this.size/2;
                  this.vy = 0;
                  // keep horizontal velocity
                  landed = false;
                  // do not mark as landedThisFrame
                  break;
                }
              }
            }
          }

          if (landed) break;

          // Check learning-mode starting platform (single centered platform)
          if (gameState === 'learning') {
            let pX = width/2 - 100;
            let pW = 200;
            let pY = learningPlatformY;
            let minX = min(this.x, nextX);
            let maxX = max(this.x, nextX);
            if (maxX > pX && minX < pX + pW) {
              if (stepVY > 0) {
                if (this.y + this.size/2 <= pY && nextY + this.size/2 >= pY) {
                  this.x = (this.x + nextX) / 2;
                  this.y = pY - this.size/2;
                  this.vy = 0;
                  this.vx = 0;
                  this.isJumping = false;
                  this.landedThisFrame = true;
                  landed = true;
                  break;
                }
              } else if (stepVY < 0) {
                if (this.y - this.size/2 >= pY + 15 && nextY - this.size/2 <= pY + 15) {
                  // treat platform.h as 15 (same as Platform.h)
                  this.x = (this.x + nextX) / 2;
                  this.y = pY + 15 + this.size/2;
                  this.vy = 0;
                  break;
                }
              }
            }
          }
        }

        // advance by one sub-step
        this.x += stepVX;
        this.y += stepVY;
      }

      // apply gravity once per frame (not per sub-step)
      if (!landed) {
        this.vy += 0.5;
      }

      // screen bounds
      if (this.x < this.size/2) {
        this.x = this.size/2;
        this.vx = -this.vx * 0.7;
      }
      if (this.x > width - this.size/2) {
        this.x = width - this.size/2;
        this.vx = -this.vx * 0.7;
      }
    }
  }
  
  display() {
    // use selected player color
    fill(playerColor[0], playerColor[1], playerColor[2]);
    // darker stroke
    let strokeCol = [max(0, floor(playerColor[0]*0.5)), max(0, floor(playerColor[1]*0.5)), max(0, floor(playerColor[2]*0.6))];
    stroke(strokeCol[0], strokeCol[1], strokeCol[2]);
    strokeWeight(3);
    circle(this.x, this.y, this.size);
    
    fill(strokeCol[0], strokeCol[1], strokeCol[2]);
    noStroke();
    rect(this.x - 10, this.y - 3, 20, 6, 3);
  }
  
  jump() {
    let angleRad = radians(angleInput);
    let targetX = this.x + cos(angleRad) * distanceInput;
    let targetY = this.y - sin(angleRad) * distanceInput;
    
    let frames = 30;
    this.vx = (targetX - this.x) / frames;
    
    let gravity = 0.5;
    this.vy = (targetY - this.y - 0.5 * gravity * frames * frames) / frames;
    
    this.isJumping = true;
  }
  
  land(platformY) {
    this.y = platformY - this.size/2;
    this.vy = 0;
    this.vx = 0;
    this.isJumping = false;
    this.landedThisFrame = true;
  }
}

class Platform {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 15;
  }
  
  display() {
    fill(139, 69, 19);
    stroke(101, 67, 33);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 3);
  }
}

// Enemy class: square airborne enemies that patrol horizontally
class Enemy {
  constructor(x, y, w, h, range = 120, vx = 1.2) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.origin = x;
    this.range = range;
    this.leftBound = max(10, this.origin - this.range/2);
    this.rightBound = min(width - this.w - 10, this.origin + this.range/2);
    this.hitCooldown = 0; // frames remaining in cooldown after hitting player
  }

  update() {
    if (this.hitCooldown > 0) this.hitCooldown--;
    this.x += this.vx;
    if (this.x < this.leftBound) {
      this.x = this.leftBound;
      this.vx *= -1;
    } else if (this.x > this.rightBound) {
      this.x = this.rightBound;
      this.vx *= -1;
    }
  }

  display() {
    push();
    noStroke();
    fill(200, 50, 50);
    rect(this.x, this.y, this.w, this.h, 4);
    // optional simple eyes
    fill(20);
    rect(this.x + this.w*0.2, this.y + this.h*0.25, this.w*0.15, this.h*0.15, 2);
    rect(this.x + this.w*0.6, this.y + this.h*0.25, this.w*0.15, this.h*0.15, 2);
    pop();
  }
}

// Utility: circle-rect collision
function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
  let testX = cx;
  if (cx < rx) testX = rx;
  else if (cx > rx + rw) testX = rx + rw;
  let testY = cy;
  if (cy < ry) testY = ry;
  else if (cy > ry + rh) testY = ry + rh;
  let dx = cx - testX;
  let dy = cy - testY;
  return (dx*dx + dy*dy) <= r*r;
}

// Particle for simple hit effect
class Particle {
  constructor(x, y, vx, vy, size, color, life = 40) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.life = life;
    this.age = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.12; // gravity
    this.age++;
    this.life--;
  }

  display() {
    push();
    noStroke();
    let alpha = map(this.life, 0, 40, 0, 255);
    fill(this.color[0], this.color[1], this.color[2], alpha);
    circle(this.x, this.y, this.size);
    pop();
  }
}
