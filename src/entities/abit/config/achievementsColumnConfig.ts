export const achievementsColumnConfig: any[] = [
  {
    dataField: 'id',
    caption: 'ID',
    width: 80,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'number'
  },
  {
    dataField: 'code',
    caption: 'Код',
    width: 100,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'number'
  },
  {
    dataField: 'name',
    caption: 'Название',
    width: 300,
    alignment: 'left',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'string'
  },
  {
    dataField: 'maxBall',
    caption: 'Макс. балл',
    width: 100,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'number'
  },
  {
    dataField: 'counted',
    caption: 'Начислено',
    width: 100,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'number'
  },
  {
    dataField: 'status',
    caption: 'Статус',
    width: 120,
    alignment: 'left',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'string'
  },
  {
    dataField: 'ballChanged',
    caption: 'Балл изменен',
    width: 100,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'boolean',
    calculateDisplayValue: function(data) {
      if (data.ballChanged === null || data.ballChanged === undefined) {
        return '-';
      }
      return data.ballChanged ? 'да' : 'нет';
    }
  },
  {
    dataField: 'idCode',
    caption: 'Код ID',
    width: 100,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'number'
  },
  {
    dataField: 'verifierCode',
    caption: 'Код верификатора',
    width: 120,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'number'
  },
  {
    dataField: 'changeDate',
    caption: 'Дата изменения',
    width: 120,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'date'
  },
  {
    dataField: 'year',
    caption: 'Год',
    width: 80,
    alignment: 'center',
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: 'number'
  }
];
