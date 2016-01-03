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
      $("#add-category").kendoDropDownList({
        dataTextField: "name",
        dataValueField: "name",
        dataSource: App.data.category
      });

      loadCategory(function () {
        App.views.tambah.$form.find('[name="type"]:eq(1)').on('change', function () {
          if (App.views.tambah.$form.find('[name="type"]:eq(1)').is(':checked')) {
            $('#expensetype').text('Pengeluaran');
            App.views.tambah.addType = 'expense';
          } else {
            $('#expensetype').text('Pemasukan');
            App.views.tambah.addType = 'income';
          }
          App.views.tambah.reloadCategory();
        });
      });

      App.views.tambah.reloadCategory();
    },

    hide: function (e) {
      e.view.scroller.reset();
    },

    show: function (e) {
    },

    reloadCategory: function () {
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
          'SELECT * FROM category WHERE name = ?', [data.category], function (transaction, result) {
            if (result != null && result.rows != null) {
              var row = result.rows[0];
              if (row.istarget === 1) {
               console.log('Target ' + row.name);
              }
            }
          }, DBHandler.errorHandler);
        App.data[data.type].add(data);
        App.data.schedule.add({
          start: new Date(data.date + ' ' + data.time),
          end: new Date(data.date + ' ' + data.time),
          title: data.name + ' - Rp ' + data.amount,
          type: data.type
        });
        App.views.tambah.$form[0].reset();
        $("#add-expensetype").data("kendoMobileSwitch").refresh();
        kendoApp.navigate('index');
      }, DBHandler.errorHandler, DBHandler.nullHandler);
    }
  }
});