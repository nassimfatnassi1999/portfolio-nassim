import type { CheckContext, LabWorld, Mission, Pod } from './types';
import { allPodsRunning, createWorld, deploymentTarget, diskPercent, imageBase, podsOf, resourceKind, t } from './world';

const is = (ctx: CheckContext, name: string, ...args: string[]) =>
  ctx.ok && ctx.cmd.name === name && args.every((arg, index) => ctx.cmd.args[index] === arg);

const kubectlGet = (ctx: CheckContext, kind: ReturnType<typeof resourceKind>) =>
  ctx.ok && ctx.cmd.name === 'kubectl' && ctx.cmd.args[0] === 'get' && resourceKind(ctx.cmd.args[1]) === kind;

const clusterNodes: LabWorld['nodes'] = [
  { name: 'master-01', role: 'control-plane' },
  { name: 'worker-01', role: 'worker' },
  { name: 'worker-02', role: 'worker' },
];

const pod = (name: string, app: string, node: string, status: Pod['status'] = 'Running', restarts = 0, age = '3d'): Pod => ({
  name, app, node, status, restarts, age,
});

export const CRASHING_POD = 'api-7f5d2c-n3w9x';

const firstLogin: Mission = {
  id: 'first-login',
  scene: 'shell',
  title: t('First login', 'Première connexion'),
  brief: t(
    "You just got SSH access to Nassim's lab server. Get your bearings like any sysadmin on day one.",
    "Vous venez d'obtenir un accès SSH au serveur de labo de Nassim. Prenez vos repères comme tout sysadmin le premier jour.",
  ),
  debrief: t(
    'whoami, ls and cat are the first three commands of every incident. You are ready for real work.',
    'whoami, ls et cat sont les trois premières commandes de chaque incident. Vous êtes prêt pour le vrai travail.',
  ),
  objectives: [
    { id: 'whoami', title: t('Find out which user you are logged in as', 'Découvrez sous quel utilisateur vous êtes connecté'), hint: 'whoami', done: (ctx) => is(ctx, 'whoami') },
    { id: 'ls', title: t('List the files in your home directory', 'Listez les fichiers de votre répertoire personnel'), hint: 'ls', done: (ctx) => is(ctx, 'ls') },
    { id: 'cat', title: t('Read the mission brief in mission.txt', 'Lisez le brief dans mission.txt'), hint: 'cat mission.txt', done: (ctx) => is(ctx, 'cat', 'mission.txt') },
  ],
  setup: () => createWorld({
    scene: 'shell',
    host: 'ops-lab',
    files: {
      'mission.txt': t(
        "Welcome, operator.\nNassim's infrastructure needs you today:\n  1. ship an nginx container\n  2. fix a crashing Kubernetes pod\n  3. scale a deployment for a traffic spike\n  4. bring a broken web server back online\nType `hint` whenever you are stuck. Good luck!",
        "Bienvenue, opérateur.\nL'infrastructure de Nassim a besoin de vous aujourd'hui :\n  1. lancer un conteneur nginx\n  2. réparer un pod Kubernetes qui crash\n  3. scaler un déploiement pour un pic de trafic\n  4. remettre en ligne un serveur web en panne\nTapez `hint` dès que vous êtes bloqué. Bonne chance !",
      ),
      'skills.yaml': 'systems:  [Linux, Windows Server, AIX, VMware]\ncloud:    [Azure, AWS, Google Cloud, OpenStack]\nplatform: [Docker, Kubernetes, Helm]\ndelivery: [Jenkins, GitLab CI/CD, Argo CD, Terraform, Ansible]\nobserve:  [Prometheus, Grafana, ELK, Zabbix]',
      'notes.md': t('TODO: finish the lab, then contact Nassim (type `contact`).', 'TODO : finir le labo, puis contacter Nassim (tapez `contact`).'),
    },
  }),
};

