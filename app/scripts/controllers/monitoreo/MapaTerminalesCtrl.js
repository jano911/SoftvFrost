'use strict';

/// Modulo para el controlador Mapa Beams
angular
  .module('softvFrostApp')
  .controller('MapaTerminalesCtrl', MapaTerminalesCtrl);

function MapaTerminalesCtrl($uibModal, SuscriptorFactory, terminalFactory, $rootScope, ngNotify, NgMap, mapaBeamFactory, globalService, $state) {
  
  /// Inicializa el controlador, muestra los detalles de los beam junto con los mapas que abarca
  this.$onInit = function () {

    mapaBeamFactory.GetBeamList().then(function (data) {

      vm.Beams = data.GetBeamListResult;
      vm.UrlBeam = globalService.getUrlBeams() + data.GetBeamListResult[1].FilePath;
      DetalleBeam(data.GetBeamListResult[0]);
    });
    NgMap.getMap().then(function (map) {
      vm.map = map;
      google.maps.event.trigger(vm.map, 'resize');
    });
  }

  /// Obtiene las coordenadas de longitud y latitud de cada una de las terminales dentro del beam
  function ObtenerCoordenadasTerminales(terminales, beamid) {
     vm.Terminales = [];
    for (var i = 0; i < terminales.length; i++) {

      if (terminales[i].BeamID == beamid) {
        var obj = {};
        obj.data = terminales[i];
        obj.san = terminales[i].SAN;
        obj.ESN = terminales[i].ESN;
        obj.Lat = terminales[i].Latitud;
        obj.Lng = terminales[i].Longitud;
        vm.Terminales.push(obj);
      }
    }


  }

  /// Obtiene la información detallada de una terminal determinada
  function DetalleTerminal(x) {

    var id = hughesGetSanCompuesto(this.id);
    $state.go('home.monitoreo.DetalleTerminal', {
      'id': id
    });
    }

  /// Genera el SAN compuesto para Hughes en base a un SAN determinado
  function hughesGetSanCompuesto(obj) {
    var a = obj.toString();
    var i;
    for (i = a.length; i < 9; i++) {
      a = '0' + a;
    }
    return globalService.getType() + a;
  };

  /// Obtiene la información detallada del beam correspondiente
  function DetalleBeam(obj) {
     vm.BeamId=obj.BeamId;
      var a = obj.BeamId.toString();
    
      if(a.length ==2){
        vm.BeamId='0'+obj.BeamId
      }


    vm.UrlBeam = globalService.getUrlBeams() + obj.FilePath;
    mapaBeamFactory.GetBeamUsage('outroute', vm.BeamId).then(function (data) {
      vm.datosoutroute = JSON.parse(data);
      mapaBeamFactory.GetBeamUsage('inroute', vm.BeamId).then(function (data) {
        vm.datosinroute = JSON.parse(data);
        terminalFactory.getTerminalList().then(function (data) {
          vm.terminales_ = data.GetTerminalListResult;
          ObtenerCoordenadasTerminales(vm.terminales_, obj.BeamId);
        });
      });
    });
    google.maps.event.trigger(vm.map, 'resize');
  }

  var vm = this;
  vm.DetalleBeam = DetalleBeam;
  vm.Terminales = [];
  vm.DetalleTerminal = DetalleTerminal;

}
