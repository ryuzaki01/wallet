'use strict';

define([
  'jquery',
  'kendo',
  'cultureID',
  'views/index',
  'views/tambah',
  'views/target',
  'views/kalender',
  'data',
  'serializeObject'
], function (
  $,
  kendo,
  cultureID,
  indexView,
  tambahView,
  targetView,
  kalenderView,
  data
) {
  var $body = $('body');
  return {
    interval: 0,
    init: function () {
      kendo.culture("id-ID");
      kendoApp = new kendo.mobile.Application($('#body'), {
        skin: "nova",
        init: function () {
          if (!IsDesktop && navigator.splashscreen) {
            navigator.splashscreen.hide();
          }
          App.loadDayData(App.loadDatabase);
          App.loadTargetData();
        }
      });
    },

    views: {
      index: indexView,
      tambah: tambahView,
      target : targetView,
      kalender: kalenderView
    },

    totalIncome: 0,
    totalExpense: 0,
    totalMoney: 0,

    data: data,

    loadDayData: function (cb) {
      var $homeDay = $('#home-day');
      var date = new Date();
      if (App.interval !== 0) {
        date.setDate(date.getDate() + App.interval);
        $homeDay.text(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
      } else {
        $homeDay.text('Hari Ini');
      }
      db.transaction(function (transaction) {
        var data = {
          income: [],
          expense: []
        };
        transaction.executeSql('SELECT * FROM expense WHERE date = ?;',
          [
            date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          ],
          function (transaction, result) {
            if (result != null && result.rows != null) {
              App.totalIncome = 0;
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                var type = row.type || 'expense';
                data[type].push(row);
                App.totalIncome += parseInt(row.amount);
              }
              App.data.income.data(data.income);
              App.data.expense.data(data.expense);
            }
          },
          DBHandler.errorHandler
        );
      }, DBHandler.errorHandler, function () {
        if (typeof cb === 'function') {
          cb.call();
        }
      });
    },

    loadDatabase: function (cb) {
      var date = new Date();
      var endMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM expense WHERE date BETWEEN ? AND ?;',
          [
            date.getFullYear() + '-' + (date.getMonth() + 1) + '-1',
            date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + endMonthDate.getDate()
          ],
          function (transaction, result) {
            if (result != null && result.rows != null) {
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                App.data.schedule.add({
                  start: new Date(row.date + ' ' + row.time),
                  end: new Date(row.date + ' ' + row.time),
                  title: row.name + ' - Rp ' + row.amount,
                  type: row.type
                });
              }
            }
          },
          DBHandler.errorHandler
        );
      }, DBHandler.errorHandler, function () {
        if (typeof cb === 'function') {
          cb.call();
        }
      });
    },

    loadTargetData: function (cb) {
      db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM target;', [],
          function (transaction, result) {
            if (result != null && result.rows != null) {
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                App.data.target.add(row);
              }
            }
          },
          DBHandler.errorHandler
        );
      }, DBHandler.errorHandler, function () {
        if (typeof cb === 'function') {
          cb.call();
        }
      });
    },

    prevDay: function () {
      App.interval -= 1;
      App.loadDayData();
    },

    nextDay: function () {
      App.interval += 1;
      App.loadDayData();
    },

    backPressed: function () {
      if (App.drawer) {
        $("#drawer").data("kendoMobileDrawer").hide();
        App.drawerOnHide();
      } else {
        var currentTime = new Date();
        if ((currentTime - lastPressExit) > 5000) {
          Toast.shortshow('Press back again to exit.');
          lastPressExit = currentTime;
        } else {
          navigator.app.exitApp();
        }
      }
    },

    drawer: false,

    drawerOnShow: function(){
      App.drawer = true;
    },
    drawerOnHide: function(){
      App.drawer = false;
    },

    menuPressed: function(){
      if(App.drawer){
        $("#drawer").data("kendoMobileDrawer").hide();
        App.drawerOnHide();
      } else {
        $("#drawer").data("kendoMobileDrawer").show();
        App.drawerOnShow();
      }
    },

    // Get value of query hash by param name
    getParam: function (name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(window.location.search);
      return results === null ?
        '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    // Get the value of cookie given a cookie key
    // =([^;]+) get the matching value between = and anything before ";"
    getCookie: function (name) {
      var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
      if (match) {
        return match[1];
      } else {
        return false;
      }
    }
  };
});
