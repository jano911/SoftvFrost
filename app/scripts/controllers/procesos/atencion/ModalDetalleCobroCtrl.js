'use strict';

/// Modulo para el controlador de Detalle de Cobro
angular
	.module('softvFrostApp')
	.controller('ModalDetalleCobroCtrl', function($uibModalInstance, $uibModal, cajasFactory, contrato, atencionFactory, $rootScope, ngNotify, $localStorage) {
		
		/// Inicializa el controlador, obtiene los detalles e importes del pago correspondiente
		function initialData() {
			cajasFactory.dameSession(contrato).then(function(session) {
				vm.session = session.GetDeepDameClv_SessionResult.IdSession;
				cajasFactory.dameDetallePago(vm.session).then(function(detallePago) {
					vm.detallePago = detallePago.GetDameDetalleListResult;
					vm.detallePagoAux = vm.detallePago;
					cajasFactory.dameSumaPago(vm.session).then(function(sumaPago) {
						vm.sumaPagos = sumaPago.GetSumaDetalleListResult;
					});
				});
			});
		}

		/// Cancela la operación actual
		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}
		
		var vm = this;
		vm.cancel = cancel;
		initialData();

	});
