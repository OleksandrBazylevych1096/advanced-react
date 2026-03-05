import {ProductImageCarousel} from "@/pages/Product/ui/ProductImageCarousel/ProductImageCarousel.tsx";
import {ProductInfo} from "@/pages/Product/ui/ProductInfo/ProductInfo.tsx";

import {BestSellingProducts} from "@/widgets/BestSellingProducts";
import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";

import {AppPage, Stack} from "@/shared/ui";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

import {useProductPageController} from "../model/controllers/useProductPageController";

import styles from "./ProductPage.module.scss";

const ProductPage = () => {
    const {
        data: {product},
        derived: {breadcrumbs},
        status: {isFetching, isError},
    } = useProductPageController();

    return (
        <AppPage>
            <Header />
            <AppPage.Content>
                <Stack gap={16}>
                    <Breadcrumbs items={breadcrumbs} />
                    <Stack direction="row">
                        <div className={styles.carouselContainer}>
                            <ProductImageCarousel
                                images={product?.images}
                                isLoading={isFetching}
                                error={isError}
                            />
                        </div>
                        <ProductInfo product={product} error={isError} isLoading={isFetching} />
                    </Stack>
                    <BestSellingProducts />
                </Stack>
            </AppPage.Content>
            <Footer />
        </AppPage>
    );
};

export default ProductPage;
