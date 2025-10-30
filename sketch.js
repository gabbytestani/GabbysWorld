// Planet links
let planet1, planet2, planet3, planet4, planet5, planet6, planet7, planet8, planet9;
let titleElement;

// Planet data structure
let planets = [];

let titleX = 50;
let titleY = 50;
let titleVX = 0.15;
let titleVY = 0.15;

// Page state management
let currentPage = 'galaxy'; // 'galaxy', 'webcam', 'bubbles', 'purgatory'
let backButton;

// Webcam page variables
let cam;
let scale = 8;
let prevPixels = [];
let particles = [];

// Bubbles page variables
let xVals = [];
let yVals = [];
let numSegments = 150;
let bubbles = [];
let ambientMusic;
let popSounds = [];
let musicStarted = false;

// Purgatory page variables
let rows = 50;
let cols = 100;
let purgMusicStarted = false;
let osc1, osc2, osc3;
let lfo1, lfo2;
let reverb, delay;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Created HTML elements for galaxy page
  titleElement = createElement('h1', 'MY SUPER AWESOME AND INCREDIBLY EPIC MULTI DIMENSIONAL GALAXY');
  titleElement.style('color', 'white');
  titleElement.style('font-size', '24px');
  titleElement.style('font-weight', 'bold');
  titleElement.style('text-shadow', '0 0 20px cyan');
  titleElement.style('position', 'absolute');
  titleElement.style('z-index', '10');
  titleElement.style('pointer-events', 'none');
  titleElement.style('letter-spacing', '3px');
  titleElement.style('font-family', 'Oswald');
  
  // Created planet links - these will be buttons that change pages
  planet1 = createA('https://www.cameronsworld.net/', 'CAMERONS WORLD IS SO LIT');
  planet1.attribute('target', '_self');
  stylePlanetLink(planet1);
  
  planet2 = createA('https://rotatingsandwiches.com/', 'Rotating Sandwiches');
  planet2.attribute('target', '_self');
  stylePlanetLink(planet2);
  
  planet3 = createA('https://alwaysjudgeabookbyitscover.com/', 'Eating PPl is Wrong');
  planet3.attribute('target', '_self');
  stylePlanetLink(planet3);
  
  planet4 = createA('http://corndog.io/', 'Corndogs');
  planet4.attribute('target', '_self');
  stylePlanetLink(planet4);
  
  planet5 = createButton('See Yourself For What You Really Are');
  planet5.mousePressed(() => switchToPage('webcam'));
  stylePlanetLink(planet5);
  
  planet6 = createButton('What I Think Purgatory Looks Like');
  planet6.mousePressed(() => switchToPage('purgatory'));
  stylePlanetLink(planet6);
  
  planet7 = createButton('Ambient Bubbles');
  planet7.mousePressed(() => switchToPage('bubbles'));
  stylePlanetLink(planet7);
  
  planet8 = createButton('This Code Was Somewhat An Accident');
  planet8.mousePressed(() => switchToPage('bubbles'));
  stylePlanetLink(planet8);
  
  planet9 = createA('https://www.github.com/', 'Meep');
  planet9.attribute('target', '_self');
  stylePlanetLink(planet9);
  
  // Created back button (hidden initially)
  backButton = createButton('← Back to Galaxy');
  backButton.position(20, 20);
  backButton.style('background-color', 'rgba(0,0,0,0.7)');
  backButton.style('color', 'white');
  backButton.style('border', 'none');
  backButton.style('padding', '10px 20px');
  backButton.style('border-radius', '5px');
  backButton.style('cursor', 'pointer');
  backButton.style('font-size', '16px');
  backButton.style('z-index', '1000');
  backButton.mousePressed(() => switchToPage('galaxy'));
  backButton.hide();
  
  // Initialized planet data with positions, velocities, sizes, and types
  planets = [
    { x: random(100, width - 100), y: random(100, height - 100), vx: 0.15, vy: 0.2, size: 65, link: planet1, type: 'cratered', color: color(255, 140, 80) },
    { x: random(100, width - 100), y: random(100, height - 100), vx: -0.18, vy: 0.15, size: 110, link: planet2, type: 'ringed', color: color(78, 205, 196) },
    { x: random(100, width - 100), y: random(100, height - 100), vx: 0.2, vy: -0.18, size: 55, link: planet3, type: 'lumpy', color: color(200, 247, 120) },
    { x: random(100, width - 100), y: random(100, height - 100), vx: -0.15, vy: -0.2, size: 85, link: planet4, type: 'spotted', color: color(255, 105, 180) },
    { x: random(100, width - 100), y: random(100, height - 100), vx: 0.22, vy: 0.12, size: 30, link: planet5, type: 'asteroid', color: color(147, 112, 219) },
    { x: random(100, width - 100), y: random(100, height - 100), vx: -0.2, vy: -0.15, size: 95, link: planet6, type: 'heavilyCratered', color: color(64, 224, 208) },
    { x: random(100, width - 100), y: random(100, height - 100), vx: 0.18, vy: 0.22, size: 70, link: planet7, type: 'rocky', color: color(205, 92, 92) },
    { x: random(100, width - 100), y: random(100, height - 100), vx: -0.12, vy: 0.18, size: 130, link: planet8, type: 'gasGiant', color: color(135, 206, 250) },
    { x: random(100, width - 100), y: random(100, height - 100), vx: 0.25, vy: -0.12, size: 40, link: planet9, type: 'irregular', color: color(60, 179, 113) }
  ];
  
  // Setup for webcam page
  setupWebcam();
  
  // Setup for bubbles page
  setupBubbles();
  
  // Setup for purgatory page
  setupPurgatory();
}

