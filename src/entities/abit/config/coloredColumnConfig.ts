import { abitColumnConfig } from "./columnConfig.ts";


export const coloredColumnConfig: any[] = abitColumnConfig.map(column => {
  if (column.dataField === 'greenWaveFilesCount') {
    
    return {
      ...column,
      cssClass: 'green-wave-column', 
      cellTemplate: (container, options) => {
        container.textContent = options.text;
        container.style.backgroundColor = '#d4edda'; 
        container.style.color = '#155724'; 
        container.style.fontWeight = 'bold';
      }
    };
  }
  return column;
});
