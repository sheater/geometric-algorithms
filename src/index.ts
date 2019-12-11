import Scene from "./base/Scene";
import GiftWrapping from "./GiftWrapping";
import GrahamScan from "./GrahamScan";
import SweepLine from "./SweepLine";
import KDTree from "./KDTree";
import Delaunay from "./Delaunay";
import Voronoi from "./Voronoi";

const LOCAL_STORAGE_KEY = "algorithm";

interface AlgorithmType {
  scene: typeof Scene;
  name: string;
}

const algorithms: Array<AlgorithmType> = [
  { scene: GiftWrapping, name: "Convex hull: Gift wrapping" },
  { scene: GrahamScan, name: "Convex hull: Graham scan" },
  { scene: SweepLine, name: "Triangulation: Sweep line" },
  { scene: KDTree, name: "k-D Tree" },
  { scene: Delaunay, name: "Triangulation: Delaunay" },
  { scene: Voronoi, name: "Voronoi diagrams" }
];

const select = <HTMLSelectElement>document.getElementById("algorithm");
const clear = <HTMLButtonElement>document.getElementById("clear");
let currentScene: Scene = null;

algorithms.forEach(x => {
  const el = document.createElement("option");

  el.value = x.name;
  el.innerText = x.name;

  select.appendChild(el);
});

function switchScene(sceneName: string) {
  let algorithm = algorithms.find(x => x.name === sceneName);

  if (!algorithm) {
    // throw new Error("WTF");
    algorithm = algorithms[0];
  }

  if (select.value !== sceneName) {
    select.value = sceneName;
  }

  currentScene = new algorithm.scene();
}

switchScene(localStorage.getItem(LOCAL_STORAGE_KEY) || algorithms[0].name);

select.addEventListener("change", event => {
  // @ts-ignore
  const { value } = event.target;
  localStorage.setItem(LOCAL_STORAGE_KEY, value);
  switchScene(value);
});

clear.addEventListener("click", event => {
  event.preventDefault();

  if (currentScene) {
    currentScene.clearPoints();
  }
});
