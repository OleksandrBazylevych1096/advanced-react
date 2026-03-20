export interface ApplyCouponSchema {
    code: string;
    draftCode: string;
    message: string | null;
    isModalOpen: boolean;
    isApplying: boolean;
}
