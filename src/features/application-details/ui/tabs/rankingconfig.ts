export const rankingconfig = [
    {
        dataField: "rank",
        caption: "Номер",
        width: 70,
        dataType: 'number'
    },
    {
        dataField: "id",
        caption: "ID",
        width: 70,
        dataType: 'number'
    }, 
    {
        dataField: "fio",
        caption: "ФИО",
        width: 300,
        dataType: 'string'
    }, 
    {
        dataField: "caseNumber",
        caption: "Номер дела",
        width: 150,
        dataType: 'string'
    }, 
    
    
    
    
    
    
    {
        dataField: "sumPoints",
        caption: "Сумма баллов",
        width: 100,
        dataType: 'number'
    }, 
    {
        dataField: "priority",
        caption: "Приоритет",
        width: 70,
        dataType: 'number'
    }, 
    {
        dataField: "original",
        caption: "оригинал",
        width: 70,
        dataType: 'boolean',
        calculateDisplayValue: function(data) {
            if (data.original === null || data.original === undefined) {
                return '-';
            }
            return data.original ? 'да' : 'нет';
        }
    },
    {
        dataField: "consent",
        caption: "Согласие",
        width: 70,
        dataType: 'boolean',
        calculateDisplayValue: function(data) {
            if (data.consent === null || data.consent === undefined) {
                return '-';
            }
            return data.consent ? 'да' : 'нет';
        }
    },
    {
        dataField: "status",
        caption: "Статус",
        width: 200,
        dataType: 'string'
    },
    {
        dataField: "highestPriority",
        caption: "Высший приоритет",
        width: 70,
        dataType: 'boolean',
        calculateDisplayValue: function(data) {
            if (data.highestPriority === null || data.highestPriority === undefined) {
                return '-';
            }
            return data.highestPriority ? 'да' : 'нет';
        }
    },
    {
        dataField: "highestPriorityOriginal",
        caption: "Высший приоритет оригинал",
        width: 70,
        dataType: 'boolean',
        calculateDisplayValue: function(data) {
            if (data.highestPriorityOriginal === null || data.highestPriorityOriginal === undefined) {
                return '-';
            }
            return data.highestPriorityOriginal ? 'да' : 'нет';
        }
    }
]