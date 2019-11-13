'use strict';

function manualesCtrl(globalService) {

  /// Variables para obtener la url de los reportes de memoria tecnica
  var vm = this;
  vm.url = globalService.getUrlmemoriatecnicareportes();

}

/// Modulo para el controlador de Manuales
angular.module('softvFrostApp').controller('manualesCtrl', manualesCtrl);
