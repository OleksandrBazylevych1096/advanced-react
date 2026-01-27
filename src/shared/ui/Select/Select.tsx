import React, {
    type FocusEvent,
    type KeyboardEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import ChevronRightIcon from '@/shared/assets/icons/ChevronRight.svg?react';
import CloseIcon from '@/shared/assets/icons/Close.svg?react'
import SearchIcon from '@/shared/assets/icons/Search.svg?react';
import {cn} from "@/shared/lib";
import {AppIcon, Button, Checkbox, Input, Spinner} from "@/shared/ui";

import styles from './Select.module.scss';

export interface SelectOption<T = string | number> {
    label: string | ReactNode;
    value: T;
    disabled?: boolean;
    hidden?: boolean;
}

export interface SelectOptionGroup<T = string | number> {
    label: string;
    options: SelectOption<T>[];
}

export type SelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type SelectTheme = 'outlined' | 'filled';
export type DropdownAlign = 'left' | 'right' | 'center' | 'auto';

export interface SelectProps<T = string | number> {
    value?: T | T[];
    defaultValue?: T | T[];
    onChange?: (value: T | T[]) => void;

    options?: SelectOption<T>[];
    optionGroups?: SelectOptionGroup<T>[];

    multiple?: boolean;
    searchable?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    loading?: boolean;

    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    onOpen?: () => void;
    onClose?: () => void;

    searchValue?: string;
    onSearch?: (query: string) => void;
    filterOption?: (option: SelectOption<T>, query: string) => boolean;

    onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;

    placeholder?: string;
    helperText?: string;
    errorMessage?: string;
    noOptionsMessage?: string;
    loadingMessage?: string;

    className?: string;
    size?: SelectSize;
    theme?: SelectTheme;
    error?: boolean;
    fullWidth?: boolean;

    dropdownAlign?: DropdownAlign;

    renderOption?: (option: SelectOption<T>) => ReactNode;
    renderValue?: (value: T | T[], options: SelectOption<T>[]) => ReactNode;
    renderPlaceholder?: () => ReactNode;

    id?: string;
    name?: string;
    required?: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

export function Select<T = string | number>({
                                                value,
                                                defaultValue,
                                                onChange,
                                                options = [],
                                                optionGroups,
                                                multiple = false,
                                                searchable = false,
                                                clearable = false,
                                                disabled = false,
                                                readonly = false,
                                                loading = false,
                                                isOpen: controlledIsOpen,
                                                onOpenChange,
                                                onOpen,
                                                onClose,
                                                searchValue: controlledSearchValue,
                                                onSearch,
                                                filterOption,
                                                onFocus,
                                                onBlur,
                                                placeholder = 'Choose...',
                                                helperText,
                                                errorMessage,
                                                noOptionsMessage = 'Nothing has been found',
                                                loadingMessage = 'Loading...',
                                                className,
                                                size = 'sm',
                                                theme = 'outlined',
                                                error = false,
                                                fullWidth = false,
                                                dropdownAlign = 'auto',
                                                renderOption,
                                                renderValue,
                                                renderPlaceholder,
                                                id,
                                                name,
                                                required = false,
                                                'aria-label': ariaLabel,
                                                'aria-labelledby': ariaLabelledby,
                                                'aria-describedby': ariaDescribedby,
                                            }: SelectProps<T>) {
    const [internalValue, setInternalValue] = useState<T | T[]>(
        defaultValue ?? (multiple ? [] : ('' as T))
    );
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [internalSearchValue, setInternalSearchValue] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<{
        left?: string;
        right?: string;
    }>({});

    const controlRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const currentValue = value !== undefined ? value : internalValue;
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const searchValue = controlledSearchValue !== undefined ? controlledSearchValue : internalSearchValue;

    const allOptions = useMemo(() => {
        if (optionGroups) {
            return optionGroups.flatMap(group => group.options);
        }
        return options;
    }, [options, optionGroups]);

    const visibleOptions = useMemo(() => {
        let filtered = allOptions.filter(opt => !opt.hidden);

        if (searchValue && searchable) {
            const query = searchValue.toLowerCase();
            filtered = filtered.filter(opt => {
                if (filterOption) {
                    return filterOption(opt, searchValue);
                }
                const label = typeof opt.label === 'string' ? opt.label : String(opt.label);
                return label.toLowerCase().includes(query);
            });
        }

        return filtered;
    }, [allOptions, searchValue, searchable, filterOption]);

    const isSelected = useCallback((option: SelectOption<T>) => {
        if (multiple && Array.isArray(currentValue)) {
            return currentValue.includes(option.value);
        }
        return currentValue === option.value;
    }, [currentValue, multiple]);

    const selectedOptions = useMemo(() => {
        if (multiple && Array.isArray(currentValue)) {
            return allOptions.filter(opt => currentValue.includes(opt.value));
        }
        return allOptions.filter(opt => opt.value === currentValue);
    }, [currentValue, allOptions, multiple]);

    const calculateDropdownPosition = useCallback(() => {
        if (!controlRef.current || !dropdownRef.current) return;

        const controlRect = controlRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        const position: typeof dropdownPosition = {};

        switch (dropdownAlign) {
            case 'left':
                position.left = '0';
                position.right = 'auto';
                break;

            case 'right':
                position.right = '0';
                position.left = 'auto';
                break;

            case 'center':
                position.left = '50%';
                position.right = 'auto';
                break;

            case 'auto': {
                const spaceOnRight = viewportWidth - controlRect.left;
                const spaceOnLeft = controlRect.right;
                const dropdownWidth = dropdownRect.width || 0;

                if (spaceOnRight >= dropdownWidth || spaceOnRight >= spaceOnLeft) {
                    position.left = '0';
                    position.right = 'auto';
                } else {
                    position.right = '0';
                    position.left = 'auto';
                }
                break;
            }
        }

        setDropdownPosition(position);
    }, [dropdownAlign]);

    const handleToggleOpen = () => {
        if (disabled || readonly) return;

        const newIsOpen = !isOpen;
        if (controlledIsOpen === undefined) {
            setInternalIsOpen(newIsOpen);
        }
        onOpenChange?.(newIsOpen);

        if (newIsOpen) {
            onOpen?.();
            if (searchable) {
                setTimeout(() => searchInputRef.current?.focus(), 0);
            }
        } else {
            onClose?.();
            setInternalSearchValue('');
            setFocusedIndex(-1);
        }
    };

    const handleSelectOption = (option: SelectOption<T>) => {
        if (option.disabled) return;

        let newValue: T | T[];

        if (multiple) {
            const currentArray = Array.isArray(currentValue) ? currentValue : [];
            if (currentArray.includes(option.value)) {
                newValue = currentArray.filter(v => v !== option.value);
            } else {
                newValue = [...currentArray, option.value];
            }
        } else {
            newValue = option.value;
            if (controlledIsOpen === undefined) {
                setInternalIsOpen(false);
            }
            onOpenChange?.(false);
            onClose?.();
        }

        if (value === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(newValue);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newValue = multiple ? [] : ('' as T);
        if (value === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(newValue as T | T[]);
    };

    const handleRemoveValue = (optionValue: T, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!multiple || !Array.isArray(currentValue)) return;

        const newValue = currentValue.filter(v => v !== optionValue);
        if (value === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(newValue);
    };

    const handleSearchChange = (value: string) => {
        if (controlledSearchValue === undefined) {
            setInternalSearchValue(value);
        }
        onSearch?.(value);
        setFocusedIndex(-1);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled || readonly) return;

        switch (e.key) {
            case 'Enter':
            case ' ':
                if (!isOpen) {
                    e.preventDefault();
                    handleToggleOpen();
                } else if (focusedIndex >= 0 && focusedIndex < visibleOptions.length) {
                    e.preventDefault();
                    handleSelectOption(visibleOptions[focusedIndex]);
                }
                break;

            case 'Escape':
                if (isOpen) {
                    e.preventDefault();
                    if (controlledIsOpen === undefined) {
                        setInternalIsOpen(false);
                    }
                    onOpenChange?.(false);
                    onClose?.();
                    controlRef.current?.focus();
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    handleToggleOpen();
                } else {
                    setFocusedIndex(prev =>
                        prev < visibleOptions.length - 1 ? prev + 1 : 0
                    );
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (isOpen) {
                    setFocusedIndex(prev =>
                        prev > 0 ? prev - 1 : visibleOptions.length - 1
                    );
                }
                break;

            case 'Tab':
                if (isOpen) {
                    if (controlledIsOpen === undefined) {
                        setInternalIsOpen(false);
                    }
                    onOpenChange?.(false);
                    onClose?.();
                }
                break;
        }
    };

    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                controlRef.current &&
                dropdownRef.current &&
                !controlRef.current.contains(e.target as Node) &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                if (controlledIsOpen === undefined) {
                    setInternalIsOpen(false);
                }
                onOpenChange?.(false);
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, controlledIsOpen, onOpenChange, onClose]);

    useEffect(() => {
        if (focusedIndex >= 0 && dropdownRef.current) {
            const optionElement = dropdownRef.current.querySelector(
                `[data-option-index="${focusedIndex}"]`
            ) as HTMLElement;

            if (optionElement) {
                optionElement.scrollIntoView({block: 'nearest'});
            }
        }
    }, [focusedIndex]);

    useLayoutEffect(() => {
        if (!isOpen) return;

        calculateDropdownPosition();

        window.addEventListener('resize', calculateDropdownPosition);

        return () => {
            window.removeEventListener('resize', calculateDropdownPosition);
        };
    }, [isOpen, calculateDropdownPosition]);


    const renderSelectedValue = () => {
        if (renderValue) {
            return renderValue(currentValue, allOptions);
        }

        if (multiple && Array.isArray(currentValue)) {
            if (currentValue.length === 0) {
                return renderPlaceholder ? renderPlaceholder() : (
                    <span className={styles.placeholder}>{placeholder}</span>
                );
            }

            return selectedOptions.map((opt) => (
                <div key={String(opt.value)} className={styles.multiValue}>
                    <span>{opt.label}</span>
                    {!disabled && !readonly && (
                        <Button
                            className={styles.multiValueRemove}
                            theme={'ghost'}
                            type="button"
                            onClick={(e) => handleRemoveValue(opt.value, e)}
                            aria-label={`Видалити ${opt.label}`}
                        >
                            <AppIcon Icon={CloseIcon}/>
                        </Button>
                    )}
                </div>
            ));
        }

        const selected = selectedOptions[0];
        if (!selected) {
            return renderPlaceholder ? renderPlaceholder() : (
                <span className={styles.placeholder}>{placeholder}</span>
            );
        }

        return <span className={styles.singleValue}>{selected.label}</span>;
    };

    const renderOptionContent = (option: SelectOption<T>) => {
        if (renderOption) {
            return renderOption(option);
        }

        return (
            <>
                {multiple && (
                    <Checkbox
                        checked={isSelected(option)}
                        className={styles.optionCheckbox}/>

                )}
                <span>{option.label}</span>
            </>
        );
    };

    const renderOptions = () => {
        if (loading) {
            return <div className={styles.noOptions}>{loadingMessage}</div>;
        }

        if (visibleOptions.length === 0) {
            return <div className={styles.noOptions}>{noOptionsMessage}</div>;
        }

        if (optionGroups) {
            return optionGroups.map((group, groupIndex) => {
                const groupOptions = group.options.filter(opt =>
                    visibleOptions.some(visOpt => visOpt.value === opt.value)
                );

                if (groupOptions.length === 0) return null;

                return (
                    <div key={groupIndex} className={styles.optionGroup}>
                        <div className={styles.optionGroupLabel}>{group.label}</div>
                        {groupOptions.map((option) => {
                            const globalIndex = visibleOptions.findIndex(
                                opt => opt.value === option.value
                            );

                            return (
                                <div
                                    key={String(option.value)}
                                    data-option-index={globalIndex}
                                    role="option"
                                    aria-selected={isSelected(option)}
                                    aria-disabled={option.disabled}
                                    className={cn(
                                        styles.option,
                                        {
                                            [styles.selected]: isSelected(option),
                                            [styles.focused]: focusedIndex === globalIndex,
                                            [styles.disabled]: !!option.disabled,
                                        }
                                    )}
                                    onClick={() => handleSelectOption(option)}
                                >
                                    {renderOptionContent(option)}
                                </div>
                            );
                        })}
                    </div>
                );
            });
        }

        return visibleOptions.map((option, index) => (
            <div
                key={String(option.value)}
                data-option-index={index}
                role="option"
                aria-selected={isSelected(option)}
                aria-disabled={option.disabled}
                className={cn(
                    styles.option,
                    {
                        [styles.selected]: isSelected(option),
                        [styles.focused]: focusedIndex === index,
                        [styles.disabled]: !!option.disabled,
                    }
                )}
                onClick={() => handleSelectOption(option)}
            >
                {renderOptionContent(option)}
            </div>
        ));
    };

    const showClear = clearable && !disabled && !readonly && (
        multiple
            ? Array.isArray(currentValue) && currentValue.length > 0
            : currentValue !== '' && currentValue !== null && currentValue !== undefined
    );

    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    return (
        <div className={cn(
            styles.select,
            {[styles.fullWidth]: fullWidth},
            className
        )}>
            <div
                ref={controlRef}
                className={cn(
                    styles.control,
                    styles[size],
                    styles[theme],
                    {
                        [styles.focused]: isFocused,
                        [styles.open]: isOpen,
                        [styles.disabled]: disabled,
                        [styles.readonly]: readonly,
                        [styles.error]: error || !!errorMessage,
                    }
                )}
                onClick={handleToggleOpen}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                tabIndex={disabled || readonly ? -1 : 0}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={`${id}-listbox`}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                aria-describedby={
                    errorMessage ? errorId : helperText ? helperId : ariaDescribedby
                }
                aria-required={required}
                aria-disabled={disabled}
                aria-readonly={readonly}
            >
                <div className={styles.valueContainer}>
                    {renderSelectedValue()}
                </div>

                <div className={styles.indicators}>
                    {loading && (
                        <Spinner size={'sm'}/>
                    )}

                    {showClear && (
                        <Button
                            theme={'ghost'}
                            className={styles.clearIndicator}
                            onClick={handleClear}
                            aria-label="Очистити"
                        >
                            <AppIcon Icon={CloseIcon}/>
                        </Button>
                    )}

                    {!loading && (
                        <AppIcon
                            Icon={ChevronRightIcon}
                            className={styles.dropdownIndicator}
                        />
                    )}
                </div>
            </div>

            <div
                ref={dropdownRef}
                className={cn(
                    styles.dropdown,
                    {
                        [styles.hidden]: !isOpen,
                        [styles.searchable]: searchable,
                        [styles.alignCenter]: dropdownAlign === 'center',
                    }
                )}
                style={dropdownPosition}
                id={`${id}-listbox`}
                role="listbox"
                aria-multiselectable={multiple}
            >
                {searchable && (
                    <div className={styles.search}>
                        <Input
                            ref={searchInputRef}
                            type="text"
                            value={searchValue}
                            onChange={handleSearchChange}
                            Icon={<AppIcon size={18} Icon={SearchIcon} theme="background"/>}
                            placeholder="Search..."
                            aria-label="Search options"
                        />
                    </div>
                )}

                <div className={styles.optionsList}>
                    {renderOptions()}
                </div>
            </div>

            {(helperText || errorMessage) && (
                <div
                    id={errorMessage ? errorId : helperId}
                    className={cn(styles.helperText, {
                        [styles.error]: !!errorMessage,
                    })}
                >
                    {errorMessage || helperText}
                </div>
            )}

            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={
                        Array.isArray(currentValue)
                            ? JSON.stringify(currentValue)
                            : String(currentValue)
                    }
                />
            )}
        </div>
    );
}