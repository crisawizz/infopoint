var map_js;
var view;
function initMapJS() {   
     require([
        "esri/WebMap",
        "esri/views/MapView",
        "esri/layers/Layer",
        "esri/portal/PortalItem",
        "esri/intl",
        "esri/core/promiseUtils",
        "esri/config",

        // IE11 shim for Array
        "@dojo/framework/shim/array"
      ], function (WebMap, MapView, Layer, PortalItem, intl, promiseUtils, esriConfig) {
        /************************************************************
         * Creates a template to display Portal Item Information.
         * Any values enclosed in "{}" will be parsed with properties
         * from an object using the utility method esri/intl::substitute
         ************************************************************/
        var template =
          '<div data-itemid="{id}" class="card" draggable="true">' +
          '<figure class="card-image-wrap"><img class="card-image" src="{thumbnailUrl}" alt="Card Thumbnail">' +
          '<figcaption class="card-image-caption">{title}</figcaption>' +
          "</figure>" +
          '<div class="card-content">' +
          "<ul>" +
          "<li>Published Date:</li>" +
          "{created}" +
          "<li>Owner:</li>" +
          "{owner}" +
          "</ul>" +
          "</div>" +
          "</div>";
        // Array of Portal Items for Layers!
        var layerItems = [
            "cd3e7e10c25941988e3c5bc036c737e2", // TBA
            "90da67c05a6946adae9803c73b0e9baf", // ZVV
            
          
          
        ];
        /************************************************************
         * Creates a new WebMap instance. A WebMap must reference
         * a PortalItem ID that represents a WebMap saved to
         * arcgis.com or an on-premise portal.
         *
         * To load a WebMap from an on-premise portal, set the portal
         * url with esriConfig.portalUrl.
         ************************************************************/
        esriConfig.portalUrl="https://gdi.ktzh.ch/portal";
        var map_js = new WebMap({
          portalItem: {
            // autocasts as new PortalItem()
            id: "0d7c3327721341c787e867209cde1b1c"
            //up 0d7c3327721341c787e867209cde1b1c
          }
        });
        /************************************************************
         * Set the WebMap instance to the map property in a MapView.
         ************************************************************/
        var view = new MapView({
          map: map_js, // The WebMap instance created above
          container: "viewDiv"
        });
        /************************************************************
         * Wait for the MapView to finish loading and create an array
         * of PortalItems.
         ************************************************************/
        view.when(function () {
          var portalItems = layerItems.map(function (itemid) {
            /************************************************************
             * We want to load the PortalItem right away so that we can
             * read the data, such as "id", "owner", "title", and "created".
             * This does not load the Layer itself, but returns a Promise.
             ************************************************************/
            return new PortalItem({
              id: itemid
            }).load();
          });
          /************************************************************
           * Use promiseUtils.eachAlways to wait for all of the
           * PortalItem Promises to complete loading.
           ************************************************************/
          promiseUtils.eachAlways(portalItems).then(function (items) {
            /************************************************************
             * Create a DocumentFragment to hold our list elements
             * until we are ready to add them to the page.
             ************************************************************/
            var docFrag = document.createDocumentFragment();
            items.map(function (result) {
              var item = result.value;
              /************************************************************
               * Use esri/intl::substitute will create a new string
               * using properties from the PortalItem.
               ************************************************************/
              var card = intl.substitute(template, item);
              /************************************************************
               * Create a "div" element to hold the new string from the
               * template and get the new node from that element to append
               * it to the DocumentFragment.
               ************************************************************/
              var elem = document.createElement("div");
              elem.innerHTML = card;
              // This is a technique to turn a DOM string to a DOM element.
              var target = elem.firstChild;
              docFrag.appendChild(target);
              /************************************************************
               * Listen for the "dragstart" event on the list item.
               ************************************************************/
              target.addEventListener("dragstart", function (event) {
                /************************************************************
                 * Get the data attribute from the element and pass it along
                 * as the data being transferred in the drag event.
                 ************************************************************/
                var id = event.currentTarget.getAttribute("data-itemid");
                event.dataTransfer.setData("text", id);
              });
            });
            /************************************************************
             * Append the list item to the page.
             ************************************************************/
            document.querySelector(".cards-list").appendChild(docFrag);
            /************************************************************
             * Listen for "drop" and "dragover" events on the container
             * of the View.
             ************************************************************/
            view.container.addEventListener("dragover", function (event) {
              event.preventDefault();
              /************************************************************
               * On "dragover", you need to specify the dropEffect to drop
               * items to an element while dragging.
               ************************************************************/
              event.dataTransfer.dropEffect = "copy";
            });
            view.container.addEventListener("drop", function (event) {
              event.preventDefault();
              /************************************************************
               * Element has been dropped into container. Get the "id"
               * that was transferred and find it in the item list.
               ************************************************************/
              var id = event.dataTransfer.getData("text");
              var resultItem = items.find(function (x) {
                return x.value.id === id;
              });
              var item = resultItem.value;
              /************************************************************
               * If the item is a Layer item, create a Layer using
               * Layer.fromPortalItem.
               ************************************************************/
              if (item && item.isLayer) {
                Layer.fromPortalItem({
                  portalItem: item
                }).then(function (layer) {
                  /************************************************************
                   * Add the layer to the map and zoom to its extent.
                   ************************************************************/
                  map_js.add(layer);
                  //view.extent = item.extent;
                });
              }
            });
          });
        });
      });
    }
