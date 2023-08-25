# mcviewer
Macarte viewer application

C'est l'application utilisée pour afficher les carte sur le site Ma carte.

## Installation et développement

Voir la section générale [Installation & développement](https://github.com/IGNF-Ma-carte/.github/blob/main/DEVELOPING.md)

## Instance de test

Une instance de test de l'application est disponible dans le répertoire `./docs` du projet.   
Vous pouvez test les derniers [développements en ligne](https://ignf-ma-carte.github.io/mcviewer/?map=4abe44d25ec0a28b7159b27cd25ce476).

NB: l'instance de test est branchée sur la base de donnée de [qualification du site Ma carte](https://macarte-qualif.ign.fr/). Vous devez avoir un compte sur cette base pour certaines opérations.

<img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_the_United_Kingdom_%285-8%29.svg" height=20 align="left" />
You can test the last [dev online](https://ignf-ma-carte.github.io/mcviewer/?map=4abe44d25ec0a28b7159b27cd25ce476).   
NB: tests use the qualification instance and may [have an account](https://macarte-qualif.ign.fr/) on it for some tests.

# Map IFrame API

Le viewer embarque une IFrame API permettant de piloter la carte depuis une iFrame.
Pour plus d'information, voir la [documentation en ligne](https://ignf-ma-carte.github.io/mcviewer/doc/).

<img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_the_United_Kingdom_%285-8%29.svg" height=20 align="left" />
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

# LICENCE

Copyright (c) 2023 IGN-France

Open Source JavaScript, released under the [GPL-3 License](./LICENSE).

Important notice : Please note that the logos, images and graphic elements associated with IGN and the French Republic, present in this project, are protected by copyright and are not covered by the open source licence of this code. The use of these elements is subject to applicable laws and regulations and must be carried out in compliance with the rights and permissions granted by the respective owners
