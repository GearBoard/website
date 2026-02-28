export const DEPARTMENTS = [
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Engineering",
  "Electrical Engineering",
  "Environmental and Sustainable Engineering",
  "Industrial Engineering",
  "Mechanical Engineering",
  "Metallurgical Engineering",
  "Mining and Petroleum Engineering",
  "Nuclear Engineering",
  "Survey Engineering",
  "Water Resource Engineering",
  "International School of Engineering (ISE)",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
