'use strict';

/// Módulo para el controlador Edita Servicio
angular.module('softvFrostApp').controller('EditaServicioCtrl', EditaServicioCtrl);

function EditaServicioCtrl(terminalFactory, $state, ngNotify, $stateParams) {
    var vm = this;
    vm.titulo = 'Edita Servicio';
    vm.GuardarServicio = GuardarServicio;

    /// Inicializa el controlador, obtiene los datos del servicio a editar
    this.$onInit = function () {
        var parametros = {};
        parametros.IdServicio = $stateParams.id;
        terminalFactory.GetServicioById(parametros).then(function (data) {
            var servicio = data.GetDeepServicioResult;
            vm.IdServicio = servicio.IdServicio;
            vm.Nombre = servicio.Nombre;
            vm.ProgramCode = servicio.ProgramCode;
            vm.Plan = servicio.Plan;
            vm.PartnerId = servicio.PartnerId;
            vm.Package = servicio.Package;
            vm.Activo = servicio.Activo;
        });
    }

    /// Actualiza y guarda los cambios realizados al servicio correspondiente
    function GuardarServicio() {
        var obj = {};
        obj.IdServicio = vm.IdServicio;
        obj.Nombre = vm.Nombre;
        obj.ProgramCode = vm.ProgramCode;
        obj.Plan = vm.Plan;
        obj.PartnerId = vm.PartnerId;
        obj.Package = vm.Package;
        obj.Activo = vm.Activo;
        terminalFactory.UpdateServicios(obj).then(function (data) {
            if (data.GetUpdateServiciosResult == 0) {
                $state.go('home.provision.servicios');
                ngNotify.set('Servicio editado correctamente.', 'success');
            }
            else {
                ngNotify.set('Ya existe un servicio con el nombre capturado.', 'warn');
            }
        });
    }

    
}
