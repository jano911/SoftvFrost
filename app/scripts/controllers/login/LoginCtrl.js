'use strict';

/// Modulo para el controlador de Login
angular.module('softvFrostApp').controller('LoginCtrl', LoginCtrl);

function LoginCtrl(authFactory, ngNotify, $state, $localStorage, $stateParams, $window, $location) {
	var vm = this;
	vm.login = login;
	vm.Prueba = Prueba;
	vm.DesactivaOVT = false;

	/// Inicializa el controlador, obtiene los parametros y las configuraciones para el inicio de sesión
	this.$onInit = function () {
		if($stateParams.ESN != undefined && $stateParams.ESN != '' && $stateParams.antenna_size != undefined && $stateParams.antenna_size != ''){
			$window.open('http://189.254.231.35/ovttool/#!/home/monitoreo/validation?esn=' + $stateParams.ESN + '&antenna_size=' + $stateParams.antenna_size, '_self');
		}
		if ($localStorage.currentUser) {
			if ($stateParams.ESN != undefined) {
				$state.go('home.provision.activacion', {
					'ESN': $stateParams.ESN
				});
			} else {
				$state.go('home.dashboard');
			}
		}
	}

	/// Valida los datos capturados para iniciar sesión con dichas credenciales
	function login() {
		authFactory.login(vm.user, vm.password).then(function (data) {
			if (data) {
				$window.location.reload();
			} else {
				ngNotify.set('Datos de acceso erróneos', 'error');
			}
		});
	}

	/// Procedimiento de prueba para el inicio de sesión
	function Prueba() {
		if ($stateParams.ESN != undefined && $stateParams.ESN != '') {
			$window.open('http://189.254.231.35/ovttool/#!/home/monitoreo/validation?esn=' + $stateParams.ESN, '_blank');
		}
	}
}
