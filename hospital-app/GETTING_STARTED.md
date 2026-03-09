# Hospital Management System

Système complet de gestion d'hôpital avec authentification JWT et trois niveaux d'accès.

## 🚀 Démarrage Rapide

### Installation

**Windows:**
```bash
.\install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Initialiser la Base de Données

```bash
cd backend
node src/init-db.js
npm run dev
```

Dans un autre terminal:
```bash
cd frontend
npm run dev
```

## 📱 Comptes de Test

### Admin
- **Utilisateur:** admin
- **Mot de passe:** admin123

### Docteur
- **Utilisateur:** dr_martin ou dr_sophie
- **Mot de passe:** doctor123

### Réceptionniste
- **Utilisateur:** marie
- **Mot de passe:** receptionist123

## 📁 Structure du Projet

```
hospital-app/
├── backend/              # API REST Node.js/Express
│   ├── src/
│   │   ├── database/     # Configuration SQLite
│   │   ├── controllers/  # Logique métier
│   │   ├── models/       # Schémas de données
│   │   ├── routes/       # Endpoints API
│   │   ├── middleware/   # Auth & validation
│   │   ├── utils/        # Helpers
│   │   ├── server.js     # Point d'entrée
│   │   └── init-db.js    # Initialisation DB
│   ├── package.json
│   └── .env
│
└── frontend/             # Application Vue 3
    ├── src/
    │   ├── components/   # Composants réutilisables
    │   ├── views/        # Vues par rôle
    │   ├── router/       # Vue Router
    │   ├── stores/       # Pinia (état global)
    │   ├── services/     # API Client
    │   ├── composables/  # Logique réutilisable
    │   ├── utils/        # Helpers
    │   ├── App.vue       # App principal
    │   └── main.js       # Bootstrap
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env

```

## 🔐 Architecture de Sécurité

- ✅ Authentification JWT avec tokens 24h
- ✅ Routes protégées avec middleware auth
- ✅ Hashage bcryptjs des mots de passe
- ✅ Contrôle d'accès basé sur les rôles (RBAC)
- ✅ Redirection automatique non-authentifiés → Login
- ✅ Routes invalides → Login (pas de 404)

## 🎯 Fonctionnalités Principales

### Admin (9 vues)
- Dashboard avec statistiques en temps réel
- Gestion complète des patients
- Gestion des docteurs
- Gestion des rendez-vous
- Gestion des chambres
- Gestion des comptes utilisateurs
- Affichage des collaborateurs
- Corbeille (suppression permanente)
- À propos de nous

### Docteur (5 vues)
- Dashboard personnel
- Mes rendez-vous (modifier statut, ajouter)
- Mes patients (modification seulement)
- Gestion des chambres (assigner, modifier capacité)
- À propos de nous

### Réceptionniste (5 vues)
- Dashboard avec statistiques
- Gestion des patients
- Gestion des rendez-vous
- Consultation des chambres
- À propos de nous

## ✨ Caractéristiques Spéciales

✅ **Confirmations personnalisées** - Modales au lieu de confirm()
✅ **Notifications** - Pour chaque action CRUD
✅ **Filtrage & Recherche** - Sur toutes les listes
✅ **Mise à jour en temps réel** - Entre utilisateurs (prêt pour WebSocket)
✅ **Formulaires auto-nettoyants** - Après soumission
✅ **HTML pur** - Sans CSS/Tailwind, styles intégrés
✅ **Gestion des suppressions** - Vers corbeille avant suppression définitive
✅ **Validations** - Docteurs < 5 rendez-vous, chambres pleines, etc.

## 🛠️ Technologies

- **Backend:** Node.js, Express, SQLite, JWT, bcryptjs
- **Frontend:** Vue 3, Vite, Pinia, Axios, Vue Router
- **Base de Données:** SQLite3

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/create-user`
- `POST /api/auth/change-password`

### Patients
- `GET /api/patients`
- `GET /api/patients/:id`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

### Appointments
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Rooms
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/rooms`
- `PUT /api/rooms/:id`
- `DELETE /api/rooms/:id`

## 🚦 Prochaines Étapes

1. [ ] WebSocket pour mise à jour temps réel
2. [ ] Pagination pour les listes
3. [ ] Rapports et statistiques avancées
4. [ ] Intégration d'email pour notifications
5. [ ] Dashboard mobil-responsive
6. [ ] Tests unitaires et intégration
7. [ ] Documentation API (Swagger)
8. [ ] Déploiement (Docker, Heroku, Vercel)

## 📞 Support

Pour toute question ou bug, veuillez contacter l'équipe de développement.

---

**Créé avec ❤️ pour l'excellence médicale**
