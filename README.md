# 🔮 Algorithm Visualizer

<!-- <p align="center">
  <img src="assets/banner.png" alt="Algorithm Visualizer Banner" width="100%" />
</p> -->

<p align="center">
  An interactive and beginner-friendly visualizer for <b>sorting</b> and <b>searching</b> algorithms.<br/>
  Watch step-by-step animations to understand how algorithms manipulate arrays and find elements.
</p>

<p align="center">
  <a href="https://algo-visualizer-rohan.netlify.app/"><b>🌐 Live Demo</b></a> •
  <a href="https://github.com/Rohantiwari10/Alogorithm-Visualizer/issues">🐞 Report Bug</a> •
  <a href="https://github.com/Rohantiwari10/Alogorithm-Visualizer/pulls">⚡ Contribute</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/Rohantiwari10/Alogorithm-Visualizer?style=for-the-badge&color=yellow" alt="stars" />
  <img src="https://img.shields.io/github/forks/Rohantiwari10/Alogorithm-Visualizer?style=for-the-badge&color=blue" alt="forks" />
  <img src="https://img.shields.io/github/license/Rohantiwari10/Alogorithm-Visualizer?style=for-the-badge&color=brightgreen" alt="license" />
  <img src="https://img.shields.io/badge/demo-netlify-blue?style=for-the-badge" alt="netlify" />
</p>

---

## ✨ Features

- 🎥 **Real-time animations** for sorting & searching algorithms  
- 🎛 **Speed control** (slow to fast) for step-by-step learning  
- 📱 **Responsive UI** — works on both desktop and mobile  
- 🧩 Modular code — easy to add new algorithms or visual styles  
- ✅ Helpful **tooltips, controls and keyboard shortcuts**

---

## 🖼️ Preview

![Algorithm Visualizer Demo](assets/preview.gif)


---

## 📂 Project Structure

```
Alogorithm-Visualizer/
│── assets/                # Images, banner, preview GIFs
│── sorting/               # Sorting algorithms
│   ├── bubbleSort.js
│   ├── selectionSort.js
│   ├── insertionSort.js
│   ├── mergeSort.js
│   └── quickSort.js
│── searching/             # Searching algorithms
│   ├── linearSearch.js
│   └── binarySearch.js
│── index.html             # Main entry point
│── style.css              # Styles for visualizer
│── script.js              # Controller logic
│── LICENSE
│── README.md
```

---

## ✅ Implemented Algorithms

**Sorting**
- Bubble Sort  
- Selection Sort  
- Insertion Sort  
- Merge Sort  
- Quick Sort  

**Searching**
- Linear Search  
- Binary Search  

*(Update this list as you add more algorithms.)*

---

## 🚀 Getting Started

### Run Locally
```bash
# Clone the repo
git clone https://github.com/Rohantiwari10/Alogorithm-Visualizer.git

# Navigate
cd Alogorithm-Visualizer

# Open in browser
open index.html
```

Or run a simple local server:
```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

---

## 🎯 How to Use

1. Open the app (local or [live demo](https://algo-visualizer-rohan.netlify.app/)).  
2. Choose **Sorting** or **Searching** mode.  
3. Select an algorithm from the dropdown.  
4. Adjust **array size** and **speed** sliders.  
5. Click **Start** and watch the algorithm in action.  

---

## ✍️ Adding a New Algorithm

1. Add a new file in `sorting/` or `searching/` (e.g. `sorting/heapSort.js`).  
2. Export a function that returns the algorithm’s animation steps.  
3. Import it in `script.js` and add it to the algorithm map.  
4. Add the algorithm’s name in the dropdown menu in `index.html`.  

---

## 🧑‍💻 Contributing

Contributions are welcome 🎉  

- Add new algorithms (Heap Sort, Radix Sort, Jump Search, etc.)  
- Improve UI/UX or animations  
- Enhance mobile experience  

👉 Fork the repo, make changes, and submit a PR.  

---

## 🛠️ Troubleshooting

- **Animation too slow/fast** → adjust speed slider.  
- **UI broken on mobile** → check responsive CSS (use `flex`, `rem`, `vw`).  
- **New algorithm doesn’t animate** → make sure it returns actions in the expected format (e.g. `{ type: "swap", i, j }`).  

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).  
You’re free to use, modify, and distribute this project with attribution.  

---

## ⭐ Support

If you like this project, please **⭐ star the repo** and share it!  

Made with ❤️ by **[Rohan Tiwari](https://github.com/Rohantiwari10)**
