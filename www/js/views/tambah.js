define(["kendo"], function (kendo) {
  function loadCategory (cb) {
    db.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM category;',
        [],
        function (transaction, result) {
          if (result != null && result.rows != null) {
            for (var i = 0; i < result.rows.length; i++) {
              var row = result.rows.item(i);
              App.data.category[row.type].add(row);
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
    init: function (e) {
      App.currentView = e.view;
      loadCategory();
    },

    hide: function (e) {
      if (App.currentView.scroller) {
        App.currentView.scroller.reset();
      }
      App.views.tambah.$form[0].reset();
    },

    selectCategory: function (e) {
      var category = e.item.find('[name="category"]');
      App.views.tambah.$form.find('[name="category"]').val(category.val());
      App.views.tambah.$form.find('[name="type"]').val(category.data('type'));

      $('#category-pop').html(category.val() + '<br/><small>' + (category.data('type') === 'income' ? 'Pemasukan' : 'Pengeluaran') + '</small>');
      var popover = e.sender.element.closest('[data-role=popover]').data('kendoMobilePopOver');

      popover.close();
    },

    show: function (e) {

    },

    save: function (e) {
      var data = App.views.tambah.$form.serializeObject();
      var dateNow = new Date();
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO expense (type, category, amount, date, time, note) VALUES (?, ?, ?, ?, ?, ?)',
          [
            data.type,
            data.category,
            data.amount || 0,
            data.date || dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate(),
            data.time || dateNow.getHours() + ':' + (dateNow.getMinutes() + 1) + ':' + dateNow.getSeconds(),
            data.note || ''
          ], function () {
            var totalSaldo = App.model.get('totalSaldo');
            switch (data.type) {
              case 'income':
                App.model.set('totalSaldo', totalSaldo + (parseInt(data.amount) || 0));
              break;
              case 'expense':
                App.model.set('totalSaldo', totalSaldo - (parseInt(data.amount) || 0));
              break;
              default:
              break;
            }

            App.updateStore();
          }, DBHandler.errorHandler);
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
                          title: data.note,
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
                  title: data.note,
                  amount: data.amount,
                  type: data.type
                });

                kendoApp.navigate('index');
              }
            }
          }, DBHandler.errorHandler);
      }, DBHandler.errorHandler, DBHandler.nullHandler);
      e.preventDefault();
    }
  }
});