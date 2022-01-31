const ball = document.querySelector(".ball");
const glare = document.querySelector(".glare");
const obstacle_L = document.querySelector(".obstacle_L");
const obstacle_R = document.querySelector(".obstacle_R");
const text = document.querySelector(".text");
const gnd = document.querySelector(".gnd");
let isPlay = 0;
let isRestart = 0;
let isDieComplete = 0;
let obstacleIsDown = 0;
let countOfFireEffect = 40;
let isEnableFireEffect = true;
let lives = 10;
let ballColor;
let ground;
let ballSize;
let winWidth;
let winHeight
let maxHeight;
let middle;
let speed = 1.50;
let xCoef = 3.0;
let fallCoef = 0.0;
let maxpowerY;
let borderL, borderR, borderH;
let obstacleHoleSize = 2; // > 1.5
let hiScore;

Start ();

function Start() {
  hiScore = localStorage.getItem("hiScore");
  if (hiScore == null) {
    hiScore = 0;
    localStorage.setItem("hiScore", hiScore);
  }
  
  ballSize = ball.clientHeight;
  winHeight = document.documentElement.clientHeight;
  ground = winHeight - ballSize;
  winWidth = document.documentElement.clientWidth;
  maxHeight = winHeight / 2 - ballSize;
  middle = document.documentElement.clientWidth / 2;
  gnd.style.top = ground;
  gnd.style.height = ballSize;
  ball.style.left = middle - ballSize / 2;
  ball.style.top = winHeight - ballSize * 2;
  speed = 1;
  maxpowerY = 25;
  score = 0;
  ballColor = `rgb(${100-lives*10},0,${lives*10})`;
  ball.style.background = ballColor;
  text.textContent = "Нажмите для старта";
  text.style.color = "yellow";
  text.style.width = winWidth;
  text.style.left = 0;
  text.style.fontSize = ballSize / 2;
 
  borderL = randomInt(0, winWidth - ballSize * obstacleHoleSize);
  borderR = borderL + ballSize * obstacleHoleSize;
  obstacle_L.style.height = obstacle_R.style.height = ballSize/2;
  
  obstacle_L.style.width = borderL;
  obstacle_R.style.width = winWidth - borderR;
  
  obstacle_L.style.left = -2;
  obstacle_R.style.left = borderR;
  borderH = obstacle_L.style.top = obstacle_R.style.top = 0;
  
  for (let i = 0; i < countOfFireEffect; i++) {
    fireX = randomInt(0, gnd.clientWidth);
    fireY = randomInt(0, gnd.clientHeight);
    gnd.innerHTML += `<div class="fireEffect fire${i}" style = "left: ${fireX}px; top: ${fireY}px"></div>`;
  }
  requestAnimationFrame(preLoop);
}
function preLoop() {
  if (isPlay == 1) { 
    text.textContent = `Очки: ${score}`
    text.style.color = "gray";
    text.style.top = ballSize/8;
    text.style.fontSize = ballSize / 4;
    requestAnimationFrame(MainLoop);
  }
  else requestAnimationFrame(preLoop);
}
let spd = 0;
let isFalling = false;
let powerY = 0;
let x = 0, y = 0;
let step = 0;
let fireSpeed = 4;
let borderEffectTim = 0;
let borderEffect = 0;
let borderOpacity = 0;

