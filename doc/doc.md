# Macarte iFrameAPI

Macarte iFrameAPI vous permet d'intégrer un widget d'une carte produite sur le site [Ma carte](https://macarte.ign.fr) sur votre site Web et de le contrôler à l'aide de JavaScript.    
L'intégration des cartes se fait via une balise `<iframe>`, la configuration de la carte se fait simplement, de manière interactive sur le site [Ma carte](https://macarte.ign.fr).

Les fonctions de l'API JavaScript vous permettent d'afficher une carte, de controler sa position et son contenu et de récupérer des informations liées à cette carte. Vous pouvez également ajouter des écouteurs d'événements qui s'exécutent en réponse à certains événements déclenchés sur la carte tels qu'un déplacement ou une sélection d'objet par exemple.

Ce guide décrit le fonctionnement de l'iFrame API. Il présente les différents types d'événements que l'API peut envoyer et explique comment définir des écouteurs d'événements pour y répondre. Il présente également en détail les différentes fonctions JavaScript que vous pouvez appeler pour contrôler la carte, ainsi que les paramètres de la carte que vous pouvez utiliser pour la personnaliser.

## 🛠️ Configuration requise

L'utilisateur final doit utiliser un navigateur compatible avec la fonctionnalité `postMessage` de HTML5. Les navigateurs les plus récents sont compatibles avec `postMessage`.

La taille de la fenêtre d'affichage des cartes intégrés doit être suffisante pour que celle-ci s'affiche correctement.

Les pages Web qui utilisent l'iFrameAPI doivent également mettre en œuvre la fonction JavaScript permettant de récupérer l'API : [MapIFrameAPI.ready]{@link MapIFrameAPI#ready}.
Cette fonction permet de récupérer l'API lorsque la carte a terminé de se charger, ce qui vous permet de l'utiliser sur votre page.

## 📜 Premiers pas

L'exemple de page HTML ci-dessous permet d'afficher une carte intégrée et de récupérer l'API associée à cette carte. Les commentaires numérotés dans le code HTML sont expliqués dans la liste apparaissant sous l'exemple.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Ma carte</title>
    <!-- 1. Charger le code de l'API -->
    <script type="text/javascript" src="https://macarte.ign.fr/carte/MapIFrameAPI.js"></script>
  </head>

  <body>
    <!-- 2. <iframe> qui va contenir la carte a afficher -->
    <iframe id="map" src="https://macarte.ign.fr/carte/MAP_ID/CARTE_TITLE" width="100%" height="400"></iframe>

    <script>
    // Variable globale
    var mapAPI = null;
    // 3. Récupération de l'API lorsque la carte est chargée
    MapIFrameAPI.ready('map', function(api) {
      // 4. Récupération de l'API pour un accès global
      mapAPI = api;
      // 5. Center la carte sur Paris
      mapAPI.setCenter([2.33, 48.85]);
      // 6. Placer un écouteur pour récupérer les objets sélectionnés
      mapAPI.on('select', function(sel) {
        console.log(sel);
      })
    })
    </script>
  </body>
</html>
```

Cet exemple de code est expliqué plus en détail dans la liste ci-dessous :

1. La ligne qui suit permet de charger le code de l'API afin de pouvoir l'utiliser sur votre page. Il expose la variable {@link MapIFrameAPI}.
2. La balise `<iframe>` permet d'insérer une carte sur votre page web à l'emplacement que vous avez choisi.    
`MAP_ID` correspond à l'identifiant de publication de la carte que vous voulez intégrer. Vous devez donc au préalable avoir créer la carte à afficher sur le site [Ma carte](https://macarte.ign.fr).
3. La fonction [MapIFrameAPI.ready]{@link MapIFrameAPI#ready} permet d'être informé lorsque la carte est chargée et que l'API est prète à être utilisée.    
Elle prend 2 arguments : 
    * le premier argument indique l'iframe sur laquelle il faut brancher l'API. C'est soit l'élément lui même soit son identifiant.
    * le second argument est une fonction de rappel qui sera exécutée lorsque l'API est disponible, et qui transmet la variable d'API à utiliser par la suite.
4. La ligne suivante permet de sauvegarder l'API dans une variable globale pour y avoir accès plus simplement (facultatif)
5. La fonction `setCenter` de l'API permet de centrer la carte à une longitude, latitude donnée. Dans l'exemple, on se centre sur Paris.
6. A la ligne suivante, nous allons brancher un écouteur pour être averti lorsqu'un objet est sélectionné. Le premier argument est le type d'évènement qu'on écoute (`select`), le second une fonction qui renvoit un tableau d'objet sélectionné au format GeoJSON.

## ⌨️ Fonctionnalités

### Récupération de l'API

Vous devez récupérer l'API au moyen de la méthode [MapIFrameAPI.ready]{@link MapIFrameAPI#ready} en lui indiquant l'iFrame sur laquelle on veut se brancher et qui en retour vous renverra l'API à utiliser par la-suite (notée `mapAPI` dans la suite).

### Utilisation de l'API

Pour communiquer avec l'iFrame, utilisez les [fonctionnalités disponibles dans l'API]{@link api}.

Elles sont de la forme `functionality(options)` ou si on attend une réponse `functionality([options], callback)`. Callback est une fonction de rapelle qui transmettra l'information, dans ce cas les options sont facultatives et peuvent ne pas être demandées.

Il est également possible de brancher des écouteurs pour être informé lorsqu'un évènement se produit sur la carte au moyen de la méthode [on]{@link api#on}. Vous pouvez débrancher un écouteur à l'aide de [un]{@link api#un}.
