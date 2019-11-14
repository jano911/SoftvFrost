'use strict';

/// Modulo para el controlador de Memoria Técnica de Reportes Detallada
angular
    .module('softvFrostApp')
    .controller('ModalMemoriaServicioDetalladoCtrl', function ($uibModalInstance, IdMemoriaTecnica, memoriaServicioFactory) {
        
        /// Inicializa el controlador, obtiene los detalles y observaciones de la memoria técnica seleccionada
        function init() {
            vm.IdMemoriaTecnica = IdMemoriaTecnica;
            memoriaServicioFactory.GetObtieneObservacionesMemoriaTecnica(IdMemoriaTecnica).then(function (result) {
                vm.rowCollection = result.GetObtieneObservacionesMemoriaTecnicaServicioResult;
                memoriaServicioFactory.GetObtieneObservacionesMemoriaTecnicaPestana(IdMemoriaTecnica).then(function (result) {
                    vm.rowCollection2 = result.GetObtieneObservacionesMemoriaTecnicaPestanaServicioResult;
                });
            });
        }

        /// Cierra la ventana de los detalles al dar click en Cancelar
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        /// Cierra la ventana de los detalles al dar click en OK
        function ok() {
            $uibModalInstance.dismiss('cancel');
        }

        var vm = this;
        vm.cancel = cancel;
        vm.ok = ok;
        init();
    });
