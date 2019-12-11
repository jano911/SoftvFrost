'use strict';
angular
  .module('softvFrostApp')
  .controller('detallememoriatecnicaCtrl',
    function ($state, ngNotify, memoriaFactory, $localStorage, $stateParams, FileUploader, globalService, Lightbox) {
      function initialData() {
        memoriaFactory.GetObtieneMemoriaTecnica(vm.id).then(function (data) {

          vm.OrdenInstalacion = data.GetObtieneMemoriaTecnicaResult[0].OrdenInstalacion;

          detalle(data.GetObtieneMemoriaTecnicaResult[0]);
          memoriaFactory.GetObtieneImagenesMemoriaTecnica(vm.id).then(function (response) {
            vm.Lista_evidenciasVS = [];
            vm.Lista_evidencias = [];
            var Lista_evidencias = response.GetObtieneImagenesMemoriaTecnicaResult;
            Lista_evidencias.forEach(function (item) {
              item.Ruta = item.Ruta;
              item.url = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
              item.thumbUrl = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
              item.RutaCompleta = globalService.getUrlmemoriatecnicaImages() + '/' + item.Ruta;
              item.Opcion = 2;
              if (item.ValidacionEnSitio) {
                vm.Lista_evidenciasVS.push(item);
              }
              else {
                vm.Lista_evidencias.push(item);
              }
            });

            memoriaFactory.GetObtieneObservacionesMemoriaTecnica(vm.id).then(function (result) {
              var notas = result.GetObtieneObservacionesMemoriaTecnicaResult;
              notas.forEach(function (item) {
                var obj = {};
                obj.Observacion = item.Observacion;
                obj.IdUsuario = 0;
                obj.IdObservacion = 0;
                obj.Fecha = item.Fecha;
                obj.Nombre = item.Nombre;
                vm.notas_ant.push(obj);

              });
            });

            memoriaFactory.GetObtieneEquiposSustituir(vm.id).then(function (result) {
              var eq = result.GetObtieneEquiposSustituirResult;
              eq.forEach(function (item) {
                var equipo = {};
                equipo.IdEquipoSustituir = item.IdEquipoSustituir;
                equipo.IdMemoriaTecnica = item.IdMemoriaTecnica;
                equipo.Equipo = item.Equipo;
                equipo.SerieAnterior = item.SerieAnterior;
                equipo.SerieNueva = item.SerieNueva;
                equipo.Opcion = 2;
                vm.cambios.push(equipo);
              });
              memoriaFactory.GetObtieneDigitalMemoriaTecnica(vm.id).then(function (result) {
                var ed = result.GetObtieneDigitalMemoriaTecnicaResult;
                ed.forEach(function (item) {
                  var equipodig = {};
                  equipodig.IdEquipoSustituir = item.IdEquipoSustituir;
                  equipodig.IdMemoriaTecnica = item.IdMemoriaTecnica;
                  equipodig.Equipo = item.Equipo;
                  equipodig.SerieAnterior = item.SerieAnterior;
                  equipodig.paquete = item.paquete;
                  equipodig.Opcion = 2;
                  vm.aparatosdigitales.push(equipodig);
                });

                memoriaFactory.GetEstatusTecnico().then(function (estatus) {
                  vm.listEstatus = estatus.GetEstatusTecnicoResult;
                  vm.listEstatus.forEach(function (item, index) {
                    if (item.IdEstatusTecnico === vm.IdEstatusTecnico) {
                      vm.estatustecnico = vm.listEstatus[index];
                    }
                  });

                  memoriaFactory.GetTipoServicio().then(function (tipos) {
                    vm.listTiposerv = tipos.GetTipoServicioResult;
                    vm.listTiposerv.forEach(function (item, index) {
                      if (item.IdTipoServicio === vm.IdTipoServicio) {
                        vm.tiposervicio = vm.listTiposerv[index];
                      }
                    });
                    if (vm.IdAntena > 0) {
                      catalogosMemoriaFactory.GetObtieneAntenasCatalogo().then(function (data) {
                        var antenasTamanos = data.GetObtieneAntenasCatalogoResult;
                        vm.antenasTamanos = [];
                        antenasTamanos.forEach(function (item) {
                          if (item.IdAntena == vm.IdAntena) {
                            vm.antenaTamano = item;
                          }
                          if (item.Activo) {
                            vm.antenasTamanos.push(item);
                          }
                          else if (item.Activo == false && item.IdAntena == vm.IdAntena) {
                            vm.antenasTamanos.push(item);
                          }
                        });
                      });
                    }
                  });
                });
              });
            });
          });
        });
      }

      function getApartos(modem, radio, router, antena, ups, idtecnico) {

        memoriaFactory.GetAparatosTecnico(1, vm.numeroorden, idtecnico, vm.IdMemoriaTecnica).then(function (aparatos) {
          vm.listModem = aparatos.GetAparatosTecnicoResult;
          if (vm.numerofolio) {
            vm.listModem.push({
              'Clv_CableModem': 0,
              'Descripcion': (modem) ? modem : '',
              'Servicio': ''
            });
          }


          vm.listModem.forEach(function (item, index) {
            if (item.Descripcion === modem) {
              vm.modem = vm.listModem[index];
            }
          });

          memoriaFactory.GetAparatosTecnico(2, vm.numeroorden, idtecnico, vm.IdMemoriaTecnica).then(function (aparatos) {
            vm.listRadio = aparatos.GetAparatosTecnicoResult;

            if (vm.numerofolio) {
              vm.listRadio.push({
                'Clv_CableModem': 0,
                'Descripcion': (radio) ? radio : '',
                'Servicio': ''
              });
            }

            vm.listRadio.forEach(function (item, index) {
              if (item.Descripcion === radio) {
                vm.serieradio = vm.listRadio[index];
              }
            });

            memoriaFactory.GetAparatosTecnico(3, vm.numeroorden, idtecnico, vm.IdMemoriaTecnica).then(function (aparatos) {
              vm.listRouter = aparatos.GetAparatosTecnicoResult;

              if (vm.numerofolio) {
                vm.listRouter.push({
                  'Clv_CableModem': 0,
                  'Descripcion': (router) ? router : '',
                  'Servicio': ''
                });
              }

              vm.listRouter.forEach(function (item, index) {
                if (item.Descripcion === router) {
                  vm.serierouter = vm.listRouter[index];
                }
              });


              memoriaFactory.GetAparatosTecnico(4, vm.numeroorden, idtecnico, vm.IdMemoriaTecnica).then(function (aparatos) {
                vm.listSTB = aparatos.GetAparatosTecnicoResult;


                memoriaFactory.GetAparatosTecnico(5, vm.numeroorden, idtecnico, vm.IdMemoriaTecnica).then(function (aparatos) {
                  vm.listAntena = aparatos.GetAparatosTecnicoResult;

                  if (vm.numerofolio) {
                    vm.listAntena.push({
                      'Clv_CableModem': 0,
                      'Descripcion': (antena) ? antena : '',
                      'Servicio': ''
                    });
                  }

                  vm.listAntena.forEach(function (item, index) {
                    if (item.Descripcion === antena) {
                      vm.antena = vm.listAntena[index];
                    }
                  });

                  memoriaFactory.GetAparatosTecnico(6, vm.numeroorden, idtecnico, vm.IdMemoriaTecnica).then(function (aparatos) {
                    vm.listUPS = aparatos.GetAparatosTecnicoResult;

                    if (vm.numerofolio) {
                      vm.listUPS.push({
                        'Clv_CableModem': 0,
                        'Descripcion': (ups) ? ups : '',
                        'Servicio': ''
                      });
                    }

                    vm.listUPS.forEach(function (item, index) {
                      if (item.Descripcion === ups) {
                        vm.upsserie = vm.listUPS[index];
                      }
                    })
                  });
                });
              });
            });
          });
        });
      }


      function getTecnicos(id, idtecnico, Modem, Radio, Router, Antena, UPS) {
        memoriaFactory.GetTecnicosMemoriaTecnica(id, 'C', vm.IdMemoriaTecnica).then(function (tecnicos) {
          vm.listTecnicos = tecnicos.GetTecnicosMemoriaTecnicaResult;
          vm.listTecnicos.forEach(function (item, index) {
            if (item.IdEntidad === idtecnico) {
              vm.instalador = vm.listTecnicos[index];
            }
          });

          getApartos(Modem, Radio, Router, Antena, UPS, idtecnico);
        });
      }

      function detalle(det) {
        vm.usuariosistema = det.Instalador;
        vm.Apuntamiento = det.Apuntamiento;
        vm.tamanoantena = det.Antena;
        vm.beam = det.Beam;
        vm.CambioComponentes = det.CambioComponentes;
        vm.celular = det.Celular;
        vm.cliente = det.Cliente;
        vm.numeroorden = det.Clv_Orden;
        vm.codigopostal = det.CodigoPostal;
        vm.contrato = det.Contrato;
        vm.detalleinstalacion = det.Detalles;
        vm.direccion = det.Direccion;
        vm.distribuidor = det.Distribuidor;
        vm.domicilionotificacion = det.DomicilioNotificacion;
        vm.estado = det.Estado;
        vm.estatustecnico = det.EstatusTecnico;
        vm.fechacaptura = det.Fecha;
        var fecAux = moment(det.FechaActivacion, 'DD-MM-YYYY').toDate();
        //console.log('Prueba',fecAux);
        vm.fechaactivacion = new Date(fecAux);//$filter('date')(det.FechaActivacion, 'dd/MM/yyyy');//det.FechaActivacion;
        //vm.fechaactivacion = det.FechaActivacion;
        vm.fechasitio = det.FechaVisita;
        vm.numerofolio = det.Folio;
        vm.horallegada = det.HoraLlegada;
        vm.horasalida = det.HoraSalida;
        vm.IdMemoriaTecnica = det.IdMemoriaTecnica;
        vm.IdUsuario = det.IdUsuario;
        vm.Instalacion = det.Instalacion;
        vm.InstalacionDemo = det.InstalacionDemo;
        vm.latitud = det.Latitud;
        vm.localidad = det.Localidad;
        vm.longitud = det.Longitud;
        vm.Mantenimiento = det.Mantenimiento;
        vm.marcarouter = det.MarcaRouter;
        vm.municipio = det.Municipio;
        vm.recibe = det.PersonaRecibe;
        vm.plataforma = det.Plataforma;
        vm.Reubicacion = det.Reubicacion;
        vm.SAN = det.SAN;
        vm.sqf = det.SQF;
        vm.plan = det.Servicio;
        vm.siteid = det.SiteId;
        vm.SiteSurvey = det.SiteSurvey;
        vm.telefono = det.Telefono;
        vm.tiposervicio = det.TipoServicio;
        vm.vcfaseneutro = det.VCFaseNeutro;
        vm.vcfasetierra = det.VCFaseTierra;
        vm.vcneutrotierra = det.VCNeutroTierra;
        vm.upcfaseneutro = det.VUPSFaseNeutro;
        vm.upcfasetierra = det.VUPSFaseTierra;
        vm.upcneutrotierra = det.VUPSNeutroTierra;
        vm.velocidad = det.Velocidad;
        vm.wifiserie = det.WiFi;
        vm.numeroorden = det.Clv_Orden;
        vm.PersonaValidaServicio = det.PersonaValidaServicio;
        vm.Combo = det.Combo;
        vm.contratocompania = det.contratocompania;
        vm.IdEstatusTecnico = det.IdEstatusTecnico;
        vm.IdTipoServicio = det.IdTipoServicio;
        vm.IdAntena = det.IdAntena;
        if (vm.OrdenInstalacion) {
          vm.CambioDeEquipos = false;
          if (det.Proveedor == 'AZ3' || det.Proveedor == 'Norte' || det.Proveedor == 'AZ5') {
            vm.ActivaFechaActivacion = true;
          }
          else {
            vm.ActivaFechaActivacion = false;
          }
        }
        else {
          vm.CambioDeEquipos = true;
          vm.ActivaFechaActivacion = false;
          vm.modem = det.Modem == undefined ? '' : det.Modem;
          vm.antena = det.AntenaSerie == undefined ? '' : det.AntenaSerie;
          vm.serierouter = det.Router == undefined ? '' : det.Router;
          vm.tamanoantena = det.Antena == undefined ? '' : det.Antena;
          vm.upsserie = det.UPS == undefined ? '' : det.UPS;
          vm.serieradio = det.Radio == undefined ? '' : det.Radio;
        }
        if (vm.IdAntena == 0) {
          vm.MuestraComboAntena = false;
        }
        vm.CodigodeEstado = det.CodigoEstado == undefined ? '' : det.CodigoEstado;
        vm.SQFVS = det.SQFVS == undefined ? '' : det.SQFVS;
        vm.TransmitRate = det.TransmitRate == undefined ? '' : det.TransmitRate;
        vm.PowerAttenuation = det.PowerAttenuation == undefined ? '' : det.PowerAttenuation;
        if (vm.PowerAttenuation.length > 0) {
          vm.PowerAttenuations.forEach(function (item, index) {
            if (item.Descripcion === det.PowerAttenuation) {
              vm.PowerAttenuation = item;
            }
          });
        }
        vm.PruebaACP = det.PruebaACP == undefined ? '' : det.PruebaACP;
        vm.VoltajeComercialNT = det.VoltajeComercialNT == undefined ? '' : det.VoltajeComercialNT;
        vm.VoltajeComercialFT = det.VoltajeComercialFT == undefined ? '' : det.VoltajeComercialFT;
        vm.VoltajeComercialFN = det.VoltajeComercialFN == undefined ? '' : det.VoltajeComercialFN;
        vm.PersonaAtiendeSitio = det.PersonaAtiendeSitio == undefined ? '' : det.PersonaAtiendeSitio;
        vm.TelefonoAtiendeSitio = det.TelefonoAtiendeSitio == undefined ? '' : det.TelefonoAtiendeSitio;
        vm.CelularAtiendeSitio = det.CelularAtiendeSitio == undefined ? '' : det.CelularAtiendeSitio;
        vm.EmailAtiendeSitio = det.EmailAtiendeSitio == undefined ? '' : det.EmailAtiendeSitio;
        vm.PersonaAtiendeSitio2 = det.PersonaAtiendeSitio2 == undefined ? '' : det.PersonaAtiendeSitio2;
        vm.TelefonoAtiendeSitio2 = det.TelefonoAtiendeSitio2 == undefined ? '' : det.TelefonoAtiendeSitio2;
        vm.CelularAtiendeSitio2 = det.CelularAtiendeSitio2 == undefined ? '' : det.CelularAtiendeSitio2;
        vm.EmailAtiendeSitio2 = det.EmailAtiendeSitio2 == undefined ? '' : det.EmailAtiendeSitio2;
        if (vm.OrdenInstalacion) {
          getTecnicos(vm.contratocompania.split('-')[1], det.IdTecnico, det.Modem, det.Radio, det.Router, det.AntenaSerie, det.UPS);
        }

      }

      function ActualizarDatosHughes() {
        var parametros = {};
        parametros.Clv_Orden = vm.numeroorden;
        memoriaFactory.GetObtieneDatosHughes(parametros).then(function (result) {
          vm.SQFVS = result.GetObtieneDatosHughesResult.SQF;
          vm.CodigodeEstado = result.GetObtieneDatosHughesResult.CodigoEstado;
        });
      }

      var openLightboxModal =
        function (index) {
          Lightbox.openModal(vm.Lista_evidencias, index);
        };
      var vm = this;
      vm.uploader = new FileUploader();
      vm.uploaderVS = new FileUploader();
      vm.id = $stateParams.id;
      initialData();
      vm.cambios = [];
      vm.notas = [];
      vm.notas_ant = [];
      vm.aparatosdigitales = [];
      vm.openLightboxModal = openLightboxModal;
      vm.showguardar = false;
      vm.seleccionImagen = false;
      vm.titulo = 'Detalle de memoria técnica de servicio #' + vm.id;
      vm.detalle = true;
      vm.CambioDeEquipos = false;
      vm.MuestraComboAntena = true;
      vm.ActualizarDatosHughes = ActualizarDatosHughes;
      vm.PowerAttenuations = [
        {
          'IdPower': 4,
          'Descripcion': '1 db'
        },
        {
          'IdPower': 6,
          'Descripcion': '2 db'
        },
        {
          'IdPower': 1,
          'Descripcion': '3 db'
        },
        {
          'IdPower': 3,
          'Descripcion': '4 db'
        },
        {
          'IdPower': 2,
          'Descripcion': '5 db'
        },
        {
          'IdPower': 5,
          'Descripcion': '6 db'
        },
        {
          'IdPower': 7,
          'Descripcion': '7 db'
        },
        {
          'IdPower': 8,
          'Descripcion': '8 db'
        },
        {
          'IdPower': 9,
          'Descripcion': '9 db'
        },
        {
          'IdPower': 10,
          'Descripcion': '10 db'
        },
        {
          'IdPower': 11,
          'Descripcion': 'Mayor > 10 db'
        }
      ];
      vm.EquiposSustituir = [
        {
          'IdEquipo': 4,
          'Nombre': 'STB'
        },
        {
          'IdEquipo': 6,
          'Nombre': 'UPS'
        },
        {
          'IdEquipo': 1,
          'Nombre': 'Modem'
        },
        {
          'IdEquipo': 3,
          'Nombre': 'Router'
        },
        {
          'IdEquipo': 2,
          'Nombre': 'Radio'
        },
        {
          'IdEquipo': 5,
          'Nombre': 'Antena Internet'
        },
        {
          'IdEquipo': 7,
          'Nombre': 'LNB'
        },
        {
          'IdEquipo': 8,
          'Nombre': 'Antena Digital'
        },
      ];
    });
