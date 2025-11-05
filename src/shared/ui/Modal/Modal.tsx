import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import { cn } from "@/shared/lib";

import { AppIcon } from "../AppIcon/AppIcon";
import { Button } from "../Button/Button";
import { Portal } from "../Portal/Portal";

import styles from "./Modal.module.scss";
import { modalManager } from "./modalManager";

interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

interface ModalProps {
  lazy?: boolean;
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  isDefaultOpen?: boolean;
}

const ANIMATION_DELAY = 300;

export const Modal = (props: ModalProps) => {
  const {
    children,
    isOpen: isControlledOpen,
    onClose: controlledOnClose,
    isDefaultOpen = false,
    lazy = true,
  } = props;

  const [internalIsOpen, setInternalIsOpen] = useState(isDefaultOpen || false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = isControlledOpen !== undefined;

  const isOpen = isControlled ? isControlledOpen : internalIsOpen;

  const handleClose = useCallback(() => {
    if (timerRef.current) return;

    setIsClosing(true);

    timerRef.current = setTimeout(() => {
      controlledOnClose?.();
      if (!isControlledOpen) {
        setInternalIsOpen(false);
      }
      setIsClosing(false);
      timerRef.current = null;
    }, ANIMATION_DELAY);
  }, [controlledOnClose, isControlledOpen]);

  const handleOpen = () => {
    if (!isControlledOpen) {
      setInternalIsOpen(true);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      modalManager.openModal();
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (isOpen) {
        modalManager.closeModal();
      }
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timerRef.current!);
    };
  }, [handleKeyDown, isOpen]);

  useEffect(() => {
    if (isOpen && isMounted) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isMounted, isOpen]);

  const contextValue: ModalContextValue = {
    isOpen,
    onClose: handleClose,
    onOpen: handleOpen,
  };

  const triggers: ReactNode[] = [];
  const contents: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ModalTrigger) {
      triggers.push(child);
    } else {
      contents.push(child);
    }
  });

  if (lazy && !isMounted) {
    return (
      <ModalContext.Provider value={contextValue}>
        {triggers}
      </ModalContext.Provider>
    );
  }

  return (
    <ModalContext.Provider value={contextValue}>
      {triggers}

      {isMounted && (
        <Portal>
          <div
            className={cn(styles.modal, {
              [styles.opened]: isAnimating,
              [styles.isClosing]: isClosing,
            })}
          >
            <div className={styles.overlay} onMouseDown={handleOverlayClick}>
              {contents}
            </div>
          </div>
        </Portal>
      )}
    </ModalContext.Provider>
  );
};

interface ModalTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

const ModalTrigger = (props: ModalTriggerProps) => {
  const { children, asChild = false } = props;
  const { onOpen } = useModalContext();

  if (asChild && isValidElement<HTMLAttributes<HTMLElement>>(children)) {
    return cloneElement(children, {
      ...children.props,
      onClick: (e: MouseEvent<HTMLElement>) => {
        children.props.onClick?.(e);
        onOpen();
      },
    });
  }

  return (
    <Button onClick={onOpen} theme="ghost">
      {children}
    </Button>
  );
};

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

const ModalContent = (props: ModalContentProps) => {
  const { children, className } = props;

  const handleContentClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleContentClick}
      className={cn(styles.contentWrapper, className)}
    >
      {children}
    </div>
  );
};

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
  childContainerClassName?: string;
}

const ModalHeader = (props: ModalHeaderProps) => {
  const { children, className, childContainerClassName } = props;

  const { onClose } = useModalContext();

  return (
    <div className={cn(styles.header, className)}>
      <div className={childContainerClassName}>{children}</div>
      <Button
        size="lg"
        theme="ghost"
        onClick={onClose}
        className={styles.closeButton}
      >
        <AppIcon Icon={CloseIcon} />
      </Button>
    </div>
  );
};

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

const ModalBody = (props: ModalBodyProps) => {
  const { children, className } = props;

  return <div className={cn(styles.body, className)}>{children}</div>;
};

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const ModalFooter = (props: ModalFooterProps) => {
  const { children, className } = props;

  return <div className={cn(styles.footer, className)}>{children}</div>;
};

Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