const containers: Mission = {
  id: 'containers',
  scene: 'docker',
  title: t('Ship a container', 'Lancer un conteneur'),
  brief: t(
    'Marketing needs a web server right now. Use Docker to run nginx and publish it on port 8080.',
    'Le marketing a besoin d’un serveur web tout de suite. Utilisez Docker pour lancer nginx et le publier sur le port 8080.',
  ),
  debrief: t(
    'Container running, port published, response checked. That is the build → run → verify loop behind every deployment.',
    'Conteneur lancé, port publié, réponse vérifiée. C’est la boucle build → run → vérification derrière chaque déploiement.',
  ),
  objectives: [
    { id: 'docker-ps', title: t('List the running containers', 'Listez les conteneurs en cours d’exécution'), hint: 'docker ps', done: (ctx) => is(ctx, 'docker', 'ps') || is(ctx, 'docker', 'container', 'ls') },
    {
      id: 'docker-run',
      title: t('Run nginx in the background, named web, on port 8080', 'Lancez nginx en arrière-plan, nommé web, sur le port 8080'),
      hint: 'docker run -d --name web -p 8080:80 nginx',
      done: (ctx) => is(ctx, 'docker', 'run') && ctx.after.containers.some((container) => container.status === 'running' && imageBase(container.image) === 'nginx' && container.ports.includes(':8080->')),
    },
    { id: 'curl', title: t('Check that the site answers on localhost:8080', 'Vérifiez que le site répond sur localhost:8080'), hint: 'curl localhost:8080', done: (ctx) => is(ctx, 'curl') && ctx.cmd.args.some((arg) => arg.includes('8080')) },
  ],
  setup: () => createWorld({
    scene: 'docker',
    host: 'docker-host',
    images: ['nginx:latest', 'node:18-alpine', 'postgres:16'],
    containers: [
      { id: '8b2e4d6f1a3c', name: 'db', image: 'postgres:16', status: 'running', ports: '5432/tcp', age: '2 hours ago' },
      { id: '3f9a1c2b7d4e', name: 'legacy-api', image: 'node:18-alpine', status: 'exited', ports: '', age: '3 days ago' },
    ],
    services: { docker: 'active', containerd: 'active', sshd: 'active' },
    files: {
      'README.md': t('Task: start nginx on port 8080 so the marketing site is reachable.', 'Tâche : démarrer nginx sur le port 8080 pour rendre le site marketing accessible.'),
    },
  }),
};

const crashLoop: Mission = {
  id: 'crashloop',
  scene: 'kubernetes',
  title: t('Pod on fire', 'Pod en feu'),
  brief: t(
    'Alert! The `api` deployment is degraded after this morning’s release: one pod keeps crashing. Find the cause and fix it.',
    'Alerte ! Le déploiement `api` est dégradé depuis la release de ce matin : un pod crashe en boucle. Trouvez la cause et corrigez-la.',
  ),
  debrief: t(
    'Observe → read logs → fix config → roll out → verify. You just ran a textbook Kubernetes incident.',
    'Observer → lire les logs → corriger la config → redéployer → vérifier. Vous venez de mener un incident Kubernetes dans les règles.',
  ),
  objectives: [
    { id: 'get-pods', title: t('List the pods and spot the failing one', 'Listez les pods et repérez celui qui échoue'), hint: 'kubectl get pods', done: (ctx) => kubectlGet(ctx, 'pods') },
    {
      id: 'logs',
      title: t('Read the logs of the crashing pod', 'Lisez les logs du pod en crash'),
      hint: `kubectl logs ${CRASHING_POD}`,
      done: (ctx) => is(ctx, 'kubectl', 'logs') && ctx.before.pods.some((item) => item.name === ctx.cmd.args[1] && item.status === 'CrashLoopBackOff'),
    },
    { id: 'apply', title: t('Apply the fixed ConfigMap from api-config.yaml', 'Appliquez la ConfigMap corrigée depuis api-config.yaml'), hint: 'kubectl apply -f api-config.yaml', done: (ctx) => is(ctx, 'kubectl', 'apply') && ctx.after.configFixed },
    {
      id: 'restart',
      title: t('Restart the api pods so they load the new config', 'Redémarrez les pods api pour charger la nouvelle config'),
      hint: 'kubectl rollout restart deployment/api',
      done: (ctx) => ctx.ok && ctx.after.configFixed && ctx.cmd.name === 'kubectl' && (
        (ctx.cmd.args[0] === 'rollout' && ctx.cmd.args[1] === 'restart' && deploymentTarget(ctx.cmd.args.slice(2)) === 'api')
        || (ctx.cmd.args[0] === 'delete' && podsOf(ctx.before, 'api').some((item) => item.status === 'CrashLoopBackOff' && ctx.after.pods.find((other) => other.name === item.name)?.status === 'Terminating'))
      ),
    },
    { id: 'verify', title: t('Confirm that every pod is Running', 'Confirmez que tous les pods sont Running'), hint: 'kubectl get pods', done: (ctx) => kubectlGet(ctx, 'pods') && allPodsRunning(ctx.after) },
  ],
  setup: () => createWorld({
    scene: 'kubernetes',
    host: 'ops-lab',
    nodes: clusterNodes,
    deployments: [
      { name: 'api', replicas: 3, image: 'registry.local/api:2.4.0', revision: '7f5d2c' },
      { name: 'web', replicas: 2, image: 'nginx:1.27', revision: '5c6b4f' },
    ],
    pods: [
      pod('api-6b8c9d-k2x7p', 'api', 'worker-01'),
      pod('api-6b8c9d-q9m4t', 'api', 'worker-02'),
      pod(CRASHING_POD, 'api', 'worker-02', 'CrashLoopBackOff', 7, '14m'),
      pod('web-5c6b4f-h7j2k', 'web', 'worker-01', 'Running', 0, '6d'),
      pod('web-5c6b4f-z4r8s', 'web', 'worker-02', 'Running', 0, '6d'),
      pod('postgres-0', 'postgres', 'worker-01', 'Running', 0, '12d'),
    ],
    services: { kubelet: 'active', containerd: 'active', sshd: 'active' },
    files: {
      'api-config.yaml': 'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: api-config\ndata:\n  DB_HOST: postgres.default.svc.cluster.local\n  DB_PORT: "5432"\n  LOG_LEVEL: info',
      'incident.txt': t('INC-2048 · api degraded since release 2.4.0 · on-call: you', 'INC-2048 · api dégradée depuis la release 2.4.0 · astreinte : vous'),
    },
  }),
};

