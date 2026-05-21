# PROJECT_RULES.md

Document de référence du projet **To The Moon** (CTF spatial – module ICT-306).
À lire avant toute contribution.

## 1. Identité du projet

- Nom : To The Moon
- Module : ICT-306
- Échéance : fin du module en 2026
- Type : application web locale jouée sur smartphone, hébergée sur Raspberry Pi 5

## 2. Équipe

| Membre              | Rôle                     |
| ------------------- | ------------------------ |
| Hugo                | Chef de projet           |
| Mathéo              | Développeur DevOps       |
| Brayan              | Développeur senior       |
| Juan David          | Développeur master       |
| Monsieur Wohlhauser | Project Owner            |

Matériel : Raspberry Pi 5, clavier Raspberry, écran, alimentation, carte microSD, boîtier.

## 3. Les 5 buts

1. Faire un projet pour les portes ouvertes afin de faire découvrir l'informatique.
2. Développer la logique et la résolution d'énigmes.
3. Pouvoir utiliser un téléphone pour jouer.
4. Permettre une utilisation sans connexion internet.
5. Offrir une expérience interactive et immersive aux joueurs.

## 4. Objectifs mesurables

- Créer une application web tournant localement sur le Raspberry Pi avant la fin du module ICT-306 en 2026.
- Connecter un téléphone à l'application via un réseau Wi-Fi local d'ici la fin du module ICT-306 en 2026.
- Installer un OS Linux sur le Raspberry Pi d'ici fin mai 2026.

## 5. Critères de réussite

1. Le jeu est jouable de bout en bout sans connexion internet.
2. Au moins 70 % des joueurs terminent les 3 énigmes en moins de 15 minutes.
3. L'application se charge en moins de 3 secondes sur un smartphone connecté au point d'accès du Raspberry Pi.
4. Note de satisfaction moyenne d'au moins 4/5 via le mini-questionnaire en fin de partie.
5. Minimum 15 joueurs uniques ayant terminé le jeu.

## 6. Périmètre fonctionnel

### 6.1 Côté joueur

- Saisie du pseudo / nom d'équipe sur la landing page.
- Chronomètre global (démarre au début, s'arrête à la résolution finale).
- Système d'indices progressifs : 1er indice gratuit après X minutes, 2e indice avec pénalité de temps.
- Compteur de tentatives par énigme.
- Barre de progression visuelle avec thème spatial (fusée qui avance).
- Sauvegarde via localStorage pour reprise après rafraîchissement.

### 6.2 Gameplay spatial

- Narration immersive entre les énigmes.
- Sons d'ambiance spatiaux (bips, radio, alertes) – fichiers compressés pour rester offline.
- Animations CSS thématiques (étoiles, parallaxe, planètes).
- Variété d'énigmes : logique, observation d'image, code à déchiffrer (morse, binaire, césar), puzzle visuel.

### 6.3 Côté admin / portes ouvertes

- Leaderboard affiché sur un écran à côté du stand, classement par temps.
- Mode reset rapide pour enchaîner les sessions.
- Page admin avec stats : nombre de parties, temps moyen, énigme la plus bloquante.
- QR code à l'entrée du stand pour connexion Wi-Fi et accès à l'URL du jeu.
- Mini-questionnaire de satisfaction en fin de partie.

## 7. Stack et contraintes techniques

- Next.js 15 (App Router) + TypeScript.
- React 19, Tailwind CSS.
- SQLite + Prisma (base locale sur le Raspberry).
- Aucun appel réseau externe en production. Vérifier avant chaque release.
- Toutes les ressources (fonts, images, sons) servies depuis `/public`.
- Build optimisé pour mobile, bundle initial sous 500 KB gzip.

## 8. Workflow de développement

1. Une tâche = une branche (`feat/`, `fix/`, `chore/`, `docs/`).
2. Commits clairs, conventionnels (`feat:`, `fix:`, `refactor:`, etc.).
3. PR obligatoire pour merger sur `main`. Voir `PR_REVIEW.md`.
4. Mise à jour de `PROJECT_UPDATES.md` à chaque changement notable.
5. Bilan hebdomadaire (bila) le vendredi : avancement, blocages, prochaines étapes.

## 9. Estimation budgétaire

| Élément          | Prix      |
| ---------------- | --------- |
| Raspberry Pi 5   | ~130 CHF  |
| Alimentation     | ~20 CHF   |
| Carte microSD    | ~15 CHF   |
| Boîtier          | ~10 CHF   |
| Écran            | ~100 CHF  |
| Clavier Raspberry| ~75 CHF   |
| Développement (7h)| Gratuit  |
| Images / sons    | Gratuit   |
| Tests            | Gratuit   |
| Total estimé     | ~350 CHF  |

## 10. Risques identifiés

| Risque                              | Cause probable                                                | Mitigation                                              |
| ----------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| Problème de planning                | Absences, retards de tâches, dépendances entre tâches         | Bila hebdo, jalons clairs, tâches découpées             |
| Conflit avec le budget              | Mauvais calcul, ajouts, hausse des coûts                      | Validation des achats, marge de 10 %                    |
| Problème de compétences             | Surestimation du niveau des tâches                            | Pair programming, montée en compétence sur Next.js      |
| Problème de contrôle qualité        | Pas de tests, pas de revue                                    | Tests manuels documentés, PR review obligatoire         |
| Client insatisfait                  | Écart entre attentes et livrable                              | Démos régulières au Project Owner                       |

## 11. Définition de "terminé" (Definition of Done)

Une tâche est terminée quand :

- Le code est mergé sur `main` après PR validée.
- L'app fonctionne en mode offline (testée sans Wi-Fi externe).
- Aucune erreur en console.
- `PROJECT_UPDATES.md` est à jour.
- La documentation (README, commentaires) reflète le changement.
- Le code inutile a été supprimé.
