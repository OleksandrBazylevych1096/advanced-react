import {ProductImageCarousel} from "@/pages/Product/ui/ProductImageCarousel/ProductImageCarousel.tsx";
import {ProductInfo} from "@/pages/Product/ui/ProductInfo/ProductInfo.tsx";

import {BestSellingProducts} from "@/widgets/BestSellingProducts";

import {Breadcrumbs} from "@/shared/ui/Breadcrumbs";
import {Stack} from "@/shared/ui/Stack";

import {useProductPageController} from "../model/controllers/useProductPageController";

import styles from "./ProductPage.module.scss";

const ProductPage = () => {
    const {
        data: {product},
        derived: {breadcrumbs},
        status: {isFetching, isError},
    } = useProductPageController();

    return (
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
    );
};

export default ProductPage;
