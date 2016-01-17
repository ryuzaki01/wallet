define(["kendo"], function (kendo) {
  return {
    income : kendo.data.DataSource.create({
      data:[],
      change: function(e) {
        var income = 0;
        this.data().forEach(function (d) {
          income += parseInt(d.amount);
        });
        var expense = App.model.get('expense');
        App.model.set('income', income);
        App.model.set('saldo', income - expense);
      }
    }),
    expense: kendo.data.DataSource.create({
      data:[],
      change: function(e) {
        var expense = 0;
        this.data().forEach(function (d) {
          expense += parseInt(d.amount);
        });
        var income = App.model.get('income');
        App.model.set('expense', expense);
        App.model.set('saldo', income - expense);
      }
    }),
    schedule: kendo.data.SchedulerDataSource.create({
      online: false,
      data: [],
      schema: {
        model: { id: "ref" }
      }
    }),
    target: kendo.data.DataSource.create({
      schema: {
        model: {
          id: "id"
        }
      },
      data: [],
      change: function () {
        var $emptyOverlay = $('#target .empty-overlay');
        if (this.data().length > 0) {
          $emptyOverlay.hide();
        } else {
          $emptyOverlay.show();
        }
      }
    }),
    category: {
      income: kendo.data.DataSource.create({
        data: [],
        sort: [
          { field: "target", dir: "desc" },
          { field: "id", dir: "asc" }
        ]
      }),
      expense: kendo.data.DataSource.create({
        data: [],
        sort: [
          { field: "target", dir: "desc" },
          { field: "id", dir: "asc" }
        ],
        schema: {
          model: { id: "name" }
        }
      })
    },
    defaultStores: [
      {
        id: 1,
        name: 'total',
        value: 0
      }
    ],
    defaultCategories: [
      {
        id: 1,
        name: 'Gaji',
        type: 'income'
      },
      {
        id: 2,
        name: 'Penghasilan Sampingan',
        type: 'income'
      },
      {
        id: 3,
        name: 'Bonus',
        type: 'income'
      },
      {
        id: 4,
        name: 'Hadiah',
        type: 'income'
      },
      {
        id: 5,
        name: 'Lainnya',
        type: 'income'
      },
      {
        id: 6,
        name: 'Belanja',
        type: 'expense'
      },
      {
        id: 7,
        name: 'Cicilan',
        type: 'expense'
      },
      {
        id: 8,
        name: 'Transportasi',
        type: 'expense'
      },
      {
        id: 9,
        name: 'Lainnya',
        type: 'expense'
      }
    ]
  }
});