const scale: Mission = {
  id: 'scale',
  scene: 'kubernetes',
  title: t('Traffic spike', 'Pic de trafic'),
  brief: t(
    'A recruiter just shared this portfolio and traffic on `web` is exploding. Scale it from 2 to 5 replicas.',
    'Un recruteur vient de partager ce portfolio et le trafic sur `web` explose. Passez-le de 2 à 5 réplicas.',
  ),
  debrief: t(
    'Horizontal scaling in one command, spread across workers by the scheduler. In production an HPA would do this for you.',
    'Scalabilité horizontale en une commande, répartie sur les workers par le scheduler. En production, un HPA le ferait pour vous.',
  ),
  objectives: [
    { id: 'get-deploy', title: t('Check the current replica count', 'Vérifiez le nombre actuel de réplicas'), hint: 'kubectl get deployments', done: (ctx) => kubectlGet(ctx, 'deployments') },
    {
      id: 'scale',
      title: t('Scale the web deployment to 5 replicas', 'Scalez le déploiement web à 5 réplicas'),
      hint: 'kubectl scale deployment/web --replicas=5',
      done: (ctx) => ctx.ok && ctx.cmd.name === 'kubectl' && ctx.cmd.args[0] === 'scale' && (ctx.after.deployments.find((item) => item.name === 'web')?.replicas ?? 0) >= 5,
    },
    {
      id: 'spread',
      title: t('See all web pods Running across the nodes', 'Voyez tous les pods web Running sur les nœuds'),
      hint: 'kubectl get pods -o wide',
      done: (ctx) => kubectlGet(ctx, 'pods') && podsOf(ctx.after, 'web').length >= 5 && podsOf(ctx.after, 'web').every((item) => item.status === 'Running'),
    },
  ],
  setup: () => createWorld({
    scene: 'kubernetes',
    host: 'ops-lab',
    nodes: clusterNodes,
    configFixed: true,
    deployments: [
      { name: 'api', replicas: 3, image: 'registry.local/api:2.4.1', revision: '9d4e1a' },
      { name: 'web', replicas: 2, image: 'nginx:1.27', revision: '5c6b4f' },
    ],
    pods: [
      pod('api-9d4e1a-b7k2m', 'api', 'worker-01', 'Running', 0, '2h'),
      pod('api-9d4e1a-c4x9q', 'api', 'worker-02', 'Running', 0, '2h'),
      pod('api-9d4e1a-t6w3z', 'api', 'worker-01', 'Running', 0, '2h'),
      pod('web-5c6b4f-h7j2k', 'web', 'worker-01', 'Running', 0, '6d'),
      pod('web-5c6b4f-z4r8s', 'web', 'worker-02', 'Running', 0, '6d'),
      pod('postgres-0', 'postgres', 'worker-02', 'Running', 0, '12d'),
    ],
    services: { kubelet: 'active', containerd: 'active', sshd: 'active' },
    files: {
      'traffic.txt': t('web: 4 200 req/s (normal: 600) · p95 latency: 1.8 s', 'web : 4 200 req/s (normal : 600) · latence p95 : 1,8 s'),
    },
  }),
};

