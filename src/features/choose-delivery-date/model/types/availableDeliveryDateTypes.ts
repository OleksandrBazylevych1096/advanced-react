export interface AvailableDeliveryDate {
    date: string;
    slots: string[];
}

export interface DeliverySelection {
    deliveryDate: string;
    deliveryTime: string;
}
