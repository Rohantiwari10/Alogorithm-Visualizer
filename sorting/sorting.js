// ----------------------------
// State & Elements
// ----------------------------
let array = [];
let arraySize = 30;
let delay = 50; // ms between steps (mapped from speed slider)
let stopRequested = false; // stop flag

const barsContainer = document.getElementById("bars");
const sizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");
const generateBtn = document.getElementById("generateBtn");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");  // stop button
const algoSelect = document.getElementById("algorithm");

// ----------------------------
// Utilities
// ----------------------------
const isMobile = () => window.innerWidth <= 768;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function toggleControls(disabled) {
  document
    .querySelectorAll("button, input, select")
    .forEach((el) => (el.disabled = disabled));
}

// Orientation-aware gradient
function defaultGradient() {
  return isMobile()
    ? "linear-gradient(90deg, #00ccff, #ff66cc)"
    : "linear-gradient(180deg, #00ccff, #ff66cc)";
}

// Max array size depending on device
function maxArraySize() {
  return isMobile() ? 20 : 60;
}

// Map value -> desktop height in px
function heightFor(value) {
  const maxVal = Math.max(...array);
  const usable = Math.max(50, barsContainer.clientHeight - 16); // padding room
  return Math.max(6, Math.round((value / maxVal) * usable));
}

// Apply style to a single bar
function applyBarStyle(bar, value) {
  if (isMobile()) {
    let maxVal = Math.max(...array);
    let width = (value / maxVal) * 90; // scale to 90% of container width

    bar.style.width = width + "%";
    bar.style.height = "35px";
    bar.style.background = "linear-gradient(90deg, #00ccff, #ff66cc)";
    bar.style.display = "flex";
    bar.style.justifyContent = "flex-end";
    bar.style.alignItems = "center";
    bar.style.paddingRight = "10px";
    bar.style.color = "#fff";
    bar.innerText = value;
  } else {
    // Desktop vertical bar
    bar.style.height = `${value}px`;
    bar.style.width = `${600 / arraySize}px`;
    bar.style.background = "linear-gradient(180deg, #00ccff, #ff66cc)";
    bar.style.display = "flex";
    bar.style.justifyContent = "center";
    bar.style.alignItems = "flex-end";

    bar.style.fontSize = "12px";
    bar.style.color = "#fff";
    bar.innerText = value;
  }
}

// Repaint all bars after orientation change
function restyleAllBars() {
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar, i) => applyBarStyle(bar, array[i]));
}

// ----------------------------
// Array & Bars
// ----------------------------
function generateArray(size = arraySize) {
  arraySize = Math.min(size, maxArraySize()); // cap size
  array = [];
  barsContainer.innerHTML = "";

  for (let i = 0; i < arraySize; i++) {
    const value = Math.floor(Math.random() * 300) + 20; // 20..319
    array.push(value);

    const bar = document.createElement("div");
    bar.className = "bar"; // reset classes
    applyBarStyle(bar, value);
    barsContainer.appendChild(bar);
  }
}

// Keep visuals correct when device rotates / viewport changes
window.addEventListener("resize", () => {
  sizeSlider.max = maxArraySize();
  if (arraySize > sizeSlider.max) {
    sizeSlider.value = sizeSlider.max;
    generateArray(sizeSlider.max);
  } else {
    restyleAllBars();
  }
});

// ----------------------------
// Swap utility
// ----------------------------
async function swapBars(i, j) {
  [array[i], array[j]] = [array[j], array[i]];
  const bars = document.querySelectorAll(".bar");
  applyBarStyle(bars[i], array[i]);
  applyBarStyle(bars[j], array[j]);
  await sleep(delay);
}

// Highlight compare
function setCompare(i, j, on = true) {
  const bars = document.querySelectorAll(".bar");
  [i, j].forEach((idx) => {
    if (idx < 0) return;
    bars[idx].classList.toggle("is-compare", on);
  });
}

