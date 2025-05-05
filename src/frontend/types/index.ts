export type Part = {
  partNumber: string;
  quantity: number;
  childParts?: ChildPart[];
};

export type ChildPart = {
  partNumber: string;
  quantity: number;
  proofOfDeliveryId?: string;
  status: DeliveryStatus;
};

export type DeliveryStatus = 'in-transit' | 'received';

export type Delivery = {
  id: string;
  part: Part;
  status: DeliveryStatus;
  from: 'upstream' | 'middlestream';
  to: 'middlestream' | 'downstream';
  timestamp: string;
  originalDeliveryId?: string;
};
