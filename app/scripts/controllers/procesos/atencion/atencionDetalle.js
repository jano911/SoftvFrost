'use strict';

/// Modulo para el controlador de Atención Detalle
angular
	.module('softvFrostApp')
	.controller('AtencionDetalleCtrl', function($uibModal, $state, atencionFactory, $stateParams) {

    /// Inicializa el controlador, obtiene los detalles de las atenciones telefonicas para mostrarse en el
    /// sistema
		function initialData() {
      atencionFactory.serviciosNuevo().then(function (data) {
        vm.servicios = data.GetMuestraTipSerPrincipal2ListResult;

        atencionFactory.ConsultaLLamada(vm.NumeroLlamada).then(function (data) {          
          var datos = data.GetLLamadasdeInternetListResult[0];
          vm.CLV_TIPSER = datos.CLV_TIPSER;
          vm.CLV_TRABAJO = datos.Clv_trabajo;
          vm.clvProblema = parseInt(datos.Clv_Problema);
          vm.tipoAtencion = datos.TipoAtencion;
          vm.contratoSelected = datos.ContratoCom;
          var param = {};
          param.contrato = datos.ContratoCom;
          param.servicio = datos.CLV_TIPSER;
          param.op = 0;

          atencionFactory.buscarCliente(param).then(function (data) {
            var detalle = data.GetuspBuscaContratoSeparado2ListResult[0];
            var contrato = detalle.ContratoBueno;
            vm.GlobalContrato = detalle.ContratoBueno;
            vm.NombreCliente = detalle.Nombre + detalle.Apellido_Paterno + " " + detalle.Apellido_Materno;
            vm.Calle = detalle.CALLE;
            vm.Numero = detalle.NUMERO;
            vm.Colonia = detalle.COLONIA;
            vm.Ciudad = detalle.CIUDAD
            vm.contrato = datos.ContratoCom;
            vm.DescripcionProblema = datos.Descripcion;
            vm.DescripcionSolucion = datos.Solucion;
            vm.Fecha = datos.Fecha;
            vm.Hora = datos.HoraInicial;
            vm.clv_queja = datos.clv_queja;
            vm.Turno = datos.Turno;
            vm.UsuarioGenero = datos.UsuarioGenero;
            for (var a = 0; a < vm.servicios.length; a++) {
              if (vm.servicios[a].Clv_TipSerPrincipal == vm.CLV_TIPSER) {
                vm.selectedServicio = vm.servicios[a];
              }
            }
            atencionFactory.GetClasificacionProblemas().then(function (data) {

              vm.clasificacionProblemas = data.GetuspConsultaTblClasificacionProblemasListResult;

              for (var b = 0; b < vm.clasificacionProblemas.length; b++) {
                if (vm.clasificacionProblemas[b].clvProblema == vm.clvProblema) {
                  vm.Problema = vm.clasificacionProblemas[b];
                }
              }
              atencionFactory.MuestraTrabajos(vm.CLV_TIPSER).then(function (data) {
                vm.Trabajos = data.GetMUESTRATRABAJOSQUEJASListResult;
                for (var a = 0; a < vm.Trabajos.length; a++) {
                  if (vm.Trabajos[a].CLV_TRABAJO == vm.CLV_TRABAJO) {
                    vm.Trabajo = vm.Trabajos[a];
                  }
                }
              });
            });
            vm.DireccionCliente = "Calle: " + detalle.CALLE + " #" + detalle.NUMERO + " Colonia: " + detalle.COLONIA + " Ciudad:" + detalle.CIUDAD;
            atencionFactory.getServiciosCliente(contrato).then(function (data) {
              vm.ServiciosCliente = data.GetDameSerDelCliFacListResult;
              atencionFactory.GetConAtenTelCte(vm.GlobalContrato).then(function (data) {
                vm.Telefono = data.GetConAtenTelCteResult.Telefono;
              });

            });
          });

        });
      });
    }

  /// Abre la vista para los tickets de pago del contrato del cliente
	function abrirPagos() {
      if (vm.GlobalContrato == null) {
        ngNotify.set('Establezca el contrato del cliente para obtener información', 'error');
        return;
      }
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/modalTickets.html',
        controller: 'ModalTicketsCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          contrato: function () {
            return vm.GlobalContrato;
          }
        }
      });
    }

  /// Abre el reporte de historial del contrato del cliente
	function openHistorial() {
      if (vm.GlobalContrato == null) {
        ngNotify.set('Establezca el contrato del cliente para Obtener información', 'error');
        return;
      }
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/modalReportes.html',
        controller: 'ModalReportesCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          contrato: function () {
            return vm.GlobalContrato;;
          }
        }
      });
    }

  /// Abre la ventana de cobro del detalle para el contrato delc lciente
	function abrirDetalleCobro() {
      if (vm.GlobalContrato == null) {
        ngNotify.set('Establezca el contrato del cliente para obtener la información', 'error');
        return;
      }
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalDetalleCobro.html',
        controller: 'ModalDetalleCobroCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: "lg",
        resolve: {
          contrato: function () {
            return vm.GlobalContrato;
          }
        }
      });
    }

	var vm = this;
	vm.titulo = "Detalle atención telefónica";
	vm.BloquearElementos = true;
	vm.BloquearElementosDetalle = true;
	vm.ShowDetalle = false;
	vm.ShowDetalleOnly = true;
	vm.abrirPagos = abrirPagos;
	vm.openHistorial = openHistorial;
	vm.abrirDetalleCobro = abrirDetalleCobro;
	vm.NumeroLlamada = $stateParams.id;
	initialData();
	});
