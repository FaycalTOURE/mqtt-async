# Exemples Javascript ([Node.js])

> Utilise la bibliothèque [mqtt](https://www.npmjs.com/package/mqtt)

## Installation

_Prérequis_: disposer d'une version récente de [Node.js]

Se placer dans le répertoire  `mqtt-logger-exo` (`cd [le chemin de nodejs]`)
puis rapatrier les dépendances logicielles:

```bash
npm install
```

## Commande `mqtt`

### Utilisation

La bibliothèque utilisée fournie un utilitaire en ligne de commande: `mqtt`

Pour y avoir accès il faut l'exécuter dans le contexte de `nodejs`:

```bash
npx mqtt help
```

ce qui retourne:

```
MQTT.js command line interface, available commands are:

  * publish     publish a message to the broker
  * subscribe   subscribe for updates from the broker
  * version     the current MQTT.js version
  * help        help about commands

Launch 'mqtt help [command]' to know more about the commands.
```

### Exemples

#### Tracer les messages venant du sujet `chat_messages`

```bash
npx mqtt subscribe -h localhost chat/messages
```

> `Ctrl-C` pour interrompre

#### Envoyer un message

```bash
npx mqtt publish -h localhost -t chat/messages 'mqtt-cli: HaHa !'
```

## Chat Log

### Comportement de l'application

1. se connecte au broker MQTT sur `localhost` (port 1883)
2. souscrit au sujet (topic) `chat/messages`
3. lorsqu'un message est reçu, si il est du sujet `chat/messages`, l'afficher
  sur la sortie standard

> L'application se comporte comme `npx mqtt subscribe ...`

### Utilisation

```bash
node chat-log-async
```

> `Ctrl-C` pour interrompre

[Node.js]: https://nodejs.org/en/
