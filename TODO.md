# Objectif

Réaliser un programme permettant de stocker des messages reçu à des sujets souscrits sur un broker MQTT dans des fichiers de
log correspondant aux sujets souscrits.

Une application fonctionnelle est fournie comme base de départ:

> c.f. fichier `chat-log-sync.js`

# A faire

Prendre connaissance du fichier `chat-log-sync` et comprendre son fonctionnement

## Modulariser le code

### `await`

Transformer les `.then(…)` en `await`

> il faudra englober `lancement du programme` dans une fonction

### Créer des fonctions

- Transformer `connection` en fonction avec pour paramètre l'url du broker
  et qui retourne une promesse résolue avec le `client`
- Transformer `subscription` en fonction avec pour paramètre le `client`
  et le sujet (`topic`) et qui retourne une promesse avec le résolue avec le sujet souscrit.
- Transformer `reception` en fonction avec pour paramètre le `client` et
  qui retourne une promesse résolue avec `message_pool`
- Transformer le `lancement du programme` pour appeler les fonctions définies.

### Stocker les informations dans un fichier

on va avoir besoin des modules:

- [`path`](https://nodejs.org/api/path.html)
- [`fs`](https://nodejs.org/api/fs.html)

#### variable LOGPATH

Définir une variable `LOGPATH` indiquant le répertoire
dans lequel on va stocker les fichiers par (mis à `logs` par défaut)

#### Fonction `log_topic_open`

Définir une fonction asynchrone `log_topic_open` qui retourne
un `handler` de fichier ouvert en écriture dans lequel on va stocker les messages reçus (à la fin).

##### Détail de la fonction

- Produire un nom de fichier `log_file` qui reprend le répertoire `LOGPATH` auquel au ajout le sujet: attention les séparateur de sujet `/` doivent être converti en séparateur de répertoire (ça doit marcher sur MS Windows)

  > c.f. <https://nodejs.org/api/path.html>

- Créer les répertoire parent si ils n'existent pas.

  > c.f. <https://nodejs.org/api/fs.html#fs_fs_mkdir_path_options_callback>

- Ouvrir en écriture le `log_file` (on récupère les `handler`)

  > c.f. <https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options>

- retourne une promesse qui est résolue quand le flux du fichier est prêt ("ready")


#### Fonction `log_topic_write`

La fonction 'log_topic_write' écrit de façon asynchrone dans
le flux en écritue

##### Détail de la fonction

- La fonction asynchrone `log_topic_write` qui prend en
paramètre le flux de fichier ouvert en écriture, ainsi
que la charge du message (`payload`)
- Elle écrit dans le flux, le contenu de `payload`

  > c.f. <https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback>

- Retourne une promesse qui est résolue quand le fichier est écrit.


#### Insérer `log_topic_write` et `log_topic_open`

- Une fois que le sujet est souscrit: `log_topic_open` sur le sujet
- modifier le handler pour qu'il prenne en paramètre le flux en écriture et qu'il utilise `log_topic_write` pour écrire le contenu du message dans le fichier suivi d'un retour à la ligne.

## Manquements au programme

- Certaines erreurs ne sont pas gérées quelles sont elles ?
- Comment vous y prendriez vous pour les gérer (une ou deux courtes phrases)

## Question subsidiaire (BONUS)

- Modifier le programme pour qu'il puisse utiliser plusieurs topic (et donc plusieurs fichiers de log)

# Restitution

Fournir un fichier `zip` avec la réponse aux questions (sans `node_modules` ni `package.json`) avec un votre nom dans le `README.md`
