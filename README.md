# Plateforme de Discussion XML - Projet DSS

## Description

Cette plateforme de gestion de discussions en ligne de style WhatsApp a été développée dans le cadre du projet DSS-XML du DIC2-M1/DGI/ESP/UCAD/SN sous la supervision du Pr Ibrahima FALL.

## Fonctionnalités

### ✅ Fonctionnalités Implémentées

1. **Gestion des Utilisateurs**
   - Profil utilisateur avec nom, email, statut
   - Gestion du statut (en ligne, absent, hors ligne)

2. **Gestion des Contacts**
   - Ajout de nouveaux contacts
   - Liste des contacts avec statut en temps réel
   - Recherche dans les contacts

3. **Gestion des Groupes**
   - Création de groupes de discussion
   - Gestion des membres
   - Administration des groupes

4. **Messagerie**
   - Envoi de messages texte
   - Messages individuels et de groupe
   - Horodatage des messages
   - Statut des messages (envoyé, livré, lu)

5. **Stockage XML**
   - Toutes les données sont stockées au format XML
   - Schéma XSD pour la validation
   - DTD pour la structure des données
   - API pour sauvegarder/charger les données XML

### 🎨 Interface Utilisateur

- Design moderne inspiré de WhatsApp
- Interface responsive
- Sidebar avec liste des contacts/groupes
- Zone de chat principale
- Indicateurs de statut en temps réel

## Structure XML

### Schéma des Données

Le fichier XML contient quatre sections principales :

1. **Users** : Informations des utilisateurs
2. **Contacts** : Liste des contacts de chaque utilisateur
3. **Groups** : Groupes de discussion
4. **Messages** : Historique des messages

### Validation

- **XSD Schema** : `schema/whatsapp-platform.xsd`
- **DTD** : `schema/whatsapp-platform.dtd`

## Technologies Utilisées

- **Frontend** : Next.js 14, React, TypeScript
- **UI** : Tailwind CSS, shadcn/ui
- **Stockage** : XML avec validation XSD/DTD
- **API** : Next.js API Routes

## Installation et Utilisation

1. Cloner le projet
2. Installer les dépendances : `npm install`
3. Lancer le serveur de développement : `npm run dev`
4. Accéder à l'application sur `http://localhost:3000`

## Fonctionnalités Avancées

### Gestion XML
- Génération automatique du XML à partir des données
- Échappement des caractères spéciaux
- Structure hiérarchique respectant le schéma

### API Endpoints
- `POST /api/save-data` : Sauvegarde des données en XML
- `GET /api/load-data` : Chargement des données depuis XML

## Équipe de Développement

Projet réalisé dans le cadre du cours de DSS-XML par des groupes de 3 à 5 personnes maximum.

## Présentation

Date de présentation : 16 juillet 2025

## Professeur Superviseur

**Pr Ibrahima FALL**  
Département Génie Informatique (DGI)  
École Supérieure Polytechnique (ESP)  
Université Cheikh Anta Diop (UCAD) de Dakar  
Email: Ibrahima.Fall@esp.sn
