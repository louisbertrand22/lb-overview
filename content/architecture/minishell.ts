import type { Architecture } from "./types";

/**
 * Source: MiniShell_Rust, read from the code at 434221c (24 February 2026), the last pushed commit.
 * Limits below were checked by running the binary built from that code.
 */
export const minishellArchitecture: Architecture = {
  source: {
    note: {
      fr: "Relevé dans le code, commit 434221c du 24 février 2026",
      en: "Read from the code, commit 434221c, 24 February 2026",
    },
  },
  intro: {
    fr: "Un shell Unix écrit en Rust, sans aucune dépendance. Le texte passe par trois étages : un lexer écrit à la main le découpe en jetons, un parser à descente récursive en fait un arbre de syntaxe (AST), puis un exécuteur parcourt cet arbre et lance les commandes comme processus enfants. Aujourd'hui, il exécute des commandes simples, les enchaînements && et ||, et les blocs if / then / else. Le lexer reconnaît déjà pipes, redirections, boucles et variables, mais le parser ne les prend pas encore en charge.",
    en: "A Unix shell written in Rust, with no dependencies at all. Text goes through three stages: a handwritten lexer splits it into tokens, a recursive-descent parser turns them into a syntax tree (AST), and an executor walks that tree and starts commands as child processes. Today it runs simple commands, && and || chains, and if / then / else blocks. The lexer already recognises pipes, redirections, loops and variables, but the parser does not handle them yet.",
  },
  facts: [
    { value: "445", label: { fr: "lignes de Rust", en: "lines of Rust" } },
    { value: "0", label: { fr: "dépendance externe : std seulement", en: "external dependencies: std only" } },
    { value: "35", label: { fr: "types de jetons dans le lexer", en: "token kinds in the lexer" } },
    { value: "4", label: { fr: "formes de commande dans l'AST", en: "command shapes in the AST" } },
    { value: "3", label: { fr: "étages : lexer, parser, exécuteur", en: "stages: lexer, parser, executor" } },
    { value: "2024", label: { fr: "édition de Rust", en: "Rust edition" } },
  ],
  layers: [
    {
      id: "input",
      label: { fr: "Entrée", en: "Input" },
      host: "",
      items: [
        { name: "main.rs", detail: { fr: "Une ligne de commande, passée au lexer puis au parser", en: "One command line, handed to the lexer then the parser" } },
      ],
      link: { fr: "&str → Vec<char>", en: "&str → Vec<char>" },
    },
    {
      id: "lexer",
      label: { fr: "Lexer", en: "Lexer" },
      host: "server",
      items: [
        { name: "lexer.rs", detail: { fr: "peek, peek_next, advance : un caractère d'avance pour | ou ||, > ou >>", en: "peek, peek_next, advance: one character of lookahead for | or ||, > or >>" } },
        { name: "token.rs", detail: { fr: "enum Token : mots-clés, opérateurs, 7 redirections, Word, Var, Eof, Error", en: "enum Token: keywords, operators, 7 redirections, Word, Var, Eof, Error" } },
      ],
      link: { fr: "next_token(), à la demande du parser", en: "next_token(), on the parser's demand" },
    },
    {
      id: "parser",
      label: { fr: "Parser", en: "Parser" },
      host: "server",
      items: [
        { name: "parser.rs", detail: { fr: "Descente récursive, un jeton courant : expression, commande, if", en: "Recursive descent, one current token: expression, command, if" } },
        { name: "ast.rs", detail: { fr: "enum Command : Simple, BinaryOp, If, Pipeline", en: "enum Command: Simple, BinaryOp, If, Pipeline" } },
      ],
      link: { fr: "Command, passé par valeur", en: "Command, passed by value" },
    },
    {
      id: "executor",
      label: { fr: "Exécuteur", en: "Executor" },
      host: "server",
      items: [
        { name: "executor.rs", detail: { fr: "Parcours récursif de l'arbre, court-circuit de && et ||", en: "Recursive tree walk, short-circuits && and ||" } },
      ],
      link: { fr: "spawn() puis wait()", en: "spawn() then wait()" },
    },
    {
      id: "os",
      label: { fr: "Système", en: "System" },
      host: "",
      items: [
        { name: "std::process::Command", detail: { fr: "Un processus enfant par commande, cherché dans le PATH", en: "One child process per command, looked up in PATH" } },
        { name: "ExitStatus", detail: { fr: "0 → Ok(()), sinon Err avec le code", en: "0 → Ok(()), otherwise Err with the code" } },
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
      body: { fr: "if, then, fi, while ou for sortent du lexer comme variantes de Token, pas comme du texte. Le parser fait un match sur une enum, et le compilateur signale tout cas oublié.", en: "if, then, fi, while or for leave the lexer as Token variants, not as text. The parser matches on an enum, and the compiler flags any case left out." },
    },
    {
      title: { fr: "Un jeton d'avance", en: "One token of lookahead" },
      body: { fr: "Le parser ne garde que current_token et demande le suivant au lexer. && et || sont repliés de gauche à droite avec la même priorité, comme le prévoit POSIX : a || b && c se lit (a || b) && c.", en: "The parser keeps only current_token and asks the lexer for the next one. && and || are folded left to right with equal precedence, as POSIX specifies: a || b && c reads as (a || b) && c." },
    },
    {
      title: { fr: "Un arbre possédé", en: "An owned tree" },
      body: { fr: "Les sous-commandes sont des Box<Command>. L'exécuteur prend l'arbre par valeur et le consomme en descendant : ni clone, ni compteur de références.", en: "Sub-commands are Box<Command>. The executor takes the tree by value and consumes it on the way down: no clones, no reference counting." },
    },
    {
      title: { fr: "Le code de sortie devient un Result", en: "The exit status becomes a Result" },
      body: { fr: "Une commande renvoie Result<(), String>. && exécute la droite si la gauche est Ok, || si elle est Err, et if teste la condition de la même façon.", en: "A command returns Result<(), String>. && runs the right side if the left is Ok, || if it is Err, and if tests its condition the same way." },
    },
    {
      title: { fr: "Seulement la bibliothèque standard", en: "Standard library only" },
      body: { fr: "Cargo.toml n'a aucune dépendance. Le lancement des processus passe par std::process, sans appel direct à fork ou exec.", en: "Cargo.toml has no dependencies. Processes are started through std::process, with no direct call to fork or exec." },
    },
  ],
  flow: {
    title: { fr: "Exemple · false || echo First && echo Second", en: "Example · false || echo First && echo Second" },
    actors: ["main", "Lexer", "Parser", "Executor", "OS"],
    steps: [
      { from: 0, to: 2, label: { fr: "parse()", en: "parse()" } },
      { from: 2, to: 1, label: { fr: "next_token() × 8", en: "next_token() × 8" } },
      { from: 2, to: 0, label: { fr: "(false || echo) && echo", en: "(false || echo) && echo" } },
      { from: 0, to: 3, label: { fr: "execute(ast)", en: "execute(ast)" } },
      { from: 3, to: 4, label: { fr: "spawn false", en: "spawn false" } },
      { from: 4, to: 3, label: { fr: "statut 1 → Err", en: "status 1 → Err" } },
      { from: 3, to: 4, label: { fr: "|| : spawn echo First", en: "|| : spawn echo First" } },
      { from: 4, to: 3, label: { fr: "statut 0 → Ok", en: "status 0 → Ok" } },
      { from: 3, to: 4, label: { fr: "&& : spawn echo Second", en: "&& : spawn echo Second" } },
      { from: 3, to: 0, label: { fr: "Ok(())", en: "Ok(())" } },
    ],
    note: {
      fr: "Le parser tire les jetons un par un au lieu de recevoir une liste complète. Le || plus à gauche est replié en premier, puis l'exécuteur descend l'arbre et ne lance chaque côté que si le résultat de gauche l'exige.",
      en: "The parser pulls tokens one at a time instead of receiving a full list. The leftmost || is folded first, then the executor walks down the tree and only starts each side when the left result calls for it.",
    },
  },
  steps: {
    title: { fr: "Du texte au processus", en: "From text to process" },
    items: [
      { name: { fr: "Lecture", en: "Reading" }, code: "Lexer::new", detail: { fr: "La ligne devient un Vec<char> et une position", en: "The line becomes a Vec<char> and a position" } },
      { name: { fr: "Jetons", en: "Tokens" }, code: "next_token", detail: { fr: "Espaces sautés, opérateurs sur 1 ou 2 caractères, mots-clés reconnus", en: "Whitespace skipped, 1- or 2-character operators, keywords recognised" } },
      { name: { fr: "Expression", en: "Expression" }, code: "parse_expression", detail: { fr: "Commande, puis tant que && ou || suit, un BinaryOp de plus", en: "A command, then one more BinaryOp while && or || follows" } },
      { name: { fr: "Commande", en: "Command" }, code: "parse_command", detail: { fr: "If → parse_if, Word → nom et arguments", en: "If → parse_if, Word → name and arguments" } },
      { name: { fr: "Exécution", en: "Execution" }, code: "Executor::execute", detail: { fr: "Récursion sur l'arbre, spawn et wait sur les feuilles", en: "Recursion over the tree, spawn and wait on the leaves" } },
    ],
    outcomes: [
      {
        title: { fr: "Exécuté aujourd'hui", en: "Runs today" },
        points: [
          { fr: "Commande simple et ses arguments", en: "Simple command and its arguments" },
          { fr: "&& et ||, enchaînés de gauche à droite", en: "&& and ||, chained left to right" },
          { fr: "if / then / else / fi, avec && dans la condition", en: "if / then / else / fi, with && in the condition" },
        ],
      },
      {
        title: { fr: "Reconnu par le lexer, pas encore exécuté", en: "Recognised by the lexer, not run yet" },
        points: [
          { fr: "Pipes, et 7 formes de redirection", en: "Pipes, and 7 redirection forms" },
          { fr: "; et retour à la ligne, while, until, for, elif", en: "; and newline, while, until, for, elif" },
          { fr: "Quotes simples, variables $NOM, parenthèses et accolades", en: "Single quotes, $NAME variables, parentheses and braces" },
        ],
      },
    ],
    note: {
      fr: "L'AST a déjà un nœud Pipeline et un champ redirects sur chaque commande : l'exécuteur renvoie une erreur explicite pour les pipes, et le parser laisse redirects vide. Ce sont les deux prochaines étapes.",
      en: "The AST already has a Pipeline node and a redirects field on every command: the executor returns an explicit error for pipes, and the parser leaves redirects empty. Those are the next two steps.",
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
        ["if · then · else · fi", "✓", "✓", "✓"],
        [{ fr: "Pipe |", en: "Pipe |" }, "✓", { fr: "nœud prévu", en: "node planned" }, { fr: "erreur explicite", en: "explicit error" }],
        ["> >> < >& <& >| <>", "✓", { fr: "champ prévu", en: "field planned" }, "—"],
        ["; · \\n", "✓", "—", "—"],
        ["while · until · for · elif", "✓", "—", "—"],
        [{ fr: "'quotes' · $NOM", en: "'quotes' · $NAME" }, "✓", "—", "—"],
        [{ fr: "( ) · { }", en: "( ) · { }" }, "✓", "—", "—"],
      ],
    },
    {
      title: { fr: "Limites relevées en lançant le binaire", en: "Limits found by running the binary" },
      head: [{ fr: "Entrée", en: "Input" }, { fr: "Constat", en: "Finding" }],
      mono: [0],
      rows: [
        ["ls -la", { fr: "Le lexer ne lit un mot que s'il commence par une lettre : - devient un jeton Error, le parser s'arrête sans erreur et lance ls sans option.", en: "The lexer only reads a word that starts with a letter: - becomes an Error token, the parser stops silently and runs ls without the option." }],
        ["if true; then echo a; fi", { fr: "Le parser accepte ; après la condition, pas avant fi : « Expected Fi, found Semicolon ».", en: "The parser accepts ; after the condition, not before fi: “Expected Fi, found Semicolon”." }],
        ["echo a; echo b", { fr: "; n'est pas encore un séparateur : seule la première commande s'exécute.", en: "; is not a separator yet: only the first command runs." }],
        ["false && echo No", { fr: "Le bon comportement, mais l'échec de false remonte jusqu'à main, qui affiche « Execution Error ».", en: "Correct behaviour, but the failure of false bubbles up to main, which prints “Execution Error”." }],
        ["true & echo x", { fr: "Un & seul est lu comme && : pas encore de tâche en arrière-plan.", en: "A single & is read as &&: no background jobs yet." }],
      ],
    },
  ],
  inventory: [
    {
      group: { fr: "Langage et outillage", en: "Language and tooling" },
      rows: [
        { tech: "Rust", version: "≥ 1.85", role: { fr: "Langage, édition 2024", en: "Language, 2024 edition" } },
        { tech: "Cargo", version: "—", role: { fr: "Build, aucune crate dans Cargo.lock en dehors du projet", en: "Build, no crate in Cargo.lock besides the project" } },
      ],
    },
    {
      group: { fr: "Bibliothèque standard", en: "Standard library" },
      rows: [
        { tech: "std::process::Command", version: "—", role: { fr: "spawn() et wait() des commandes", en: "spawn() and wait() for commands" } },
        { tech: "std::process::ExitStatus", version: "—", role: { fr: "Code de sortie, converti en Result", en: "Exit status, converted to a Result" } },
      ],
    },
  ],
};
