export type Part = {
  partNumber: string;
  quantity: number;
  childParts?: ChildPart[];
};

export type Material = {
  name: string;
  quantity: number;
  unit: string;
};

export type ChildPart = {
  partNumber: string;
  quantity: number;
  proofOfDeliveryId?: string;
};

export type DeliveryStatus = 'in-transit' | 'received';

export type Delivery = {
  id: string;
  part: Part;
  materials?: Material[];
  status: DeliveryStatus;
  from: 'upstream' | 'middlestream';
  to: 'middlestream' | 'downstream';
  timestamp: string;
  originalDeliveryId?: string;
};
