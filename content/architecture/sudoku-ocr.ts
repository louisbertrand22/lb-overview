import type { Architecture } from "./types";

/**
 * Source: sudoku-ocr docs/architecture.html, read from the code (dev, 6c73da4, v0.1.0, 20 October 2026).
 * Committed locally (af749e7) but not pushed yet, so no public link.
 */
export const sudokuOcrArchitecture: Architecture = {
  source: {
    note: {
      fr: "Relevé dans le code, branche dev, v0.1.0, 20 octobre 2026",
      en: "Read from the code, dev branch, v0.1.0, 20 October 2026",
    },
  },
  intro: {
    fr: "Une application Python qui trouve une grille de sudoku dans une photo ou une capture d'écran, lit ses chiffres et la résout. OpenCV détecte et redresse la grille, un petit réseau de neurones Keras lit chaque case, un solveur par backtracking termine la grille, puis la solution est redessinée sur l'image d'origine. Deux points d'entrée partagent le même pipeline : une ligne de commande, et une interface Streamlit où l'utilisateur corrige la lecture avant la résolution.",
    en: "A Python app that finds a sudoku grid in a photo or screenshot, reads its digits and solves it. OpenCV detects and straightens the grid, a small Keras neural network reads each cell, a backtracking solver completes the grid, and the solution is drawn back onto the original image. Two entry points share the same pipeline: a command line, and a Streamlit interface where the user corrects the reading before solving.",
  },
  facts: [
    { value: { fr: "98,1 %", en: "98.1 %" }, label: { fr: "de précision sur 624 chiffres de test", en: "accuracy on 624 test digits" } },
    { value: { fr: "99,84 %", en: "99.84 %" }, label: { fr: "de précision sur les chiffres acceptés (confiance ≥ 0,6)", en: "precision on accepted digits (confidence ≥ 0.6)" } },
    { value: { fr: "94 505", en: "94,505" }, label: { fr: "paramètres dans le CNN, 3 convolutions", en: "CNN parameters, 3 convolutions" } },
    { value: { fr: "4 157", en: "4,157" }, label: { fr: "chiffres imprimés étiquetés pour l'entraînement", en: "labelled printed digits for training" } },
    { value: "10", label: { fr: "étapes de l'image à la grille lue", en: "steps from image to read grid" } },
    { value: "89", label: { fr: "tests, dont les grilles d'exemple de bout en bout", en: "tests, including end-to-end sample grids" } },
  ],
  layers: [
    {
      id: "entry",
      label: { fr: "Points d'entrée", en: "Entry points" },
      host: "",
      items: [
        { name: "CLI · sudoku-ocr", detail: { fr: "--image --out --config --backend --weights", en: "--image --out --config --backend --weights" } },
        { name: "Interface · sudoku-ocr-ui", detail: { fr: "Streamlit : import, correction, solution, téléchargement", en: "Streamlit: import, correction, solution, download" } },
        { name: "Scripts", detail: { fr: "Entraînement du CNN, validation, expériences OCR", en: "CNN training, validation, OCR experiments" } },
      ],
      link: { fr: "read_grid() en cache · render_solution()", en: "read_grid() cached · render_solution()" },
    },
    {
      id: "pipeline",
      label: { fr: "Pipeline", en: "Pipeline" },
      host: "server",
      items: [
        { name: "config.py", detail: { fr: "DEFAULTS ← YAML ← options, clé inconnue refusée", en: "DEFAULTS ← YAML ← options, unknown keys rejected" } },
        { name: "pipeline.read_grid()", detail: { fr: "Image → GridReading : grille lue, cases, homographie inverse", en: "Image → GridReading: read grid, cells, inverse homography" } },
        { name: "render_solution()", detail: { fr: "Solution → image d'origine", en: "Solution → original image" } },
      ],
      link: { fr: "Modules spécialisés", en: "Specialised modules" },
    },
    {
      id: "modules",
      label: { fr: "Modules", en: "Modules" },
      host: "server",
      items: [
        { name: "detect · geometry", detail: { fr: "Contour de la grille, homographie vers 450 × 450", en: "Grid contour, homography to 450 × 450" } },
        { name: "cells", detail: { fr: "Lignes, 81 cases, case vide, extraction du chiffre", en: "Lines, 81 cells, blank check, digit extraction" } },
        { name: "ocr/cnn · ocr/tesseract", detail: { fr: "CNNOCR et son contrat .meta.json · repli Tesseract", en: "CNNOCR and its .meta.json contract · Tesseract fallback" } },
        { name: "solver · overlay", detail: { fr: "Backtracking MRV, conflits · dessin ramené par Minv", en: "MRV backtracking, conflicts · drawing mapped back by Minv" } },
      ],
      link: { fr: "Lit le modèle et la configuration versionnés", en: "Reads the versioned model and configuration" },
    },
    {
      id: "files",
      label: { fr: "Fichiers du dépôt", en: "Repository files" },
      host: "",
      items: [
        { name: "models/sudoku_cnn.keras", detail: { fr: "Modèle versionné + .meta.json (classes, échelle, polarité)", en: "Versioned model + .meta.json (classes, scale, polarity)" } },
        { name: "configs/default.yaml", detail: { fr: "Backend OCR, seuil de confiance, rendu", en: "OCR backend, confidence threshold, rendering" } },
        { name: "data/assets", detail: { fr: "4 157 chiffres étiquetés pour l'entraînement", en: "4,157 labelled digits for training" } },
        { name: "data/samples", detail: { fr: "6 grilles d'exemple, claires et sombres", en: "6 sample grids, light and dark" } },
      ],
    },
  ],
  principles: [
    {
      title: { fr: "Deux portes, un seul pipeline", en: "Two doors, one pipeline" },
      body: { fr: "Une seule fonction read_grid fait la détection, le découpage et l'OCR. La CLI comme l'interface l'appellent et reçoivent un GridReading.", en: "A single read_grid function does detection, slicing and OCR. Both the CLI and the interface call it and get a GridReading." },
    },
    {
      title: { fr: "Toujours de l'encre foncée", en: "Always dark ink" },
      body: { fr: "Une grille en mode sombre est lue sur l'image inversée. On garde le candidat dont la grille redressée a un fond clair.", en: "A dark-mode grid is read on the inverted image. The candidate whose straightened grid has a light background wins." },
    },
    {
      title: { fr: "Le modèle porte son contrat", en: "The model carries its contract" },
      body: { fr: "sudoku_cnn.meta.json décrit les classes, l'échelle des pixels et la polarité. L'entrée du réseau est préparée d'après ce fichier, pas d'après des constantes.", en: "sudoku_cnn.meta.json describes classes, pixel scale and polarity. Network input is prepared from this file, not from constants." },
    },
    {
      title: { fr: "Une configuration stricte", en: "A strict configuration" },
      body: { fr: "Toute clé absente des valeurs par défaut est refusée : une faute de frappe dans un YAML lève une erreur au lieu d'être ignorée.", en: "Any key missing from the defaults is rejected: a typo in a YAML raises an error instead of being ignored." },
    },
    {
      title: { fr: "L'humain corrige, la machine résout", en: "The human corrects, the machine solves" },
      body: { fr: "L'interface ne corrige rien en silence. Elle montre les conflits et le nombre de solutions, et ne résout qu'une grille à solution unique.", en: "The interface never fixes anything silently. It shows conflicts and the number of solutions, and only solves a grid with a unique solution." },
    },
    {
      title: { fr: "Ni serveur ni base", en: "No server, no database" },
      body: { fr: "Aucun état persistant. L'interface met le modèle en cache et garde les 16 dernières lectures.", en: "No persistent state. The interface caches the model and keeps the last 16 readings." },
    },
  ],
  steps: {
    title: { fr: "Pipeline · de l'image à la grille lue", en: "Pipeline · from image to read grid" },
    items: [
      { name: { fr: "Image", en: "Image" }, code: "imread · decode_image", detail: { fr: "Photo ou capture, en BGR", en: "Photo or screenshot, as BGR" } },
      { name: { fr: "Deux candidats", en: "Two candidates" }, code: "bitwise_not", detail: { fr: "L'image et son inverse, pour le mode sombre", en: "The image and its inverse, for dark mode" } },
      { name: { fr: "Détection", en: "Detection" }, code: "find_sudoku_quad", detail: { fr: "CLAHE, seuil adaptatif, 20 plus grands contours notés par grid_score", en: "CLAHE, adaptive threshold, 20 largest contours scored by grid_score" } },
      { name: { fr: "Redressement", en: "Straightening" }, code: "four_point_transform", detail: { fr: "Carré de 450 × 450, homographie inverse gardée", en: "450 × 450 square, inverse homography kept" } },
      { name: { fr: "Choix", en: "Choice" }, code: "grid_score", detail: { fr: "Fond clair d'abord, puis meilleur score", en: "Light background first, then best score" } },
      { name: { fr: "Lignes", en: "Lines" }, code: "detect_grid_lines", detail: { fr: "Projections, 10 + 10 lignes, repli sur une grille régulière", en: "Projections, 10 + 10 lines, regular-grid fallback" } },
      { name: { fr: "81 cases", en: "81 cells" }, code: "split_cells_by_lines", detail: { fr: "Découpe avec une marge d'1/40 de case", en: "Sliced with a 1/40-cell margin" } },
      { name: { fr: "Case vide ?", en: "Blank cell?" }, code: "is_blank_cell", detail: { fr: "Contraste du centre < 40 : pas d'OCR", en: "Centre contrast < 40: no OCR" } },
      { name: { fr: "Extraction", en: "Extraction" }, code: "extract_digit", detail: { fr: "Composante la plus centrale, ramenée en 28 × 28", en: "Most central component, scaled to 28 × 28" } },
      { name: { fr: "CNN", en: "CNN" }, code: "predict_digit", detail: { fr: "9 classes, confiance < 0,6 → case laissée vide", en: "9 classes, confidence < 0.6 → cell left blank" } },
    ],
    outcomes: [
      {
        title: { fr: "La CLI répare seule", en: "The CLI repairs on its own" },
        points: [
          { fr: "Retire les chiffres en conflit", en: "Removes conflicting digits" },
          { fr: "Remplit les cases à candidat unique", en: "Fills single-candidate cells" },
          { fr: "Résout, et relit les cases vides avec Tesseract en cas d'échec", en: "Solves, and rereads blank cells with Tesseract on failure" },
        ],
      },
      {
        title: { fr: "L'interface demande", en: "The interface asks" },
        points: [
          { fr: "Tableau éditable : l'utilisateur corrige la lecture", en: "Editable table: the user corrects the reading" },
          { fr: "Conflits en rouge, nombre de solutions compté jusqu'à 2", en: "Conflicts in red, solutions counted up to 2" },
          { fr: "Résolution seulement si la solution est unique, puis dessin sur l'original", en: "Solves only with a unique solution, then draws on the original" },
        ],
      },
    ],
    note: {
      fr: "Mieux vaut une case vide, que l'utilisateur remplit, qu'un faux chiffre qui rend la grille insoluble : c'est tout le rôle du seuil de confiance. Si l'extraction échoue sur une case non vide, trois binarisations font voter le CNN.",
      en: "A blank cell the user fills in beats a wrong digit that makes the grid unsolvable: that is the whole point of the confidence threshold. When extraction fails on a non-blank cell, three binarisations let the CNN vote.",
    },
  },
  tables: [
    {
      title: { fr: "Réseau de neurones · 94 505 paramètres", en: "Neural network · 94,505 parameters" },
      head: [{ fr: "Couche", en: "Layer" }, { fr: "Sortie", en: "Output" }, { fr: "Paramètres", en: "Parameters" }],
      mono: [1, 2],
      rows: [
        [{ fr: "Entrée", en: "Input" }, "28 × 28 × 1", "0"],
        ["Conv 3×3 · BN · ReLU", "28 × 28 × 32", "288 + 128"],
        ["MaxPool 2×2", "14 × 14 × 32", "0"],
        ["Conv 3×3 · BN · ReLU", "14 × 14 × 64", "18 432 + 256"],
        ["MaxPool 2×2", "7 × 7 × 64", "0"],
        ["Conv 3×3 · BN · ReLU", "7 × 7 × 128", "73 728 + 512"],
        ["GlobalAveragePooling · Dropout 0,3", "128", "0"],
        ["Dense · softmax", { fr: "9 (chiffres 1 à 9)", en: "9 (digits 1 to 9)" }, "1 161"],
      ],
      note: {
        fr: "Pas de classe « vide » : les cases vides sont écartées avant le réseau. BatchNorm à momentum 0,9, car avec la valeur par défaut de Keras les statistiques ne convergeaient pas et le modèle s'effondrait en inférence.",
        en: "No “blank” class: blank cells are filtered out before the network. BatchNorm momentum is 0.9, because with the Keras default the running statistics did not converge and the model collapsed at inference.",
      },
    },
    {
      title: { fr: "Entraînement · test sur 624 images", en: "Training · test on 624 images" },
      head: [{ fr: "Mesure", en: "Metric" }, { fr: "Avant", en: "Before" }, { fr: "Actuel", en: "Current" }],
      mono: [1, 2],
      rows: [
        [{ fr: "Précision", en: "Accuracy" }, "96,3 %", "98,1 %"],
        [{ fr: "Couverture (confiance ≥ 0,6)", en: "Coverage (confidence ≥ 0.6)" }, "91,3 %", "97,9 %"],
        [{ fr: "Précision des chiffres acceptés", en: "Precision of accepted digits" }, "—", "99,84 %"],
        [{ fr: "Faux chiffres acceptés", en: "Wrong digits accepted" }, "4", "1"],
      ],
      note: {
        fr: "4 157 chiffres imprimés, 15 % mis de côté pour le test. Même prétraitement que l'app : chaque image passe par l'extraction de l'interface. Adam, lots de 64, arrêt anticipé, environ 2 minutes sur processeur.",
        en: "4,157 printed digits, 15% held out for testing. Same preprocessing as the app: every image goes through the interface's extraction. Adam, batches of 64, early stopping, about 2 minutes on CPU.",
      },
    },
    {
      title: { fr: "Résolution", en: "Solving" },
      head: [{ fr: "Fonction", en: "Function" }, { fr: "Rôle", en: "Role" }],
      mono: [0],
      rows: [
        ["solve", { fr: "Backtracking qui commence par la case la plus contrainte (MRV) et abandonne dès qu'une case n'a plus de candidat", en: "Backtracking that starts from the most constrained cell (MRV) and gives up as soon as a cell has no candidate" }],
        ["count_solutions", { fr: "Compte les solutions sans modifier la grille, en s'arrêtant à 2", en: "Counts solutions without changing the grid, stopping at 2" }],
        ["find_conflicts", { fr: "Cases répétées dans leur ligne, colonne ou boîte", en: "Cells repeated in their row, column or box" }],
      ],
    },
    {
      title: { fr: "Tests · 89 au total", en: "Tests · 89 in total" },
      head: [{ fr: "Fichier", en: "File" }, { fr: "Couvre", en: "Covers" }],
      mono: [0],
      rows: [
        ["test_end_to_end", { fr: "Les 6 grilles d'exemple, claires et sombres, avec le vrai modèle", en: "The 6 sample grids, light and dark, with the real model" }],
        ["test_ui", { fr: "Fonctions de l'interface et page Streamlit via AppTest", en: "Interface helpers and the Streamlit page via AppTest" }],
        ["test_config", { fr: "Fusion, clés inconnues, valeurs invalides", en: "Merging, unknown keys, invalid values" }],
        ["test_solver", { fr: "Résolution, conflits, unicité", en: "Solving, conflicts, uniqueness" }],
        ["test_cells · test_detect", { fr: "Cases vides, fonds grisés, grille encadrée", en: "Blank cells, grey backgrounds, framed grid" }],
        ["test_cnn_ocr", { fr: "Contrat du modèle, polarité, seuil de confiance", en: "Model contract, polarity, confidence threshold" }],
      ],
    },
    {
      title: { fr: "Limites connues", en: "Known limits" },
      head: [{ fr: "Sujet", en: "Topic" }, { fr: "Constat", en: "Finding" }],
      rows: [
        [{ fr: "Grilles 9 × 9 seulement", en: "9 × 9 grids only" }, { fr: "Le découpage et le solveur supposent des boîtes de 3 × 3 ; un mini sudoku 6 × 6 est mal lu.", en: "Slicing and solver assume 3 × 3 boxes; a 6 × 6 mini sudoku is misread." }],
        [{ fr: "81 appels au réseau", en: "81 network calls" }, { fr: "Une case à la fois, environ 28 ms chacune : 2 à 3 s par grille.", en: "One cell at a time, about 28 ms each: 2 to 3 s per grid." }],
        [{ fr: "Pas de classe « pas un chiffre »", en: "No “not a digit” class" }, { fr: "Une tache qui passe les filtres est classée de 1 à 9 ; seul le seuil de confiance l'arrête.", en: "A smudge that passes the filters is classed 1 to 9; only the confidence threshold stops it." }],
        [{ fr: "Mémoire sur le cloud", en: "Cloud memory" }, { fr: "Environ 756 Mo une fois TensorFlow chargé, pour une limite d'environ 1 Go.", en: "About 756 MB once TensorFlow is loaded, against a limit of about 1 GB." }],
        [{ fr: "Pas de vraies photos dans les tests", en: "No real photos in tests" }, { fr: "Les exemples sont des captures : perspective, flou et éclairage inégal ne sont pas couverts.", en: "Samples are screenshots: perspective, blur and uneven lighting are not covered." }],
      ],
    },
  ],
  pipeline: {
    stages: [
      { branch: "dev", target: { fr: "Travail quotidien, tests en local", en: "Day-to-day work, local tests" } },
      { branch: "main", target: { fr: "Avance rapide depuis dev", en: "Fast-forwarded from dev" } },
      { branch: "Streamlit Cloud", target: { fr: "Redéploie à chaque push sur main", en: "Redeploys on every push to main" } },
    ],
    checks: {
      fr: "Pas d'intégration continue : les 89 tests tournent en local avec make test (environ 90 s), make test-fast saute ceux qui chargent le modèle. Le modèle est versionné dans le dépôt, OpenCV est en version headless car le serveur n'a pas de libGL.",
      en: "No continuous integration: the 89 tests run locally with make test (about 90 s), make test-fast skips those that load the model. The model is versioned in the repository, and OpenCV is the headless build because the server has no libGL.",
    },
  },
  inventory: [
    {
      group: { fr: "Cœur", en: "Core" },
      rows: [
        { tech: "Python", version: "3.10–3.13", role: { fr: "Langage, plafonné par TensorFlow", en: "Language, capped by TensorFlow" } },
        { tech: "opencv-python-headless · numpy", version: "—", role: { fr: "Seuils, contours, homographies, dessin", en: "Thresholds, contours, homographies, drawing" } },
        { tech: "TensorFlow (Keras)", version: "≥ 2.12", role: { fr: "Chargement et inférence du CNN", en: "CNN loading and inference" } },
        { tech: "pyyaml", version: "—", role: { fr: "Lecture des configurations", en: "Configuration loading" } },
      ],
    },
    {
      group: { fr: "Extras", en: "Extras" },
      rows: [
        { tech: "Streamlit (+ pandas)", version: "≥ 1.40", role: { fr: "Interface web, tableau éditable", en: "Web interface, editable table" } },
        { tech: "pytesseract", version: "—", role: { fr: "Backend OCR alternatif, repli de la CLI", en: "Alternative OCR backend, CLI fallback" } },
        { tech: "scikit-learn", version: "—", role: { fr: "Découpage stratifié pour l'entraînement", en: "Stratified split for training" } },
        { tech: "pytest", version: "—", role: { fr: "Tests, marqueur e2e", en: "Tests, e2e marker" } },
      ],
    },
    {
      group: { fr: "Outillage et hébergement", en: "Tooling and hosting" },
      rows: [
        { tech: "uv · Makefile", version: "—", role: { fr: "Environnement Python 3.12, commandes test, train, run, ui", en: "Python 3.12 environment, test, train, run, ui commands" } },
        { tech: "setuptools · pyproject.toml", version: "—", role: { fr: "Commandes sudoku-ocr et sudoku-ocr-ui", en: "sudoku-ocr and sudoku-ocr-ui commands" } },
        { tech: "Streamlit Community Cloud", version: "—", role: { fr: "Hébergement de sudoku-ocr.streamlit.app", en: "Hosting for sudoku-ocr.streamlit.app" } },
      ],
    },
  ],
};
