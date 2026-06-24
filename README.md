# Honae Care — Formulaire d'anamnèse fertilité

Application Next.js 14 pour la gestion du formulaire d'anamnèse fertilité du centre Honae Care (Belgique).

## Fonctionnalités

- Formulaire multi-étapes en français (8 étapes, ~100 champs)
- Génération PDF côté serveur via @react-pdf/renderer
- Stockage chiffré AES-256-GCM sur le serveur (dossier `/data/submissions/`)
- Interface admin sécurisée (JWT httpOnly, bcrypt, rate limiting)
- Aucune donnée transmise à des tiers, aucune analytics
- Sauvegarde automatique dans localStorage (reprise en cas de perte de connexion)

---

## Installation locale

### Prérequis
- Node.js 18+
- npm

```bash
cd honae-care
npm install
```

### Variables d'environnement

Copier le fichier exemple et renseigner les valeurs :

```bash
cp .env.local.example .env.local
```

Générer les secrets :

```bash
# ENCRYPTION_KEY (32 bytes hex)
openssl rand -hex 32

# JWT_SECRET (32 bytes hex)
openssl rand -hex 32

# ADMIN_PASSWORD_HASH (remplacer MON_MOT_DE_PASSE)
node -e "const b=require('bcryptjs'); b.hash('MON_MOT_DE_PASSE', 12).then(console.log)"
```

Renseigner dans `.env.local` :

```env
ENCRYPTION_KEY=<valeur openssl>
JWT_SECRET=<valeur openssl>
ADMIN_PASSWORD_HASH=<valeur bcrypt>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Démarrage

```bash
npm run dev
```

Application disponible sur http://localhost:3000

---

## Déploiement VPS Ubuntu (Node.js + PM2 + Nginx + HTTPS)

### 1. Préparer le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 20 (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PM2 globalement
sudo npm install -g pm2

# Installer Nginx
sudo apt install -y nginx

# Installer Certbot (HTTPS)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Déployer l'application

```bash
# Cloner ou copier le projet
cd /var/www
sudo git clone <repo> honae-care
sudo chown -R $USER:$USER /var/www/honae-care
cd /var/www/honae-care

# Installer les dépendances
npm install

# Créer le fichier .env.local
nano .env.local
# (renseigner ENCRYPTION_KEY, JWT_SECRET, ADMIN_PASSWORD_HASH, NEXT_PUBLIC_BASE_URL)

# Créer le dossier de données
mkdir -p data/submissions

# Builder l'application
npm run build
```

### 3. Configurer PM2

```bash
pm2 start npm --name "honae-care" -- start
pm2 startup
pm2 save
```

### 4. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/honae-care
```

Contenu du fichier :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/honae-care /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Activer HTTPS avec Certbot

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
# Certbot modifie automatiquement la config Nginx pour HTTPS

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

### 6. Sécuriser le dossier /data

Le dossier `/data/submissions/` doit être inaccessible depuis le web. Nginx ne le sert pas directement (hors dossier `public/`), mais par précaution :

```bash
# S'assurer que /data est hors de la racine publique de Nginx
# (le proxy_pass vers Next.js s'en charge)

# Permissions restrictives
chmod 700 /var/www/honae-care/data
chmod 700 /var/www/honae-care/data/submissions
```

### 7. Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 8. Mises à jour

```bash
cd /var/www/honae-care
git pull
npm install
npm run build
pm2 restart honae-care
```

---

## Structure du projet

```
honae-care/
├── app/
│   ├── api/
│   │   ├── submit/           # POST — reçoit le formulaire, génère et stocke le PDF
│   │   ├── download-patient/ # POST — génère un PDF en mémoire pour le patient
│   │   └── admin/
│   │       ├── login/        # POST — authentification admin
│   │       ├── logout/       # POST — déconnexion
│   │       └── submissions/  # GET — liste + [id]/download
│   ├── admin/
│   │   ├── page.tsx          # Dashboard secrétariat
│   │   └── login/page.tsx    # Page de connexion
│   └── form/
│       ├── page.tsx          # Formulaire multi-étapes
│       └── confirmation/     # Page de confirmation
├── components/form/
│   ├── FormContainer.tsx     # Orchestrateur du formulaire
│   ├── FormProgress.tsx      # Barre de progression
│   ├── FormField.tsx         # Composants UI réutilisables
│   └── steps/               # Step1.tsx … Step8.tsx
├── lib/
│   ├── crypto.ts             # Chiffrement AES-256-GCM
│   ├── storage.ts            # Lecture/écriture fichiers chiffrés
│   ├── auth.ts               # bcrypt, JWT, rate limiting
│   ├── pdf.tsx               # Génération PDF (@react-pdf/renderer)
│   └── types.ts              # Types TypeScript
├── middleware.ts             # Protection des routes /admin
└── data/                    # Données (hors dossier public)
    ├── submissions/          # PDFs chiffrés (.enc)
    ├── index.json            # Métadonnées (sans données de santé)
    └── access.log            # Journal des accès admin
```

---

## Sécurité

| Mesure | Détail |
|--------|--------|
| Chiffrement données | AES-256-GCM, clé en variable d'environnement |
| Authentification admin | bcrypt + JWT httpOnly cookie (8h) |
| Rate limiting | 5 tentatives max, blocage 15 min |
| Headers sécurité | CSP, X-Frame-Options, HSTS, X-Content-Type-Options |
| Données en transit | HTTPS obligatoire (Certbot) |
| Aucune analytics | Pas de cookie tracking tiers |
| RGPD | Consentement explicite, données pseudonymisées dans l'index |

---

## Accès admin

- URL : `https://votre-domaine.com/admin`
- Mot de passe : celui défini lors de la génération du hash bcrypt

Pour changer le mot de passe :
```bash
node -e "const b=require('bcryptjs'); b.hash('NOUVEAU_MOT_DE_PASSE', 12).then(console.log)"
# Mettre à jour ADMIN_PASSWORD_HASH dans .env.local
pm2 restart honae-care
```
