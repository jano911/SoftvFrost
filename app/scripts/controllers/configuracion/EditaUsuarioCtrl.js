'use strict';

/// Módulo para el controlador Edita Usuario
angular.module('softvFrostApp').controller('EditaUsuarioCtrl', EditaUsuarioCtrl);

function EditaUsuarioCtrl(usuarioFactory, rolFactory, $state, ngNotify, $stateParams) {
  var vm = this;
  vm.titulo = 'Edita Usuario';
  vm.passwordPanel = false;
  vm.ValidatePanel = true;
  vm.editar = false;
  vm.ValidaPass = ValidaPass;
  vm.GuardarUsuario = GuardarUsuario;
  vm.eliminaRelacion = eliminaRelacion;
  vm.guardaRelacion = guardaRelacion;
  vm.userText = true;
  vm.getplazas = getplazas;
  vm.getTecnicosDisponibles = getTecnicosDisponibles;
  vm.guardaRelacion = guardaRelacion;
  vm.eliminaRelacion = eliminaRelacion;
  vm.getplazasClienteDisp=getplazasClienteDisp;
  vm.guardaRelacionCliente=guardaRelacionCliente;
  vm.eliminaRelacionCliente=eliminaRelacionCliente;
  vm.btnsubmit = true;
  vm.obtendetalle=obtendetalle;
  vm.Activo = false;

  /// Inicializa el controlador, obtiene los datos y configuraciones del usuario que se va a editar
  this.$onInit = function () {
    var userid = $stateParams.id;
    usuarioFactory.GetDistribuidores().then(function (data) {
      vm.Distribuidores = data.GetDistribuidoresResult;
      usuarioFactory.GetUserDetail(userid).then(function (data) {
        var user = data.GetUserListbyIdUserResult[0];
        vm.Id = user.IdUsuario;
        rolFactory.GetRoleList().then(function (data) {
          vm.Roles = data.GetRoleListResult;
          for (var a = 0; a < vm.Roles.length; a++) {
            if (vm.Roles[a].IdRol == user.IdRol) {
              vm.Rol = vm.Roles[a];
            }
          }
          vm.Nombre = user.Nombre;
          vm.Correo = user.Email;
          vm.Descripcion = user.Usuario;
          vm.Password = user.Password;
          vm.Contrasena = user.Password;
          vm.RecibeMensaje = (user.RecibeMensaje === null) ? false : user.RecibeMensaje;
          vm.CheckMemoria = (user.CheckMemoria === null) ? false : user.CheckMemoria;
          vm.Cliente=user.Cliente;
          vm.Activo = (user.Estado === null) ? false : user.Estado;
          vm.LUITerminal = user.LUITerminal;
          if(user.Cliente){
            GetObtieneCompaniasUsuario();
          }else{
            getUsuariostecnicos();
          }
          
        });
      });
    });
  }

  /// Obtiene lista de plazas disponibles para el cliente
  function getplazasClienteDisp(){
		usuarioFactory.GetObtieneCompaniasLibres(vm.Id,vm.distribuidorcliente.Clave).then(function (data) {
			vm.PlazasClienteDis = data.GetObtieneCompaniasLibresResult;
		});		
	}

  /// Almacena la relación creada entre el cliente y el distribuidor y plaza seleccionados
	function guardaRelacionCliente(){
		var arr=[];
		arr.push({
			'IdCompania':vm.plazaCliente.IdCompania,
			'Accion':1
		})
		usuarioFactory.GetGuardaRelacionUsuarioCompania(vm.Id,arr).then(function(result){
			  ngNotify.set('La relación Usuario-Plaza se ha guardado correctamente','success');
			  getplazasClienteDisp();
			  GetObtieneCompaniasUsuario();
		});
	}

  /// Elimina la relación de técnico y distribuidor del cliente
  function eliminaRelacion(item) {
    var tecnicos = [];
    var tec = {
      'IdEntidad': item.IdEntidad,
      'Nombre': item.Nombre,
      'Accion': 2
    }
    tecnicos.push(tec);
    usuarioFactory.GetGuardaRelacionUsuarioTecnico(vm.Id, tecnicos).then(function (result) {
      getUsuariostecnicos();
    });
  }

  /// Almacena la relacion entre el cliente y el distribuidor y téncico seleccionados
  function guardaRelacion() {
    var tecnicos = [];
    var tec = {
      'IdEntidad': vm.tecnicolibre.IdEntidad,
      'Nombre': vm.tecnicolibre.Nombre,
      'Accion': 1
    }
    tecnicos.push(tec);
    usuarioFactory.GetGuardaRelacionUsuarioTecnico(vm.Id, tecnicos).then(function (result) {
      getUsuariostecnicos();

    });
  }

  /// Obtiene una lista de técnicos disponibles para el cliente
  function getTecnicosDisponibles() {
    usuarioFactory.GetObtieneTecnicosLibres(vm.Id, vm.plaza.Clave, vm.distribuidor.Clave).then(function (data) {
      vm.tecnicoslibres = data.GetObtieneTecnicosLibresResult;
    });
  }

  /// Obtiene lista de todas las plazas registradas
  function getplazas() {
    usuarioFactory.GetPlazas(vm.distribuidor.Clave).then(function (data) {
      vm.Plazas = data.GetPlazasResult;
    });
  }

  /// Obtiene lista de todos los técnicos registrados por usuario
  function getUsuariostecnicos() {
    usuarioFactory.GetObtieneTecnicosUsuario(vm.Id).then(function (data) {
      vm.tecnicosUsuario = data.GetObtieneTecnicosUsuarioResult;
    });
  }

  /// Obtiene lista de detalle de plazas o técnicos en base al cliente seleccionado
  function obtendetalle(){
    if(vm.Cliente){
      GetObtieneCompaniasUsuario();
    }else{
      getUsuariostecnicos();
    }
 }

  /// Actualiza y guarda los cambios realizados en el usuario correspondiente
  function GuardarUsuario() {
    if (vm.editar) {
      if (vm.Contrasena === vm.Contrasena2) {
        var obj = {};
        obj.IdUsuario = vm.Id;
        obj.IdRol = vm.Rol.IdRol;
        obj.Nombre = vm.Nombre;
        obj.Email = vm.Correo;
        obj.Usuario = vm.Descripcion;
        obj.Password = vm.Contrasena;
        obj.RecibeMensaje = vm.RecibeMensaje;
        obj.CheckMemoria = vm.CheckMemoria;
        obj.Cliente=vm.Cliente;
        obj.Estado = vm.Activo;
        obj.LUITerminal = vm.LUITerminal;
        usuarioFactory.UpdateUsuario(obj).then(function (data) {
          $state.go('home.provision.usuarios');
          ngNotify.set('Usuario editado correctamente.', 'success');
        });
      } else {
        ngNotify.set('Las contraseña no coinciden.', 'error');
      }
    } else {
      var obj = {};
      obj.IdUsuario = vm.Id;
      obj.IdRol = vm.Rol.IdRol;
      obj.Nombre = vm.Nombre;
      obj.Email = vm.Correo;
      obj.Usuario = vm.Descripcion;
      obj.Password = vm.Contrasena;
      obj.RecibeMensaje = vm.RecibeMensaje;
      obj.CheckMemoria = vm.CheckMemoria;
      obj.Cliente=vm.Cliente;
      obj.Estado = vm.Activo;
      obj.LUITerminal = vm.LUITerminal;
      //console.log(obj);
      usuarioFactory.UpdateUsuario(obj).then(function (data) {
        $state.go('home.provision.usuarios');
        ngNotify.set('Usuario editado correctamente.', 'success');
      });
    }


  }

  /// Elimina la relación de plaza y distribuidor del cliente
	function eliminaRelacionCliente(x){
		var arr=[];
		arr.push({
			'IdCompania':x.IdCompania,
			'Accion':2
		})
		usuarioFactory.GetGuardaRelacionUsuarioCompania(vm.Id,arr).then(function(result){
			  ngNotify.set('La relación Usuario-Plaza se ha eliminado correctamente','warn');
			  getplazasClienteDisp();
			  GetObtieneCompaniasUsuario();
		});
  }
  
  /// Obtiene listado de distribuidores para lista de selección para egregar relación de técnicos
  function GetObtieneCompaniasUsuario(){
		usuarioFactory.GetObtieneCompaniasUsuario(vm.Id).then(function(result){
          vm.relacionCliente=result.GetObtieneCompaniasUsuarioResult;
		});
	}

  /// Valida que la contraseña capturada sea correcta para poder ser actualizada
  function ValidaPass() {
    if (vm.PassValidate === vm.Password) {
      vm.editar = true;
      vm.Contrasena = '';
      vm.ValidatePanel = false;
      vm.passwordPanel = true;
    } else {
      ngNotify.set('Contraseña no es  válida', 'error');
    }
  }
}
