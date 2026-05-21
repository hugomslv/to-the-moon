# PR_REVIEW.md

Checklist de revue des Pull Requests sur **To The Moon**.
Toute PR doit être validée par au moins un autre membre de l'équipe avant merge sur `main`.

## 1. Avant de demander une revue (auteur de la PR)

L'auteur vérifie que :

- [ ] La branche part de `main` à jour.
- [ ] Le titre de la PR suit le format conventionnel : `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `chore: ...`.
- [ ] La description explique le quoi, le pourquoi et le comment tester.
- [ ] Une issue ou ticket est lié si applicable.
- [ ] `PROJECT_UPDATES.md` contient une entrée datée.
- [ ] Le code compile (`npm run build`).
- [ ] L'app démarre sans erreur en console (`npm run dev`).
- [ ] L'app fonctionne en mode offline (couper le Wi-Fi externe et tester).
- [ ] Les éventuelles nouvelles dépendances sont justifiées dans la description.
- [ ] Aucun secret, mot de passe ou clé n'est commité.
- [ ] Le code mort et les imports inutilisés sont supprimés.

## 2. Format de la description de PR

```
## Quoi
Brève description du changement.

## Pourquoi
Raison du changement, lien avec un but ou un critère du projet.

## Comment tester
Étapes pour reproduire ou valider le comportement.

## Captures
Screenshots ou vidéos si UI.

## Checklist
- [ ] Testé en local
- [ ] Testé offline
- [ ] Testé sur mobile (ou simulateur)
- [ ] PROJECT_UPDATES.md mis à jour
```

## 3. Critères de revue (relecteur)

### 3.1 Fonctionnel

- [ ] Le comportement correspond à la description.
- [ ] Les cas limites sont gérés (saisie vide, double clic, rafraîchissement).
- [ ] Le mode offline reste opérationnel.
- [ ] La sauvegarde localStorage fonctionne.

### 3.2 Code

- [ ] TypeScript strict, pas de `any` non justifié.
- [ ] Pas de logique métier dans les composants UI.
- [ ] Nommage clair et cohérent avec les conventions de `CLAUDE.md`.
- [ ] Pas de duplication évidente.
- [ ] Pas de console.log oublié.
- [ ] Pas de TODO sans ticket associé.

### 3.3 Performance et offline

- [ ] Aucun import depuis un CDN ou une URL externe.
- [ ] Les images sont optimisées (formats modernes, taille raisonnable).
- [ ] Les sons sont compressés (mp3 64-96 kbps suffit).
- [ ] Le bundle ne dépasse pas 500 KB gzip initial.
- [ ] Les polices sont locales.

### 3.4 UX mobile

- [ ] Testé sur écran de smartphone (largeur 360-414 px).
- [ ] Boutons assez grands pour le tactile (min 44x44 px).
- [ ] Pas de hover-only pour les interactions essentielles.
- [ ] Les animations restent fluides sur un Raspberry Pi.

### 3.5 Sécurité

- [ ] Pas de secret en clair.
- [ ] Pas d'injection possible dans les champs de saisie (pseudo, équipe).
- [ ] L'API admin est protégée si exposée.

### 3.6 Documentation

- [ ] README à jour si nouvelle page, nouvelle variable d'env ou nouvelle commande.
- [ ] PROJECT_UPDATES.md contient l'entrée datée.
- [ ] Les fonctions complexes ont un commentaire court.

## 4. Niveaux de retour

- bloquant : doit être corrigé avant merge (sécurité, offline cassé, bug fonctionnel).
- important : à corriger dans cette PR si possible (qualité, perf notable).
- suggestion : amélioration, peut être traitée plus tard via une issue.
- nit : détail de style ou de goût, non bloquant.

Préfixer les commentaires avec ces tags pour clarifier la priorité.

## 5. Règles de merge

- Au moins une approbation requise.
- Tous les retours bloquants doivent être résolus ou explicitement écartés.
- Squash merge par défaut pour garder un historique propre sur `main`.
- Supprimer la branche après merge.

## 6. Cas particuliers

- Hotfix urgent (jour des portes ouvertes par exemple) : auto-revue acceptée avec mention `hotfix:` dans le titre, suivi d'une revue a posteriori sous 24 h.
- Modification de `PROJECT_RULES.md` : nécessite validation explicite d'Hugo (chef de projet).
- Ajout d'une dépendance : justifier dans la PR (alternative envisagée, poids, mainteneur, licence).
