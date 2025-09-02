let array = [];
let delay = 200; // default speed (ms)
let arraySize = 30;

const barsContainer = document.getElementById("bars");

// ==============================
// Utility Functions
// ==============================

// Update array size
function updateSize(size) {
  arraySize = size;
  generateArray(size);
}

// Update sorting speed
function updateSpeed(speed) {
  delay = speed;
}

// Sleep utility for animation delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Swap utility
async function swap(bar1, bar2) {
  let tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;
  await sleep(delay);
}

// ==============================
// Array Generation
// ==============================
function generateArray(size = arraySize) {
  array = [];
  barsContainer.innerHTML = "";
  let isMobile = window.innerWidth <= 768;

  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 300) + 20;
    array.push(value);

    const bar = document.createElement("div");
    bar.classList.add("bar");

    if (isMobile) {
      // Horizontal bars: width = value, height fixed
      bar.style.height = `20px`;
      bar.style.width = `${Math.max(value, 5)}px`;
    } else {
      // Vertical bars
      bar.style.height = `${value}px`;
      bar.style.width = `${600 / size}px`;
    }

    barsContainer.appendChild(bar);
  }
}

// Adjust bars dynamically on resize
window.addEventListener("resize", () => generateArray(arraySize));


// ==============================
// Sorting Algorithms
// ==============================

// Bubble Sort
async function bubbleSort() {
  let bars = document.querySelectorAll(".bar");
  for (let i = 0; i < bars.length; i++) {
    for (let j = 0; j < bars.length - i - 1; j++) {
      bars[j].style.background = "red";
      bars[j + 1].style.background = "red";

      if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
        await swap(bars[j], bars[j + 1]);
      }

      bars[j].style.background = "#00ccff";
      bars[j + 1].style.background = "#00ccff";
      await sleep(delay);
    }
  }
}

// Insertion Sort
async function insertionSort() {
  let bars = document.querySelectorAll(".bar");
  for (let i = 1; i < bars.length; i++) {
    let j = i;
    while (
      j > 0 &&
      parseInt(bars[j].style.height) < parseInt(bars[j - 1].style.height)
    ) {
      bars[j].style.background = "red";
      bars[j - 1].style.background = "red";
      await swap(bars[j], bars[j - 1]);
      bars[j].style.background = "#00ccff";
      bars[j - 1].style.background = "#00ccff";
      j--;
    }
    await sleep(delay);
  }
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let bars = document.querySelectorAll(".bar");
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);
  let k = start,
    i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    bars[k].style.background = "red";
    if (left[i] <= right[j]) {
      array[k] = left[i];
      bars[k].style.height = `${left[i]}px`;
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = `${right[j]}px`;
      j++;
    }
    await sleep(delay);
    bars[k].style.background = "#00ccff";
    k++;
  }

  while (i < left.length) {
    array[k] = left[i];
    bars[k].style.height = `${left[i]}px`;
    i++;
    k++;
    await sleep(delay);
  }

  while (j < right.length) {
    array[k] = right[j];
    bars[k].style.height = `${right[j]}px`;
    j++;
    k++;
    await sleep(delay);
  }
}

// Quick Sort
async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) return;

  let index = await partition(start, end);
  await quickSort(start, index - 1);
  await quickSort(index + 1, end);
}

async function partition(start, end) {
  let bars = document.querySelectorAll(".bar");
  let pivotValue = array[end];
  let pivotIndex = start;

  for (let i = start; i < end; i++) {
    bars[i].style.background = "red";
    bars[end].style.background = "yellow";

    if (array[i] < pivotValue) {
      await swap(bars[i], bars[pivotIndex]);
      let temp = array[i];
      array[i] = array[pivotIndex];
      array[pivotIndex] = temp;
      pivotIndex++;
    }

    bars[i].style.background = "#00ccff";
    bars[end].style.background = "#00ccff";
    await sleep(delay);
  }

  await swap(bars[pivotIndex], bars[end]);
  let temp = array[pivotIndex];
  array[pivotIndex] = array[end];
  array[end] = temp;
  return pivotIndex;
}

// ==============================
// Start Sorting
// ==============================
async function startSort() {
  let algorithm = document.getElementById("algorithm").value;

  if (algorithm === "bubble") {
    await bubbleSort();
  } else if (algorithm === "insertion") {
    await insertionSort();
  } else if (algorithm === "merge") {
    await mergeSort();
  } else if (algorithm === "quick") {
    await quickSort();
  }
}



// ==============================
// Init
// ==============================
window.onload = () => {
  generateArray(arraySize);
};