// ----------------------------
// Sorting Algorithms
// ----------------------------
async function bubbleSort() {
  const n = array.length;
  const bars = document.querySelectorAll(".bar");

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (stopRequested) return; // stop check
      setCompare(j, j + 1, true);
      if (array[j] > array[j + 1]) {
        await swapBars(j, j + 1);
      }
      setCompare(j, j + 1, false);
      await sleep(delay);
    }
    bars[n - i - 1].classList.add("is-sorted");
  }
}

async function insertionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 1; i < array.length; i++) {
    if (stopRequested) return; // stop check
    let j = i;
    while (j > 0 && array[j] < array[j - 1]) {
      if (stopRequested) return;
      setCompare(j - 1, j, true);
      await swapBars(j, j - 1);
      setCompare(j, j + 1, false);
      j--;
    }
  }
  bars.forEach((b) => b.classList.add("is-sorted"));
}

async function mergeSort(start = 0, end = array.length - 1) {
  if (stopRequested) return;
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;
  const bars = document.querySelectorAll(".bar");

  while (i < left.length && j < right.length) {
    if (stopRequested) return;
    bars[k].classList.add("is-compare");
    if (left[i] <= right[j]) {
      array[k] = left[i++];
    } else {
      array[k] = right[j++];
    }
    applyBarStyle(bars[k], array[k]);
    bars[k].classList.remove("is-compare");
    await sleep(delay);
    k++;
  }
  while (i < left.length) {
    if (stopRequested) return;
    array[k] = left[i++];
    applyBarStyle(bars[k], array[k]);
    await sleep(delay);
    k++;
  }
  while (j < right.length) {
    if (stopRequested) return;
    array[k] = right[j++];
    applyBarStyle(bars[k], array[k]);
    await sleep(delay);
    k++;
  }
  for (let idx = start; idx <= end; idx++) bars[idx].classList.add("is-sorted");
}

async function quickSort(start = 0, end = array.length - 1) {
  if (stopRequested) return;
  if (start >= end) return;
  const pivotIndex = await partition(start, end);
  await quickSort(start, pivotIndex - 1);
  await quickSort(pivotIndex + 1, end);
}

async function partition(start, end) {
  const bars = document.querySelectorAll(".bar");
  const pivotValue = array[end];
  let i = start;
  bars[end].classList.add("is-pivot");

  for (let j = start; j < end; j++) {
    if (stopRequested) return;
    setCompare(j, end, true);
    if (array[j] < pivotValue) {
      if (i !== j) await swapBars(i, j);
      setCompare(j, end, false);
      i++;
    } else {
      setCompare(j, end, false);
    }
  }
  if (i !== end) await swapBars(i, end);
  bars[end].classList.remove("is-pivot");
  bars[i].classList.add("is-sorted");
  return i;
}

// ----------------------------
// Controls / Events
// ----------------------------
generateBtn.addEventListener("click", () => {
  stopRequested = true; // cancel any running sort
  generateArray(arraySize);
});

sizeSlider.addEventListener("input", (e) => {
  generateArray(+e.target.value);
});

speedSlider.addEventListener("input", (e) => {
  delay = Math.max(5, Math.round(1000 / +e.target.value));
});

startBtn.addEventListener("click", async () => {
  stopRequested = false;
  toggleControls(true);
  stopBtn.disabled = false; // enable stop while running
  const algo = algoSelect.value;
  if (algo === "bubble") await bubbleSort();
  else if (algo === "insertion") await insertionSort();
  else if (algo === "merge") await mergeSort();
  else if (algo === "quick") await quickSort();
  toggleControls(false);
});

stopBtn.addEventListener("click", () => {
  stopRequested = true; // stop signal
  toggleControls(false); // re-enable UI
});

// ----------------------------
// Init
// ----------------------------
window.addEventListener("load", () => {
  sizeSlider.max = maxArraySize();
  generateArray(arraySize);
});
