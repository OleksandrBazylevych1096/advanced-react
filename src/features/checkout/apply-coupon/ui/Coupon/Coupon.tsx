import {useTranslation} from "react-i18next";

import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Input} from "@/shared/ui/Input";
import {Modal} from "@/shared/ui/Modal";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useApplyCouponController} from "../../model/controllers/useApplyCouponController/useApplyCouponController";

import styles from "./Coupon.module.scss";

export const Coupon = () => {
    const {t} = useTranslation("checkout");
    const {
        data: {code, draftCode, validationMessage, isModalOpen, isValidationLoading, isApplying},
        actions: {openModal, closeModal, setDraftCode, applyCoupon, removeCoupon},
    } = useApplyCouponController();

    return (
        <Stack className={styles.card} gap={12}>
            <Typography as="h3" variant="heading" weight="bold">
                {t("coupon.title")}
            </Typography>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {!code && (
                    <Modal.Trigger asChild>
                        <Button type="button" theme="tertiary" size="sm" onClick={openModal}>
                            {t("coupon.add")}
                        </Button>
                    </Modal.Trigger>
                )}

                <Modal.Content className={styles.modalContent}>
                    <Modal.Header>
                        <Typography as="h4" variant="heading" weight="semibold">
                            {t("coupon.add")}
                        </Typography>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack gap={8}>
                            <Input
                                value={draftCode}
                                onChange={setDraftCode}
                                placeholder={t("coupon.enterCode")}
                                errorText={validationMessage || ""}
                                fullWidth
                            />
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer className={styles.modalFooter}>
                        <Stack direction="row" justify="flex-end" gap={8}>
                            <Button type="button" theme="tertiary" size="sm" onClick={closeModal}>
                                {t("coupon.cancel")}
                            </Button>
                            <Button
                                type="button"
                                theme="primary"
                                size="sm"
                                onClick={applyCoupon}
                                isLoading={isApplying && isValidationLoading}
                            >
                                {t("coupon.apply")}
                            </Button>
                        </Stack>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {code && (
                <Stack className={styles.badge} direction="row" align="center" gap={8}>
                    <Typography as="span" variant="body" weight="medium">
                        {code}
                    </Typography>
                    <Button
                        type="button"
                        theme="ghost"
                        size="xs"
                        className={styles.removeBadgeButton}
                        onClick={removeCoupon}
                        aria-label={t("coupon.removeAriaLabel")}
                    >
                        <AppIcon className={styles.icon} Icon={CloseIcon} />
                    </Button>
                </Stack>
            )}
        </Stack>
    );
};
