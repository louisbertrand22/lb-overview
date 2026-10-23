import type { Architecture } from "./types";

/**
 * Source: the arcl-base-setup-2 and arcl-cmp-server-2 repositories (main, archives of October 2026). Not published.
 * Where the docs and the Terraform disagree (gateway NICs, vm-control machine type), the Terraform wins.
 * Credentials found in the repositories are deliberately not reproduced anywhere on this page.
 */
export const arclArchitecture: Architecture = {
  source: {
    note: {
      fr: "Relevé dans le code des dépôts arcl-base-setup-2 et arcl-cmp-server-2, branche main, octobre 2026",
      en: "Read from the code of the arcl-base-setup-2 and arcl-cmp-server-2 repositories, main branch, October 2026",
    },
  },
  intro: {
    fr: "Un cloud hybride en deux moitiés. La moitié privée est un OpenStack déployé par Kolla-Ansible sur trois VM Google Cloud ; elle porte les bases PostgreSQL, en haute disponibilité avec Patroni. La moitié publique est sur AWS : un load balancer et deux instances EC2 servent chaque application. Entre les deux, une VM gateway fait tout transiter : HAProxy envoie le SQL vers la base primaire, etcd tient l'état des clusters Patroni, WireGuard ouvre l'accès d'administration, et une API FastAPI déploie chaque application des deux côtés d'un seul appel.",
    en: "A hybrid cloud in two halves. The private half is an OpenStack deployed with Kolla-Ansible on three Google Cloud VMs; it holds the PostgreSQL databases, made highly available with Patroni. The public half runs on AWS: a load balancer and two EC2 instances serve each application. Between them, a gateway VM carries everything: HAProxy sends SQL to the primary, etcd holds the Patroni cluster state, WireGuard opens admin access, and a FastAPI service deploys each application on both sides in a single call.",
  },
  facts: [
    { value: "3", label: { fr: "VM GCP portent tout OpenStack", en: "GCP VMs carry all of OpenStack" } },
    { value: "2 + 2", label: { fr: "VM par appli : Patroni sur OpenStack, EC2 sur AWS", en: "VMs per app: Patroni on OpenStack, EC2 on AWS" } },
    { value: "7", label: { fr: "routes dans l'API de la gateway", en: "routes in the gateway API" } },
    { value: "3", label: { fr: "providers Terraform : google, openstack, aws", en: "Terraform providers: google, openstack, aws" } },
    { value: "1", label: { fr: "port SQL HAProxy dédié à chaque appli", en: "dedicated HAProxy SQL port per app" } },
    { value: "60 s", label: { fr: "pour que le cluster converge, sinon échec", en: "for the cluster to converge, or it fails" } },
  ],
  layers: [
    {
      id: "clients",
      label: { fr: "Clients", en: "Clients" },
      host: "",
      items: [
        { name: "Utilisateurs", detail: { fr: "Navigateur vers l'ALB de l'appli, en HTTP :80", en: "Browser to the app's ALB, HTTP :80" } },
        { name: "Opérateur", detail: { fr: "Appelle l'API de la gateway sur :8010 · create, deploy, destroy, delete", en: "Calls the gateway API on :8010 · create, deploy, destroy, delete" } },
        { name: "Admin", detail: { fr: "Tunnel WireGuard vers Horizon et les API OpenStack", en: "WireGuard tunnel to Horizon and the OpenStack APIs" } },
      ],
      link: { fr: "Internet · seul le trafic applicatif va vers AWS", en: "Internet · only app traffic goes to AWS" },
    },
    {
      id: "aws",
      label: { fr: "AWS · public, eu-west-3", en: "AWS · public, eu-west-3" },
      host: "server",
      items: [
        { name: "Application Load Balancer", detail: { fr: "/ vers le front :5173 · /api/*, /docs vers le back :8000 · cookie de session", en: "/ to the frontend :5173 · /api/*, /docs to the backend :8000 · sticky cookie" } },
        { name: "Auto Scaling Group", detail: { fr: "2 × t3.micro sur deux sous-réseaux · Ubuntu 22.04", en: "2 × t3.micro across two subnets · Ubuntu 22.04" } },
        { name: "Appli au boot", detail: { fr: "user-data : clone, FastAPI sous uvicorn, React + Vite servi par serve", en: "user-data: clone, FastAPI under uvicorn, React + Vite served by serve" } },
      ],
      link: { fr: "DATABASE_URL vers la gateway, sur le port SQL propre à l'appli", en: "DATABASE_URL to the gateway, on the app's own SQL port" },
    },
    {
      id: "gateway",
      label: { fr: "GCP · vm-gateway", en: "GCP · vm-gateway" },
      host: "server",
      items: [
        { name: "HAProxy", detail: { fr: "Un port par appli à partir de 5100 · suit /primary de Patroni sur :8008", en: "One port per app from 5100 · follows Patroni /primary on :8008" } },
        { name: "API CMP", detail: { fr: "FastAPI :8010 · lance Terraform et les scripts de l'appli", en: "FastAPI :8010 · runs Terraform and the app scripts" } },
        { name: "etcd", detail: { fr: "Un seul nœud sur :2379, partagé par tous les clusters Patroni", en: "A single node on :2379, shared by every Patroni cluster" } },
        { name: "WireGuard", detail: { fr: "UDP 51820 · clients en 10.200.0.0/24 · NAT sortant", en: "UDP 51820 · clients on 10.200.0.0/24 · outbound NAT" } },
      ],
      link: { fr: "Floating IPs Neutron sur vpc-external · PostgreSQL :5432, REST Patroni :8008", en: "Neutron floating IPs on vpc-external · PostgreSQL :5432, Patroni REST :8008" },
    },
    {
      id: "openstack",
      label: { fr: "OpenStack · Kolla-Ansible", en: "OpenStack · Kolla-Ansible" },
      host: "server",
      items: [
        { name: "Paire Patroni", detail: { fr: "arcl-<app>-control et -compute, une par zone de disponibilité · PostgreSQL 16, un leader et une réplique", en: "arcl-<app>-control and -compute, one per availability zone · PostgreSQL 16, one leader and one replica" } },
        { name: "Neutron", detail: { fr: "arcl-external en flat sur physnet1 · arcl-tenant-net · routeur arcl-tenant-router", en: "Flat arcl-external on physnet1 · arcl-tenant-net · arcl-tenant-router" } },
        { name: "Socle partagé", detail: { fr: "Image Ubuntu 24.04 · 3 gabarits · groupe de sécurité · clé · 2 agrégats Nova", en: "Ubuntu 24.04 image · 3 flavors · security group · keypair · 2 Nova aggregates" } },
      ],
      link: { fr: "Virtualisation imbriquée · ens4 en management, ens5 vers Neutron", en: "Nested virtualization · ens4 for management, ens5 to Neutron" },
    },
    {
      id: "gcp",
      label: { fr: "Google Cloud · Compute Engine", en: "Google Cloud · Compute Engine" },
      host: "",
      items: [
        { name: "vm-control", detail: { fr: "n2-standard-4 · contrôle, réseau, stockage et compute", en: "n2-standard-4 · control, network, storage and compute" } },
        { name: "vm-compute", detail: { fr: "n2-standard-4 · compute dédié", en: "n2-standard-4 · dedicated compute" } },
        { name: "Deux VPC", detail: { fr: "vpc-mgmt 10.10.0.0/24 · vpc-external 10.20.0.0/24", en: "vpc-mgmt 10.10.0.0/24 · vpc-external 10.20.0.0/24" } },
      ],
    },
  ],
  principles: [
    {
      title: { fr: "Données privées, exposition publique", en: "Private data, public exposure" },
      body: { fr: "Les bases restent sur OpenStack, les applis tournent sur AWS. Le seul chemin entre les deux passe par HAProxy, sur la gateway.", en: "Databases stay on OpenStack, apps run on AWS. The only path between them goes through HAProxy, on the gateway." },
    },
    {
      title: { fr: "Une appli, un dossier Terraform", en: "One app, one Terraform folder" },
      body: { fr: "Chaque appli est une copie d'app_template avec son propre état. La détruire ne touche à rien d'autre, et le socle partagé reste en place.", en: "Each app is a copy of app_template with its own state. Destroying it touches nothing else, and the shared baseline stays." },
    },
    {
      title: { fr: "On vise la primaire, pas une IP", en: "Aim at the primary, not an IP" },
      body: { fr: "HAProxy interroge /primary sur chaque nœud : 200 sur le leader, 503 sur la réplique. Après un failover, le SQL suit seul.", en: "HAProxy polls /primary on each node: 200 on the leader, 503 on the replica. After a failover, SQL follows on its own." },
    },
    {
      title: { fr: "Des nœuds installés hors ligne", en: "Nodes installed offline" },
      body: { fr: "Patroni, PostgreSQL et etcd arrivent dans un lot de .deb copié par SCP. Le lot est vérifié avant la moindre connexion SSH.", en: "Patroni, PostgreSQL and etcd ship in a .deb bundle copied over SCP. The bundle is checked before any SSH connection." },
    },
    {
      title: { fr: "Rien n'est validé sans preuve", en: "Nothing passes without proof" },
      body: { fr: "Un leader etcd unique, /health de Patroni, un seul leader PostgreSQL, puis un select 1 par HAProxy. Si le SQL échoue, la route de l'appli est retirée.", en: "A single etcd leader, Patroni /health, a single PostgreSQL leader, then a select 1 through HAProxy. If SQL fails, the app's route is rolled back." },
    },
    {
      title: { fr: "Les pièges du cloud dans le code", en: "Cloud quirks live in code" },
      body: { fr: "Les correctifs de l'incident GCP × Neutron sont écrits en Terraform et en scripts relancés après chaque redéploiement, pas en commandes faites à la main.", en: "The fixes from the GCP × Neutron incident are written as Terraform and as scripts rerun after every redeploy, not as manual commands." },
    },
  ],
  flow: {
    title: { fr: "Déployer une appli · POST /deploy-app", en: "Deploying an app · POST /deploy-app" },
    actors: ["Opérateur", "API CMP", "deploy.sh", "OpenStack", "Patroni", "HAProxy", "AWS"],
    anchors: [{ item: "Opérateur" }, { item: "API CMP" }, { item: "API CMP" }, { layer: "openstack" }, { item: "Paire Patroni" }, { item: "HAProxy" }, { layer: "aws" }],
    steps: [
      { from: 0, to: 1, label: { fr: "POST /create-app", en: "POST /create-app" } },
      { from: 1, to: 2, label: { fr: "Copie du template, tfvars, init", en: "Template copy, tfvars, init" } },
      { from: 0, to: 1, label: { fr: "POST /deploy-app/{id}", en: "POST /deploy-app/{id}" } },
      { from: 1, to: 2, label: { fr: "Lance deploy.sh", en: "Runs deploy.sh" } },
      { from: 2, to: 3, label: { fr: "2 ports, 2 instances, 2 FIP", en: "2 ports, 2 instances, 2 FIPs" } },
      { from: 2, to: 4, label: { fr: "Lot .deb par SCP, PostgreSQL, Patroni", en: ".deb bundle over SCP, PostgreSQL, Patroni" } },
      { from: 4, to: 2, label: { fr: "Un seul leader, une réplique", en: "One leader, one replica" } },
      { from: 2, to: 5, label: { fr: "Nouveau port, contrôle /primary", en: "New port, /primary check" } },
      { from: 5, to: 4, label: { fr: "select 1 via le port", en: "select 1 through the port" } },
      { from: 2, to: 5, label: { fr: "Création de la base notesdb", en: "notesdb database created" } },
      { from: 2, to: 6, label: { fr: "ALB + ASG, DATABASE_URL injectée", en: "ALB + ASG, DATABASE_URL injected" } },
      { from: 6, to: 5, label: { fr: "SQL de l'appli vers la primaire", en: "App SQL to the primary" } },
    ],
    note: {
      fr: "Chaque cible se désactive séparément : OpenStack seul, ou AWS seul. La destruction se fait dans l'ordre inverse : route HAProxy retirée, puis AWS, puis OpenStack. L'API renvoie la sortie de chaque commande en JSON, et lit l'état de l'ASG et des cibles de l'ALB avec boto3.",
      en: "Each target can be turned off on its own: OpenStack only, or AWS only. Teardown runs in reverse: HAProxy route removed, then AWS, then OpenStack. The API returns each command's output as JSON, and reads the ASG and ALB target health through boto3.",
    },
  },
  steps: {
    title: { fr: "Mise en place du socle", en: "Standing up the baseline" },
    items: [
      { name: { fr: "Infra GCP", en: "GCP infra" }, code: "private_gcp/terraform", detail: { fr: "3 VM, 2 VPC, pare-feu · la gateway s'installe par cloud-init : Terraform, dépôt, API", en: "3 VMs, 2 VPCs, firewalls · the gateway sets itself up via cloud-init: Terraform, repo, API" } },
      { name: { fr: "VPN", en: "VPN" }, code: "wg0.conf", detail: { fr: "WireGuard configuré sur la gateway, puis sur le poste", en: "WireGuard set up on the gateway, then on the workstation" } },
      { name: { fr: "OpenStack", en: "OpenStack" }, code: "kolla-ansible deploy", detail: { fr: "Depuis le poste : bootstrap-servers, prechecks, deploy, post-deploy", en: "From the workstation: bootstrap-servers, prechecks, deploy, post-deploy" } },
      { name: { fr: "Socle partagé", en: "Shared baseline" }, code: "openstack_config", detail: { fr: "Réseaux, routeur, gabarits, image, groupe de sécurité, zones", en: "Networks, router, flavors, image, security group, zones" } },
      { name: { fr: "Correctifs + tests", en: "Fixes + tests" }, code: "post-deploy-openstack.sh", detail: { fr: "Route vers la gateway, MAC du routeur, ping et SSH vers les FIP", en: "Route to the gateway, router MAC, ping and SSH to the FIPs" } },
    ],
    note: {
      fr: "Ces étapes se font une fois, puis etcd et HAProxy s'installent sur la gateway par script. Ensuite, chaque appli se déploie par l'API, sans toucher au socle.",
      en: "These steps run once, then etcd and HAProxy are installed on the gateway by script. After that, every app deploys through the API, without touching the baseline.",
    },
  },
  notes: [
    {
      title: { fr: "Incident · FIP actives, mais injoignables", en: "Incident · FIPs active, yet unreachable" },
      body: {
        fr: "Les floating IPs étaient ACTIVE dans OpenStack, mais la gateway ne les joignait pas. Trois causes, documentées dans un postmortem. GCP rejette le trafic vers des IP que la carte réseau ne possède pas. Les VM GCP sont en /32, alors que le routeur Neutron supposait un /24. Et la MAC du routeur ne correspondait pas à celle d'ens5. Le correctif durable : deux plages d'alias IP sur la NIC external de vm-control, un pool de FIP limité à ces plages (.112 à .143), et une route 10.20.0.10/32 via 10.20.0.1 sur le routeur tenant.",
        en: "Floating IPs were ACTIVE in OpenStack, yet the gateway could not reach them. Three causes, written up in a postmortem. GCP drops traffic to IPs the NIC does not own. GCP VMs are /32 hosts, while the Neutron router assumed a /24. And the router MAC did not match ens5. The lasting fix: two alias IP ranges on vm-control's external NIC, a FIP pool kept inside them (.112 to .143), and a 10.20.0.10/32 via 10.20.0.1 route on the tenant router.",
      },
    },
    {
      title: { fr: "Failover testé de bout en bout", en: "Failover tested end to end" },
      body: {
        fr: "test_failover.sh écrit une ligne par le port HAProxy, arrête Patroni sur le leader, attend l'élection d'un nouveau leader, puis vérifie que l'écriture passe toujours par le même port, sans rien reconfigurer côté appli.",
        en: "test_failover.sh writes a row through the HAProxy port, stops Patroni on the leader, waits for a new leader to be elected, then checks that writes still go through the same port, with nothing reconfigured on the app side.",
      },
    },
  ],
  tables: [
    {
      title: { fr: "Réseau", en: "Network" },
      head: [{ fr: "Plage", en: "Range" }, { fr: "Réseau", en: "Network" }, { fr: "Qui s'y trouve", en: "What lives there" }],
      mono: [0],
      rows: [
        ["10.10.0.0/24", "vpc-mgmt", { fr: "Gateway .10, control .11, compute .12 · API OpenStack ouvertes au VPN et à la gateway seulement", en: "Gateway .10, control .11, compute .12 · OpenStack APIs open to the VPN and the gateway only" }],
        ["10.20.0.0/24", "vpc-external", { fr: "Gateway .10 avec IP publique statique · ens5 des nœuds · réseau externe de Neutron", en: "Gateway .10 with a static public IP · node ens5 · Neutron external network" }],
        ["10.20.0.112–143", { fr: "Pool de FIP", en: "FIP pool" }, { fr: "Deux /28 en alias IP sur vm-control, pour que GCP accepte le trafic", en: "Two /28 alias IP ranges on vm-control, so GCP accepts the traffic" }],
        ["10.200.0.0/24", "WireGuard", { fr: "Clients VPN, seuls autorisés vers Horizon et les API", en: "VPN clients, the only ones allowed to Horizon and the APIs" }],
      ],
    },
    {
      title: { fr: "Ports", en: "Ports" },
      head: [{ fr: "Port", en: "Port" }, { fr: "Service", en: "Service" }, { fr: "Où", en: "Where" }],
      mono: [0],
      rows: [
        ["80", "ALB", "AWS"],
        ["5173 · 8000", { fr: "Front React · back FastAPI", en: "React frontend · FastAPI backend" }, "EC2"],
        ["8010", { fr: "API CMP", en: "CMP API" }, "vm-gateway"],
        ["5100+", { fr: "HAProxy, un port SQL par appli", en: "HAProxy, one SQL port per app" }, "vm-gateway"],
        ["8404", { fr: "Statistiques HAProxy", en: "HAProxy stats" }, "vm-gateway"],
        ["2379", "etcd", "vm-gateway"],
        ["51820/udp", "WireGuard", "vm-gateway"],
        ["5432 · 8008", { fr: "PostgreSQL · REST Patroni", en: "PostgreSQL · Patroni REST" }, { fr: "Instances OpenStack", en: "OpenStack instances" }],
        ["5000 · 8774 · 9696 · 9292", "Keystone · Nova · Neutron · Glance", { fr: "vm-control, via le VPN", en: "vm-control, through the VPN" }],
      ],
    },
    {
      title: { fr: "API de la gateway", en: "Gateway API" },
      head: [{ fr: "Route", en: "Route" }, { fr: "Effet", en: "Effect" }],
      mono: [0],
      rows: [
        ["GET /health", { fr: "Vérifie que l'API répond", en: "Checks the API is up" }],
        ["GET /list-apps", { fr: "Liste les dossiers apps/app-*", en: "Lists the apps/app-* folders" }],
        ["GET /app-info/{id}", { fr: "Chemins, états Terraform, métriques ASG et ALB via boto3", en: "Paths, Terraform state, ASG and ALB metrics via boto3" }],
        ["POST /create-app", { fr: "Copie le template, écrit les tfvars, lance init.sh", en: "Copies the template, writes tfvars, runs init.sh" }],
        ["POST /deploy-app/{id}", { fr: "deploy.sh, OpenStack et AWS ensemble ou séparément", en: "deploy.sh, OpenStack and AWS together or separately" }],
        ["POST /destroy-app/{id}", { fr: "destroy.sh, dans l'ordre inverse", en: "destroy.sh, in reverse order" }],
        ["DELETE /delete-app/{id}", { fr: "Détruit puis supprime le dossier, jamais le template", en: "Destroys then removes the folder, never the template" }],
      ],
    },
  ],
  inventory: [
    {
      group: { fr: "Clouds", en: "Clouds" },
      rows: [
        { tech: "Google Compute Engine", version: "—", role: { fr: "Les trois VM qui portent OpenStack et la gateway", en: "The three VMs carrying OpenStack and the gateway" } },
        { tech: "OpenStack · Kolla-Ansible", version: "—", role: { fr: "Cloud privé : Nova, Neutron, Glance, Keystone, Horizon", en: "Private cloud: Nova, Neutron, Glance, Keystone, Horizon" } },
        { tech: "AWS", version: "eu-west-3", role: { fr: "ALB, Auto Scaling Group, EC2", en: "ALB, Auto Scaling Group, EC2" } },
      ],
    },
    {
      group: { fr: "Infrastructure as code", en: "Infrastructure as code" },
      rows: [
        { tech: "Terraform", version: "≥ 1.5", role: { fr: "Toute l'infra, des VM GCP aux stacks de chaque appli", en: "All infrastructure, from GCP VMs to each app's stacks" } },
        { tech: "hashicorp/google", version: "5.45", role: { fr: "VPC, pare-feu, VM, alias IP", en: "VPCs, firewalls, VMs, alias IPs" } },
        { tech: "openstack provider", version: "2.1", role: { fr: "Socle partagé et instances des applis", en: "Shared baseline and app instances" } },
        { tech: "hashicorp/aws", version: "5.100", role: { fr: "ALB, ASG, launch template, groupes de sécurité", en: "ALB, ASG, launch template, security groups" } },
      ],
    },
    {
      group: { fr: "Données et réseau", en: "Data and network" },
      rows: [
        { tech: "PostgreSQL", version: "16", role: { fr: "Base de chaque appli", en: "Each app's database" } },
        { tech: "Patroni", version: "3.2", role: { fr: "Élection du leader, réplication, API REST de santé", en: "Leader election, replication, health REST API" } },
        { tech: "etcd", version: "3.4", role: { fr: "État des clusters Patroni", en: "Patroni cluster state" } },
        { tech: "HAProxy", version: "—", role: { fr: "Routage SQL vers la primaire", en: "SQL routing to the primary" } },
        { tech: "WireGuard", version: "—", role: { fr: "Accès d'administration", en: "Admin access" } },
      ],
    },
    {
      group: { fr: "API de la gateway", en: "Gateway API" },
      rows: [
        { tech: "FastAPI · uvicorn", version: "0.115 · 0.30", role: { fr: "Cycle de vie des applis", en: "App lifecycle" } },
        { tech: "pydantic", version: "2.9", role: { fr: "Validation des requêtes", en: "Request validation" } },
        { tech: "boto3", version: "1.38", role: { fr: "Lecture de l'état AWS", en: "Reading AWS state" } },
      ],
    },
  ],
};