const serverDown: Mission = {
  id: 'server-down',
  scene: 'server',
  title: t('Server down', 'Serveur à terre'),
  brief: t(
    'The load balancer returns 502 for the website. SSH still works on web-01. Investigate like a sysadmin and bring it back.',
    'Le load balancer renvoie 502 pour le site. Le SSH fonctionne encore sur web-01. Enquêtez comme un sysadmin et remettez-le en ligne.',
  ),
  debrief: t(
    'Service status → disk → culprit → safe cleanup → restart → verify. Next step in real life: log rotation and a disk alert at 80%.',
    'Statut du service → disque → coupable → nettoyage sûr → redémarrage → vérification. Prochaine étape en vrai : rotation des logs et alerte disque à 80 %.',
  ),
  objectives: [
    { id: 'status', title: t('Check the nginx service status', 'Vérifiez le statut du service nginx'), hint: 'systemctl status nginx', done: (ctx) => is(ctx, 'systemctl', 'status', 'nginx') },
    { id: 'df', title: t('Check the disk usage', 'Vérifiez l’utilisation du disque'), hint: 'df -h', done: (ctx) => is(ctx, 'df') },
    { id: 'du', title: t('Find what is filling /var/log', 'Trouvez ce qui remplit /var/log'), hint: 'du -sh /var/log/*', done: (ctx) => is(ctx, 'du') && ctx.cmd.args.some((arg) => arg.startsWith('/var/log')) },
    {
      id: 'free',
      title: t('Free space by emptying the runaway log file', 'Libérez de l’espace en vidant le fichier de log incontrôlé'),
      hint: 'truncate -s 0 /var/log/app/debug.log',
      done: (ctx) => ctx.ok && diskPercent(ctx.after) < 90,
    },
    { id: 'restart', title: t('Restart nginx', 'Redémarrez nginx'), hint: 'systemctl restart nginx', done: (ctx) => ctx.ok && ctx.after.services.nginx === 'active' },
    { id: 'verify', title: t('Confirm the site answers again', 'Confirmez que le site répond à nouveau'), hint: 'curl -I localhost', done: (ctx) => is(ctx, 'curl') && ctx.after.services.nginx === 'active' },
  ],
  setup: () => createWorld({
    scene: 'server',
    host: 'web-01',
    disk: { sizeGb: 20, baseUsedGb: 4.4 },
    logs: [
      { path: '/var/log/app/debug.log', sizeGb: 14 },
      { path: '/var/log/nginx/access.log', sizeGb: 1.2 },
      { path: '/var/log/nginx/error.log', sizeGb: 0 },
      { path: '/var/log/syslog', sizeGb: 0.4 },
    ],
    services: { nginx: 'failed', 'portfolio-app': 'active', sshd: 'active', cron: 'active' },
    files: {
      'alert.txt': t('[FIRING] HTTP 502 Bad Gateway · lb-01 → web-01:80 · since 03:12 UTC', '[FIRING] HTTP 502 Bad Gateway · lb-01 → web-01:80 · depuis 03:12 UTC'),
    },
  }),
};

export const missions: Mission[] = [firstLogin, containers, crashLoop, scale, serverDown];

export const POINTS_PER_OBJECTIVE = 100;
export const HINT_COST = 30;
export const MAX_SCORE = missions.reduce((total, mission) => total + mission.objectives.length * POINTS_PER_OBJECTIVE, 0);
