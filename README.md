# Todo App

## Description
Une application Todo simple construite avec Vue.js, Express et MongoDB, déployée via Docker. Ce dépôt sert de base pour évaluer les compétences techniques des développeurs candidats. Les candidats sont invités à récupérer ce projet, à le faire fonctionner localement, et à y ajouter de nouvelles fonctionnalités.

## Prérequis
- Docker
- Docker Compose
- Un éditeur de code (ex. VS Code)
- Node.js (si vous travaillez sans Docker)

## Installation et Déploiement

### 1. Cloner le Dépôt
```bash
git clone https://github.com/Jahzzman/todo-app.git
cd todo-app
```

### 2. Démarrer les Services
```bash
docker-compose up --build
```

### 3. Accéder à l'Application
- Frontend : http://localhost:8080
- Backend API : http://localhost:5001/api/todos

## Structure du Projet

### Frontend
- Technologies utilisées : Vue.js, Tailwind CSS
- Port : 8080
- Dossier : `frontend`

### Backend
- Technologies utilisées : Express.js, MongoDB, Mongoose
- Port : 5001
- Dossier : `backend`

### Base de Données
- Technologie : MongoDB
- Port : 27017
- Volume persistant : `mongo-data`

## Fonctionnalités de Base
- Ajouter une tâche : Permet d'ajouter une nouvelle tâche avec un titre.
- Lister les tâches : Affiche la liste des tâches existantes.
- Marquer une tâche comme complétée : Checkbox pour indiquer qu'une tâche est terminée.
- Supprimer une tâche : Bouton pour supprimer une tâche existante.
- Réordonnancement des tâches : Glisser-déposer pour changer l'ordre des tâches.

## Instructions pour les Candidats

### Étape 1 : Configurer votre Environnement

1. Clonez ce dépôt dans votre propre compte GitHub ou en local.
2. Installez les dépendances nécessaires :
```bash
cd frontend
npm install
cd ../backend
npm install
```
3. Lancez l'application en mode développement :
```bash
docker-compose up --build
```

### Étape 2 : Ajout de Fonctionnalités

#### Frontend
**Filtrage des tâches :**
- Ajouter un champ de recherche pour filtrer les tâches par titre.
- Implémenter des filtres pour afficher uniquement les tâches complétées ou en cours.
![Todo App avec Tags](https://divertychallenge.silex-cloud.com/screenshots/todo-tags.png)

**Gestion des priorités :**
- Ajouter une fonctionnalité pour définir une priorité (ex. haute, moyenne, basse) pour chaque tâche.
- Permettre de trier les tâches par priorité.

**Affichage amélioré :**
- Ajouter des animations pour le drag and drop des tâches.
- Améliorer l'UI avec des icônes ou des couleurs pour différencier les tâches selon leur état ou priorité.

#### Backend
**Pagination des tâches :**
- Implémenter une API pour retourner les tâches par page (ex. 10 tâches par page).
- Adapter le frontend pour consommer cette API.

**Authentification utilisateur :**
- Ajouter une gestion des utilisateurs avec des rôles (ex. utilisateur simple, administrateur).
- Utiliser JWT pour sécuriser les endpoints de l'API.

**Sauvegarde automatique :**
- Implémenter une API qui sauvegarde périodiquement l'état des tâches dans une collection d'archives.

### Étape 3 : Documentation et Tests

**Documentation :**
- Mettez à jour ce fichier README.md pour inclure les nouvelles fonctionnalités ajoutées.
- Documentez les endpoints de l'API dans une section séparée.

**Tests :**
- Écrivez des tests unitaires ou d'intégration pour le backend (ex. Mocha, Jest).
- Implémentez des tests End-to-End pour le frontend (ex. Cypress).

## API Documentation

### Liste des Endpoints Disponibles

#### GET /api/todos
**Description :** Retourne toutes les tâches.

**Réponse :**
```json
[
  {
    "_id": "64b91d841aa2d933285b5670",
    "title": "Acheter du lait",
    "completed": false,
    "position": 1
  },
  {
    "_id": "64b91d841aa2d933285b5671",
    "title": "Terminer le projet",
    "completed": true,
    "position": 2
  }
]
```

#### POST /api/todos
**Description :** Ajoute une nouvelle tâche.

**Body :**
```json
{
  "title": "Nouvelle tâche"
}
```

**Réponse :**
```json
{
  "_id": "64b91d841aa2d933285b5672",
  "title": "Nouvelle tâche",
  "completed": false,
  "position": 3
}
```

#### PATCH /api/todos/:id
**Description :** Met à jour une tâche existante.

**Body (optionnel) :**
```json
{
  "completed": true
}
```

**Réponse :**
```json
{
  "_id": "64b91d841aa2d933285b5672",
  "title": "Nouvelle tâche",
  "completed": true,
  "position": 3
}
```

#### DELETE /api/todos/:id
**Description :** Supprime une tâche existante.

**Réponse :**
```json
{
  "message": "Tâche supprimée avec succès"
}
```

## Critères d'Évaluation
Vos modifications seront évaluées sur les critères suivants :

### Fonctionnalité
- Les fonctionnalités ajoutées répondent aux consignes et fonctionnent correctement.

### Qualité du Code
- Le code est bien structuré, lisible et respecte les bonnes pratiques.

### Tests et Documentation
- Les nouvelles fonctionnalités sont accompagnées de tests et documentées dans le README.md.

### Créativité
- Les candidats sont encouragés à proposer des fonctionnalités ou améliorations innovantes.

## Contact
Pour toute question ou assistance, veuillez contacter mathieu@silex-lab.com