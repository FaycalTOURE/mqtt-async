// # Chat Log
//
// Decription du programme fourni:
//
// 1. on se connecte en mqtt à `localhost` (port 1883)
// 2. on souscrit au sujet (topic) `chat_messages`
// 3. pour chaque message est reçu, si il est du sujet `chat_messages`, l'afficher
//    sur la sortie standard

require('dotenv').config();
const fs = require('fs')
const path = require('path');
const MQTT = require('mqtt') // https://github.com/mqttjs/MQTT.js
const BROKER_URI = 'mqtt://localhost:1883' // le broker auquel on se connecte
const TOPIC = 'chat/messages'  // le sujet auquel on souscrit


// crée une connection MQTT à une uri
// retourne la promesse d'un client
let client = MQTT.connect(BROKER_URI);
console.log('connexion à %j ...', BROKER_URI);

function connexion(broker) {
    return new Promise(function (resolve, reject) {
        client.on('connect', resolve())
        console.log('connecté!', broker)
    });
}

// souscrit à un sujet pour un client
// retourne la promesse que c'est fait

function subscription(client, subject){
    return new Promise(function (resolve, reject) {
        client.subscribe(subject, function (err, granted) {
            if (err) {
                reject(err)
            } else {
                // le sujet a été souscrit
                console.log("%j soucrit !", subject);
                // on a promis de souscrire au sujet
                resolve(granted);
            }
        })
    });
}
// const subscription = new Promise(function (resolve, reject) {
//     client.subscribe(TOPIC, function (err, granted) {
//         if (err) {
//             reject(err)
//         } else {
//             // le sujet a été souscrit
//             console.log("%j soucrit !", TOPIC)
//             // on a promis de souscrire au sujet
//             resolve(granted)
//         }
//     })
// });

// on va stocker les messages en attente de traitement
const message_pool = []

function reception(client) {
    return new Promise(function (resolve, reject) {
        // quand un message est reçu
        client.on('message', (topic, payload) => {
            // on l'ajoute au pool de messages
            message_pool.push({
                topic: topic,
                payload: payload
            })
        });
        console.log("messages écoutés!");
        // on a promis d'écouter les messages en attente
        resolve()
    });
}


// recoit les messages un par un
// retourne un itérateur sur chaque message recu
// la fonction est asynchrone: il y a un "await" dedans
async function* incomings() {
    // à chaque itération
    while (true) {
        // si il y a des messages dans le pool...
        if (message_pool.length) {
            // ... on émet le premier message
            yield message_pool.shift() // on perd la main pendant que yield s'exécute
            // on récupère la main
        } else {
            // ... sinon on attend 50 millisecondes
            // en faisant appel à la boucle d'évènement
            // pour ne pas coincer le processus (while(true) {})
            // c.f. https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout
            // sans cette petite pause, un des coeurs du CPU serait à 100%
            // d'activité
            await new Promise(function (resolve, reject) {
                // on résoud la promesse après 50 millisecondes
                setTimeout(() => resolve(null), 50)
            })
        }
        // on recommence
    }
}

function log_topic_write(message) {
    var etc = path.dirname(process.env.LOGPATH);
    var logsFile = fs.createWriteStream(path.resolve(process.env.LOGPATH) + '/' + process.env.LOGFILE, { flags: 'a' });
    logsFile.write(message + '\r\n');
}

// on va gérer le message
function handle_message(message) {
    // on l'affiche sur la sortie standard
    console.log(
        "message reçu (%s): %j",
        "message reçu (%s): %j",
        message.topic,
        message.payload.toString()
    );

    log_topic_write(message.payload.toString());

    // une autre fonction du même genre pourrait
    // bien être asynchrone
    return Promise.resolve(message)
}

// c'est parti !
// lancement du programme
// on va gérer chaque message l'un à la suite de l'autre (en séquence)

async function callConnectionAsync () {
    connexion(BROKER_URI);
    await subscription(client, TOPIC);
    await reception(client);

    console.log("en attente ...");
    for await (let message of incomings()) {
        // ^^^^ for await: "incomings" est asynchrone!
        // on a recu un message
        if (message) {
            // le message correspond à un sujet souscrit
            // on attend que le message soit traité
            await handle_message(message)
        }
    }
}

callConnectionAsync();
