define(["kendo"], function (kendo) {
  return {
    income : kendo.data.DataSource.create({
      data:[],
      change: function(e) {
        App.totalIncome = 0;
        this.data().forEach(function (d) {
          App.totalIncome += parseInt(d.amount);
        });
        App.totalMoney = App.totalIncome - App.totalExpense;
        $('#home-income').text('Rp ' + App.totalIncome);
        $('#home-expense').text('Rp ' + App.totalExpense);
        $('#home-total').text('Rp ' + App.totalMoney);
      }
    }),
    expense: kendo.data.DataSource.create({
      data:[],
      change: function(e) {
        App.totalExpense = 0;
        this.data().forEach(function (d) {
          App.totalExpense += parseInt(d.amount);
        });
        App.totalMoney = App.totalIncome - App.totalExpense;
        $('#home-income').text('Rp ' + App.totalIncome);
        $('#home-expense').text('Rp ' + App.totalExpense);
        $('#home-total').text('Rp ' + App.totalMoney);
      }
    }),
    schedule:kendo.data.SchedulerDataSource.create({
      data: []
    })
  }
});