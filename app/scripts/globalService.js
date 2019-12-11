'use strict';
angular.module('softvFrostApp')

  .service('globalService', function () {
    var svc = {};

    //firebase
    //bossfirebase@gmail.com
    //0601x-2L


    
     //rutas servidor producción
       svc.getUrl = function () {
        return 'http://189.254.231.35:9091/SoftvWCFService.svc';
      };

      svc.getUrlReportes = function () {
        return 'http://189.254.231.35:9091/';
      };
 
      svc.getUrlmemoriatecnica = function () {
      return 'http://189.254.231.35:12121/MemoriaTecnica/SoftvWCFService.svc';
    
     };
 
     svc.getUrlmemoriatecnicareportes = function () {
     return 'http://189.254.231.35:12121/MemoriaTecnica';
   
     };
 
     svc.getUrlmemoriatecnicaImages = function () {
      return 'http://189.254.231.35:12121/MemoriaTecnica/MemoriaTecnica';   
     };
 
 
      svc.getUrlHughesService = function () {
        return 'http://189.254.231.35:9092/SoftvFrostAPI';
        //return 'http://localhost:21590/SoftvFrostAPI';
      };
 
      svc.getUrlBeams = function () {
        return 'http://189.254.231.35/beams/';
      };
 
      svc.getUrlHughesMonitoreo = function () {
        return 'http://189.254.231.35:9090/api';
      //return 'http://localhost:50914/api';
      };
 
      svc.getType = function () {
        return 'TEV';
      };  
    
  /*
    //rutas locales
     svc.getUrl = function () {
      return  'http://localhost:64481/SoftvWCFService.svc';
      //return 'http://192.168.50.122:8020/SoftvWCFService.svc';
      //return 'http://172.16.126.44:8089/SoftvWCFService.svc';
      //return  'http://localhost:80/SoftvWCFService.svc';
    };

    svc.getUrlReportes = function () {
      //return 'http://192.168.50.122:8020';
      return  'http://localhost:64481/SoftvWCFService.svc';
      //return  'http://localhost:80';
    };

    svc.getUrlmemoriatecnica = function () {
      return 'http://192.168.50.122:8025/SoftvWCFService.svc';
      //return 'http://localhost:64482/SoftvWCFService.svc';
      //return 'http://localhost:85/SoftvWCFService.svc';
    };

    svc.getUrlmemoriatecnicareportes = function () {
      return 'http://192.168.50.122:8025';
      //return 'http://localhost:64482';
      //return 'http://localhost:85';
    };

    svc.getUrlmemoriatecnicaImages = function () {
      return 'http://192.168.50.122:8025/MemoriaTecnica';
      //return 'http://localhost:64482/MemoriaTecnica';
      //return 'http://localhost:85/MemoriaTecnica';
    };

    svc.getUrlHughesService = function () {//SoftvForstAPI local
      return 'http://192.168.50.122:8020/HughesAPI/SoftvFrostAPI';
      //return 'http://189.254.231.35:9092/SoftvFrostAPI';
      //return "http://localhost:21590/SoftvFrostAPI";
    };

    svc.getUrlBeams = function () {
      return 'http://189.254.231.35/beams/';
    };

    svc.getUrlHughesMonitoreo = function () {
      //return 'http://localhost:50914/api';
      return 'http://192.168.50.122:8020/BossMonitoreo/api';
      //return 'http://localhost:90/api';
    };

    svc.getType = function () {
      return 'TEV';
    };
 */

/*
        //rutas server de pruebas
     svc.getUrl = function () {
       //  return 'http://172.16.126.44:3000/SoftvWCFService.svc';     
       return 'http://172.16.126.44:3000/SoftvWCFService.svc';
     };
 
     svc.getUrlReportes = function () {
       return 'http://172.16.126.44:3000/';
 
     };
 
     svc.getUrlmemoriatecnica = function () {
       return 'http://172.16.126.44:3500/SoftvWCFService.svc';
 
     };
 
     svc.getUrlmemoriatecnicareportes = function () {
       return 'http://172.16.126.44:3500';
 
     };
 
     svc.getUrlmemoriatecnicaImages = function () {
       return 'http://172.16.126.44:3500/MemoriaTecnica';
 
     };
 
     svc.getUrlHughesService = function () {
       return 'http://172.16.126.44:3000/BossAPI/SoftvFrostAPI';
     };
 
     svc.getUrlBeams = function () {
       return 'http://189.254.231.35/beams/';
     };
 
     svc.getUrlHughesMonitoreo = function () {
       return 'http://172.16.126.44:3000/BossMonitoreo/api';
     };
 
     svc.getType = function () {
       return 'TEV';
     }; 
  */
 
  
    return svc;
  });

