import type { EmblaCarouselType } from "embla-carousel";

import ChevronLeftIcon from "@/shared/assets/icons/ChevronLeft.svg?react";
import ChevronRightIcon from "@/shared/assets/icons/ChevronRight.svg?react";

import { AppIcon } from "../AppIcon/AppIcon";
import { Button } from "../Button/Button";

import styles from "./Carousel.module.scss";
import { usePrevNextButtons } from "./hooks/usePrevNextButtons";

interface CarouselControlsProps {
  emblaApi?: EmblaCarouselType;
}

export const CarouselControls = ({ emblaApi }: CarouselControlsProps) => {
  const {
    nextBtnDisabled,
    onNextButtonClick,
    onPrevButtonClick,
    prevBtnDisabled,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className={styles.emblaButtons}>
      <Button
        size="md"
        theme="tertiary"
        form="circle"
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
      >
        <AppIcon className={styles.navIcon} Icon={ChevronLeftIcon} />
      </Button>
      <Button
        size="md"
        theme="tertiary"
        form="circle"
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
      >
        <AppIcon className={styles.navIcon} Icon={ChevronRightIcon} />
      </Button>
    </div>
  );
};
