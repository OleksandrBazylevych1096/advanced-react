import {
    cloneElement,
    createContext,
    type HTMLAttributes,
    isValidElement,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import {cn} from "@/shared/lib";
import {Button} from "@/shared/ui";

import styles from "./Dropdown.module.scss";

interface DropdownContextValue {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    open: () => void;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

const useDropdownContext = () => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error("Dropdown components must be used within Dropdown");
    }
    return context;
};

interface DropdownProps {
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

export const Dropdown = ({
    children,
    className,
    defaultOpen = false,
    onOpenChange,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggle = () => {
        setIsOpen((prev) => {
            const newState = !prev;
            onOpenChange?.(newState);
            return newState;
        });
    };

    const close = useCallback(() => {
        setIsOpen(false);
        onOpenChange?.(false);
    }, [onOpenChange]);

    const open = () => {
        setIsOpen(true);
        onOpenChange?.(true);
    };

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                close();
            }
        };

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                close();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", closeOnOutsideClick);
            document.addEventListener("keydown", closeOnEscape);
        }

        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [close, isOpen]);

    return (
        <DropdownContext.Provider value={{isOpen, toggle, close, open}}>
            <div ref={dropdownRef} className={cn(styles.dropdown, className)}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

interface TriggerProps {
    children: ReactNode;
    className?: string;
    asChild?: boolean;
}

const Trigger = ({children, className, asChild = false}: TriggerProps) => {
    const {toggle, isOpen} = useDropdownContext();

    if (asChild && isValidElement<HTMLAttributes<HTMLElement>>(children)) {
        return cloneElement(children, {
            onClick: toggle,
            "aria-expanded": isOpen,
            "aria-haspopup": true,
            className: cn(children.props.className, className),
        });
    }

    return (
        <Button
            theme={"ghost"}
            onClick={toggle}
            aria-expanded={isOpen}
            aria-haspopup="true"
            className={cn(styles.trigger, className)}
        >
            {children}
        </Button>
    );
};

interface CloseProps {
    children: ReactNode;
    asChild?: boolean;
    className?: string;
}

const Close = ({children, asChild = false, className}: CloseProps) => {
    const {close} = useDropdownContext();

    if (asChild && isValidElement<HTMLAttributes<HTMLElement>>(children)) {
        const originalOnClick = children.props.onClick;

        return cloneElement(children, {
            onClick: (event: ReactMouseEvent<HTMLElement>) => {
                originalOnClick?.(event);
                close();
            },
            className: cn(children.props.className, className),
        });
    }

    return (
        <Button theme="ghost" className={cn(styles.close, className)} onClick={close}>
            {children}
        </Button>
    );
};

interface ContentProps {
    children: ReactNode;
    className?: string;
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

const Content = ({children, className, align = "start", sideOffset = 8}: ContentProps) => {
    const {isOpen} = useDropdownContext();

    if (!isOpen) return null;

    return (
        <div
            className={cn(styles.content, styles[`align-${align}`], className)}
            style={{top: "100%", marginTop: sideOffset}}
            role="menu"
        >
            <div className={styles.inner}>{children}</div>
        </div>
    );
};

interface HeaderProps {
    children: ReactNode;
    className?: string;
}

const Header = ({children, className}: HeaderProps) => {
    return <div className={cn(styles.header, className)}>{children}</div>;
};

interface FooterProps {
    children: ReactNode;
    className?: string;
}

const Footer = ({children, className}: FooterProps) => {
    return <div className={cn(styles.footer, className)}>{children}</div>;
};

interface BodyProps {
    children: ReactNode;
    className?: string;
}

const Body = ({children, className}: BodyProps) => {
    return <div className={cn(styles.body, className)}>{children}</div>;
};

Dropdown.Trigger = Trigger;
Dropdown.Close = Close;
Dropdown.Content = Content;
Dropdown.Header = Header;
Dropdown.Footer = Footer;
Dropdown.Body = Body;
