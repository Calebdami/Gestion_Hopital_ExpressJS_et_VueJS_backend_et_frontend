# Architecture et Organisation du Projet

## 📋 Vue d'ensemble

Ce projet suit une architecture modulaire et scalable avec séparation claire entre le backend et le frontend.

## 🏗️ Architecture Backend

### Hiérarchisation des fichiers

```
backend/src/
├── server.js              # Point d'entrée principal
├── database/
│   └── database.js        # Connexion et gestion SQLite
├── controllers/           # Logique métier
│   ├── authController.js
│   ├── patientController.js
│   ├── appointmentController.js
│   ├── roomController.js
│   └── userController.js
├── routes/                # Définition des endpoints
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── appointmentRoutes.js
│   ├── roomRoutes.js
│   └── userRoutes.js
├── middleware/            # Middlewares
│   └── auth.js            # Vérification JWT et RBAC
├── utils/                 # Utilitaires
│   ├── authHelper.js      # Tokenisation et hashage
│   └── statsHelper.js     # Helpers pour statistiques
├── models/                # (À implémenter) Validations
└── init-db.js            # Initialisation avec données par défaut
```

### Patterns d'Architecture Utilisés

#### 1. **MVC Pattern**
- **Models**: Schémas de données dans `database.js`
- **Views**: Réponses JSON
- **Controllers**: Logique métier dans `/controllers`

#### 2. **Middleware Pattern**
- `verifyToken`: Authentification JWT
- `authorizeRole`: Contrôle d'accès basé sur rôles

#### 3. **Service Layer** (À enrichir)
- Séparation entre routes et logique métier
- Controllers gèrent la logique

### Points Clés d'Implémentation

1. **Authentification JWT**
   - Tokens avec expiration 24h
   - Stockage local côté client
   - Refresh automatique sur 401

2. **RBAC (Role-Based Access Control)**
   - 3 rôles: admin, doctor, receptionist
   - Middleware `authorizeRole()` sur routes
   - Logique métier vérifie les permissions

3. **Gestion des Erreurs**
   - Status codes HTTP standards
   - Messages d'erreur clairs
   - Logging d'erreurs

## 🎨 Architecture Frontend

### Hiérarchisation des fichiers

```
frontend/src/
├── main.js                # Bootstrap de l'app
├── App.vue                # Composant racine
├── index.html             # Template HTML avec styles
├── router/
│   └── index.js           # Configuration Vue Router + guards
├── stores/                # Pinia stores (état global)
│   ├── authStore.js       # État d'authentification
│   ├── notificationStore.js # Gestion des notifications
│   └── dataStore.js       # Données applicatives
├── services/              # Couche API
│   ├── apiClient.js       # Client Axios avec interceptors
│   └── api.js             # Services par domaine
├── views/                 # Pages par rôle/fonctionnalité
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── PatientView.vue
│   ├── AppointmentView.vue
│   ├── RoomView.vue
│   ├── DoctorView.vue
│   ├── AccountView.vue
│   ├── CollaboratorView.vue
│   ├── TrashView.vue
│   ├── DoctorAppointmentView.vue
│   ├── DoctorPatientView.vue
│   └── AboutView.vue
├── components/            # Composants réutilisables
│   ├── ConfirmDialog.vue  # À créer
│   ├── NotificationList.vue # À créer
│   └── (Autres...)
├── composables/           # Logic réutilisable (Vue 3)
│   └── useConfirmation.js # Gestion des confirmations
└── utils/                 # Helpers
    └── helpers.js         # Formatage, validation, debounce
```

### Patterns d'Architecture Utilisés

#### 1. **Composition API Pattern**
- `setup()` dans les composants
- Hooks réutilisables (`composables`)
- Logique séparée de la vue

#### 2. **State Management (Pinia)**
- Stores centralisés par domaine
- Actions asynchrones
- Reactivity automatique

#### 3. **Service Layer**
- `apiClient.js`: Configuration Axios
- `api.js`: Services par entité
- Intercepteurs pour JWT

#### 4. **Routing Guards**
- Protection des routes par auth
- Vérification des rôles
- Redirection automatique

### Points Clés d'Implémentation

1. **Gestion d'État**
   - `authStore`: Utilisateur + token
   - `dataStore`: Données applicatives
   - `notificationStore`: Notifications système

2. **API Communication**
   - Interceptors pour JWT
   - Gestion 401 automatique
   - Methods par entité

3. **Routing**
   - Routes protégées
   - Redirect sur 404 → login
   - Guards par rôle

4. **Notifications**
   - Pinia store
   - Auto-hide après 5s
   - Types: success, error, info