function switchToPage(page) {
  currentPage = page;
  
  if (page === 'galaxy') {
    // Showed galaxy elements
    titleElement.show();
    for (let p of planets) {
      p.link.show();
    }
    backButton.hide();
    
    // Stopped other page audio
    if (cam) cam.stop();
    if (ambientMusic && musicStarted) {
      ambientMusic.stop();
      musicStarted = false;
    }
    if (purgMusicStarted) {
      osc1.stop();
      osc2.stop();
      osc3.stop();
      lfo1.stop();
      lfo2.stop();
      purgMusicStarted = false;
    }
  } else {
    // Hid galaxy elements
    titleElement.hide();
    for (let p of planets) {
      p.link.hide();
    }
    backButton.show();
    
    // Started appropriate page
    if (page === 'webcam' && cam) {
      cam.loop();
    } else if (page === 'bubbles') {
      // Reset bubbles
      bubbles = [];
      for (let i = 0; i < numSegments; i++) {
        xVals[i] = width / 2;
        yVals[i] = height / 2;
      }
    } else if (page === 'purgatory' && !purgMusicStarted) {
      startPurgatoryMusic();
    }
  }
}

function stylePlanetLink(link) {
  link.style('position', 'absolute');
  link.style('background', 'transparent');
  link.style('border', 'none');
  link.style('cursor', 'pointer');
  link.style('z-index', '5');
  link.style('color', 'white');
  link.style('font-size', '18px');
  link.style('font-weight', 'bold');
  link.style('text-align', 'center');
  link.style('font-family', 'Georgia');
}

function draw() {
  if (currentPage === 'galaxy') {
    drawGalaxy();
  } else if (currentPage === 'webcam') {
    drawWebcam();
  } else if (currentPage === 'bubbles') {
    drawBubbles();
  } else if (currentPage === 'purgatory') {
    drawPurgatory();
  }
}

