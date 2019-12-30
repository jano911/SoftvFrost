'use strict';

/// Modulo para el controlador de Memoria Técnica Reportes
angular
  .module('softvFrostApp')
  .controller('memoriatecnicaServicioCtrl', function ($state, ngNotify, memoriaFactory, memoriaServicioFactory, moment, $firebaseArray,
    firebase, globalService, $q, $window, $localStorage, $uibModal) {

    /// Inicializa el controlador, ejecuta procedimientos para obtener la lista de memorias técnicas registradas
    function initialData() {
      vm.RolUsuario = $localStorage.currentUser.idRol;
      BuscaMemoriaTecnica(0);
      memoriaServicioFactory.GetTecnicosMemoriaTecnica(0, 'B', 0).then(function (tecnicos) {
        //console.log(tecnicos);
        vm.listTecnicos = tecnicos.GetTecnicosMemoriaTecnicaServicioResult;
      });
    }

    /// Obtiene el listado de memorias técnicas de reportes y su información relacionada para mostrarla en el
    /// sistema
    function BuscaMemoriaTecnica(op) {
      var params = {
        'Folio': (op === 1) ? vm.folio : '',
        'Fecha': (op === 2) ? vm.fecha : '',
        'IdUsuario': '',
        'ClvQueja': (op === 3) ? vm.queja : 0,
        'op': op,
        'SAN': (op === 4) ? vm.SAN : 0,
        'Cliente': (op === 5) ? vm.cliente : '',
        'Contrato': (op === 7) ? vm.contrato : '',
        'Tecnico': (op === 6) ? vm.tecnico : '',
        'IdTecnico': (op === 9) ? vm.instalador.IdEntidad : 0
      };
      memoriaServicioFactory.BuscaMemoriaTecnica(params)
        .then(function (data) {
          console.log('BuscaMemoriaTecnica',data);
          vm.memorias = data.GetBuscaMemoriaTecnicaListServicioResult;
          vm.memorias.forEach(function (item, index) {
            item.RolUsuario = vm.RolUsuario;
          });
        });
    }

    /// Genera el reporte de la memoria en formato PDF para poder exportarlo
    function reportepdf(id) {

      vm.url = '';
      memoriaServicioFactory.GetReportepdf(id).then(function (data) {
       

        vm.url = globalService.getUrlmemoriatecnicareportes() + '/ReportesPDF/' + data.GetReportepdfServicioResult;
        //  $window.open( vm.url, '_self');
        /* var anchor = angular.element('<a/>');
         anchor.attr({
           href: vm.url,
           target: '_blank',
           download: vm.url
         })[0].click();*/

        var isChrome = !!window.chrome && !!window.chrome.webstore;
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        var isEdge = !isIE && !!window.StyleMedia;


        if (isChrome) {
          var url = window.URL || window.webkitURL;

          var downloadLink = angular.element('<a></a>');
          downloadLink.attr('href', vm.url);
          downloadLink.attr('target', '_self');
          downloadLink.attr('download', 'invoice.pdf');
          downloadLink[0].click();
        } else if (isEdge || isIE) {
          window.navigator.msSaveOrOpenBlob(vm.url, 'invoice.pdf');

        } else {
          var fileURL = vm.url;
          window.open(fileURL);
        }



      });

    }

    /// Genera el reporte de la memoria técnica seleccionada en formato XLS para poder exportarlo
    function getreportexls(id) {
      vm.url = '';
      memoriaServicioFactory.GetReportexls(id).then(function (data) {
      
        vm.url = globalService.getUrlmemoriatecnicareportes() + '/ReportesPDF/' + data.GetReportexlsServicioResult;
        $window.open(vm.url, '_self');

        /* var anchor = angular.element('<a/>');
         anchor.attr({
           href: vm.url,
           target: '_blank',
           download: vm.url
         })[0].click();*/
      });

    }

    /// Genera una nueva memoria técnica de reporte en la base de datos de Firebase
    function add() {
      alert('add');
      var ref = firebase
        .database()
        .ref()
        .child("messages");
      vm.messages = $firebaseArray(ref);
      vm.messages.$add({
        Id: vm.addtest,
        Fecha: moment().format("L"),
        Hora: moment().format("LT"),
        Mensaje: 'Se ha generado una nueva memoria técnica de reporte',
        Tipo: 1
      });
    }

    /// Elimina el nodo correspondiente de la base de datos de Firebase
    function deletechild() {
      var id = vm.deletetest;
      GetdataFire().then(function (result) {
        result.forEach(function (item, index) {
          if (parseInt(item.Id) === parseInt(id)) {
            deleteFile(index).then(function (result) {
            
            });

          }
        });

      });
    }

    var ref = firebase
      .database()
      .ref()
      .child('messages');

    /// Obtiene la información registrada en la base de datos de Firebase
    function GetdataFire() {
      var defered = $q.defer();
      var promise = defered.promise;
      var registros = [];
      var posts = $firebaseArray(ref);
      posts.$loaded().then(function (x) {
        x.forEach(function (item) {
          registros.push(item);
        });
        defered.resolve(registros);
      }).catch(function (err) {
        defered.reject(err)
      });
      return promise;
    }

    /// Elimina la información del registro correspondiente de Firebase
    function deleteFile(index) {
      var defered = $q.defer();
      var promise = defered.promise;
      var posts = $firebaseArray(ref);
      posts.$loaded().then(function (x) {
        posts.$remove(index).then(function (ref) {
          defered.resolve(true);
        });

      }).catch(function (err) {
        defered.reject(false)
      });
      return promise;

    }

    /// Muestra la lista de memorias técnicas en base a los filtros de búsqueda seleccionados
    function FiltrarLista() {
      var Lista = [];
      vm.listTecnicos.forEach(function (item) {
        var itemAux = {};
        itemAux.Descripcion = item.Nombre;
        itemAux.IdEntidad = item.IdEntidad;
        Lista.push(itemAux);
      });
      var Titulo = 'Instalador';
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/memorias/ModalFiltrarLista.html',
        controller: 'ModalFiltrarListaCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        keyboard: false,
        size: "md",
        resolve: {
          Lista: function () {
            return Lista;
          },
          Titulo: function () {
            return Titulo;
          }
        }
      });
      modalInstance.result.then(function (item) {
        vm.instalador = item;
      }, function () {
      });
    }

    var vm = this;
    vm.op = 0;
    vm.BuscaMemoriaTecnica = BuscaMemoriaTecnica;
    vm.reportepdf = reportepdf;
    vm.getreportexls = getreportexls;
    vm.add = add;
    vm.deletechild = deletechild;
    initialData();
    vm.FiltrarLista = FiltrarLista;
  });
