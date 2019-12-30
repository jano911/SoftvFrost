'use strict';

/// Modulo del controlador Ejecutar Queja
angular
  .module('softvFrostApp')
  .controller('QuejaEjecutaCtrl', function ($state, ngNotify, DescargarMaterialFactory, $location, $uibModal, ordenesFactory, $stateParams, atencionFactory, quejasFactory) {

    /// Inicializa el controlador, obtiene la información de la queja a ejecutar y realiza los procedimientos para
    /// ejecutarla
    function InitalData() {
      vm.clv_queja = $stateParams.id;
      vm.contrato = $stateParams.contrato;
      vm.Servicio = $stateParams.servicio;
      quejasFactory.ValidaQueja(vm.clv_queja).then(function (data) {
        if (data.GetDeepValidaQuejaCompaniaAdicResult.Valida == 0) {
          var param = {};
          param.contrato = vm.contrato;
          param.servicio = vm.Servicio;
          param.op = 0;
          atencionFactory.buscarCliente(param).then(function (data) {

            var detalle = data.GetuspBuscaContratoSeparado2ListResult[0];
            var contrato = detalle.ContratoBueno;
            vm.GlobalContrato = contrato;
            vm.NombreCliente = detalle.Nombre + detalle.Apellido_Paterno + " " + detalle.Apellido_Materno;
            vm.Calle = detalle.CALLE;
            vm.Numero = detalle.NUMERO;
            vm.Colonia = detalle.COLONIA;
            vm.Ciudad = detalle.CIUDAD;
            vm.Telefono = 123456;
            atencionFactory.getServiciosCliente(contrato).then(function (data) {
              vm.ServiciosCliente = data.GetDameSerDelCliFacListResult;

              quejasFactory.ConsultaQueja($stateParams.id).then(function (data) {

                var detqueja = data.GetQuejasListResult[0];
                vm.UsuarioGenero = detqueja.UsuarioGenero;
                vm.UsuarioEjecuto = detqueja.UsuarioEjecuto;
                vm.TecnicoAgenda = detqueja.NombreTecAge;
                vm.TurnoAgenda = detqueja.TurnoAge;
                vm.FechaAgenda = detqueja.FechaAge;
                vm.ComentarioAgenda = detqueja.ComentarioAge;
                vm.DetalleProblema = detqueja.Problema;
                vm.Observaciones = detqueja.Observaciones;
                vm.DetalleSolucion = detqueja.Solucion;
                var fsolicitud = detqueja.Fecha_Soliciutud.split(' ');
                vm.FechaSolicitud = fsolicitud[0];
                var hora = getTime(detqueja.Fecha_Soliciutud);
                vm.HoraSolicitud = hora;

                if (detqueja.Fecha_Ejecucion != null) {
                  var fejecucion = detqueja.Fecha_Ejecucion.split(' ');
                  vm.FechaEjecucion = fejecucion[0];
                  var horaEjecucion = getTime(detqueja.Fecha_Ejecucion);
                  vm.HoraEjecucion = horaEjecucion;
                }


                if (detqueja.FechaProceso != null) {
                  var fproceso = detqueja.FechaProceso.split(' ');
                  vm.FechaProceso = fproceso[0];
                  vm.HoraProceso = getTime(detqueja.FechaProceso);
                }


                if (detqueja.Visita1 != null) {

                  var fvisita1 = detqueja.Visita1.split(' ');
                  vm.Fechavisita1 = fvisita1[0];
                  vm.Horavisita1 = getTime(detqueja.Visita1);

                  vm.FVisita3 = true;
                  vm.FVisita2 = true;
                }
                if (detqueja.Visita2 != null) {

                  var fvisita2 = detqueja.Visita2.split(' ');
                  vm.Fechavisita2 = fvisita2[0];
                  vm.Horavisita2 = getTime(detqueja.Visita2);

                  vm.FVisita3 = true;
                  vm.FVisita1 = true;
                }
                if (detqueja.Visita3 != null) {

                  var fvisita3 = detqueja.Visita3.split(' ');
                  vm.Fechavisita3 = fvisita3[0];
                  vm.Horavisita3 = getTime(detqueja.Visita3);
                  vm.FVisita1 = true;
                  vm.FVisita2 = true;
                }
                if (detqueja.EjecucuionReal != null) {

                  var fEjecucuionReal = detqueja.EjecucuionReal.split(' ');
                  vm.FechaEjecucuionReal = fEjecucuionReal[0];
                  vm.HoraEjecucuionReal = getTime(detqueja.EjecucuionReal);
                }

                DateRep.FEjec = vm.FechaEjecucion;
                DateRep.HEjec = vm.HoraEjecucion;
                DateRep.FVis1 = vm.Fechavisita1;
                DateRep.HVis1 = vm.Horavisita1;
                DateRep.FVis2 = vm.Fechavisita2;
                DateRep.HVis2 = vm.Horavisita2;
                DateRep.FVis3 = vm.Fechavisita3;
                DateRep.HVis3 = vm.Horavisita3;
                DateRep.FPro = vm.FechaProceso;
                DateRep.HPro = vm.HoraProceso;

                vm.Departamento = detqueja.Clasificacion;
                vm.Clv_trabajo = detqueja.Clv_Trabajo;
                vm.Clv_prioridad = detqueja.clvPrioridadQueja;
                vm.Clv_problema = detqueja.clvProblema;
                vm.ProblemaReal = detqueja.Solucion;
                vm.Visita = detqueja.Visita;
                vm.Clv_status = detqueja.Status;
                vm.Estatus = 'E';
                Bloqueo(true);

                DescargarMaterialFactory.GetchecaBitacoraTecnico(vm.clv_queja, 'Q').then(function (data) {
                  if (data.GetchecaBitacoraTecnicoResult != null) {
                    vm.idBitacora = data.GetchecaBitacoraTecnicoResult.idBitacora;
                    vm.idTecnicoBitacora = data.GetchecaBitacoraTecnicoResult.clvTecnico;
                  }
                  quejasFactory.ObtenTecnicos(vm.GlobalContrato).then(function (data) {
                    vm.Tecnicos = data.GetMuestra_Tecnicos_AlmacenListResult;
                    if (detqueja.Clave_Tecnico != null && vm.idTecnicoBitacora > 0) {
                      for (var a = 0; a < vm.Tecnicos.length; a++) {
                        if (vm.Tecnicos[a].clv_Tecnico == vm.idTecnicoBitacora) {
                          vm.Tecnico = vm.Tecnicos[a];
                          vm.BlockTecnico = true;
                        }
                      }
                    }
                  });
                });



                atencionFactory.MuestraTrabajos(vm.Servicio).then(function (data) {
                  vm.Trabajos = data.GetMUESTRATRABAJOSQUEJASListResult;
                  for (var a = 0; a < vm.Trabajos.length; a++) {
                    if (vm.Trabajos[a].CLV_TRABAJO == vm.Clv_trabajo) {
                      vm.Trabajo = vm.Trabajos[a];
                    }
                  }
                });

                quejasFactory.ObtenPrioridad().then(function (data) {
                  vm.Prioridades = data.GetSoftv_GetPrioridadQuejaListResult;
                  for (var a = 0; a < vm.Prioridades.length; a++) {
                    if (vm.Prioridades[a].clvPrioridadQueja == vm.Clv_prioridad) {
                      vm.Prioridad = vm.Prioridades[a];
                    }
                  }
                });
                atencionFactory.getServicios().then(function (data) {
                  vm.Servicios = data.GetMuestraTipSerPrincipalListResult;
                  for (var a = 0; a < vm.Servicios.length; a++) {
                    if (vm.Servicios[a].Clv_TipSerPrincipal == vm.Servicio) {
                      vm.Servicio = vm.Servicios[a];
                    }
                  }
                });

                ordenesFactory.serviciosCliente(vm.GlobalContrato).then(function (data) {
                  vm.servicioscli = data.GetDameSerDelCliFacListResult;
                });

                atencionFactory.GetClasificacionProblemas().then(function (data) {
                  vm.Problemas = data.GetuspConsultaTblClasificacionProblemasListResult;
                  for (var a = 0; a < vm.Problemas.length; a++) {
                    if (vm.Problemas[a].clvProblema == vm.Clv_problema) {
                      vm.Problema = vm.Problemas[a];
                    }
                  }
                });

              });

            });

          });
        } else {
          $state.go('home.procesos.reportes');
          ngNotify.set('El Reporte pertenece a un contrato de plazas adicionales al usuario, no puede ejecutarla', 'error');
        }
      });
    }

    /// Crea el objeto de tipo date con el día, mes y año de la fecha recibida
    function dateParse(date) {
      var realdate = date.split(" ")
      var strDate = realdate[0];
      var dateParts = strDate.split("/");
      var date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
      if (dateParts[0].length == 1) {
        var dia = '0' + ateParts[0];
      }
    }

    /// Obtiene la hora de la fecha recibida
    function getTime(date) {
      var fejecucion = date.split(' ');

      if (fejecucion.length == 3) {
        return fejecucion[2];
      } else if (fejecucion.length == 4) {
        var hora = fejecucion[3].split(':');
        if (hora[0].length == 1) {
          return '0' + fejecucion[3];
        } else {
          return fejecucion[3];
        }

      }
    }

    /// Abre la vista de Bonificaciones con acciones en base a su controlador
    function abrirBonificacion() {
      var detalle = {};
      detalle.Block = true;
      detalle.Queja = vm.clv_queja;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalBonificacion.html',
        controller: 'ModalBonificacionCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'md',
        resolve: {
          detalle: function () {
            return detalle;
          }
        }
      });
    }

    /// Devuelve el objeto date con el día, mes y año de la cadena de fecha recibida
    function toDate(dateStr) {
      var parts = dateStr.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    /// Valida que las fechas recibidas sean correctas en formato y en comparación entre ellas
    function ValidaFecha(fechaIngresada, fechasolicitud) {
      var _fechaHoy = new Date();
      var _fechaIngresada = toDate(fechaIngresada);
      var _fechasolicitud = toDate(fechasolicitud);

      if ((_fechaIngresada > _fechasolicitud && _fechaIngresada < _fechaHoy) || _fechasolicitud.toDateString() === _fechaIngresada.toDateString()) {
        return true;
      } else {
        return false;
      }

    }

    /// Asigna valores correspondientes dependiendo del estatus de la queja si es que aplica el bloqueo
    function Bloqueo(aplicabloqueo) {
      if (vm.Estatus == 'E') {
        vm.FEjecucion = false;
        vm.FVisita1 = true;
        vm.FVisita2 = true;
        vm.FVisita3 = true;
        vm.FProceso = true;
        vm.Iejecucion = 'input-yellow';
        vm.Ivisita = 'input-normal';
        vm.Iproceso = 'input-normal';
        vm.Ivisita1 = 'input-normal';
        vm.Ivisita2 = 'input-normal';
        vm.Ivisita3 = 'input-normal';
      } else if (vm.Estatus == 'V') {

        vm.FEjecucion = true;
        vm.FProceso = true;

        if (vm.Fechavisita1 == null) {
          vm.FVisita1 = false;
          vm.FVisita2 = true;
          vm.FVisita3 = true;

          vm.Ivisita1 = 'input-yellow';
          vm.Ivisita2 = 'input-normal';
          vm.Ivisita3 = 'input-normal';
          vm.Iejecucion = 'input-normal';
        }

        if (vm.Fechavisita2 == null && vm.Fechavisita1 != null) {
          vm.FVisita2 = false;
          vm.FVisita1 = true;
          vm.FVisita3 = true;

          vm.Ivisita2 = 'input-yellow';
          vm.Ivisita1 = 'input-normal';
          vm.Ivisita3 = 'input-normal';
          vm.Iejecucion = 'input-normal';
        }

        if (vm.Fechavisita3 == null && vm.Fechavisita2 != null) {
          vm.FVisita3 = false;
          vm.FVisita1 = true;
          vm.FVisita2 = true;

          vm.Ivisita2 = 'input-normal';
          vm.Ivisita1 = 'input-normal';
          vm.Ivisita3 = 'input-yellow';
          vm.Iejecucion = 'input-normal';
        }

      } else if (vm.Estatus == 'S') {
        if (vm.FechaProceso != null) {
          vm.FProceso = true;
          vm.Iproceso = 'input-normal';
        } else {
          vm.FProceso = false;
          vm.Iproceso = 'input-yellow';
        }
        vm.FEjecucion = true
        vm.FVisita1 = true;
        vm.FVisita2 = true;
        vm.FVisita3 = true;

        vm.Iejecucion = 'input-normal';
        vm.Ivisita1 = 'input-normal';
        vm.Ivisita2 = 'input-normal';
        vm.Ivisita3 = 'input-normal';
      }
    }

    /// Cambia el status de la queja
    function CambiaEstatus() {
      console.log('CambiaEstatus-DateRep: ', DateRep);
      vm.FechaEjecucion = DateRep.FEjec;
      vm.HoraEjecucion = DateRep.HEjec;
      vm.Fechavisita1 = DateRep.FVis1;
      vm.Horavisita1 = DateRep.HVis1;
      vm.Fechavisita2 = DateRep.FVis2;
      vm.Horavisita2 = DateRep.HVis2;
      vm.Fechavisita3 = DateRep.FVis3;
      vm.Horavisita3 = DateRep.HVis3;
      vm.FechaProceso = DateRep.FPro;
      vm.HoraProceso = DateRep.HPro;
      Bloqueo();
    }

    /// Realiza los procedimientos y configuraciones correspondientes para la ejecución de quejas
    function Ejecutaqueja() {
      console.log("F2: " + vm.Fechavisita2);
      quejasFactory.ValidaQueja(vm.clv_queja).then(function (data) {
        if (data.GetDeepValidaQuejaCompaniaAdicResult.Valida == 0) {
          quejasFactory.BuscaBloqueado(vm.GlobalContrato).then(function (bloqueado) {
            if (bloqueado.GetDeepBuscaBloqueadoResult.Bloqueado == 0) {

              if (vm.Estatus == 'E') {
                if (vm.FechaEjecucion == undefined) {
                  ngNotify.set('Seleccione la fecha de ejecución', 'error');
                  return;
                } else {
                  if (ValidaFecha(vm.FechaEjecucion, vm.FechaSolicitud) == false) {
                    ngNotify.set('La fecha de ejecución no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                    return;
                  }
                }
              } else if (vm.Estatus == 'V') {

                if (vm.Fechavisita1 != undefined &&
                  vm.Fechavisita2 == undefined &&
                  vm.Fechavisita3 == undefined) {
                  if (ValidaFecha(vm.Fechavisita1, vm.FechaSolicitud) == false) {
                    ngNotify.set('La fecha de ejecución no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                    return;
                  }
                } else if (vm.Fechavisita1 != undefined &&
                  vm.Fechavisita2 != undefined &&
                  vm.Fechavisita3 == undefined) {

                  if (ValidaFecha(vm.Fechavisita2, vm.FechaSolicitud) == false) {
                    ngNotify.set('La fecha de visita no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                    return;
                  }
                } else if (vm.Fechavisita1 != undefined &&
                  vm.Fechavisita2 != undefined &&
                  vm.Fechavisita3 != undefined) {
                  if (ValidaFecha(vm.Fechavisita3, vm.FechaSolicitud) == false) {
                    ngNotify.set('La fecha de visita no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                    return;
                  }
                }

              } else if (vm.Estatus == 'S') {

                if (ValidaFecha(vm.FechaProceso, vm.FechaSolicitud) == false) {
                  ngNotify.set('La fecha de proceso no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                  return;
                }

              }

              if (vm.Estatus == 'E') {
                var obj = {};
                obj.Clv_Queja = vm.clv_queja;
                obj.Status = 'E';
                obj.Fecha_Ejecucion = vm.FechaEjecucion;
                obj.Visita1 = '';
                obj.Visita2 = '';
                obj.Visita3 = '';
                obj.HV1 = '';
                obj.HV2 = '';
                obj.HV3 = '';
                obj.FechaProceso = '';
                obj.HP = '';
                obj.Visita = false;
                obj.Clv_Tecnico = vm.Tecnico.clv_Tecnico;
                obj.clvProblema = vm.Problema.clvProblema;
                obj.clvPrioridadQueja = vm.Prioridad.clvPrioridadQueja;
                obj.Solucion = vm.ProblemaReal;
                obj.Clv_Trabajo = (vm.Trabajo == null || vm.Trabajo == undefined) ? 0 : vm.Trabajo.CLV_TRABAJO;
                console.log(obj);
                quejasFactory.UpdateQuejas(obj).then(function (data) {

                  ngNotify.set('El Reporte se aplicó  correctamente', 'success');
                  $state.go('home.procesos.reportes');
                });
              }
              if (vm.Estatus == 'V') {
                var obj = {};
                obj.Clv_Queja = vm.clv_queja;
                obj.Status = 'V';
                obj.Fecha_Ejecucion = '';
                obj.Visita1 = (vm.Fechavisita1 == undefined) ? '' : vm.Fechavisita1;
                obj.Visita2 = (vm.Fechavisita2 == undefined) ? '' : vm.Fechavisita2;
                obj.Visita3 = (vm.Fechavisita2 == undefined) ? '' : vm.Fechavisita3;
                obj.HV1 = (vm.Horavisita1 == undefined) ? '' : vm.Horavisita1;
                obj.HV2 = (vm.Horavisita2 == undefined) ? '' : vm.Horavisita2;
                obj.HV3 = (vm.Horavisita3 == undefined) ? '' : vm.Horavisita3;
                obj.FechaProceso = '';
                obj.HP = '';
                obj.Visita = false;
                obj.Clv_Tecnico = vm.Tecnico.clv_Tecnico;
                obj.clvProblema = vm.Problema.clvProblema;
                obj.clvPrioridadQueja = vm.Prioridad.clvPrioridadQueja;
                obj.Solucion = vm.ProblemaReal;
                obj.Clv_Trabajo = (vm.Trabajo == null || vm.Trabajo == undefined) ? 0 : vm.Trabajo.CLV_TRABAJO;
                quejasFactory.UpdateQuejas(obj).then(function (data) {

                  ngNotify.set('El Reporte se aplicó  correctamente', 'success');
                  $state.go('home.procesos.reportes');
                });

              }
              if (vm.Estatus == 'S') {
                var obj = {};
                obj.Clv_Queja = vm.clv_queja;
                obj.Status = 'S';
                obj.Fecha_Ejecucion = '';
                obj.Visita1 = '';
                obj.Visita2 = '';
                obj.Visita3 = '';
                obj.HV1 = '';
                obj.HV2 = '';
                obj.HV3 = '';
                obj.FechaProceso = vm.FechaProceso;
                obj.HP = vm.HoraProceso;
                obj.Visita = false;
                obj.Clv_Tecnico = vm.Tecnico.clv_Tecnico;
                obj.clvProblema = vm.Problema.clvProblema;
                obj.clvPrioridadQueja = vm.Prioridad.clvPrioridadQueja;
                obj.Solucion = vm.ProblemaReal;
                obj.Clv_Trabajo = (vm.Trabajo == null || vm.Trabajo == undefined) ? 0 : vm.Trabajo.CLV_TRABAJO;


                quejasFactory.UpdateQuejas(obj).then(function (data) {

                  ngNotify.set('El Reporte se aplicó  correctamente', 'success');
                  $state.go('home.procesos.reportes');
                });

              }


            } else {
              ngNotify.set('El cliente, ha sido bloqueado, por lo que no se podrá ejecutar la orden', 'error');
            }
          });

        } else {

          ngNotify.set('El Reporte pertenece a un contrato de plazas adicionales al usuario, no puede ejecutarla', 'error');
        }
      });
    }

    /// Muestra la vista correspondiente a la agenda para quejas
    function MuestraAgenda() {

      var options = {};
      options.TecnicoAgenda = vm.TecnicoAgenda;
      options.TurnoAgenda = vm.TurnoAgenda;
      options.FechaAgenda = vm.FechaAgenda;
      options.ComentarioAgenda = vm.ComentarioAgenda;
      options.opcion = 2;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalAgendaQueja.html',
        controller: 'ModalAgendaQuejaCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'sm',
        resolve: {
          options: function () {
            return options;
          }
        }
      });
    }

    /// Muestra la vista de avances
    function Avances() {
      var options = {};
      options.ClvOrden = vm.clv_queja;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalAvances.html',
        controller: 'ModalAvancesCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          options: function () {
            return options;
          }
        }
      });


    }

    /// Obtiene la información correspondiente para abrir la vista para la descarga de material
    function DescargaMaterial() {

      if (vm.Tecnico == null) ngNotify.set('Seleccione un técnico para continuar', 'warn');
      var Tecnico = {};
      Tecnico.CLV_TECNICO = vm.Tecnico.clv_Tecnico;
      Tecnico.Nombre = vm.Tecnico.Nombre;
      var options = {};
      options.Detalle = false;
      options.ClvOrden = vm.clv_queja;
      options.ClvBitacora = vm.idBitacora;
      options.SctTecnico = Tecnico;
      options.Tipo_Descargar = "Q";

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalDescargaMaterial.html',
        controller: 'ModalDescargaMaterialCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          options: function () {
            return options;
          }
        }
      });
    }
    var vm = this;

    InitalData();
    vm.Titulo = 'Ejecutar Reporte';
    vm.ShowEje = true;
    vm.ShowDet = false;
    vm.BloqElemnt = false;
    vm.abrirBonificacion = abrirBonificacion;
    vm.CambiaEstatus = CambiaEstatus;
    vm.Ejecutaqueja = Ejecutaqueja;
    vm.DescargaMaterial = DescargaMaterial;
    vm.MuestraAgenda = MuestraAgenda;
    vm.Iprioridad = true;
    vm.IDetProblema = true;
    vm.IClasproblema = true;
    vm.Iprobreal = false;
    vm.Iobser = true;
    vm.IEstatus = true;
    vm.idBitacora = 0;
    vm.idTecnicoBitacora = 0;
    vm.Avances = Avances;
    var DateRep = {};

  });
