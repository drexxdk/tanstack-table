import { Assignment } from "@/interfaces/assignment.interface";

export const assignmentsMock: Assignment[] = [
  {
    id: crypto.randomUUID(),
    groups: [
      {
        title: "5. B",
        url: "https://example.com/",
      },
      {
        title: "1. A",
        url: "https://example.com/",
      },
      {
        title: "2. A",
        url: "https://example.com/",
      },
      {
        title: "3. A",
        url: "https://example.com/",
      },
    ],
    subject: {
      title: "Matematik",
      url: "https://example.com/",
    },
    portal: {
      title: "Matematikportalen",
      url: "https://example.com/",
    },
    learningMaterial: {
      title: "Ny tildeling",
      url: "https://example.com/",
    },
    period: {
      start: new Date(2025, 3, 4),
      end: new Date(2025, 3, 8),
    },
  },
  {
    id: crypto.randomUUID(),
    groups: [
      {
        title: "5. B",
        url: "https://example.com/",
      },
      {
        title: "6. B",
        url: "https://example.com/",
      },
    ],
    subject: {
      title: "Matematik",
      url: "https://example.com/",
    },
    portal: {
      title: "Matematikfessor",
      url: "https://example.com/",
    },
    learningMaterial: {
      title: "Hundreder",
      url: "https://example.com/",
    },
    period: {
      start: new Date(2025, 3, 4),
      end: new Date(2025, 3, 8),
    },
    externalManagement: {
      title: "",
      url: "https://example.com/",
    },
  },
  {
    id: crypto.randomUUID(),
    groups: [
      {
        title: "Læsehold 1",
        url: "https://example.com/",
      },
      {
        title: "5. B",
        url: "https://example.com/",
      },
      {
        title: "6. B",
        url: "https://example.com/",
      },
    ],
    subject: {
      title: "Dansk",
      url: "https://example.com/",
    },
    portal: {
      title: "Danskportalen",
      url: "https://example.com/",
    },
    learningMaterial: {
      title: "Helte og antihelte",
      url: "https://example.com/",
    },
    period: {
      start: new Date(2025, 3, 16),
      end: new Date(2025, 3, 20),
    },
  },
  {
    id: crypto.randomUUID(),
    groups: [
      {
        title: "Læsehold 3",
        url: "https://example.com/",
      },
    ],
    subject: {
      title: "Biologi",
      url: "https://example.com/",
    },
    portal: {
      title: "Biologiportalen",
      url: "https://example.com/",
    },
    learningMaterial: {
      title: "Evolution",
      url: "https://example.com/",
    },
    period: {
      start: new Date(2025, 4, 10),
      end: new Date(2025, 4, 14),
    },
  },
];

// {
//     id: crypto.randomUUID(),
//     groups: [],
//     subject: {
//       title: "",
//       url: "https://example.com/",
//     },
//     portal: {
//       title: "",
//       url: "https://example.com/",
//     },
//     learningMaterial: {
//       title: "",
//       url: "https://example.com/",
//     },
//     period: {
//       start: new Date(2025, 0, 0),
//       end: new Date(2025, 0, 0),
//     },
//   },