function drawGalaxy() {
  background(10, 14, 39);
  
  // Drew the twinkling stars
  for (let i = 0; i < 150; i++) {
    let starX = (i * 137.5) % width;
    let starY = (i * 217.3) % height;
    let brightness = map(sin(frameCount * 0.05 + i), -1, 1, 100, 255);
    fill(brightness);
    noStroke();
    circle(starX, starY, 2);
  }
  
  // Checked collisions between all planets
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      checkCollision(planets[i], planets[j]);
    }
  }
  
  // Updated and drew all planets
  for (let planet of planets) {
    // Moved planet
    planet.x += planet.vx;
    planet.y += planet.vy;
    
    // Bounced off edges
    let radius = planet.size / 2;
    if (planet.x > width - radius || planet.x < radius) planet.vx *= -1;
    if (planet.y > height - radius || planet.y < radius) planet.vy *= -1;
    
    // Kept within bounds
    planet.x = constrain(planet.x, radius, width - radius);
    planet.y = constrain(planet.y, radius, height - radius);
    
    // Drew planet based on type
    switch(planet.type) {
      case 'cratered':
        drawCrateredPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
      case 'ringed':
        drawRingedPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
      case 'lumpy':
        drawLumpyPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
      case 'spotted':
        drawSpottedPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
      case 'asteroid':
        drawAsteroidPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
      case 'heavilyCratered':
        drawHeavilyCrateredPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
      case 'rocky':
        drawRockyPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
      case 'gasGiant':
        drawGasGiantPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
      case 'irregular':
        drawIrregularPlanet(planet.x, planet.y, planet.size, planet.color);
        break;
    }
    
    // Positioned text below planet
    let textOffset = planet.size / 2 + 15;
    planet.link.position(planet.x - 60, planet.y + textOffset);
  }
  
  // Moved title with bounce, kept it within canvas bounds
  let titleWidth = 600;
  let titleHeight = 60;
  if (titleX > width - titleWidth || titleX < 0) titleVX *= -1;
  if (titleY > height - titleHeight || titleY < 0) titleVY *= -1;
  titleX = constrain(titleX, 0, width - titleWidth);
  titleY = constrain(titleY, 0, height - titleHeight);
  titleX += titleVX;
  titleY += titleVY;
  titleElement.position(titleX, titleY);
}

// Collision detection - used this function to detect when planets got too close
function checkCollision(p1, p2) {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  let distance = sqrt(dx * dx + dy * dy);
  let minDist = (p1.size + p2.size) / 2;
  
  if (distance < minDist) {
    // Collision detected so used this model for bounce
    let angle = atan2(dy, dx);
    let targetX = p1.x + cos(angle) * minDist;
    let targetY = p1.y + sin(angle) * minDist;
    
    let ax = (targetX - p2.x);
    let ay = (targetY - p2.y);
    
    p1.vx -= ax * 0.05;
    p1.vy -= ay * 0.05;
    p2.vx += ax * 0.05;
    p2.vy += ay * 0.05;
    
    // Separated planets to prevent overlap
    let overlap = minDist - distance;
    let separateX = (overlap / 2) * cos(angle);
    let separateY = (overlap / 2) * sin(angle);
    
    p1.x -= separateX;
    p1.y -= separateY;
    p2.x += separateX;
    p2.y += separateY;
  }
}

// GALAXY PLANET DRAWING FUNCTIONS
function drawCrateredPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  circle(0, 0, size);
  fill(0, 0, 0, 40);
  circle(-size * 0.25, -size * 0.15, size * 0.35);
  circle(size * 0.2, size * 0.2, size * 0.25);
  circle(size * 0.1, -size * 0.3, size * 0.2);
  circle(-size * 0.15, size * 0.25, size * 0.18);
  pop();
}

function drawRingedPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  circle(0, 0, size);
  fill(0, 0, 0, 20);
  ellipse(0, -size * 0.2, size * 0.9, size * 0.15);
  ellipse(0, size * 0.1, size * 0.95, size * 0.2);
  noFill();
  stroke(red(col), green(col), blue(col), 150);
  strokeWeight(8);
  ellipse(0, 0, size * 1.6, size * 0.5);
  strokeWeight(4);
  ellipse(0, 0, size * 1.8, size * 0.55);
  pop();
}

function drawLumpyPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  circle(0, 0, size);
  circle(size * 0.2, size * 0.1, size * 0.6);
  circle(-size * 0.15, -size * 0.2, size * 0.5);
  circle(size * 0.1, -size * 0.25, size * 0.4);
  pop();
}

function drawSpottedPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  circle(0, 0, size);
  fill(0, 0, 0, 30);
  circle(-size * 0.2, size * 0.15, size * 0.3);
  circle(size * 0.25, -size * 0.1, size * 0.4);
  circle(size * 0.05, size * 0.3, size * 0.25);
  circle(-size * 0.3, -size * 0.2, size * 0.2);
  fill(255, 255, 255, 40);
  circle(size * 0.15, size * 0.15, size * 0.2);
  circle(-size * 0.1, -size * 0.25, size * 0.15);
  pop();
}

function drawAsteroidPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  beginShape();
  for (let a = 0; a < TWO_PI; a += PI / 6) {
    let r = size * random(0.4, 0.6);
    let px = r * cos(a);
    let py = r * sin(a);
    vertex(px, py);
  }
  endShape(CLOSE);
  fill(0, 0, 0, 50);
  circle(size * 0.1, 0, size * 0.3);
  circle(-size * 0.15, size * 0.1, size * 0.2);
  pop();
}

function drawHeavilyCrateredPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 22;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  circle(0, 0, size);
  fill(0, 0, 0, 35);
  circle(-size * 0.3, -size * 0.2, size * 0.4);
  circle(size * 0.25, size * 0.15, size * 0.35);
  circle(size * 0.1, -size * 0.3, size * 0.25);
  circle(-size * 0.2, size * 0.3, size * 0.3);
  circle(size * 0.3, -size * 0.1, size * 0.2);
  circle(-size * 0.1, -size * 0.1, size * 0.25);
  circle(size * 0.15, size * 0.35, size * 0.2);
  pop();
}

function drawRockyPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  circle(0, 0, size);
  fill(0, 0, 0, 25);
  for (let i = 0; i < 8; i++) {
    let angle = i * PI / 4;
    let r = size * 0.25;
    let px = r * cos(angle);
    let py = r * sin(angle);
    circle(px, py, size * random(0.15, 0.25));
  }
  pop();
}

function drawGasGiantPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  circle(0, 0, size);
  fill(255, 255, 255, 30);
  ellipse(0, -size * 0.25, size * 0.95, size * 0.12);
  fill(0, 0, 0, 15);
  ellipse(0, 0, size * 0.98, size * 0.15);
  fill(255, 255, 255, 25);
  ellipse(0, size * 0.2, size * 0.92, size * 0.13);
  fill(255, 100, 100, 60);
  ellipse(size * 0.25, size * 0.1, size * 0.3, size * 0.2);
  pop();
}

function drawIrregularPlanet(x, y, size, col) {
  push();
  translate(x, y);
  drawingContext.shadowBlur = 12;
  drawingContext.shadowColor = `rgba(${red(col)}, ${green(col)}, ${blue(col)}, 0.8)`;
  fill(col);
  noStroke();
  beginShape();
  vertex(-size * 0.5, -size * 0.2);
  vertex(-size * 0.3, -size * 0.5);
  vertex(size * 0.2, -size * 0.4);
  vertex(size * 0.5, -size * 0.1);
  vertex(size * 0.4, size * 0.3);
  vertex(size * 0.1, size * 0.5);
  vertex(-size * 0.3, size * 0.4);
  vertex(-size * 0.5, size * 0.2);
  endShape(CLOSE);
  fill(0, 0, 0, 40);
  circle(0, 0, size * 0.3);
  circle(size * 0.2, -size * 0.1, size * 0.2);
  pop();
}

// WEBCAM PAGE SETUP AND DRAW
function setupWebcam() {
  cam = createCapture(VIDEO);
  cam.size(1280/scale, 960/scale);
  cam.hide();
}

