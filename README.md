# FIT PRO

FIT PRO est une plateforme fitness responsive, construite progressivement pour conserver l’ensemble du cahier des charges. Ce premier socle comprend une application Next.js/TypeScript, une base PostgreSQL via Prisma, une inscription par e-mail/mot de passe et l’enregistrement d’entraînements personnels.

## État honnête du projet

**Implémenté dans le code :** inscription e-mail avec validation et hachage bcrypt, connexion par credentials, zones privées, déconnexion, schéma PostgreSQL, profil de base, sauvegarde des séances et tableau de bord dérivé des enregistrements réels. Les calories sont facultatives et affichées comme déclarées ; aucune estimation n’est inventée.

**Pas encore implémenté/configuré :** vérification et récupération par e-mail (fournisseur d’envoi requis), Google/Facebook OAuth (secrets et configuration fournisseur requis), édition du profil, objectifs et modules nutrition/hydratation complets, programmes/contenu, coach, notifications, paiements et vérification serveur des achats, AdMob/publicité Web, administration/tickets, sauvegardes opérées, déploiement mobile et tests de bout en bout. Le schéma réserve des entités futures mais cela ne signifie pas que leurs fonctions sont actives.

## Prérequis et lancement local

Node.js 20.9+ et PostgreSQL 14+.

```bash
cp .env.example .env
# Modifier DATABASE_URL et AUTH_SECRET
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Ouvrir http://localhost:3000. Pour créer `AUTH_SECRET`, générer une valeur aléatoire forte, par exemple `openssl rand -base64 32`. Ne jamais committer `.env`.

Vérifications :

```bash
npm test
npm run typecheck
npm run build
```

## OAuth (quand vous êtes prêt)

Les identifiants sont fournis par les consoles développeur Google et Meta/Facebook ; ne les partagez pas publiquement. Configurer `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` et `AUTH_SECRET` dans `.env` (local) ou les secrets de la plateforme d’hébergement. URL callback Auth.js locale : `http://localhost:3000/api/auth/callback/google` et `/facebook`; enregistrer l’URL publique HTTPS équivalente dans chaque console. Ajouter `NEXT_PUBLIC_GOOGLE_LOGIN=true` et/ou `NEXT_PUBLIC_FACEBOOK_LOGIN=true` pour afficher les boutons. Puis redémarrer l’application. OAuth n’est opérationnel qu’après configuration et essais réels.

## Architecture

- `src/app`: routes App Router, formulaires, tableaux de bord et actions serveur.
- `src/auth.ts`: Auth.js credentials + fournisseurs OAuth activés par configuration.
- `src/lib/db.ts`: client Prisma partagé.
- `prisma/schema.prisma`: modèle PostgreSQL ; chaque lecture/écriture privée est filtrée par l’identifiant de session.
- `src/middleware.ts`: protection de `/dashboard`.

Les transactions de paiement, secrets, webhooks et droits administrateur doivent rester côté serveur. Les migrations de schéma et sauvegardes réelles devront être ajoutées et testées avant mise en production.
