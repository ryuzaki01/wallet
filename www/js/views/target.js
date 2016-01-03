define(["kendo"], function (kendo) {
  return {
    $form: $('#target-form'),
    init: function (e) {
      // Nothing
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
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO target (name, amount, amount_paid, month, date) VALUES (?, ?, ?, ?, ?)',
          [
            data.name,
            data.amount || 0,
            0,
            data.month,
            dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate()
          ], DBHandler.nullHandler, DBHandler.errorHandler);
        tx.executeSql(
          'INSERT INTO category (name, type, istarget) VALUES (?, ?, ?)',
          [
            data.name,
            'expense',
            1
          ], DBHandler.nullHandler, DBHandler.errorHandler);
        data.amount_paid = 0;
        data.date = dateNow;
        App.data.target.add(data);
        App.data.category.add({
          name: data.name,
          type: 'expense',
          istarget: 1
        });
        App.views.target.$form[0].reset();
        alert('Target telah ditambahkan');
      }, DBHandler.errorHandler, DBHandler.nullHandler);
    }
  }
});