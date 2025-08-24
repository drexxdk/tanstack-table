export interface Assignment {
  id: string;
  groups: Link[];
  subject: Link;
  portal: Link;
  learningMaterial: Link;
  period: Period;
  externalManagement?: Link;
}

export interface Link {
  title: string;
  url: string;
}

export interface Period {
  start: Date;
  end: Date;
}
