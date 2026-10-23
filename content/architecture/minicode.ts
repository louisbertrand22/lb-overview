import type { Architecture } from "./types";

/**
 * Source: minicode, read from the code at e2e1442 (2 October 2026), the last pushed commit.
 * The 75 tests were run on that snapshot; eval scores are the ones measured and recorded in its README.
 */
export const minicodeArchitecture: Architecture = {
  source: {
    note: {
      fr: "Relevé dans le code, commit e2e1442 du 2 octobre 2026",
      en: "Read from the code, commit e2e1442, 2 October 2026",
    },
  },
  intro: {
    fr: "Un agent de code dans le terminal, façon Claude Code, écrit à la main en Python sans framework d'agent. Le modèle ne fait que demander des outils ; tout le reste est le harness : la boucle qui le rappelle, les outils qui agissent sur le projet, les permissions qui décident, la gestion d'une fenêtre de 8 192 tokens, les sous-agents et un journal de chaque appel. Il tourne gratuitement en local, avec Ollama et qwen3:8b.",
    en: "A coding agent in the terminal, in the style of Claude Code, handwritten in Python with no agent framework. The model only asks for tools; everything else is the harness: the loop that calls it again, the tools that act on the project, the permissions that decide, the handling of an 8,192-token window, sub-agents and a log of every call. It runs for free locally, with Ollama and qwen3:8b.",
  },
  facts: [
    { value: "2 343", label: { fr: "lignes de Python, hors tests et évals", en: "lines of Python, excluding tests and evals" } },
    { value: "8", label: { fr: "outils, dont task pour les sous-agents", en: "tools, including task for sub-agents" } },
    { value: "8 192", label: { fr: "tokens de fenêtre par défaut en local", en: "tokens of context window by default, locally" } },
    { value: "75", label: { fr: "tests, sans aucun appel au modèle", en: "tests, with no model call" } },
    { value: "11/13", label: { fr: "tâches d'évals réussies par qwen3:8b", en: "eval tasks passed by qwen3:8b" } },
    { value: "10", label: { fr: "étapes de la feuille de route, toutes livrées", en: "roadmap milestones, all shipped" } },
  ],
  layers: [
    {
      id: "terminal",
      label: { fr: "Terminal", en: "Terminal" },
      host: "",
      items: [
        { name: "ui.py", detail: { fr: "rich et prompt_toolkit : saisie, réflexion en direct, diff, choix de permission", en: "rich and prompt_toolkit: input, live thinking, diff, permission choice" } },
      ],
      link: { fr: "une demande, ajoutée à messages", en: "one request, appended to messages" },
    },
    {
      id: "harness",
      label: { fr: "Harness", en: "Harness" },
      host: "server",
      items: [
        { name: "minicode.py", detail: { fr: "_agent_loop : rappelle le modèle tant qu'il demande des outils, 30 appels au plus", en: "_agent_loop: calls the model again while it asks for tools, 30 calls at most" } },
        { name: "context.py", detail: { fr: "Estime les tokens, efface les vieux résultats, résume au-delà de 70 %", en: "Estimates tokens, clears old results, summarises past 70%" } },
        { name: "agents_md.py", detail: { fr: "AGENTS.md du projet et des dossiers parents, dans le prompt système", en: "AGENTS.md from the project and parent folders, in the system prompt" } },
      ],
      link: { fr: "tool_use renvoyé par le modèle", en: "tool_use returned by the model" },
    },
    {
      id: "guards",
      label: { fr: "Garde-fous", en: "Guards" },
      host: "server",
      items: [
        { name: "tools.precheck", detail: { fr: "Un appel voué à l'échec revient au modèle sans te déranger", en: "A call bound to fail goes back to the model without asking you" } },
        { name: "permissions.py", detail: { fr: "deny, puis commande composée, puis allow, sinon on demande", en: "deny, then compound command, then allow, otherwise ask" } },
      ],
      link: { fr: "run_tool(name, input)", en: "run_tool(name, input)" },
    },
    {
      id: "tools",
      label: { fr: "Outils", en: "Tools" },
      host: "server",
      items: [
        { name: "tools.py", detail: { fr: "read_file, list_dir, grep, edit_file, bash, interactive_start, interactive_send", en: "read_file, list_dir, grep, edit_file, bash, interactive_start, interactive_send" } },
        { name: "subagent.py", detail: { fr: "task : une 2e boucle en lecture seule, 12 appels au plus", en: "task: a second read-only loop, 12 calls at most" } },
      ],
      link: { fr: "subprocess, pseudo-terminal", en: "subprocess, pseudo-terminal" },
    },
    {
      id: "project",
      label: { fr: "Projet", en: "Project" },
      host: "",
      items: [
        { name: "Workspace", detail: { fr: "Chemins relatifs au projet, bash coupé après 60 s", en: "Paths relative to the project, bash stopped after 60 s" } },
        { name: ".minicode/", detail: { fr: "Règles de permission, historique, journaux JSONL", en: "Permission rules, history, JSONL logs" } },
      ],
    },
  ],
  services: [
    { name: "Ollama · qwen3:8b", detail: { fr: "Local et gratuit, sur la carte graphique", en: "Local and free, on the GPU" } },
  ],
  principles: [
    {
      title: { fr: "Le modèle n'a pas de mémoire", en: "The model has no memory" },
      body: { fr: "La conversation est une simple liste, messages, renvoyée en entière à chaque appel. /clear la vide, un sous-agent en reçoit une neuve.", en: "The conversation is a plain list, messages, sent in full on every call. /clear empties it, a sub-agent gets a fresh one." },
    },
    {
      title: { fr: "Le modèle n'exécute rien", en: "The model runs nothing" },
      body: { fr: "Il répond tool_use ; le harness exécute et renvoie un tool_result avec le même id. Même un refus renvoie un tool_result, sinon l'API rejette l'historique.", en: "It answers tool_use; the harness runs it and sends back a tool_result with the same id. Even a refusal sends a tool_result, or the API rejects the history." },
    },
    {
      title: { fr: "Le harness décide", en: "The harness decides" },
      body: { fr: "Avant edit_file, bash ou interactive_start : une règle deny l'emporte même en mode YOLO, et une commande composée (; && | $( …) est toujours demandée.", en: "Before edit_file, bash or interactive_start: a deny rule wins even in YOLO mode, and a compound command (; && | $( …) is always asked." },
    },
    {
      title: { fr: "Des modifications petites et vérifiées", en: "Small, checked edits" },
      body: { fr: "edit_file remplace un texte exact de moins de 15 lignes, dit où le texte diverge, et refuse ce qui casserait un fichier Python ou JSON valide.", en: "edit_file replaces an exact text under 15 lines, says where the text diverges, and refuses anything that would break a valid Python or JSON file." },
    },
    {
      title: { fr: "Le contexte se gère du moins cher au plus cher", en: "Context is managed cheapest first" },
      body: { fr: "Effacer les vieux résultats d'outils, puis résumer les tours précédents, puis ne garder que le dernier résultat. Un tool_use n'est jamais séparé de son tool_result.", en: "Clear old tool results, then summarise earlier turns, then keep only the last result. A tool_use is never split from its tool_result." },
    },
    {
      title: { fr: "Mesurer plutôt qu'essayer", en: "Measure instead of trying" },
      body: { fr: "Chaque appel est journalisé en JSONL, et 13 tâches fixes tournent dans des dossiers neufs. Un changement de prompt se juge sur le score, pas sur un essai.", en: "Every call is logged as JSONL, and 13 fixed tasks run in fresh folders. A prompt change is judged on the score, not on one try." },
    },
  ],
  flow: {
    title: { fr: "Exemple · « lance les tests ; si un test échoue, corrige »", en: "Example · “run the tests; if one fails, fix it”" },
    actors: ["UI", "Harness", "LLM", "Tools"],
    anchors: [{ item: "ui.py" }, { item: "minicode.py" }, { service: "Ollama · qwen3:8b" }, { item: "tools.py" }],
    steps: [
      { from: 0, to: 1, label: { fr: "demande", en: "request" } },
      { from: 1, to: 2, label: { fr: "stream(messages)", en: "stream(messages)" } },
      { from: 2, to: 1, label: { fr: "tool_use bash", en: "tool_use bash" } },
      { from: 1, to: 3, label: { fr: "tests : code de sortie 1", en: "tests: exit code 1" } },
      { from: 2, to: 1, label: { fr: "tool_use grep, puis read_file", en: "tool_use grep, then read_file" } },
      { from: 2, to: 1, label: { fr: "tool_use edit_file", en: "tool_use edit_file" } },
      { from: 1, to: 0, label: { fr: "diff et choix de permission", en: "diff and permission choice" } },
      { from: 0, to: 1, label: { fr: "1. Oui", en: "1. Yes" } },
      { from: 1, to: 3, label: { fr: "edit_file calc.py", en: "edit_file calc.py" } },
      { from: 2, to: 1, label: { fr: "tool_use bash", en: "tool_use bash" } },
      { from: 1, to: 3, label: { fr: "tests : code de sortie 0", en: "tests: exit code 0" } },
      { from: 2, to: 0, label: { fr: "end_turn : réponse", en: "end_turn: answer" } },
    ],
    note: {
      fr: "Essai réel avec qwen3:8b sur un calc.py où add soustrait : le modèle enchaîne bash, grep, read_file, edit_file et bash, sans aide. Entre deux appels, chaque tool_result repart au modèle avec tout l'historique. Ici bash est autorisé par une règle allow ; edit_file est demandé.",
      en: "A real run with qwen3:8b on a calc.py where add subtracts: the model chains bash, grep, read_file, edit_file and bash, unaided. Between two calls, each tool_result goes back to the model with the whole history. Here bash is allowed by an allow rule; edit_file is asked.",
    },
  },
  steps: {
    title: { fr: "Un tour de boucle", en: "One turn of the loop" },
    items: [
      { name: { fr: "Contexte", en: "Context" }, code: "fit_context", detail: { fr: "Avant chaque appel : estimer, puis effacer ou résumer au-delà de 70 %", en: "Before each call: estimate, then clear or summarise past 70%" } },
      { name: { fr: "Appel", en: "Call" }, code: "call_model", detail: { fr: "En streaming ; le vrai usage recalibre l'estimation suivante", en: "Streamed; the real usage recalibrates the next estimate" } },
      { name: { fr: "Contrôle", en: "Check" }, code: "precheck", detail: { fr: "Arguments validés, edit_file simulé avant toute question", en: "Arguments validated, edit_file simulated before any question" } },
      { name: { fr: "Permission", en: "Permission" }, code: "ask_permission", detail: { fr: "Règle deny, règle allow, YOLO, ou question à l'utilisateur", en: "Deny rule, allow rule, YOLO, or a question to the user" } },
      { name: { fr: "Exécution", en: "Execution" }, code: "run_tool", detail: { fr: "Sortie plafonnée à ~20 % de la fenêtre, code de sortie ajouté", en: "Output capped at ~20% of the window, exit code appended" } },
    ],
    outcomes: [
      {
        title: { fr: "Le modèle a fini", en: "The model is done" },
        points: [
          { fr: "Plus d'outil demandé : son texte est la réponse", en: "No more tool requested: its text is the answer" },
          { fr: "Réponse vide : le harness le relance une fois", en: "Empty answer: the harness nudges it once" },
        ],
      },
      {
        title: { fr: "Le harness arrête", en: "The harness stops" },
        points: [
          { fr: "Le même appel raté 3 fois : indice au 2e, arrêt au 3e", en: "The same failed call 3 times: hint on the 2nd, stop on the 3rd" },
          { fr: "30 appels sans réponse finale", en: "30 calls with no final answer" },
          { fr: "refusal, max_tokens ou Ctrl-C : historique remis à son état d'avant la demande", en: "refusal, max_tokens or Ctrl-C: history restored to its state before the request" },
        ],
      },
    ],
    note: {
      fr: "Un sous-agent suit la même boucle, avec son propre historique et son propre budget. Seul son rapport final devient le tool_result de task.",
      en: "A sub-agent follows the same loop, with its own history and its own budget. Only its final report becomes the tool_result of task.",
    },
  },
  tables: [
    {
      title: { fr: "Évals : deux runs de qwen3:8b", en: "Evals: two runs of qwen3:8b" },
      head: [{ fr: "Tâche", en: "Task" }, { fr: "1er run", en: "1st run" }, { fr: "2e run", en: "2nd run" }, { fr: "Constat", en: "Finding" }],
      mono: [0, 1, 2],
      rows: [
        ["lire_valeur", "✗", "✓", { fr: "Pas visée par les changements : réussie par hasard", en: "Not targeted by the changes: passed by chance" }],
        ["corriger_bug", "✗", "✓", { fr: "Lance enfin python3 test_calc.py au lieu de pytest", en: "Finally runs python3 test_calc.py instead of pytest" }],
        ["renommer", "✗", "✓", { fr: "Vérifie en lançant main.py", en: "Checks by running main.py" }],
        ["gros_fichier", "✗", "✓", { fr: "Lit la suite avec start_line", en: "Reads the rest with start_line" }],
        ["compteur_jeu", "✗", "✗", { fr: "Trouve le bug, décrit la correction, ne la fait pas", en: "Finds the bug, describes the fix, does not apply it" }],
        ["corriger_js", "—", "✓", { fr: "Trouve npm test seul dans package.json", en: "Finds npm test on its own in package.json" }],
        ["corriger_shell", "—", "✗", { fr: "« Corrigez la ligne 4 » au lieu de le faire", en: "“Fix line 4” instead of doing it" }],
        ["modifier_json", "—", "✓", "—"],
        [{ fr: "5 autres tâches", en: "5 other tasks" }, "✓", "✓", "—"],
      ],
      note: {
        fr: "5/10 puis 11/13, un seul essai par tâche : qwen3 est aléatoire. Les deux échecs restants ont la même cause, le modèle décrit l'action au lieu de la faire.",
        en: "5/10 then 11/13, one try per task: qwen3 is random. Both remaining failures share one cause: the model describes the action instead of taking it.",
      },
    },
    {
      title: { fr: "Ce que qwen3:8b a appris au harness", en: "What qwen3:8b taught the harness" },
      head: [{ fr: "Constat", en: "Observed" }, { fr: "Changement dans le harness", en: "Harness change" }],
      rows: [
        [{ fr: "Recopie l'exemple de la description d'un outil", en: "Copies the example from a tool description" }, { fr: "Plus aucun exemple concret dans les descriptions", en: "No concrete examples left in descriptions" }],
        [{ fr: "Ignore les outils interactifs et reste sur bash", en: "Ignores the interactive tools and sticks to bash" }, { fr: "interactive_start et interactive_send placés avant bash dans la liste", en: "interactive_start and interactive_send listed before bash" }],
        [{ fr: "Fixe le nombre aléatoire à 50 pour que son test passe", en: "Hardcodes the random number to 50 so its test passes" }, { fr: "Consigne : ne jamais modifier un programme juste pour un test", en: "Rule: never change a program just to pass a test" }],
        [{ fr: "Réécrit tout le fichier de mémoire et oublie une ligne", en: "Rewrites the whole file from memory and drops a line" }, { fr: "old_string limité à moins de 15 lignes, syntaxe vérifiée", en: "old_string capped under 15 lines, syntax checked" }],
        [{ fr: "Refait 6 fois exactement le même appel raté", en: "Repeats the exact same failed call 6 times" }, { fr: "Indice au 2e échec identique, arrêt au 3e", en: "Hint on the 2nd identical failure, stop on the 3rd" }],
        [{ fr: "Tente sudo pacman pendant une éval en mode YOLO", en: "Tries sudo pacman during an eval in YOLO mode" }, { fr: "Règles deny dans chaque dossier d'éval, plus fortes que YOLO", en: "Deny rules in every eval folder, stronger than YOLO" }],
      ],
    },
  ],
  inventory: [
    {
      group: { fr: "Langage et outillage", en: "Language and tooling" },
      rows: [
        { tech: "Python", version: "≥ 3.12", role: { fr: "Langage, sans framework d'agent", en: "Language, no agent framework" } },
        { tech: "uv", version: "—", role: { fr: "Dépendances et lancement (uv run)", en: "Dependencies and launch (uv run)" } },
        { tech: "pytest", version: "9.1.1", role: { fr: "75 tests, sans appel au modèle", en: "75 tests, with no model call" } },
      ],
    },
    {
      group: { fr: "Bibliothèques", en: "Libraries" },
      rows: [
        { tech: "anthropic", version: "1.10.0", role: { fr: "Client du serveur Ollama, en streaming", en: "Client for the Ollama server, streamed" } },
        { tech: "rich", version: "15.0.0", role: { fr: "Affichage : Markdown, diff, panneaux", en: "Display: Markdown, diff, panels" } },
        { tech: "prompt_toolkit", version: "3.0.53", role: { fr: "Saisie, historique, complétion des commandes", en: "Input, history, command completion" } },
      ],
    },
    {
      group: { fr: "Modèles", en: "Models" },
      rows: [
        { tech: "Ollama", version: "—", role: { fr: "Serveur local, API compatible avec le SDK Anthropic", en: "Local server, API compatible with the Anthropic SDK" } },
        { tech: "qwen3:8b", version: "—", role: { fr: "Le modèle utilisé, ~5 Go, sur 8 Go de VRAM", en: "The model used, ~5 GB, on 8 GB of VRAM" } },
      ],
    },
  ],
};
