# Hospital Management System

Un système complet de gestion d'hôpital avec trois niveaux d'accès : Administrateur, Docteur, et Réceptionniste.
![Capture d'écran du projet](./frontend/src/assets/readmeImage.png)

## Structure du Projet

```
hospital-app/
├── backend/          # API REST Node.js/Express
│   ├── src/
│   │   ├── controllers/   # Logique métier
│   │   ├── models/        # Modèles de base de données
│   │   ├── routes/        # Routes API
│   │   ├── middleware/    # Middleware d'authentification, validation
│   │   ├── utils/         # Utilitaires
│   │   ├── config/        # Configuration
│   │   └── server.js      # Point d'entrée
│   ├── .env
│   └── package.json
│
└── frontend/         # Application Vue 3
    ├── src/
    │   ├── components/     # Composants réutilisables
    │   ├── views/         # Vues par rôle
    │   ├── router/        # Configuration des routes
    │   ├── stores/        # Pinia stores (état global)
    │   ├── services/      # Services API
    │   ├── composables/   # Composables Vue
    │   ├── utils/         # Utilitaires
    │   ├── App.vue
    │   └── main.js
    ├── public/
    ├── .env
    ├── vite.config.js
    └── package.json
```

## Installation et Démarrage

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Fonctionnalités

### Administrateur (9 vues)
- Dashboard avec statistiques en temps réel
- Gestion des patients
- Gestion des docteurs
- Gestion des rendez-vous
- Gestion des chambres
- Gestion des comptes utilisateurs
- Affichage des collaborateurs
- Corbeille (suppression permanente)
- À propos de nous

### Docteur (5 vues)
- Dashboard avec activités
- Mes rendez-vous
- Mes patients
- Gestion des chambres
- À propos de nous

### Réceptionniste (5 vues)
- Dashboard avec statistiques
- Gestion des patients
- Gestion des rendez-vous
- Gestion des chambres (consultation)
- À propos de nous

## Contraintes de Conception

✓ Authentification JWT sans page d'inscription
✓ Routes protégées (non-conformes → redirection login)
✓ Confirmations personnalisées (pas de confirm())
✓ Notifications pour toutes les actions CRUD
✓ Filtres et barche de recherche sur les listes
✓ Formulaires auto-vidés après soumission
✓ Mise à jour en temps réel entre utilisateurs
✓ Pas de CSS/Tailwind (HTML pur)

