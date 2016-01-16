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
          //tx.executeSql( 'DROP TABLE IF EXISTS store',[],DBHandler.nullHandler,DBHandler.errorHandler);
          //tx.executeSql( 'DROP TABLE IF EXISTS expense',[],DBHandler.nullHandler,DBHandler.errorHandler);
          //tx.executeSql( 'DROP TABLE IF EXISTS target',[],DBHandler.nullHandler,DBHandler.errorHandler);
          //tx.executeSql( 'DROP TABLE IF EXISTS category',[],DBHandler.nullHandler,DBHandler.errorHandler);
          tx.executeSql('CREATE TABLE IF NOT EXISTS store(id INTEGER NOT NULL PRIMARY KEY, name TEXT, value INTEGER, UNIQUE (id) ON CONFLICT REPLACE)', [], DBHandler.nullHandler, DBHandler.errorHandler);
          tx.executeSql('CREATE TABLE IF NOT EXISTS expense(id INTEGER NOT NULL PRIMARY KEY, name TEXT, amount INTEGER, type TEXT, category TEXT, date DATE default CURRENT_DATE, time TIME default CURRENT_TIME, note TEXT, UNIQUE (id) ON CONFLICT REPLACE)', [], DBHandler.nullHandler, DBHandler.errorHandler);
          tx.executeSql('CREATE TABLE IF NOT EXISTS target(id INTEGER NOT NULL PRIMARY KEY, name TEXT, amount INTEGER, amount_paid INTEGER, month INTEGER, date DATE default CURRENT_DATE, UNIQUE (id) ON CONFLICT REPLACE)', [], function (){
            var query = 'INSERT OR IGNORE INTO store (id, name, value) VALUES ';
            var data = [];
            var rowArgs = [];
            App.data.defaultStores.forEach(function (store) {
              rowArgs.push("(?, ?, ?)");
              data.push(store.id);
              data.push(store.name);
              data.push(store.value);
            });
            query += rowArgs.join(", ");
            tx.executeSql(query, data, DBHandler.nullHandler, DBHandler.errorHandler);
          }, DBHandler.errorHandler);
          tx.executeSql('CREATE TABLE IF NOT EXISTS category(id INTEGER NOT NULL PRIMARY KEY, name TEXT, type TEXT, target INTEGER, UNIQUE (id) ON CONFLICT REPLACE)', [], function (){
            var query = 'INSERT OR REPLACE INTO category (id, name, type) VALUES ';
            var data = [];
            var rowArgs = [];
            App.data.defaultCategories.forEach(function (category) {
              rowArgs.push("(?, ?, ?)");
              data.push(category.id);
              data.push(category.name);
              data.push(category.type);
            });
            query += rowArgs.join(", ");
            tx.executeSql(query, data, DBHandler.nullHandler, DBHandler.errorHandler);
          }, DBHandler.errorHandler);
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