'use strict';

define([
  'jquery',
  'kendo',
  'cultureID',
  'views/index',
  'views/tambah',
  'views/target',
  'views/tambahTarget',
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
  tambahTargetView,
  kalenderView,
  data
) {
  var $body = $('body');
  return {
    interval: 0,
    currentView: false,
    currentDate: new Date(),
    notification: $("#notification").kendoNotification({
      autoHideAfter: 2000
    }).data("kendoNotification"),
    model: kendo.observable({
      totalSaldo: 0,
      totalSaldoText: function() {
        return kendo.toString(this.get("totalSaldo"), "c0");
      },
      income: 0,
      incomeText: function() {
        return kendo.toString(this.get("income"), "c0");
      },
      expense: 0,
      expenseText: function() {
        return kendo.toString(this.get("expense"), "c0");
      },
      saldo: 0,
      saldoText: function() {
        return kendo.toString(App.model.get("saldo"), "c0");
      }
    }),
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
          App.loadStoreData();
        }
      });

      $('input:not([type="checkbox"]):not([type="radio"]), textarea').on('click', function () {
        if(App.currentView.scroller) {
          App.currentView.scroller.scrollTo(0, - ($(this).offset().top  + App.currentView.scroller.scrollTop - 100));
        }
      });
    },

    views: {
      index: indexView,
      tambah: tambahView,
      target : targetView,
      tambahTarget: tambahTargetView,
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
        $homeDay.text(kendo.toString(date, 'd MMM yyyy'));
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
            kendo.toString(date, 'yyyy-MM-dd')
          ],
          function (transaction, result) {
            if (result != null && result.rows != null) {
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                var type = row.type || 'expense';
                data[type].push(row);
              }
              App.data.income.data(data.income);
              App.data.expense.data(data.expense);
              App.loadStoreData();
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
      var startMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
      var endMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM expense WHERE date BETWEEN ? AND ?;',
          [
            kendo.toString(startMonthDate, 'yyyy-MM-dd'),
            kendo.toString(endMonthDate, 'yyyy-MM-dd')
          ],
          function (transaction, result) {
            if (result != null && result.rows != null) {
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                var start = new Date(row.date + ' ' + row.time);
                var end = start;
                end.setHours(end.getHours() + 1);

                App.data.schedule.add({
                  start: start,
                  end: end,
                  title: row.note,
                  amount: row.amount,
                  ref: row.id,
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

    loadStoreData: function (cb) {
      db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM store;', [],
          function (transaction, result) {
            if (result != null && result.rows != null) {
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                switch (row.id) {
                  case 1:
                    App.model.set('totalSaldo', parseInt(row.value) || 0);
                  break;
                }
              }
              App.updateStore();
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

    updateStore: function () {
      db.transaction(function (tx) {
        tx.executeSql('UPDATE store SET value = ? WHERE id = ?', [App.model.get('totalSaldo'), 1], DBHandler.nullHandler, DBHandler.errorHandler);
      });
    },

    prevDay: function () {
      App.interval -= 1;
      App.currentDate.setDate(App.currentDate.getDate() - 1);
      App.views.tambah.$form.find('[name="date"]').val(kendo.toString(App.currentDate, 'yyyy-MM-dd'));
      App.views.tambah.$form.find('[name="time"]').val(kendo.toString(App.currentDate, 'HH:mm:ss'));
      App.loadDayData();
    },

    nextDay: function () {
      App.interval += 1;
      App.currentDate.setDate(App.currentDate.getDate() + 1);
      App.views.tambah.$form.find('[name="date"]').val(kendo.toString(App.currentDate, 'yyyy-MM-dd'));
      App.views.tambah.$form.find('[name="time"]').val(kendo.toString(App.currentDate, 'HH:mm:ss'));
      App.loadDayData();
    },

    backPressed: function () {
      if (App.drawer) {
        $("#drawer").data("kendoMobileDrawer").hide();
        App.drawerOnHide();
      } else {
        var currentTime = new Date();
        if ((currentTime - lastPressExit) > 5000) {
          App.notification.show('Press back again to exit.');
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
