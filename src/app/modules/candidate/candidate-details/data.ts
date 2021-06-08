export interface Audit {
    date: string;
    description: string;
    view: string;
  }

export const AUDIT_DATA: Audit[] = [
    {date: '11/12/20', description: 'Loren ipsum dolor sit..', view: ''},
    {date: '11/12/20', description: 'Loren ipsum dolor sit..', view: ''},
    {date: '11/12/20', description: 'Loren ipsum dolor sit..', view: ''}
  ];

export const COMPLAINT_DATA = [
    {description: 'Loren ipsum dolor sit..', status: 'Dismissed', view: ''},
    {description: 'Loren ipsum dolor sit..', status: 'Resolved', view: ''},
    {description: 'Loren ipsum dolor sit..', status: 'Dismissed', view: ''},
    {description: 'Loren ipsum dolor sit..', status: 'Pending', view: ''}
  ];

export const PENALTY_DATA = [
    {penalty: 'Loren ipsum', paymentStatus: 'Loren ipsum', waiverRequest: 'Loren ipsum', decision: 'Loren ipsum', amount: '$40.00'},
    {penalty: 'Loren ipsum', paymentStatus: 'Loren ipsum', waiverRequest: 'Loren ipsum', decision: 'Loren ipsum', amount: '$40.00'},
    {penalty: 'Loren ipsum', paymentStatus: 'Loren ipsum', waiverRequest: 'Loren ipsum', decision: 'Loren ipsum', amount: '$40.00'},
    {penalty: 'Loren ipsum', paymentStatus: 'Loren ipsum', waiverRequest: 'Loren ipsum', decision: 'Loren ipsum', amount: '$40.00'}
];

export const OTHER_REPORTS_DATA = [
    {fillingPeriod: 'Officer Financial Disclosure', reportingPeriod: 'Oct 1 - Oct 30, 2020', amendmentVersion: 'Amendment', dateSubmitted: '11/12/2020', view: ''},
    {fillingPeriod: 'Gift Report', reportingPeriod: 'Sept 1 - Sept 30, 2020', amendmentVersion: 'Amendment', dateSubmitted: '11/12/2020', view: ''},
    {fillingPeriod: 'City Items Report', reportingPeriod: 'Aug 1 - Aug 30, 2020', amendmentVersion: 'Amendment', dateSubmitted: '11/12/2020', view: ''},
    {fillingPeriod: 'Officer Financial Disclosure', reportingPeriod: 'July 1 - July 30, 2020', amendmentVersion: 'Amendment', dateSubmitted: '11/12/2020', view: ''},
];

export const CAMPAIGN_FILLINGS_DATA = [
    {fillingPeriod: '2020 1st Pre-Election Report', reportingPeriod: 'Oct 1 - Oct 30, 2020', amendmentVersion: 'Amendment', dateSubmitted: '11/12/2020', view: ''},
    {fillingPeriod: '2020 2nd Pre-Election Report', reportingPeriod: 'Sept 1 - Sept 30, 2020', amendmentVersion: 'Amendment', dateSubmitted: '11/12/2020', view: ''},
    {fillingPeriod: '2020 3rd Pre-Election Report', reportingPeriod: 'Aug 1 - Aug 30, 2020', amendmentVersion: 'Amendment', dateSubmitted: '11/12/2020', view: ''},
    {fillingPeriod: '2020 4th Pre-Election Report', reportingPeriod: 'July 1 - July 30, 2020', amendmentVersion: 'Amendment', dateSubmitted: '11/12/2020', view: ''},
]