function drawWebcam() {
  background(0);
  cam.loadPixels();
  
  let index = 0;
  for(let y = 0; y < cam.height; y++){
    for(let x = 0; x < cam.width; x++){
      let r = cam.pixels[index];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      
      let prevBrightness = prevPixels[index] || 0;
      let diff = abs(brightness - prevBrightness);
      
      let purpleR = map(brightness, 0, 255, 50, 180);
      let purpleG = map(brightness, 0, 255, 0, 100);
      let purpleB = map(brightness, 0, 255, 150, 255);
      
      fill(purpleR, purpleG, purpleB);
      
      let size = scale;
      let shakeX = 0;
      let shakeY = 0;
      
      if(diff > 20) {
        size = scale + map(diff, 20, 100, 0, scale * 2);
        shakeX = random(-diff/10, diff/10);
        shakeY = random(-diff/10, diff/10);
        
        if(diff > 50 && random() > 0.95) {
          particles.push({
            x: x * scale + scale/2,
            y: y * scale + scale/2,
            vx: random(-3, 3),
            vy: random(-3, 3),
            life: 255,
            size: random(2, 8)
          });
        }
      }
      
      noStroke();
      circle(x * scale + scale/2 + shakeX, y * scale + scale/2 + shakeY, size);
      
      prevPixels[index] = brightness;
      index += 4;
    }
  }
  
  for(let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    fill(150, 100, 255, p.life);
    circle(p.x, p.y, p.size);
    
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 5;
    p.size *= 0.98;
    
    if(p.life <= 0) particles.splice(i, 1);
  }
  
  cam.updatePixels();
}

// BUBBLES PAGE SETUP AND DRAW
function setupBubbles() {
  for (let i = 0; i < numSegments; i++) {
    xVals[i] = width / 2;
    yVals[i] = height / 2;
  }
}

function drawBubbles() {
  setGradient(0, 0, width, height, color(150, 200, 230), color(180, 220, 240));
  
  if (!musicStarted) {
    fill(255, 255, 255, 200);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text('Click anywhere to start music', width / 2, height / 2);
    return;
  }
  
  xVals[numSegments - 1] = random(width);
  yVals[numSegments - 1] = random(height);
  
  for (let i = 0; i < numSegments - 1; i++) {
    xVals[i] = xVals[i + 1];
    yVals[i] = yVals[i + 1];
  }
  
  if (frameCount % 3 === 0) {
    for (let i = 0; i < numSegments - 1; i++) {
      let isBlue = random() > 0.5;
      let r = isBlue ? 100 : 150;
      let g = isBlue ? 150 : 100;
      let b = 255;
      let diameter = sin(map(i, 0, numSegments, 0, PI * 2)) * 150;
      
      if (diameter > 20) {
        bubbles.push(new Bubble(xVals[i], yVals[i], diameter, r, b, i));
      }
    }
  }
  
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    
    if (bubbles[i].isDead()) {
      bubbles.splice(i, 1);
    }
  }
  
  if (mouseIsPressed) {
    for (let bubble of bubbles) {
      let d = dist(mouseX, mouseY, bubble.x, bubble.y);
      if (d < bubble.diameter / 2 && !bubble.popping) {
        bubble.startPop();
      }
    }
  }
}

class Bubble {
  constructor(x, y, diameter, colorR, colorB, index) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.colorR = colorR;
    this.colorB = colorB;
    this.index = index;
    this.lifespan = 255;
    this.popping = false;
    this.popProgress = 0;
    this.popSpeed = random(0.3, 0.8);
    this.shimmer = random(TWO_PI);
    this.wobble = random(0.02, 0.05);
    this.age = 0;
  }
  
  update() {
    this.age++;
    this.shimmer += 0.03;
    
    if (!this.popping) {
      this.lifespan -= 0.15;
      if (this.age > 180 && random() < 0.003) {
        this.startPop();
      }
    } else {
      this.popProgress += this.popSpeed;
    }
  }
  
  startPop() {
    if (!this.popping) {
      this.popping = true;
    }
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    let alpha = this.lifespan;
    let size = this.diameter;
    
    if (this.popping) {
      let popFactor = this.popProgress / 50;
      size *= (1 + popFactor * 0.3);
      alpha *= max(0, 1 - popFactor);
      
      if (this.popProgress > 20) {
        this.drawFragments();
      }
    }
    
    let wobbleX = sin(this.shimmer) * 3;
    let wobbleY = cos(this.shimmer * 1.3) * 3;
    
    noFill();
    for (let i = 3; i > 0; i--) {
      stroke(this.colorR, 50, this.colorB, alpha * 0.1 * i);
      strokeWeight(i * 2);
      ellipse(wobbleX, wobbleY, size + i * 8);
    }
    
    fill(255, 255, 255, alpha * 0.1);
    stroke(this.colorR, 100, this.colorB, alpha);
    strokeWeight(2);
    ellipse(wobbleX, wobbleY, size);
    
    noStroke();
    fill(255, 255, 255, alpha * 0.6);
    let highlightSize = size * 0.25;
    ellipse(wobbleX - size * 0.2, wobbleY - size * 0.2, highlightSize);
    
    fill(255, 255, 255, alpha * 0.3);
    ellipse(wobbleX + size * 0.15, wobbleY + size * 0.15, highlightSize * 0.5);
    
    pop();
  }
  
  drawFragments() {
    let fragments = 8;
    for (let i = 0; i < fragments; i++) {
      let angle = (TWO_PI / fragments) * i;
      let distance = this.popProgress * 2;
      let fragX = cos(angle) * distance;
      let fragY = sin(angle) * distance;
      let fragAlpha = max(0, this.lifespan * (1 - this.popProgress / 50));
      
      noStroke();
      fill(this.colorR, 150, this.colorB, fragAlpha);
      ellipse(fragX, fragY, 8, 4);
    }
  }
  
  isDead() {
    return this.lifespan <= 0 || (this.popping && this.popProgress > 50);
  }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

