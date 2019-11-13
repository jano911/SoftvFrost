'use strict';

/// Módulo para Nuevos Pools IP
angular.module('softvFrostApp').controller('nuevoPoolsCtrl', nuevoPoolsCtrl);

function nuevoPoolsCtrl($state, ngNotify, $timeout, configuracionIPFactory) {
    var vm = this;
    vm.GuardaPool = GuardaPool;
    vm.AgregarServicio = AgregarServicio;
    vm.EliminaServicio = EliminaServicio;
    vm.ServiciosAsignados = [];
    vm.ContieneFree = false;

    /// Inicializa el controlador, obtiene los datos para los campos de selección para el registro de un nuevo
    /// pool de direcciones IP
    this.$onInit = function () {
        configuracionIPFactory.GetBeamList().then(function (data) {
            vm.Beams = data.GetBeamListResult;
        });
        configuracionIPFactory.getServicioList().then(function (data) {
            vm.Servicios = data.GetServicioListResult;
            var objTodos = {
                BaseRemoteIp: null,
                BaseIdUser: 0,
                IdServicio: 0,
                Nombre: "Free",
                Op: 'Null'
            }
            vm.Servicios.push(objTodos);
        });
    }

    /// Valida el formato de la IP ingresada
    function ValidateIPaddress(ipaddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return (true)
        }
        return (false)
    }

    /// Agrega el servicio seleccionado al pool de direcciones que se va a registrar
    function AgregarServicio() {
        if (vm.Servicio != undefined) {
            var bnd = true;
            vm.ServiciosAsignados.forEach(function (item, index) {
                if (item.IdServicio == vm.Servicio.IdServicio) {
                    bnd = false;
                }
            });
            if (bnd) {
                if (vm.Servicio.IdServicio == 0 && vm.ServiciosAsignados.length == 0) {
                    vm.ContieneFree = true;
                }
                else if (vm.Servicio.IdServicio == 0 && vm.ServiciosAsignados.length > 0) {
                    ngNotify.set('No es posible asignar un servicio Free si hay más servicios en la lista', 'warn');
                    return;
                }
                else if (vm.Servicio.IdServicio > 0 && vm.ContieneFree) {
                    ngNotify.set('No es posible agregar otro servicio si ya se asignó un servicio Free', 'warn');
                    return;
                }
                vm.ServiciosAsignados.push(vm.Servicio);
            }
            else {
                ngNotify.set('El servicio seleccionado ya se encuentra en la lista', 'warn');
            }
        }
    }

    /// Elimina el servicio seleccionado de la lista de servicios asignados al pool de direcciones que se va a
    /// registrar
    function EliminaServicio(Servicio) {
        if (Servicio.IdServicio == 0) {
            vm.ContieneFree = false;
        }
        var indexAux = 0;
        vm.ServiciosAsignados.forEach(function (item, index) {
            if (item.IdServicio == Servicio.IdServicio) {
                indexAux = index;
                return;
            }
        });
        vm.ServiciosAsignados.splice(indexAux, 1);
    }

    /// Almacena y registra el pool de direcciones IP con la información capturada y las relaciones creadas
    function GuardaPool() {
        if (ValidateIPaddress(vm.IP)) {
            if (vm.MascaraRed > 0 && vm.MascaraRed <= 32) {
                if(vm.ServiciosAsignados.length > 0) {
                    var ServiciosAux = [];
                    vm.ServiciosAsignados.forEach(function (item, index) {
                        ServiciosAux.push(item.IdServicio);
                    });
                    var parametros = {};
                    var ip = vm.IP.split('.');
                    parametros.IP1 = ip[0];
                    parametros.IP2 = ip[1];
                    parametros.IP3 = ip[2];
                    parametros.IP4 = ip[3];
                    parametros.MascaraRed = vm.MascaraRed;
                    parametros.Beam = vm.Beam.BeamId;
                    parametros.IdServicio = vm.Servicio.IdServicio;
                    parametros.IPv6 = vm.IPv6;
                    parametros.MascaraIPv6 = vm.MascaraIPv6;
                    parametros.MascaraRed4Terminal = vm.MascaraRed4Terminal;
                    parametros.MascaraRed6Terminal = vm.MascaraRed6Terminal;
                    parametros.Servicios = ServiciosAux;
                    console.log(parametros);
                    configuracionIPFactory.guardaPool(parametros).then(function (data) {
                        if (data.GetGuardaPoolListResult[0].Error === 1) {
                            ngNotify.set(data.GetGuardaPoolListResult[0].Mensaje, 'error');
                        }
                        else {
                            $state.go('home.configuracionip.pools');
                            ngNotify.set('Nuevo Pool guardado exitosamente', 'success');
                        }
                    });
                }
                else {
                    ngNotify.set('Agrega al menos un servicio', 'error');
                }
            }
            else {
                ngNotify.set('Introduce una Máscara de Red válida', 'error');
            }
        }
        else {
            ngNotify.set('Introduce una IP válida', 'error');
        }
    }

}