## 🔐 Flux d'Authentification

1. **Login**
   ```
   User → LoginView → authService.login() → Backend
   Backend → JWT Token → Frontend
   Frontend → authStore.setUser() + localStorage
   Frontend → router.push('/dashboard')
   ```

2. **Requête Protégée**
   ```
   Route protégée → Guard vérifie token
   Guard → Réussi: continue
   Guard → Échoué: redirige /login
   ```

3. **Appel API**
   ```
   Service → Axios interceptor ajoute JWT
   Réponse 401 → Interceptor logout automatique
   ```

## 🎯 Flux Métier - Cas d'Utilisation

### Patient Workflow

1. **Création** (Admin/Réceptionniste)
   - Vérifier docteur disponible (<5 rendez-vous)
   - Vérifier chambre disponible
   - Créer patient + notification
   - Mettre à jour listes en temps réel

2. **Modification**
   - Vérifier pas de conflit
   - Mettre à jour + notification
   - Sync automatique avec autres utilisateurs

3. **Suppression**
   - Vérifier pas de docteur assigné
   - Ou statut = treated/discharged
   - Déplacer vers corbeille
   - Notification aux autres users

### Rendez-vous Workflow

1. **Création**
   - Valider patient + docteur
   - Vérifier créneau disponible
   - Stocker avec statut 'pending'

2. **Modification Status** (Docteur)
   - pending → completed/cancelled
   - Mettre à jour patient status si needed
   - Notifier tous les stakeholders

3. **Suppression**
   - Déplacer vers corbeille
   - Notifications

## 📊 Modèle de Données

### Users
```sql
- id (PK)
- username (UNIQUE)
- password (hashed)
- role (admin|doctor|receptionist)
- is_default_admin (boolean)
- created_at, updated_at
- created_by (admin qui a créé)
```

### Patients
```sql
- id (PK)
- first_name, last_name
- email, phone, date_of_birth
- address
- assigned_doctor_id (FK)
- assigned_room_id (FK)
- status (active|treated|discharged)
- created_at, updated_at
```

### Appointments
```sql
- id (PK)
- patient_id (FK)
- doctor_id (FK)
- appointment_date
- status (pending|completed|cancelled)
- notes
- created_at, updated_at
```

### Rooms
```sql
- id (PK)
- name (UNIQUE)
- total_capacity
- occupied_capacity
- created_at, updated_at
```

### Notifications
```sql
- id (PK)
- user_id (FK)
- from_user_id (FK)
- message
- is_read (boolean)
- created_at
```

### Trash
```sql
- id (PK)
- item_type (patient|doctor|appointment|room|user)
- item_id
- item_data (JSON)
- deleted_by (user_id)
- deleted_at
```

## 🚀 Prochaines Étapes de Développement

### Phase 1: Consolidation
- [ ] Composants réutilisables (ConfirmDialog, Modal)
- [ ] Validation côté client + serveur
- [ ] Tests unitaires backend
- [ ] Tests E2E frontend

### Phase 2: Améliorations UX
- [ ] Pagination des listes
- [ ] Recherche côté client optimisée
- [ ] Filtres avancés
- [ ] Export PDF/Excel
- [ ] Design responsive

### Phase 3: Fonctionnalités Avancées
- [ ] WebSocket pour mise à jour temps réel
- [ ] Notifications email
- [ ] Calendrier interactif
- [ ] Rapports statistiques
- [ ] Multi-langue

### Phase 4: DevOps & Production
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Tests de charge
- [ ] Monitoring & logging
- [ ] Déploiement (Heroku, AWS, etc.)

## 📱 Bonnes Pratiques Implémentées

✅ **Code Organization**
- Séparation des concerns
- Modularité et réutilisabilité
- Conventions de nommage claires

✅ **Sécurité**
- JWT stateless
- Password hashing (bcryptjs)
- RBAC strct
- Input validation

✅ **Performance**
- Async/await patterns
- Interceptors pour optimisation
- Lazy loading routes (À ajouter)

✅ **Maintenabilité**
- Code commented
- Consistent style
- Error handling
- Logging

## 🔧 Configuration Développement

### Variables d'Environnement

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_here
DATABASE_PATH=./src/database/hospital.db
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=Hospital Management System
```

### Scripts Utiles

```bash
# Backend
npm run dev          # Démarrer avec nodemon
npm start           # Production
node init-db.js     # Initialiser DB

# Frontend
npm run dev         # Vite dev server
npm run build       # Build production
npm run preview     # Prévisualiser build
```

---

**Créé avec expertise en architecture logicielle moderne**
