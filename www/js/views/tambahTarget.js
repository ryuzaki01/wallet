define(["kendo"], function (kendo) {
  return {
    $form: $('#target-form'),
    init: function (e) {
      App.currentView = e.view;
    },
    show: function () {
      // Nothing
    },
    hide: function () {
      if (App.currentView.scroller) {
        App.currentView.scroller.reset();
      }
      // Nothing
    },
    save: function (){
      var data = App.views.tambahTarget.$form.serializeObject();
      if (!data.name || !data.amount) {
        App.notification.error('Harap isi nominal dan tulis nama target');
        return false;
      }
      var dateNow = new Date();
      var formattedDate = kendo.toString(dateNow, 'yyyy-MM-dd');
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO target (name, amount, amount_paid, month, date) VALUES (?, ?, ?, ?, ?)',
          [
            data.name,
            data.amount || 0,
            0,
            data.month,
            formattedDate
          ], function (tx, result) {
            var target = result.insertId;
            App.data.category.expense.add({
              name: data.name,
              type: 'expense',
              target: target
            });
            tx.executeSql(
              'INSERT INTO category (name, type, target) VALUES (?, ?, ?)',
              [
                data.name,
                'expense',
                target
              ], function () {
                data.id = target;
                data.amount_paid = 0;
                data.date = formattedDate;
                App.data.target.add(data);
                App.views.tambahTarget.$form[0].reset();
                kendoApp.navigate('target');
                App.notification.success('Target telah ditambahkan');
              }, DBHandler.errorHandler);
          }, DBHandler.errorHandler);
      }, DBHandler.errorHandler, DBHandler.nullHandler);
    }
  }
});