define(["kendo"], function (kendo) {
  return {
    $form: $('#target-form'),
    init: function (e) {

    },
    show: function () {
      // Nothing
    },
    hide: function () {
      // Nothing
    },
    save: function (){
      var data = App.views.target.$form.serializeObject();
      var dateNow = new Date();
      var formattedDate = dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate();
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
            App.data.category.add({
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
                App.views.target.$form[0].reset();
                alert('Target telah ditambahkan');
              }, DBHandler.errorHandler);
          }, DBHandler.errorHandler);
      }, DBHandler.errorHandler, DBHandler.nullHandler);
    }
  }
});