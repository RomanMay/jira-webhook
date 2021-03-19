export const template = (name: string, projectName: string) => {
  return [
    {
      range: `PDB!A1:G1`,
      majorDimension: 'ROWS',
      values: [[null, null, `${name}`, null, null, 'Rate', '$1.00']],
    },
    {
      range: `PDB!A2:G2`,
      majorDimension: 'ROWS',
      values: [
        [
          'Project',
          'Sprint',
          'Task ID',
          'Summary',
          'Time Spent (h)',
          'Total',
          'DateLogged',
        ],
      ],
    },
  ];
};
