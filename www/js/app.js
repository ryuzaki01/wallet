'use strict';

define([
  'jquery',
  'kendo'
], function (
  $,
  kendo
) {
  var $body = $('body');
  return {
    init: function () {
      kendoApp = new kendo.mobile.Application($('#body'), {
        skin: "material",
        init: function () {
          if (!IsDesktop) {
            navigator.splashscreen.hide();
          }
          App.loadDatabase();
        }
      });
    },

    loadDatabase: function () {
      var incomes = [];
      db.transaction(function (transaction) {
        transaction.executeSql('SELECT id, amount, name FROM income;', [],
          function (transaction, result) {
            if (result != null && result.rows != null) {
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                incomes.push(row);
              }
            }
          },
          DBHandler.errorHandler
        );
      }, DBHandler.errorHandler, function () {
        App.data.income.data(incomes);
      });

      //$("#playlist-select").kendoMobileListView({
      //  dataSource: App.data.playLists,
      //  template: $("#playlist-select-template").text()
      //});
    },

    backPressed: function () {
      if (app.views.home.drawer) {
        $("#drawer").data("kendoMobileDrawer").hide();
        app.views.home.drawerOnHide();
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

    views: {
      index: indexView,
      pemasukan: pemasukanView
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
