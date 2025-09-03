// Searching Visualizer JS
// Linear + Binary search visualization, responsive, with stop/start

// Elements & state
const barsContainer = document.getElementById("bars");
const sizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");
const generateBtn = document.getElementById("generateBtn");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const algoSelect = document.getElementById("algorithm");
const targetInput = document.getElementById("target");
const sortedToggle = document.getElementById("sortedToggle");

let array = [];
let arraySize = +sizeSlider.value || 30;
let delay = 120;
let stopRequested = false;

// Helpers
const isMobile = () => window.innerWidth <= 768;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
function clamp(n, a, b){ return Math.max(a, Math.min(b,n)); }

// Map speed slider (1..50) to delay ms (bigger slider = faster => smaller ms)
function setDelayFromSlider(v){
  // map 1..50 to 700..20 roughly (reverse)
  const maxMs = 700, minMs = 20;
  const t = clamp(+v, 1, 50);
  // we want slider low => slow (high ms), slider high => fast (low ms)
  delay = Math.round(maxMs - (t-1) * ((maxMs-minMs)/49));
}

// Responsive max size
function maxArraySize(){
  return isMobile() ? 20 : 35;
}
sizeSlider.max = maxArraySize();

// Apply bar style depending on orientation
function applyBarStyle(bar, value){
  if(isMobile()){
    // horizontal pill
    const maxVal = Math.max(...array);
    const percent = maxVal ? (value / maxVal) * 92 : 10;
    bar.style.width = percent + "%";
    bar.style.height = "36px";
    bar.style.borderRadius = "18px";
    bar.textContent = value;
  } else {
    // vertical
    const containerW = barsContainer.clientWidth;
    // compute width per bar, leave some gap
    const per = Math.max(10, Math.floor((containerW / array.length) - 6));
    bar.style.width = per + "px";
    const maxVal = Math.max(...array);
    const usable = Math.max(20, barsContainer.clientHeight - 40);
    const h = maxVal ? Math.round((value / maxVal) * usable) : usable/2;
    bar.style.height = Math.max(6, h) + "px";

    // show number only if bar is wide enough
    if(per > 22){
      bar.textContent = value;
      bar.style.fontSize = "12px";
    } else {
      bar.textContent = "";
      bar.title = value;
    }
  }
}

// repaint
function restyleAll(){
  const bars = document.querySelectorAll(".bar");
  bars.forEach((b, i) => applyBarStyle(b, array[i]));
}

// Generate array (optionally sorted)
function generateArray(size = arraySize, sorted=false){
  arraySize = Math.min(size, maxArraySize());
  array = [];
  barsContainer.innerHTML = "";
  for(let i=0;i<arraySize;i++){
    const v = Math.floor(Math.random()*300)+10;
    array.push(v);
  }
  if(sorted) array.sort((a,b)=>a-b);
  array.forEach(v=>{
    const div = document.createElement("div");
    div.className = "bar";
    applyBarStyle(div, v);
    barsContainer.appendChild(div);
  });
}

// Utility to clear highlights
function clearHighlights(){
  document.querySelectorAll(".bar").forEach(b=>{
    b.classList.remove("compare","found","mid");
  });
}

// Swap not needed (we do not animate swaps for searching)

// Linear search animation
async function linearSearch(target){
  const bars = document.querySelectorAll(".bar");
  for(let i=0;i<array.length;i++){
    if(stopRequested) return -1;
    bars[i].classList.add("compare");
    await sleep(delay);
    if(array[i] === target){
      bars[i].classList.remove("compare");
      bars[i].classList.add("found");
      return i;
    }
    bars[i].classList.remove("compare");
  }
  return -1;
}

// Binary search animation (assumes array is sorted ascending)
async function binarySearch(target){
  const bars = document.querySelectorAll(".bar");
  let left = 0, right = array.length - 1;
  while(left <= right){
    if(stopRequested) return -1;
    const mid = Math.floor((left + right) / 2);
    // highlight mid
    bars[mid].classList.add("mid");
    await sleep(delay);
    // compare
    bars[mid].classList.add("compare");
    await sleep(Math.round(delay/1.5));
    if(array[mid] === target){
      bars[mid].classList.remove("compare");
      bars[mid].classList.add("found");
      return mid;
    } else if(array[mid] < target){
      bars[mid].classList.remove("compare");
      bars[mid].classList.remove("mid");
      left = mid + 1;
    } else {
      bars[mid].classList.remove("compare");
      bars[mid].classList.remove("mid");
      right = mid - 1;
    }
  }
  return -1;
}

// Controls wiring
generateBtn.addEventListener("click", ()=>{
  stopRequested = true;
  setTimeout(()=>{ stopRequested = false; }, 10); // ensure any running loop can notice
  const s = +sizeSlider.value;
  const sorted = sortedToggle.checked;
  generateArray(s, sorted);
});

sizeSlider.addEventListener("input", (e)=>{
  const s = +e.target.value;
  // clamp by device
  const max = maxArraySize();
  if(s > max) sizeSlider.value = max;
  generateArray(+sizeSlider.value, sortedToggle.checked);
});

speedSlider.addEventListener("input", (e)=>{
  setDelayFromSlider(e.target.value);
});

window.addEventListener("resize", ()=>{
  sizeSlider.max = maxArraySize();
  const max = maxArraySize();
  if(+sizeSlider.value > max) {
    sizeSlider.value = max;
    generateArray(max, sortedToggle.checked);
  } else {
    restyleAll();
  }
});

// Start / Stop
startBtn.addEventListener("click", async ()=>{
  clearHighlights();
  stopRequested = false;
  toggleUI(true);
  const algo = algoSelect.value;
  let target = parseInt(targetInput.value, 10);
  if(Number.isNaN(target)){
    // if no target provided, pick random existing value for demo
    target = array[Math.floor(Math.random()*array.length)];
    targetInput.value = target;
  }

  // If binary search, ensure array sorted visually (instant)
  if(algo === "binary"){
    array.sort((a,b)=>a-b);
    // rebuild bars quickly
    barsContainer.innerHTML = "";
    array.forEach(v=>{
      const div = document.createElement("div");
      div.className = "bar";
      applyBarStyle(div, v);
      barsContainer.appendChild(div);
    });
  }

  let idx = -1;
  try {
    if(algo === "linear") idx = await linearSearch(target);
    else idx = await binarySearch(target);
  } catch(e){
    // stopRequested may have caused early exit
    console.error(e);
  }

  if(idx >= 0){
    // flash found bar
    const bars = document.querySelectorAll(".bar");
    bars[idx].classList.add("found");
    // keep it for a moment
    await sleep(800);
  } else {
    // optionally show "not found" via a small flash in container border
    barsContainer.style.boxShadow = "0 0 0 4px rgba(220,53,69,0.12)";
    setTimeout(()=> barsContainer.style.boxShadow = "", 600);
  }

  toggleUI(false);
});

stopBtn.addEventListener("click", ()=>{
  stopRequested = true;
});

// enable/disable UI elements (start/generate while running)
function toggleUI(running){
  // keep target & algorithm disabled while running
  document.querySelectorAll("button, input, select").forEach(el=>{
    el.disabled = running;
  });
  // allow pressing Stop while running
  stopBtn.disabled = !running;
}

// initial setup
setDelayFromSlider(speedSlider.value);
sizeSlider.max = maxArraySize();
generateArray(+sizeSlider.value, sortedToggle.checked);
