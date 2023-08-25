# mcviewer
Macarte viewer application

## Installation et développement

Voir la section générale [Installation & développement](https://github.com/IGNF-Ma-carte/.github/blob/main/DEVELOPING.md)

## Instance de test

Une instance de test de l'application est disponible dans le répertoire `./docs` du projet.   
Vous pouvez test les derniers [développements en ligne](https://ignf-ma-carte.github.io/mcviewer/?map=4abe44d25ec0a28b7159b27cd25ce476).

# Map IFrame API

Le viewer embarque une IFrame API permettant de piloter la carte depuis une iFrame.
Pour plus d'information, voir la [documentation en ligne](https://ignf-ma-carte.github.io/mcviewer/doc/).

The Map IFrame API lets you embed a map on your website and control it using JavaScript.   
Using the API's JavaScript functions, you can retrieve information on the map or its content (position, layers, selected objects); add new controls or interactions; display content on the map.
You can also add event listeners that will execute in response to certain actions on the map, such as displacement, selection, object creation, etc.   
See [online documentation](https://ignf-ma-carte.github.io/mcviewer/doc/) for more information.

## Génération de la documentation de l'API

Une documentation automatique est calculée à partir du code disponible dans le répertoire `./src/api`.   
C'est dans ce code qu'on va mettre en place les différentes fonctionnalités exposées dans l'API.

Pour générer la documentation, taper la commande :

> npm run doc

La documentation de l'API est disponible dans le repertoire [./docs/doc](https://ignf-ma-carte.github.io/mcviewer/doc/) du projet.