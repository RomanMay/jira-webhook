export const tableTemplate = (
  userName: string,
  range1: string,
  range2: string,
) => {
  return [
    {
      range: `${range1}`,
      majorDimension: 'ROWS',
      values: [[null, null, `${userName}`, null, 'Rate', '$1.00']],
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
          'DateLogged',
        ],
      ],
    },
  ];
};

export const tableTemplate2 = (userName: string, range1: string) => {
  return {
    majorDimension: 'ROWS',
    range: `${range1}`,
    values: [
      [null, null, `${userName}`, null, 'Rate', '$1.00'],
      [
        'Project',
        'Sprint',
        'Task ID',
        'Summary',
        'Time Spent (h)',
        'DateLogged',
      ],
    ],
  };
};
