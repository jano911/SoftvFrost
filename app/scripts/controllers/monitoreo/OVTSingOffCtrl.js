'use strict';

/// Modulo para el controlador de OVT Sign Off
angular
	.module('softvFrostApp')
	.controller('OVTSingOffCtrl',
		function($uibModalInstance, $uibModal, token, OVTFactory, ngNotify) {

			/// Inicializa el controlador, obtiene la información correspondiente
			this.$onInit = function() {
				
				var objv = {};
				objv.token = token;
				objv.url = 'sign_off.json';
				objv.Jdata = '';
				objv.method = 'OVTGET';
				OVTFactory.DataOVT(objv).then(function(data) {
					var headers = JSON.parse(data);
					vm.headers = headers;
					vm.fso = headers.siteOrder.fso;
					vm.san = headers.san;
					vm.visittype = headers.siteOrder.visitType;

					var objmodel = {};
					objmodel.token = token;
					objmodel.url = 'install_sign_off/model.json';
					objmodel.Jdata = '';
					objmodel.method = 'OVTGET';
					OVTFactory.DataOVT(objmodel).then(function(datamodel) {
						
						vm.visittype = false;
						vm.sight = false;
						vm.modemsoftware = false;
						vm.noinstallation = false;
						vm.other = false;
						vm.NOCC = false;
						vm.dish = false;
						vm.modem = false;
						vm.power = false;
						vm.radio = false;
						vm.repaired = false;
						vm.feedhorn = false;
						vm.customersoft = false;
						vm.DetailProblem = false;
					});
				});
			}

			/// Cancela el procedimiento actual
			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			/// Realiza el procedimiento de Sign Off configurando los datos correspondientes
			function SingOff() {
				var data2 = {
					"signOffData": null,
					"fso": vm.fso,
					"createdBy": null,
					"createdDttm": null,
					"isAot": vm.visittype,
					"isBrokenConn": false,
					"isCablePrb": false,
					"isConnPrb": false,
					"isCustRefusedInstall": vm.customerRefused,
					"isDidNotPowerOn": false,
					"isDmgFeedhornOrCover": false,
					"isEquipSwRouterPrb": false,
					"isGbPrb": false,
					"isLineOfSight": vm.sight,
					"isModemLanPrb": false,
					"isModemSwInsProcPrb": vm.modemsoftware,
					"isMovedObstruction": false,
					"isNoProblem": vm.noinstallation,
					"isNoSignal": false,
					"isNoccT3CorrectedNwPrb": vm.NOCC,
					"isOther": vm.other,
					"isRadioShorted": false,
					"isReplacedDish": vm.dish,
					"isReplacedModem": vm.modem,
					"isReplacedPowerSupply": vm.power,
					"isReplacedRadio": vm.radio,
					"isRrCblconnGbWeather": vm.repaired,
					"isRrFeedhornPolarizer": vm.feedhorn,
					"modemSn": null,
					"notesCustEquipSwRouterPrb": vm.customersoft,
					"notesCustRefusedInstall": vm.DetailProblem,
					"notesInstallationDetails": vm.DetailProblem,
					"notesLineOfSight": vm.DetailProblem,
					"notesModemSwInsProcPrb": vm.DetailProblem,
					"notesNoccT3CorrectedNwPrb": vm.DetailProblem,
					"notesOther": vm.DetailProblem,
					"notesReplacedDish": vm.DetailProblem,
					"notesReplacedModem": vm.DetailProblem,
					"notesReplacedPowerSupply": vm.DetailProblem,
					"notesReplacedRadio": vm.DetailProblem,
					"notesRrCblconnGbWeather": vm.DetailProblem,
					"notesRrFeedhornPolarizer": vm.DetailProblem,
					"oduSn": null,
					"odusnCurr": null,
					"updatedBy": null,
					"updatedDttm": null
				};



				var objv = {};
				objv.token = token;
				objv.url = 'install_sign_off/create.json';
				objv.Jdata = JSON.stringify({
					'signOffData': data2
				});
				objv.method = 'OVTPOST';
				OVTFactory.DataOVT(objv).then(function(data) {
					if (data == "ERROR") {
						ngNotify.set('The signoff installation cannot be performed', 'error');

					} else {
						var error = JSON.parse(data);
						ngNotify.set(error.message, 'grimace');
					}
				});
			};



			var vm = this;
			vm.cancel = cancel;
			vm.SingOff = SingOff;
			vm.visittype = false;
			vm.sight = false;
			vm.modemsoftware = false;
			vm.noinstallation = false;
			vm.other = false;
			vm.NOCC = false;
			vm.dish = false;
			vm.modem = false;
			vm.power = false;
			vm.radio = false;
			vm.repaired = false;
			vm.feedhorn = false;
			vm.customersoft = false;
			vm.DetailProblem = false;
		});
