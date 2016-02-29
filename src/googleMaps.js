(function () {

  'use strict';

  /**
   * @todos
   *
   * some defaults would be nice
   */


  try {
    angular.module('nes.googleMaps');
  } catch (exception) {
    angular.module('nes.googleMaps', []);
  }


  angular.module('nes.googleMaps')
    .service('$googleMaps', ['$q', NesGoogleMaps]);

  /**
   *
   * A tiny wrapper on
   * https://github.com/mapsplugin/cordova-plugin-googlemaps
   *
   * a map object will be returned upon creation, so all of the plugin's api will be available,
   * plus 3 helper methods
   * addMarkers
   * addMarker
   * drawPath
   *
   *
   * Ex.
   *
   * map = $googleMaps.create('map-canvas', position(35.548852, 139.784086), 10);
   * map.addMarkers(createMarkers());
   * map.drawPath(points, 'orange', 1);
   *
   *
   *
   * @param $q
   * @returns {{create: _create}}
   * @constructor
     */
  function NesGoogleMaps($q) {

    function _position(lat, lng) {
      return new plugin.google.maps.LatLng(lat, lng);
    }

    function _addMarker(map, markerOptions) {
      map.isAvailable(function() {
        map.addMarker(markerOptions);
      });
    }

    function _drawPath(map, points, color, width) {
      var deferred = $q.defer();
      map.isAvailable(function() {
        map.addPolyline({
          'points': points,
          'color' : color,
          'width': width,
          'geodesic': true
        }, function(polyLine) {
          deferred.resolve(polyLine);
        });

      });
      return deferred.promise;
    }

    /**
     * @throws Exception if cannot find element in dom
     * @param domSelector
     * @returns {{_map: null, dropMarker: dropMarker, drawPath: drawPath}}
     * @private
     */
    function _create(domSelector, position, zoom) {

      var mapInDom = document.getElementById(domSelector);
      if(!mapInDom) {
        throw 'domSelector does not match any element id in the dom!';
      }

      try {
        plugin.google.maps
      } catch(exception) {
        throw 'cordova-plugin-googlemaps is not available!'
      }

      return {
        _map: plugin.google.maps.Map.getMap(mapInDom, {
          camera: {
            latLng: _position(position.lat, position.lon)
          },
          zoom: zoom
        }),
        addMarker: function (markerOptions) {
          return _addMarker(this._map, markerOptions);
        },
        addMarkers: function (markersOptions) {
          var deferred = $q.defer();
          var map = this._map;
          angular.forEach(markersOptions, function(markerOptions) {
            _addMarker(map, markerOptions);
          });
          return deferred.promise;
        },
        drawPath: function (points, color, width) {
          return _drawPath(this._map, points, color, width);
        }
      };
    }

    return {
      create: _create
    }
  }

})();
