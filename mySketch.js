const BOX_INITIAL_COUNT = 10;
const FONT_SIZE_OPTIONS = [15, 20, 25, 30, 35];
const BOX_GENERATION_RATE = 3;
const BOX_BATCH_SIZE = 1;
const CANVAS_SIZE = 2500;
const BACKGROUND_COLOR = 100;

let engine, ground, boxes = [], selectedColors, fontFamilies = {};

function preload() {
  const fonts = [
    '', 'Arabic', 'KR', 'JP', 'TC', 'Lao',
    'Khmer', 'Georgian', 'Hebrew', 'Devanagari', 'Thai', 'SC'
  ];

  fonts.forEach(font => {
    fontFamilies[`notoSans${font}`] = loadFont(`fonts/NotoSans${font}-Regular.ttf`);
    console.log(`notoSans${font}`);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  background(BACKGROUND_COLOR);
  selectedColors = random(colorSets);
  setupPhysics();
  generateBoxes(BOX_INITIAL_COUNT);
}

function setupPhysics() {
  const { Engine, Bodies, World } = Matter;
  engine = Engine.create();
  ground = createWall(width / 2, height + 30, width, 60);
  const wallLeft = createWall(-15, height / 2, 30, height);
  const wallRight = createWall(width + 15, height / 2, 30, height);
  World.add(engine.world, [ground, wallLeft, wallRight]);
  Engine.run(engine);
}

function createWall(x, y, width, height) {
  const { Bodies } = Matter;
  return Bodies.rectangle(x, y, width, height, { isStatic: true });
}

function getFontForText(text) {
    // This is a simple mapping and may not cover every edge case.
    const charCode = text.charCodeAt(0);

    if ((charCode >= 0x0041 && charCode <= 0x005A) || 
        (charCode >= 0x0061 && charCode <= 0x007A) || 
        (charCode >= 0x00C0 && charCode <= 0x017F)) {
        return fontFamilies['notoSans'];
    }
    if (charCode >= 0x0600 && charCode <= 0x06FF) {
        return fontFamilies['notoSansArabic'];
    }
    if (charCode >= 0xAC00 && charCode <= 0xD7AF) {
        return fontFamilies['notoSansKR'];
    }
    if (charCode >= 0x3040 && charCode <= 0x30FF || charCode >= 0x31F0 && charCode <= 0x31FF) {
        return fontFamilies['notoSansJP'];
    }
    if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
        return fontFamilies['notoSansTC'];
    }
    if (charCode >= 0x0E80 && charCode <= 0x0EFF) {
        return fontFamilies['notoSansLao'];
    }
    if (charCode >= 0x1780 && charCode <= 0x17FF) {
        return fontFamilies['notoSansKhmer'];
    }
    if (charCode >= 0x10A0 && charCode <= 0x10FF) {
        return fontFamilies['notoSansGeorgian'];
    }
    if (charCode >= 0x0590 && charCode <= 0x05FF) {
        return fontFamilies['notoSansHebrew'];
    }
    if (charCode >= 0x0900 && charCode <= 0x097F) {
        return fontFamilies['notoSansDevanagari'];
    }
    if (charCode >= 0x0E00 && charCode <= 0x0E7F) {
        return fontFamilies['notoSansThai'];
    }
    if (charCode >= 0x4E00 && charCode <= 0x9FAF) {
        return notoSansSC; // Simplified Chinese
    }
    // ... (other if statements for different fonts)
    return fontFamilies['notoSans']; // Default fallback to NotoSans-Regular
}

function generateBoxes(count) {
  for (let i = 0; i < count; i++) {
    const x = random(width);
    const y = random(height);
    generateNewBox(x, y);
  }
}

function generateNewBox(x = mouseX, y = mouseY) {
  const { Bodies, World } = Matter;
  const word = random(words);
  const fontSize = random(FONT_SIZE_OPTIONS);
  const boxWidth = max(word.length * fontSize * 0.75 + 20, fontSize * 2 + 20);
  const boxHeight = fontSize * 2 + 20;

  const box = Bodies.rectangle(x, y, boxWidth, boxHeight, {
    isStatic: false,
    friction: 0.53,
    frictionAir: 0.025,
    restitution: 1,
    chamfer: { radius: boxHeight / 2 }
  });

  Object.assign(box, {
    color: random(selectedColors),
    fontSize,
    char: word,
    font: getFontForText(word)
  });

  boxes.push(box);
  World.add(engine.world, box);
}

function draw() {
  background(BACKGROUND_COLOR);
  fill(0);
  rect(0, 0, width, height);
  drawBoxes();

  if (mouseIsPressed && frameCount % BOX_GENERATION_RATE === 0) {
    for (let i = 0; i < BOX_BATCH_SIZE; i++) {
        generateNewBox(mouseX, mouseY);
    }
  }
}

function drawBoxes() {
  boxes.forEach(box => {
    displayBox(box);
    displayText(box);
  });
}

function displayBox(box) {
  const { vertices } = box;
  fill(box.color);
  stroke(0);
  strokeWeight(2);
  beginShape();
  vertices.forEach(({ x, y }) => vertex(x, y));
  endShape(CLOSE);
}

function displayText(box) {
  push();
  translate(box.position.x, box.position.y);
  rotate(box.angle);
  fill(0);
  noStroke();
  textFont(box.font);
  textSize(box.fontSize);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(box.char, 0, 0);
  pop();
}

function keyPressed() {
  if (key === ' ') {
    saveCanvas('myCanvas', 'png');
  }
}

// Add your colorSets and words arrays below
const colorSets = [
    /*
    "#d9534f-#ea8685-#f9ddd6-#32a287-#237a6f-#ffbb44".split("-"),
    "#6699ac-#ef476f-#ffd166-#06d6a0-#5ad1a0-#ffcc99".split("-"),
    "#6b84a3-#e63946-#f1faee-#a8dadc-#90c3d4-#f4d35e".split("-"),
    "#6f87a6-#bae8e8-#ffd166-#ee6c4d-#aad4d9-#e9c46a".split("-"),
    "#6093a9-#d62828-#f77f00-#fcbf49-#eae2b7-#2a9d8f".split("-"),
    "#7c8eb4-#ff6978-#ffed66-#30e3ca-#9aa8af-#ffc3a0".split("-"),
    "#898eb9-#eec0c6-#f0e6ef-#d5c1eb-#bea2e4-#ffd670".split("-"),
    "#8fa0ae-#e94560-#f8b400-#07beb8-#a0a3c6-#f4e04d".split("-")
    */
    "#D32F2F-#1976D2-#388E3C-#FBC02D-#8E24AA-#0288D1-#7B1FA2-#F57C00-#C2185B-#455A64".split("-"),
    "#E57373-#81C784-#64B5F6-#FFD54F-#A1887F-#7986CB-#4FC3F7-#FF8A65-#AED581-#4DD0E1".split("-"),
    "#FFB74D-#BA68C8-#FF80AB-#4DB6AC-#FFF176-#90A4AE-#FF9E80-#A5D6A7-#80DEEA-#B0BEC5".split("-"),
    "#536DFE-#FFEA00-#40C4FF-#FF6D00-#76FF03-#DD2C00-#C51162-#00C853-#AA00FF-#0091EA".split("-"),
    "#FFAB91-#B39DDB-#FF5252-#69F0AE-#448AFF-#DCE775-#FF6E40-#7E57C2-#B2FF59-#1DE9B6".split("-"),
];

const words = [
    'TEN YEARS',           // English
    'DIEZ AÑOS',           // Spanish
    'DIX ANS',             // French
    'ZEHN JAHRE',          // German
    'DIECI ANNI',          // Italian
    'DEZ ANOS',            // Portuguese
    'TIEN JAAR',           // Dutch
    'ΔΈΚΑ ΧΡΌΝΙΑ',         // Greek
    'ON YIL',              // Turkish
    'TIO ÅR',              // Swedish
    'TI ÅR',               // Norwegian
    'TI ÅR',               // Danish
    'KYMMENEN VUOTTA',     // Finnish
    'ДЕСЕТ ГОДИНИ',        // Bulgarian (Cyrillic)
    'ДЕСЕТ ГОДИНА',        // Serbian (Cyrillic)
    'ДЕСЕТ ГОДИНИ',        // Macedonian (Cyrillic)
    'SEPULUH TAHUN',       // Indonesian
    'SEPULUH TAHUN',       // Malay
    'SAMPUNG TAON',        // Filipino
    'NAPULUHANG TAON',     // Visayan (e.g., Cebuano)
    'MƯỜI NĂM',            // Vietnamese
    'عشر سنوات',           // Arabic
    'עשור',                // Hebrew
    'दस वर्ष',             // Hindi (Devanagari)
    '십 년',                // Korean
    '十年',                // Chinese Simplified
    '十年',                // Chinese Traditional
    'ათი წელი',           // Georgian
    'ສິບ ປີ',            // Lao
    '១០ ឆ្នាំ',            // Khmer numeral for ten
    'สิบปี',               // Thai
    'DZIESIĘĆ LAT',       // Polish
    'DESET LET',           // Czech
    'DESAŤ ROKOV',        // Slovak
    'TÍZ ÉV',              // Hungarian
    'ZECE ANI',            // Romanian
    'KÜMME AASTAT',       // Estonian
    'DESMIT METI',         // Latvian
    'DEŠIMT METŲ',        // Lithuanian
    'ДАҲ СОЛ',             // Tajik (Cyrillic)
    'ОН ЖЫЛ',              // Kazakh (Cyrillic)
    'ОН ЙИЛ',              // Uzbek (Cyrillic)
];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(BACKGROUND_COLOR);
}