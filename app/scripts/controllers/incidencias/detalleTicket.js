'use strict';

function DetalleTicketCtrl($uibModalInstance, $localStorage, ticket, incidenciasFactory, $filter, ngNotify, $state) {
	
	/// Inicializa el controlador, obtiene los datos de detalles del ticket correspondiente
	function initial() {
		vm.fecha = new Date();
		vm.showFirstTab = function() {
			angular.element('[data-target="#tab1"]').tab('show');
		}
		incidenciasFactory.getTicketDetalle(ticket).then(function(data) {
			vm.detalleTicket = data.GetDeepTicketResult;
			incidenciasFactory.getSintoma().then(function(data) {
				vm.sintomas = data.GetSintomaListResult;
				// for (var i = 0; i < vm.sintomas.length; i++) {
				//     if (vm.sintomas[i].IdSintoma == vm.detalleTicket.IdSintoma) {
				//         vm.sintoma = vm.sintomas[i].Descripcion;
				//     }
				// }
				vm.sintomas.forEach(function(entry, index) {
					if (entry.IdSintoma == vm.detalleTicket.IdSintoma) {
						vm.sintoma = vm.sintomas[index].Descripcion;
					}
				});
			});
		});
		incidenciasFactory.getSolucion().then(function(data) {
			vm.solucion = data.GetSolucionTicketListResult;
		});
	}

	/// Realiza validación del archivo correspondiente
	function ValidaArchivo() {
		
	var	files = $('#inputFile2').get(0).files;
		ContratoMaestroFactory.UpdateFile(files, vm.Distribuidor.Clv_Plaza).then(function(data) {
			
		});
	}

	/// Imprime "avance" en la consola
	function avanceTicket() {
		console.log('avance');
	}

	/// Cierra el ticket correspondiente registrando datos como fecha e información relacionada
	function closeTicket() {
		vm.fechaCierre = new Date();
		vm.auxFecha = $filter('date')(vm.fechaCierre, 'yyyy/MM/dd HH:mm:ss');
		var closeTi = {
			ticket: ticket,
			fechaCierre: vm.auxFecha,
			solucion: vm.selectedSolucion.IdSolucion,
			causa: vm.causa,
			descripcionSolucion: vm.descripcionSolucion
		};
		incidenciasFactory.closeTicket(closeTi).then(function(data) {
			if (data.UpdateTicketResult > 0) {
				ngNotify.set('Ticket cerrado correctamente.', 'success');
				$state.go('home.incidencias.registro');
			} else {
				ngNotify.set('Error al cerrar Ticket.', 'error');
			}
		});
	}

	/// Cancela el procedimiento actual
	function cancel() {
		$uibModalInstance.dismiss('cancel');
	}

	var vm = this;
	vm.cancel = cancel
	vm.avanceTicket = avanceTicket;
	vm.closeTicket = closeTicket;
	vm.ValidaArchivo = ValidaArchivo;
	initial();
}

/// Modulo para el controlador de Detalle Ticket
angular.module('softvFrostApp').controller('DetalleTicketCtrl', DetalleTicketCtrl);
