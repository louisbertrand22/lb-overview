import type { Architecture } from "./types";

/**
 * Source: MiniShell_Rust, read from the code at ced8064 (20 September 2026), the last pushed commit.
 * Its 59 tests were run, and the limits below were checked by running the binary built from that code.
 */
export const minishellArchitecture: Architecture = {
  source: {
    note: {
      fr: "Relevé dans le code, commit ced8064 du 20 septembre 2026",
      en: "Read from the code, commit ced8064, 20 September 2026",
    },
  },
  intro: {
    fr: "Un shell Unix écrit en Rust, avec une seule dépendance, libc, pour les pipes et le fork. Le texte passe par trois étages : un lexer écrit à la main le découpe en jetons, un parser à descente récursive en fait un arbre de syntaxe (AST), puis un exécuteur parcourt cet arbre et lance les commandes comme processus enfants. Il lit ses lignes dans une boucle interactive et exécute aujourd'hui les commandes simples, les pipelines, les redirections > >> <, && et ||, if / elif / else, while, until et for, l'expansion de variables et cinq builtins. Il reste les heredocs, les sous-shells, le globbing et le séparateur ; entre deux commandes du niveau principal.",
    en: "A Unix shell written in Rust, with a single dependency, libc, for pipes and fork. Text goes through three stages: a handwritten lexer splits it into tokens, a recursive-descent parser turns them into a syntax tree (AST), and an executor walks that tree and starts commands as child processes. It reads lines in an interactive loop and today runs simple commands, pipelines, > >> < redirections, && and ||, if / elif / else, while, until and for, variable expansion and five builtins. Still missing: heredocs, subshells, globbing, and the ; separator between two top-level commands.",
  },
  facts: [
    { value: "1 337", label: { fr: "lignes de Rust dans src/", en: "lines of Rust in src/" } },
    { value: "1", label: { fr: "dépendance externe : libc", en: "external dependency: libc" } },
    { value: "59", label: { fr: "tests de bout en bout, tous verts", en: "end-to-end tests, all passing" } },
    { value: "32", label: { fr: "types de jetons dans le lexer", en: "token kinds in the lexer" } },
    { value: "6", label: { fr: "formes de commande dans l'AST", en: "command shapes in the AST" } },
    { value: "5", label: { fr: "builtins : cd, pwd, export, unset, exit", en: "builtins: cd, pwd, export, unset, exit" } },
  ],
  layers: [
    {
      id: "input",
      label: { fr: "Entrée", en: "Input" },
      host: "",
      items: [
        { name: "main.rs", detail: { fr: "Boucle : invite minishell$, une ligne lue, Ctrl-D pour quitter", en: "Loop: minishell$ prompt, one line read, Ctrl-D to quit" } },
      ],
      link: { fr: "une ligne, passée au lexer", en: "one line, handed to the lexer" },
    },
    {
      id: "lexer",
      label: { fr: "Lexer", en: "Lexer" },
      host: "server",
      items: [
        { name: "lexer.rs", detail: { fr: "peek, peek2, advance : un ou deux caractères d'avance ; quotes, \\, $VAR et ${VAR:-x} regroupés en un mot", en: "peek, peek2, advance: one or two characters of lookahead; quotes, \\, $VAR and ${VAR:-x} glued into one word" } },
        { name: "token.rs", detail: { fr: "enum Token (32 variantes) et enum WordPart : Literal, Variable, Parameter", en: "enum Token (32 variants) and enum WordPart: Literal, Variable, Parameter" } },
      ],
      link: { fr: "next_token(), à la demande du parser", en: "next_token(), on the parser's demand" },
    },
    {
      id: "parser",
      label: { fr: "Parser", en: "Parser" },
      host: "server",
      items: [
        { name: "parser.rs", detail: { fr: "Descente récursive, un jeton courant : expression, pipeline, commande, if, boucle, for", en: "Recursive descent, one current token: expression, pipeline, command, if, loop, for" } },
        { name: "ast.rs", detail: { fr: "enum Command : Simple, Pipeline, BinaryOp, If, Loop, For ; Word et Redirect", en: "enum Command: Simple, Pipeline, BinaryOp, If, Loop, For; Word and Redirect" } },
      ],
      link: { fr: "Command, passé par valeur", en: "Command, passed by value" },
    },
    {
      id: "executor",
      label: { fr: "Exécuteur", en: "Executor" },
      host: "server",
      items: [
        { name: "executor.rs", detail: { fr: "Parcours récursif de l'arbre : && et || court-circuités, boucles, builtins, expansion au moment d'exécuter", en: "Recursive tree walk: && and || short-circuit, loops, builtins, expansion at run time" } },
      ],
      link: { fr: "spawn() ou fork(), dup2, waitpid", en: "spawn() or fork(), dup2, waitpid" },
    },
    {
      id: "os",
      label: { fr: "Système", en: "System" },
      host: "",
      items: [
        { name: "std::process::Command", detail: { fr: "Un processus enfant par commande externe, cherchée dans le PATH", en: "One child process per external command, looked up in PATH" } },
        { name: "libc", detail: { fr: "pipe, fcntl, fork, dup2, waitpid : les pipes et les builtins d'un pipeline", en: "pipe, fcntl, fork, dup2, waitpid: pipes and the builtins of a pipeline" } },
      ],
    },
  ],
  principles: [
    {
      title: { fr: "Trois étages, trois modules", en: "Three stages, three modules" },
      body: { fr: "lexer, parser et executor ne se connaissent que par leurs types : Token entre les deux premiers, Command entre les deux suivants. Chacun se teste et s'étend sans toucher aux autres.", en: "lexer, parser and executor only know each other through types: Token between the first two, Command between the next two. Each can be tested and extended without touching the others." },
    },
    {
      title: { fr: "Les mots-clés sont des jetons", en: "Keywords are tokens" },
      body: { fr: "if, then, fi, while ou for sortent du lexer comme variantes de Token, pas comme du texte, et seulement s'ils ne sont pas entre quotes. Le parser fait un match sur une enum, et le compilateur signale tout cas oublié.", en: "if, then, fi, while or for leave the lexer as Token variants, not as text, and only when unquoted. The parser matches on an enum, and the compiler flags any case left out." },
    },
    {
      title: { fr: "Un jeton d'avance", en: "One token of lookahead" },
      body: { fr: "Le parser ne garde que current_token et demande le suivant au lexer. Un pipe lie plus fort que && et ||, qui se replient de gauche à droite avec la même priorité, comme le prévoit POSIX : a || b && c se lit (a || b) && c.", en: "The parser keeps only current_token and asks the lexer for the next one. A pipe binds tighter than && and ||, which fold left to right with equal precedence, as POSIX specifies: a || b && c reads as (a || b) && c." },
    },
    {
      title: { fr: "Un arbre possédé", en: "An owned tree" },
      body: { fr: "Les sous-commandes sont des Box<Command>. L'exécuteur prend l'arbre par valeur et le consomme en descendant. Seules les boucles le clonent : leur condition et leur corps repartent à chaque tour.", en: "Sub-commands are Box<Command>. The executor takes the tree by value and consumes it on the way down. Only loops clone it: their condition and body run again on every turn." },
    },
    {
      title: { fr: "Le code de sortie devient un Result", en: "The exit status becomes a Result" },
      body: { fr: "Une commande renvoie Result<(), String>. && exécute la droite si la gauche est Ok, || si elle est Err, et if ou while testent leur condition de la même façon. Le vrai code est gardé à part, dans un AtomicI32, pour $?.", en: "A command returns Result<(), String>. && runs the right side if the left is Ok, || if it is Err, and if or while test their condition the same way. The real code is kept apart, in an AtomicI32, for $?." },
    },
    {
      title: { fr: "La bibliothèque standard d'abord", en: "The standard library first" },
      body: { fr: "Les commandes externes passent par std::process. libc n'intervient que pour ce que std n'offre pas : créer les pipes avec FD_CLOEXEC, et forker un builtin quand il est une étape de pipeline, pour que cd ou exit n'y changent pas le shell parent.", en: "External commands go through std::process. libc only covers what std does not offer: creating pipes with FD_CLOEXEC, and forking a builtin when it is a pipeline stage, so that cd or exit there do not change the parent shell." },
    },
  ],
  flow: {
    title: { fr: "Exemple · echo hi | cat", en: "Example · echo hi | cat" },
    actors: ["main", "Lexer", "Parser", "Executor", "OS"],
    anchors: [{ item: "main.rs" }, { item: "lexer.rs" }, { item: "parser.rs" }, { item: "executor.rs" }, { layer: "os" }],
    steps: [
      { from: 0, to: 2, label: { fr: "parse()", en: "parse()" } },
      { from: 2, to: 1, label: { fr: "next_token() × 5", en: "next_token() × 5" } },
      { from: 2, to: 0, label: { fr: "Pipeline[echo hi, cat]", en: "Pipeline[echo hi, cat]" } },
      { from: 0, to: 3, label: { fr: "execute(ast)", en: "execute(ast)" } },
      { from: 3, to: 4, label: { fr: "pipe()", en: "pipe()" } },
      { from: 3, to: 4, label: { fr: "spawn echo hi, sortie dans le pipe", en: "spawn echo hi, output into the pipe" } },
      { from: 3, to: 4, label: { fr: "spawn cat, entrée depuis le pipe", en: "spawn cat, input from the pipe" } },
      { from: 4, to: 3, label: { fr: "wait : statut de cat 0 → Ok", en: "wait: cat status 0 → Ok" } },
      { from: 3, to: 0, label: { fr: "Ok(())", en: "Ok(())" } },
    ],
    note: {
      fr: "Le parser tire les jetons un par un : echo, hi, |, cat, puis la fin de ligne. L'exécuteur crée le pipe, lance les deux processus sans attendre le premier, puis les attend tous : c'est le statut de la dernière étape qui compte.",
      en: "The parser pulls tokens one at a time: echo, hi, |, cat, then the end of the line. The executor creates the pipe, starts both processes without waiting for the first, then waits for them all: the status of the last stage is the one that counts.",
    },
  },
  steps: {
    title: { fr: "Du texte au processus", en: "From text to process" },
    items: [
      { name: { fr: "Lecture", en: "Reading" }, code: "read_line", detail: { fr: "Une ligne lue après l'invite minishell$ ; Ctrl-D ou fin de fichier quitte", en: "One line read after the minishell$ prompt; Ctrl-D or end of file quits" } },
      { name: { fr: "Jetons", en: "Tokens" }, code: "next_token", detail: { fr: "Espaces sautés, opérateurs sur 1 ou 2 caractères, mots-clés reconnus, quotes et $VAR regroupés", en: "Whitespace skipped, 1- or 2-character operators, keywords recognised, quotes and $VAR glued" } },
      { name: { fr: "Expression", en: "Expression" }, code: "parse_expression", detail: { fr: "Un pipeline, puis tant que && ou || suit, un BinaryOp de plus", en: "A pipeline, then one more BinaryOp while && or || follows" } },
      { name: { fr: "Commande", en: "Command" }, code: "parse_command", detail: { fr: "if, while, until, for, ou un mot : commande simple et ses redirections", en: "if, while, until, for, or a word: a simple command and its redirections" } },
      { name: { fr: "Exécution", en: "Execution" }, code: "Executor::execute", detail: { fr: "Mots expandés, builtin dans le shell ou processus enfant, pipes et redirections", en: "Words expanded, builtin in the shell or child process, pipes and redirections" } },
    ],
    outcomes: [
      {
        title: { fr: "Exécuté aujourd'hui", en: "Runs today" },
        points: [
          { fr: "Commandes simples avec options, redirections > >> <, pipelines", en: "Simple commands with options, > >> < redirections, pipelines" },
          { fr: "&& et ||, if / elif / else, while, until, for", en: "&& and ||, if / elif / else, while, until, for" },
          { fr: "$VAR, ${VAR}, ${VAR:-x}, ${VAR:=x}, ${VAR:+x}, $? et $$", en: "$VAR, ${VAR}, ${VAR:-x}, ${VAR:=x}, ${VAR:+x}, $? and $$" },
          { fr: "Builtins : cd, pwd, export, unset, exit", en: "Builtins: cd, pwd, export, unset, exit" },
        ],
      },
      {
        title: { fr: "Reconnu par le lexer, pas encore exécuté", en: "Recognised by the lexer, not run yet" },
        points: [
          { fr: ">& <& >| <> : le parser s'arrête sans erreur sur ces redirections", en: ">& <& >| <>: the parser stops silently on these redirections" },
          { fr: "( ) et { } : sous-shells et groupes", en: "( ) and { }: subshells and groups" },
          { fr: "; et retour à la ligne : acceptés dans if et les boucles seulement", en: "; and newline: accepted inside if and loops only" },
        ],
      },
    ],
    note: {
      fr: "Un pipeline n'accepte que des commandes simples : if ... fi | grep x renvoie une erreur explicite. Et le parser ne vérifie pas que toute la ligne est consommée : il s'arrête au premier jeton qu'il ne sait pas placer.",
      en: "A pipeline only accepts simple commands: if ... fi | grep x returns an explicit error. And the parser does not check that the whole line was consumed: it stops at the first token it cannot place.",
    },
  },
  tables: [
    {
      title: { fr: "État par étage", en: "Status by stage" },
      head: [{ fr: "Syntaxe", en: "Syntax" }, { fr: "Lexer", en: "Lexer" }, { fr: "Parser", en: "Parser" }, { fr: "Exécution", en: "Execution" }],
      mono: [1, 2, 3],
      rows: [
        [{ fr: "Commande et arguments", en: "Command and arguments" }, "✓", "✓", "✓"],
        ["&& · ||", "✓", "✓", "✓"],
        ["if · elif · else · fi", "✓", "✓", "✓"],
        ["while · until · for", "✓", "✓", "✓"],
        [{ fr: "Pipe | de commandes simples", en: "Pipe | of simple commands" }, "✓", "✓", "✓"],
        ["> >> <", "✓", "✓", "✓"],
        ["$VAR · ${VAR:-x} · $? · $$", "✓", "✓", "✓"],
        [{ fr: "'quotes' · \"quotes\"", en: "'quotes' · \"quotes\"" }, "✓", "✓", "✓"],
        ["cd · pwd · export · unset · exit", "—", "—", "✓"],
        ["; · \\n", "✓", { fr: "dans if et boucles", en: "in if and loops" }, "—"],
        [">& <& >| <>", "✓", "—", "—"],
        ["( ) · { }", "✓", "—", "—"],
        [{ fr: "<< · * · ?", en: "<< · * · ?" }, "—", "—", "—"],
      ],
    },
    {
      title: { fr: "Limites relevées en lançant le binaire", en: "Limits found by running the binary" },
      head: [{ fr: "Entrée", en: "Input" }, { fr: "Constat", en: "Finding" }],
      mono: [0],
      rows: [
        ["echo a; echo b", { fr: "; n'est pas un séparateur au niveau principal : seule la première commande s'exécute, le reste est ignoré sans erreur.", en: "; is not a separator at the top level: only the first command runs, the rest is dropped without an error." }],
        ["echo a >& f", { fr: "Le parser s'arrête avant >& : echo écrit dans le terminal et aucun fichier n'est créé.", en: "The parser stops before >&: echo writes to the terminal and no file is created." }],
        ["false && echo No", { fr: "Le bon comportement, mais l'échec de false remonte jusqu'à main, qui affiche « Execution Error ».", en: "Correct behaviour, but the failure of false bubbles up to main, which prints “Execution Error”." }],
        ["true & echo x", { fr: "Un & seul est lu comme && : pas encore de tâche en arrière-plan.", en: "A single & is read as &&: no background jobs yet." }],
        ["echo a | if true; then cat; fi", { fr: "Seules les commandes simples entrent dans un pipeline : « Only simple commands are supported in pipelines for now ».", en: "Only simple commands go into a pipeline: “Only simple commands are supported in pipelines for now”." }],
        ["cat << EOF", { fr: "Pas de heredoc : « Expected a filename after redirection ».", en: "No heredoc: “Expected a filename after redirection”." }],
      ],
    },
  ],
  inventory: [
    {
      group: { fr: "Langage et outillage", en: "Language and tooling" },
      rows: [
        { tech: "Rust", version: "≥ 1.85", role: { fr: "Langage, édition 2024", en: "Language, 2024 edition" } },
        { tech: "Cargo", version: "—", role: { fr: "Build, une seule dépendance déclarée", en: "Build, a single declared dependency" } },
        { tech: "bash", version: "—", role: { fr: "tests/run_tests.sh : 59 cas, chacun dans un dossier temporaire", en: "tests/run_tests.sh: 59 cases, each in a temporary folder" } },
      ],
    },
    {
      group: { fr: "Dépendance", en: "Dependency" },
      rows: [
        { tech: "libc", version: "0.2.189", role: { fr: "pipe, fcntl, fork, dup2, waitpid", en: "pipe, fcntl, fork, dup2, waitpid" } },
      ],
    },
    {
      group: { fr: "Bibliothèque standard", en: "Standard library" },
      rows: [
        { tech: "std::process::Command", version: "—", role: { fr: "spawn() et wait() des commandes externes", en: "spawn() and wait() for external commands" } },
        { tech: "std::process::ExitStatus", version: "—", role: { fr: "Code de sortie, converti en Result", en: "Exit status, converted to a Result" } },
        { tech: "std::env", version: "—", role: { fr: "Variables d'environnement : $VAR, export, unset, cd", en: "Environment variables: $VAR, export, unset, cd" } },
      ],
    },
  ],
};
