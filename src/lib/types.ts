export type EventRecord = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EventInput = {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
};