// PURGATORY PAGE SETUP AND DRAW
function setupPurgatory() {
  // Audio setup happens when page is activated
}

function startPurgatoryMusic() {
  if (purgMusicStarted) return;
  
  userStartAudio();
  purgMusicStarted = true;
  
  reverb = new p5.Reverb();
  delay = new p5.Delay();
  
  delay.process(reverb, 0.12, 0.7, 2300);
  reverb.set(3, 2);
  
  osc1 = new p5.Oscillator('sine');
  osc2 = new p5.Oscillator('sine');
  osc3 = new p5.Oscillator('triangle');
  
  lfo1 = new p5.Oscillator('sine');
  lfo2 = new p5.Oscillator('sine');
  
  lfo1.freq(0.1);
  lfo2.freq(0.07);
  lfo1.amp(20);
  lfo2.amp(30);
  
  osc1.disconnect();
  osc2.disconnect();
  osc3.disconnect();
  
  osc1.connect(reverb);
  osc2.connect(delay);
  osc3.connect(reverb);
  
  osc1.freq(523.25);
  osc2.freq(659.25);
  osc3.freq(783.99);
  
  osc1.amp(0.08);
  osc2.amp(0.06);
  osc3.amp(0.05);
  
  osc1.start();
  osc2.start();
  osc3.start();
  
  lfo1.start();
  lfo2.start();
  
  lfo1.disconnect();
  lfo2.disconnect();
  lfo1.connect(osc1.freq());
  lfo2.connect(osc2.freq());
  
  changePurgatoryChord();
}

function changePurgatoryChord() {
  if (!purgMusicStarted) return;
  
  let chords = [
    [523.25, 659.25, 783.99],
    [440.00, 523.25, 659.25],
    [493.88, 622.25, 739.99],
    [587.33, 698.46, 830.61],
    [466.16, 587.33, 698.46]
  ];
  
  let randomChord = random(chords);
  
  osc1.freq(randomChord[0], 4);
  osc2.freq(randomChord[1], 5);
  osc3.freq(randomChord[2], 6);
  
  setTimeout(changePurgatoryChord, random(5000, 10000));
}

function drawPurgatory() {
  background(255);
  translate(0.2*width/cols, 0.2*height/rows);
  
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let scalar = dist(mouseX, mouseY, (x * width) / cols, (y * height) / rows);
      scalar = map(scalar, 0, width, width/cols, 5);
      
      let animatedScalar = scalar + 20 * noise(x*0.1, y*0.1, frameCount*0.01);
      
      let color1 = color(255, 100, 150);
      let color2 = color(100, 150, 255);
      let lerpAmount = map(y, 0, rows-1, 0, 1);
      let ombreColor = lerpColor(color1, color2, lerpAmount);
      
      fill(ombreColor);
      noStroke();
      
      ellipse(
        (x * width) / cols,
        (y * height) / rows,
        animatedScalar,
        animatedScalar
      );
    }
  }
}

function mousePressed() {
  if (currentPage === 'bubbles' && !musicStarted) {
    musicStarted = true;
    userStartAudio();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}