function MainLoop() {
  //if (isRestart == 1) location.reload();
  if (isPlay == 1 || true) {
    if (++borderEffectTim > 2) {
      borderOpacity += 0.2;
      if (borderOpacity > 0.8) borderOpacity = 0.0;
      obstacle_L.style.opacity = borderOpacity
      obstacle_R.style.opacity = 0.8 - borderOpacity;
      borderEffectTim = 0;
      borderEffect = !borderEffect;
      col1 = "blue";
      col2 = "#00ffec";
      obstacle_L.style.background = borderEffect == 0 ? `linear-gradient(rgba(0,0,0,0), ${col1}, white, ${col2}, rgba(0,0,0,0))` : `linear-gradient(rgba(0,0,0,0), ${col2}, white, ${col1}, rgba(0,0,0,0))`;
      obstacle_R.style.background = borderEffect == 1 ? `linear-gradient(rgba(0,0,0,0), ${col1}, white, ${col2}, rgba(0,0,0,0))` : `linear-gradient(rgba(0,0,0,0), ${col2}, white, ${col1}, rgba(0,0,0,0))`;
      obstacle_L.style.borderTopRightRadius = ballSize + "px";
      obstacle_L.style.borderBottomRightRadius = ballSize + "px";
      obstacle_R.style.borderTopLeftRadius = ballSize + "px";
      obstacle_R.style.borderBottomLeftRadius = ballSize + "px";
    }
    
    if (isEnableFireEffect) {
      if (step++ < countOfFireEffect - 1);
      else step = 0;
      let fireHeight = gnd.clientHeight;
      currentFire = gnd.children[step];
      if (currentFire.offsetTop < fireHeight / 5) {
        currentFire.style.top = fireHeight;
        currentFire.style.left = randomInt(0, gnd.clientWidth); 
      }
      else {
        currentFire.style.top = currentFire.offsetTop - fireSpeed;
      }
    }
   
    let bY = ball.offsetTop;
    let bX = ball.offsetLeft;
    let bD = ballSize;
    if (bX < winWidth - ballSize) {
      if (x > middle && bY < ground - ballSize) {
        ball.style.left = bX + speed * xCoef;
      }
    }
    if (bX > 0) {
      if (x < middle && bY < ground - ballSize) {
        ball.style.left = bX - speed * xCoef;
      }
    }
  
    isFalling = (powerY == 0) ? true : false;
    
    if (powerY > speed) {
      if (powerY > 0) powerY -= speed;
      if (bY > maxHeight) {
        ball.style.top = bY - powerY;
      }
      else { // движение препятствия
        borderH = obstacle_L.offsetTop;
        borderH = obstacle_L.style.top = obstacle_R.style.top = borderH + powerY;
        if (borderH > winHeight) { // возврат препятствия в начало
          obstacleIsDown = 0; 
          borderL = randomInt(0, winWidth - ballSize * obstacleHoleSize);
          borderR = borderL + ballSize * obstacleHoleSize;
          obstacle_L.style.height = obstacle_R.style.height = ballSize/2;
          obstacle_L.style.width = borderL;
          obstacle_R.style.width = winWidth - borderR;
          obstacle_L.style.left = -2;
          obstacle_R.style.left = borderR;
          borderH = obstacle_L.style.top = obstacle_R.style.top = -ballSize;
        }
      }
      spd = 0;
    }
    else powerY = 0;
    if (bY+bD/2 < ground && powerY == 0) {
      spd += speed + speed * fallCoef;
      if (bY + spd > ground - bD/2) {
        ball.style.top = ground - bD/2;
      }
      else {
        ball.style.top = bY + spd;
      }
    }
    checkCollision(bX, bY, bD);
    if (lives < 0) {
      isDie();
    }
  }
  requestAnimationFrame(MainLoop);
}

function isDie() {
  if (hiScore < score) {
    hiScore = score;
    localStorage.setItem("hiScore", hiScore);
  }
  text.innerHTML = `Ваш результат: ${score} <br>Рекорд: ${localStorage.getItem("hiScore")}`;
  text.style.color = "yellow";
  text.style.width = winWidth;
  text.style.top = winHeight / 2 - text.offsetHeight / 2;
  text.style.left = 0;
  text.style.fontSize = ballSize / 2;
  
  isPlay = 0;
  isRestart = 0;
  isDieComplete = 1;
  requestAnimationFrame(isDie);
}

function checkCollision(bX, bY, bD) {
  if (((bY < borderH + bD/2 && 
      bY + bD/2 > borderH ||
      bY + bD > borderH &&
      bY + bD/2 < borderH) &&
      (bX < borderL || 
      bX + bD > borderR)) ||
      bY + bD/2 >= ground) { // пересечение
        ball.style.background = "red";
        lives --;
        ballColor = `rgb(${100-lives*10},0,${lives*10})`;
        ball.style.background = ballColor;
        return 0;
      }
  else {
    ball.style.background = ballColor = `rgb(${100-lives*10},0,${lives*10})`;
    if (obstacleIsDown == 0) {
      if (bY < obstacle_R.offsetTop) {
        obstacleIsDown = 1; 
        score++;
        ballColor = `rgb(${100-lives*10},0,${lives*10})`;
        text.textContent = `Очки: ${score}`
        text.style.color = "gray";
        text.style.top = ballSize/8;
        text.style.fontSize = ballSize / 4;
      }
    }
  }
  return 1;
}

function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

document.addEventListener("touchstart", (e) => {
  powerY = maxpowerY;
  x = e.changedTouches[0].pageX;
  y = e.changedTouches[0].pageY;
  
  if (isDieComplete == 1) {
    isDieComplete = 0;
    isRestart = 1;
    location.reload();
    Start();
  }
  else {
    isPlay = 1;
  }
  
}, false);

document.addEventListener("keydown", (e) => { 
  if (e.key == "ArrowLeft") {
    powerY = maxpowerY;
    x = winWidth / 4;
    
    if (isDieComplete == 1) {
      isDieComplete = 0;
      isRestart = 1;
      location.reload();
      Start();
    }
    else {
      isPlay = 1;
    }
  }
  
  if (e.key == "ArrowRight") {
    powerY = maxpowerY;
    x = winWidth - 10;
    
    if (isDieComplete == 1) {
      isDieComplete = 0;
      isRestart = 1;
      location.reload();
      Start();
    }
    else {
      isPlay = 1;
    }
  }
  
}, false);