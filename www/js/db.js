define(["jquery", "kendo", "data"], function ($, kendo, data) {
  var shortName = 'DompetIbu';
  var version = '1.0';
  var displayName = 'Dompet Ibu';
  var maxSize = 65535;

  return {
    init: function () {
      console.log("DATABASE: loading database..");

      if (!window.openDatabase) {
        console.log('Databases are not supported in this browser.');
        return;
      }

      db = openDatabase(shortName, version, displayName, maxSize);

      db.transaction(function (tx) {
          //tx.executeSql( 'DROP TABLE IF EXISTS expense',[],DBHandler.nullHandler,DBHandler.errorHandler);
          //tx.executeSql( 'DROP TABLE IF EXISTS target',[],DBHandler.nullHandler,DBHandler.errorHandler);
          tx.executeSql('CREATE TABLE IF NOT EXISTS expense(id INTEGER NOT NULL PRIMARY KEY, name TEXT, amount INTEGER, type TEXT, category TEXT, date DATE default CURRENT_DATE, time TIME default CURRENT_TIME, note TEXT, UNIQUE (id) ON CONFLICT REPLACE)', [], DBHandler.nullHandler, DBHandler.errorHandler);
          tx.executeSql('CREATE TABLE IF NOT EXISTS target(id INTEGER NOT NULL PRIMARY KEY, name TEXT, amount INTEGER, month INTEGER, date DATE default CURRENT_DATE, note TEXT, UNIQUE (id) ON CONFLICT REPLACE)', [], DBHandler.nullHandler, DBHandler.errorHandler);
        },
        DBHandler.errorHandler, function () {
          //app.onDeviceReady();
          App.init();
        });
    },
    errorHandler: function (transaction, error) {
      if (error) {
        console.log('Error: ' + error.message + ' code: ' + error.code);
      }
    },
    nullHandler: function (tx) {
      //return console.log('null handled ');
    }

  }

});