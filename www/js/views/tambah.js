define(["kendo"], function (kendo) {
  function loadCategory (cb) {
    db.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM category;',
        [],
        function (transaction, result) {
          if (result != null && result.rows != null) {
            for (var i = 0; i < result.rows.length; i++) {
              var row = result.rows.item(i);
              App.data.category.add(row);
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
  }

  return {
    $form: $('#form-new-entry'),
    addType: 'income',
    init: function (e) {
      App.currentView = e.view;
      $("#add-category").kendoDropDownList({
        dataTextField: "name",
        dataValueField: "name",
        dataSource: App.data.category
      });

      loadCategory();

      App.views.tambah.reloadCategory();
    },

    switchExpenseType: function (e) {
      if (e.checked) {
        $('#expensetype').text('Pengeluaran');
        App.views.tambah.addType = 'expense';
      } else {
        $('#expensetype').text('Pemasukan');
        App.views.tambah.addType = 'income';
      }
      App.views.tambah.reloadCategory();
    },

    hide: function (e) {
      App.currentView.scroller.reset();
      App.views.tambah.$form[0].reset();
      $('#expensetype').text('Pemasukan');
      $("#add-expensetype").data("kendoMobileSwitch").check(false);
    },

    show: function (e) {
    },

    reloadCategory: function () {
      console.log('Reloading category..');
      App.data.category.filter([]);
      App.data.category.filter({field: "type", value: App.views.tambah.addType});
      $("#add-category").data('kendoDropDownList').select(0);
    },

    save: function () {
      var data = App.views.tambah.$form.serializeObject();
      data.type = (data.type === 'on' ? 'expense' : 'income');
      var dateNow = new Date();
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO expense (name, type, category, amount, date, time, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            data.name,
            data.type,
            data.category,
            data.amount || 0,
            data.date || dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate(),
            data.time || dateNow.getHours() + ':' + (dateNow.getMinutes() + 1) + ':' + dateNow.getSeconds(),
            data.note || ''
          ], DBHandler.nullHandler, DBHandler.errorHandler);
        tx.executeSql(
          'SELECT * FROM category WHERE name = ?', [data.category], function (tx, res) {
            if (res != null && res.rows != null && res.rows.length > 0) {
              var row = res.rows[0];
              if (row.target) {
               console.log('Updating target : ' + row.name);
                tx.executeSql(
                  'SELECT * FROM target WHERE id = ?', [row.target], function (tx, result) {
                    var targetRow = result.rows[0];
                    var newAmountPaid = (parseInt(targetRow.amount_paid) + parseInt(data.amount));
                    tx.executeSql(
                      'UPDATE target SET amount_paid = ? WHERE id = ?', [newAmountPaid, row.target], function (tx) {
                        App.data.target.pushUpdate({
                          id: row.target,
                          name: targetRow.name,
                          amount: targetRow.amount,
                          amount_paid: newAmountPaid,
                          month: targetRow.month,
                          date: targetRow.date
                        });

                        App.data[data.type].add(data);
                        var end = new Date(dateNow.setHours(dateNow.getHours() + 1));

                        App.data.schedule.add({
                          start: dateNow,
                          end: end,
                          title: data.name,
                          amount: data.amount,
                          type: data.type
                        });

                        kendoApp.navigate('index');
                      }, DBHandler.errorHandler);
                  }, DBHandler.errorHandler);
              } else {
                App.data[data.type].add(data);
                var end = new Date(dateNow.setHours(dateNow.getHours() + 1));

                App.data.schedule.add({
                  start: dateNow,
                  end: end,
                  title: data.name,
                  amount: data.amount,
                  type: data.type
                });

                kendoApp.navigate('index');
              }
            }
          }, DBHandler.errorHandler);
      }, DBHandler.errorHandler, DBHandler.nullHandler);
    }
  }
});