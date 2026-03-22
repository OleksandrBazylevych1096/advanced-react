import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {Button} from "@/shared/ui/Button";
import {Container} from "@/shared/ui/Container";
import {Spinner} from "@/shared/ui/Spinner";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useSessionIdFromParams} from "../lib/useSessionIdFromParams.ts";
import {usePaymentController} from "../model/controllers/usePaymentController/usePaymentController.ts";

import styles from "./CheckoutResultPage.module.scss";

const CheckoutResultPage = () => {
    const {t} = useTranslation("checkout");
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const sessionId = useSessionIdFromParams();

    const {
        data: {orderDetails, paymentStatus},
        status: {isPolling, isPaymentDeclined, isSystemError},
    } = usePaymentController({sessionId});

    const goToHome = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.HOME]));
    };

    if (!sessionId) {
        return (
            <Container>
                <Typography tone="danger">{t("result.missingSessionId")}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Stack className={styles.wrapper} gap={16} align="center">
                <Typography as="h1" variant="display" weight="bold">
                    {t("result.title")}
                </Typography>

                {orderDetails?.orderNumber && (
                    <Typography tone="muted">
                        {t("result.orderNumber", {orderNumber: orderDetails.orderNumber})}
                    </Typography>
                )}

                {isPolling && (
                    <Stack align="center" gap={8}>
                        <Spinner size="lg" />
                        <Typography>{t("result.pending")}</Typography>
                    </Stack>
                )}

                {!isPolling && paymentStatus === "PAID" && (
                    <Typography variant="heading" tone="success" weight="bold">
                        {t("result.success")}
                    </Typography>
                )}

                {!isPolling && (paymentStatus === "FAILED" || isPaymentDeclined) && (
                    <Typography variant="heading" tone="danger" weight="bold">
                        {t("result.failed")}
                    </Typography>
                )}
                {!isPolling && isSystemError && (
                    <Typography variant="heading" tone="danger" weight="bold">
                        {t("result.systemError")}
                    </Typography>
                )}

                <Button type="button" theme="primary" size="md" onClick={goToHome}>
                    {t("result.continueShopping")}
                </Button>
            </Stack>
        </Container>
    );
};

export default CheckoutResultPage;
