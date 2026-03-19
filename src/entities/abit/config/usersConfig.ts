export const usersConfig: any[] = [
  
  
  
  
  
  
  
  
  
  
  {
    dataField: "egeAverage",
    caption: "СреднийБаллЕГЭ",
    width: 100,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "pk",
    caption: "Подразделение",
    width: 70,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "string",
  },
  {
    dataField: "fullName",
    caption: "ФИО Абитуриента",
    width: 120,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "string",
  },
  {
    dataField: "dormitory",
    caption: "Общежитие",
    width: 50,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "regionPP",
    caption: "Регион ПП",
    width: 100,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "districtPP",
    caption: "Район ПП",
    width: 100,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "studyForm",
    caption: "Форма обучения",
    width: 100,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "basis",
    caption: "Основание",
    width: 100,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "email",
    caption: "E-mail",
    width: 250,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "string",
  },
  {
    dataField: "mobile",
    caption: "Мобильный",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "string",
  },
  {
    dataField: "gender",
    caption: "Пол",
    width: 100,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "string",
  },
  {
    dataField: "oKSO",
    caption: "ОКСО",
    width: 180,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "string",
  },
  {
    dataField: "consentFiles",
    caption: "Согласие файлов",
    width: 120,
    alignment: "left",
    allowFiltering: false,
    allowHeaderFiltering: false,
    allowSorting: false,
    dataType: "string",
  },
  {
    dataField: "greenWaveDate",
    caption: "Дата зеленная волна ",
    width: 200,
    alignment: "center",
    allowFiltering: false,
    allowHeaderFiltering: false,
    allowSorting: false,
    dataType: "string",
  },
  {
    dataField: "greenWaveFilesCount",
    caption: "Зеленная волна",
    width: 130,
    alignment: "center",
    allowFiltering: false,
    allowHeaderFiltering: false,
    allowSorting: false,
    dataType: "string",
  },
  {
    dataField: "reductionDate",
    caption: "Дата снижение",
    width: 120,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "boolean",
    calculateDisplayValue: function (data) {
      if (data.reduction === null || data.reduction === undefined) {
        return "-";
      }
      return data.reduction ? "да" : "нет";
    },
  },
  {
    dataField: "reductionFilesCount",
    caption: "Снижение файлы",
    width: 120,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "boolean",
    calculateDisplayValue: function (data) {
      if (data.reduction2 === null || data.reduction2 === undefined) {
        return "-";
      }
      return data.reduction2 ? "да" : "нет";
    },
  },
  {
    dataField: "directionName",
    caption: "Название специальности",
    width: 100,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "specialization",
    caption: "Специализация",
    width: 90,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "profile",
    caption: "Профиль",
    width: 80,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "applicantStatus",
    caption: "Статус Абитуриента",
    width: 120,
    alignment: "center",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "school",
    caption: "Уч заведение",
    width: 50,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "schoolLocation",
    caption: "Где находиться уч заведение",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "certificateSeries",
    caption: "Серия аттестата",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "certificateNumber",
    caption: "Номер аттестата",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "educationDocumentType",
    caption: "Тип образовательного документа",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "educationType",
    caption: "Тип образовательного учреждения",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "udIssueDate",
    caption: "Дата выдачи УД",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "parentPhone",
    caption: "Телефон родителя",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "epguCode",
    caption: "Код ЕПГУ",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "enrolledTo",
    caption: "Зачислен на",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  {
    dataField: "orders",
    caption: "Приказ №",
    width: 150,
    alignment: "left",
    allowFiltering: true,
    allowHeaderFiltering: true,
    allowSorting: true,
    dataType: "number",
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
];
