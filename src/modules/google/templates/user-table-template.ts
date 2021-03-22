export const template = (name: string, range1: string, range2: string) => {
  return [
    {
      range: `${range1}`,
      majorDimension: 'ROWS',
      values: [[null, null, `${name}`, null, null, 'Rate', '$1.00']],
    },
    {
      range: `${range2}`,
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
