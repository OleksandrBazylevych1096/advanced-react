import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeAll, describe, expect, it, vi} from "vitest";

import {Select, type SelectOption, type SelectOptionGroup} from './Select';

beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
});

const mockOptions: SelectOption<string>[] = [
    {label: 'Option 1', value: '1'},
    {label: 'Option 2', value: '2'},
    {label: 'Option 3', value: '3', disabled: true},
    {label: 'Option 4', value: '4'},
];

const mockOptionGroups: SelectOptionGroup<string>[] = [
    {
        label: 'Group 1',
        options: [
            {label: 'Option 1', value: '1'},
            {label: 'Option 2', value: '2'},
        ],
    },
    {
        label: 'Group 2',
        options: [
            {label: 'Option 3', value: '3'},
            {label: 'Option 4', value: '4'},
        ],
    },
];

describe('Select Component', () => {
    describe('Basic Rendering', () => {
        it('should render with placeholder', () => {
            render(
                <Select
                    options={mockOptions}
                    placeholder="Choose option"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select')).toBeInTheDocument();
            expect(screen.getByText('Choose option')).toBeInTheDocument();
        });

        it('should render with default value', () => {
            render(
                <Select
                    options={mockOptions}
                    defaultValue="2"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-value')).toHaveTextContent('Option 2');
        });

        it('should render with controlled value', () => {
            render(
                <Select
                    options={mockOptions}
                    value="3"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-value')).toHaveTextContent('Option 3');
        });

        it('should render helper text', () => {
            render(
                <Select
                    options={mockOptions}
                    helperText="This is helper text"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-helper-text')).toHaveTextContent('This is helper text');
        });

        it('should render error message', () => {
            render(
                <Select
                    options={mockOptions}
                    errorMessage="This field is required"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-error')).toHaveTextContent('This field is required');
        });

        it('should apply fullWidth class', () => {
            render(
                <Select
                    options={mockOptions}
                    fullWidth
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select')).toHaveClass(/fullWidth/);
        });

        it('should render with different sizes', () => {
            const {rerender} = render(
                <Select
                    options={mockOptions}
                    size="xs"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-control')).toHaveClass(/xs/);

            rerender(
                <Select
                    options={mockOptions}
                    size="lg"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-control')).toHaveClass(/lg/);
        });

        it('should render with different themes', () => {
            const {rerender} = render(
                <Select
                    options={mockOptions}
                    theme="outlined"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-control')).toHaveClass(/outlined/);

            rerender(
                <Select
                    options={mockOptions}
                    theme="filled"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-control')).toHaveClass(/filled/);
        });
    });

    describe('Dropdown Opening/Closing', () => {
        it('should open dropdown on click', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            const control = screen.getByTestId('select-control');
            await user.click(control);

            expect(screen.getByTestId('select-dropdown')).not.toHaveClass(/hidden/);
        });

        it('should close dropdown on outside click', async () => {
            const user = userEvent.setup();
            render(
                <div>
                    <Select options={mockOptions} data-testid="select"/>
                    <button data-testid="outside-button">Outside button</button>
                </div>
            );

            await user.click(screen.getByTestId('select-control'));
            expect(screen.getByTestId('select-dropdown')).not.toHaveClass(/hidden/);

            await user.click(screen.getByTestId('outside-button'));

            await waitFor(() => {
                expect(screen.getByTestId('select-dropdown')).toHaveClass(/hidden/);
            });
        });

        it('should close dropdown on Escape key', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            const control = screen.getByTestId('select-control');
            await user.click(control);
            expect(screen.getByTestId('select-dropdown')).not.toHaveClass(/hidden/);

            await user.keyboard('{Escape}');

            await waitFor(() => {
                expect(screen.getByTestId('select-dropdown')).toHaveClass(/hidden/);
            });
        });

        it('should call onOpenChange callback', async () => {
            const user = userEvent.setup();
            const onOpenChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    onOpenChange={onOpenChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            expect(onOpenChange).toHaveBeenCalledWith(true);

            await user.keyboard('{Escape}');

            await waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(false);
            });
        });

        it('should call onOpen and onClose callbacks', async () => {
            const user = userEvent.setup();
            const onOpen = vi.fn();
            const onClose = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    onOpen={onOpen}
                    onClose={onClose}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            expect(onOpen).toHaveBeenCalled();

            await user.keyboard('{Escape}');

            await waitFor(() => {
                expect(onClose).toHaveBeenCalled();
            });
        });

        it('should work with controlled isOpen prop', async () => {
            const user = userEvent.setup();
            const onOpenChange = vi.fn();
            const {rerender} = render(
                <Select
                    options={mockOptions}
                    isOpen={false}
                    onOpenChange={onOpenChange}
                    data-testid="select"
                />
            );

            expect(screen.getByTestId('select-dropdown')).toHaveClass(/hidden/);

            await user.click(screen.getByTestId('select-control'));
            expect(onOpenChange).toHaveBeenCalledWith(true);

            rerender(
                <Select
                    options={mockOptions}
                    isOpen={true}
                    onOpenChange={onOpenChange}
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-dropdown')).not.toHaveClass(/hidden/);
        });
    });

    describe('Single Selection', () => {
        it('should select option on click', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    onChange={onChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            await user.click(screen.getByTestId('select-option-2'));

            expect(onChange).toHaveBeenCalledWith('2');
        });

        it('should close dropdown after selection in single mode', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            await user.click(screen.getByTestId('select-option-1'));

            await waitFor(() => {
                expect(screen.getByTestId('select-dropdown')).toHaveClass(/hidden/);
            });
        });

        it('should not select disabled option', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    onChange={onChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            await user.click(screen.getByTestId('select-option-3'));

            expect(onChange).not.toHaveBeenCalled();
        });

        it('should display selected value', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            await user.click(screen.getByTestId('select-option-2'));

            await waitFor(() => {
                expect(screen.getByTestId('select-value')).toHaveTextContent('Option 2');
            });
        });
    });

    describe('Multiple Selection', () => {
        it('should allow multiple selections', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    multiple
                    onChange={onChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            await user.click(screen.getByTestId('select-option-1'));
            expect(onChange).toHaveBeenCalledWith(['1']);

            await user.click(screen.getByTestId('select-option-2'));
            expect(onChange).toHaveBeenCalledWith(['1', '2']);
        });

        it('should deselect option on second click', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    multiple
                    defaultValue={['1']}
                    onChange={onChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            await user.click(screen.getByTestId('select-option-1'));

            expect(onChange).toHaveBeenCalledWith([]);
        });

        it('should keep dropdown open after selection in multiple mode', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} multiple data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            await user.click(screen.getByTestId('select-option-1'));

            expect(screen.getByTestId('select-dropdown')).not.toHaveClass(/hidden/);
        });

        it('should render checkboxes in multiple mode', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} multiple data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));

            const checkboxes = screen.getAllByTestId(/select-checkbox-/);
            expect(checkboxes).toHaveLength(mockOptions.length);
        });

        it('should display multiple selected values', () => {
            render(
                <Select
                    options={mockOptions}
                    multiple
                    defaultValue={['1', '2']}
                    data-testid="select"
                />
            );

            expect(screen.getByTestId('select-multi-value-1')).toBeInTheDocument();
            expect(screen.getByTestId('select-multi-value-2')).toBeInTheDocument();
        });

        it('should remove selected value on remove button click', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    multiple
                    defaultValue={['1', '2']}
                    onChange={onChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-remove-value-1'));
            expect(onChange).toHaveBeenCalledWith(['2']);
        });
    });

    describe('Search Functionality', () => {
        it('should render search input when searchable', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} searchable data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            expect(screen.getByTestId('select-search-input')).toBeInTheDocument();
        });

        it('should filter options based on search query', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} searchable data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            const searchInput = screen.getByTestId('select-search-input');

            await user.type(searchInput, 'Option 2');

            expect(screen.getByTestId('select-option-2')).toBeInTheDocument();
            expect(screen.queryByTestId('select-option-1')).not.toBeInTheDocument();
        });

        it('should show no options message when search has no results', async () => {
            const user = userEvent.setup();
            render(
                <Select
                    options={mockOptions}
                    searchable
                    noOptionsMessage="No results found"
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            await user.type(screen.getByTestId('select-search-input'), 'NonexistentOption');

            expect(screen.getByTestId('select-no-options')).toHaveTextContent('No results found');
        });

        it('should use custom filterOption function', async () => {
            const user = userEvent.setup();
            const filterOption = vi.fn((option, query) =>
                option.value.includes(query)
            );

            render(
                <Select
                    options={mockOptions}
                    searchable
                    filterOption={filterOption}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            await user.type(screen.getByTestId('select-search-input'), '2');

            expect(filterOption).toHaveBeenCalled();
        });

        it('should call onSearch callback', async () => {
            const user = userEvent.setup();
            const onSearch = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    searchable
                    onSearch={onSearch}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            await user.type(screen.getByTestId('select-search-input'), 'test');

            expect(onSearch).toHaveBeenCalled();
        });

        it('should focus search input when dropdown opens', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} searchable data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));

            await waitFor(() => {
                expect(screen.getByTestId('select-search-input')).toHaveFocus();
            });
        });
    });

    describe('Clear Functionality', () => {
        it('should show clear button when clearable and has value', () => {
            render(
                <Select
                    options={mockOptions}
                    clearable
                    defaultValue="1"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-clear-button')).toBeInTheDocument();
        });

        it('should not show clear button when no value', () => {
            render(
                <Select
                    options={mockOptions}
                    clearable
                    data-testid="select"
                />
            );
            expect(screen.queryByTestId('select-clear-button')).not.toBeInTheDocument();
        });

        it('should clear value on clear button click', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    clearable
                    defaultValue="1"
                    onChange={onChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-clear-button'));
            expect(onChange).toHaveBeenCalledWith('');
        });

        it('should clear multiple values', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    multiple
                    clearable
                    defaultValue={['1', '2']}
                    onChange={onChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-clear-button'));
            expect(onChange).toHaveBeenCalledWith([]);
        });
    });

    describe('Keyboard Navigation', () => {
        it('should open dropdown on Enter key', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            const control = screen.getByTestId('select-control');
            await user.click(control);
            await user.keyboard('{Enter}');

            expect(screen.getByTestId('select-dropdown')).not.toHaveClass(/hidden/);
        });

        it('should open dropdown on Space key', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            const control = screen.getByTestId('select-control');
            await user.click(control);
            await user.keyboard(' ');

            expect(screen.getByTestId('select-dropdown')).not.toHaveClass(/hidden/);
        });

        it('should navigate options with ArrowDown', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            const control = screen.getByTestId('select-control');
            await user.click(control);
            await user.keyboard('{Enter}');
            await user.keyboard('{ArrowDown}');

            await waitFor(() => {
                expect(screen.getByTestId('select-option-1')).toHaveClass(/focused/);
            });
        });

        it('should navigate options with ArrowUp', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            const control = screen.getByTestId('select-control');
            await user.click(control);
            await user.keyboard('{Enter}');
            await user.keyboard('{ArrowDown}');
            await user.keyboard('{ArrowDown}');
            await user.keyboard('{ArrowUp}');

            await waitFor(() => {
                expect(screen.getByTestId('select-option-1')).toHaveClass(/focused/);
            });
        });

        it('should select focused option on Enter', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    onChange={onChange}
                    data-testid="select"
                />
            );

            const control = screen.getByTestId('select-control');
            await user.click(control);
            await user.keyboard('{Enter}');
            await user.keyboard('{ArrowDown}');
            await user.keyboard('{Enter}');

            expect(onChange).toHaveBeenCalledWith('1');
        });

        it('should close dropdown on Tab', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            await user.keyboard('{Tab}');

            await waitFor(() => {
                expect(screen.getByTestId('select-dropdown')).toHaveClass(/hidden/);
            });
        });
    });

    describe('Option Groups', () => {
        it('should render option groups', async () => {
            const user = userEvent.setup();
            render(
                <Select
                    optionGroups={mockOptionGroups}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));

            expect(screen.getByTestId('select-group-0')).toHaveTextContent('Group 1');
            expect(screen.getByTestId('select-group-1')).toHaveTextContent('Group 2');
        });

        it('should render options within groups', async () => {
            const user = userEvent.setup();
            render(
                <Select
                    optionGroups={mockOptionGroups}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));

            expect(screen.getByTestId('select-option-1')).toBeInTheDocument();
            expect(screen.getByTestId('select-option-2')).toBeInTheDocument();
            expect(screen.getByTestId('select-option-3')).toBeInTheDocument();
            expect(screen.getByTestId('select-option-4')).toBeInTheDocument();
        });

        it('should select options from groups', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <Select
                    optionGroups={mockOptionGroups}
                    onChange={onChange}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            await user.click(screen.getByTestId('select-option-3'));

            expect(onChange).toHaveBeenCalledWith('3');
        });
    });

    describe('Disabled and Readonly States', () => {
        it('should not open when disabled', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} disabled data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            expect(screen.getByTestId('select-dropdown')).toHaveClass(/hidden/);
        });

        it('should not open when readonly', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} readonly data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            expect(screen.getByTestId('select-dropdown')).toHaveClass(/hidden/);
        });

        it('should have disabled class when disabled', () => {
            render(<Select options={mockOptions} disabled data-testid="select"/>);
            expect(screen.getByTestId('select-control')).toHaveClass(/disabled/);
        });

        it('should have readonly class when readonly', () => {
            render(<Select options={mockOptions} readonly data-testid="select"/>);
            expect(screen.getByTestId('select-control')).toHaveClass(/readonly/);
        });

        it('should not show clear button when disabled', () => {
            render(
                <Select
                    options={mockOptions}
                    clearable
                    disabled
                    defaultValue="1"
                    data-testid="select"
                />
            );
            expect(screen.queryByTestId('select-clear-button')).not.toBeInTheDocument();
        });

        it('should not show remove buttons in multiple mode when disabled', () => {
            render(
                <Select
                    options={mockOptions}
                    multiple
                    disabled
                    defaultValue={['1', '2']}
                    data-testid="select"
                />
            );
            expect(screen.queryByTestId('select-remove-value-1')).not.toBeInTheDocument();
        });
    });

    describe('Loading State', () => {
        it('should show loading spinner', () => {
            render(<Select options={mockOptions} loading data-testid="select"/>);
            expect(screen.getByTestId('select-loading-spinner')).toBeInTheDocument();
        });

        it('should show loading message in dropdown', async () => {
            const user = userEvent.setup();
            render(
                <Select
                    options={mockOptions}
                    loading
                    loadingMessage="Loading data..."
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            expect(screen.getByTestId('select-loading-message')).toHaveTextContent('Loading data...');
        });
    });

    describe('Custom Renderers', () => {
        it('should use custom renderOption', async () => {
            const user = userEvent.setup();
            const renderOption = (option: SelectOption) => (
                <div data-testid={`custom-option-${option.value}`}>
                    Custom: {option.label}
                </div>
            );

            render(
                <Select
                    options={mockOptions}
                    renderOption={renderOption}
                    data-testid="select"
                />
            );
            await user.click(screen.getByTestId('select-control'));

            expect(screen.getByTestId('custom-option-1')).toHaveTextContent('Custom: Option 1');
        });

        it('should use custom renderValue', () => {
            const renderValue = (value: string | string[]) => (
                <div data-testid="custom-value">Selected: {value}</div>
            );

            render(
                <Select
                    options={mockOptions}
                    defaultValue="1"
                    renderValue={renderValue}
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('custom-value')).toHaveTextContent('Selected: 1');
        });

        it('should use custom renderPlaceholder', () => {
            const renderPlaceholder = () => (
                <div data-testid="custom-placeholder">Custom Placeholder</div>
            );

            render(
                <Select
                    options={mockOptions}
                    renderPlaceholder={renderPlaceholder}
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('custom-placeholder')).toHaveTextContent('Custom Placeholder');
        });
    });

    describe('Focus and Blur Events', () => {
        it('should call onFocus callback', async () => {
            const user = userEvent.setup();
            const onFocus = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    onFocus={onFocus}
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            expect(onFocus).toHaveBeenCalled();
        });

        it('should call onBlur callback', async () => {
            const user = userEvent.setup();
            const onBlur = vi.fn();
            render(
                <Select
                    options={mockOptions}
                    onBlur={onBlur}
                    data-testid="select"
                />
            );

            const control = screen.getByTestId('select-control');
            await user.click(control);
            await user.tab();

            await waitFor(() => {
                expect(onBlur).toHaveBeenCalled();
            });
        });

        it('should apply focused class on focus', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            const control = screen.getByTestId('select-control');
            await user.click(control);

            expect(control).toHaveClass(/focused/);
        });
    });

    describe('Accessibility', () => {
        it('should have correct ARIA attributes', () => {
            render(<Select options={mockOptions} id="test-select" data-testid="select"/>);

            const control = screen.getByTestId('select-control');
            expect(control).toHaveAttribute('role', 'combobox');
            expect(control).toHaveAttribute('aria-haspopup', 'listbox');
            expect(control).toHaveAttribute('aria-controls', 'test-select-listbox');
        });

        it('should support aria-label', () => {
            render(
                <Select
                    options={mockOptions}
                    aria-label="Select an option"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-control')).toHaveAttribute('aria-label', 'Select an option');
        });

        it('should support aria-labelledby', () => {
            render(
                <>
                    <label id="select-label">Choose option</label>
                    <Select
                        options={mockOptions}
                        aria-labelledby="select-label"
                        data-testid="select"
                    />
                </>
            );
            expect(screen.getByTestId('select-control')).toHaveAttribute('aria-labelledby', 'select-label');
        });

        it('should support aria-describedby', () => {
            render(
                <Select
                    options={mockOptions}
                    aria-describedby="description"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-control')).toHaveAttribute('aria-describedby', 'description');
        });

        it('should set aria-required when required', () => {
            render(<Select options={mockOptions} required data-testid="select"/>);
            expect(screen.getByTestId('select-control')).toHaveAttribute('aria-required', 'true');
        });

        it('should have aria-multiselectable in multiple mode', async () => {
            const user = userEvent.setup();
            render(
                <Select
                    options={mockOptions}
                    multiple
                    id="test"
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            expect(screen.getByTestId('select-dropdown')).toHaveAttribute('aria-multiselectable', 'true');
        });

        it('should set aria-selected on selected options', async () => {
            const user = userEvent.setup();
            render(
                <Select
                    options={mockOptions}
                    defaultValue="1"
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            expect(screen.getByTestId('select-option-1')).toHaveAttribute('aria-selected', 'true');
        });

        it('should set aria-disabled on disabled options', async () => {
            const user = userEvent.setup();
            render(<Select options={mockOptions} data-testid="select"/>);

            await user.click(screen.getByTestId('select-control'));
            expect(screen.getByTestId('select-option-3')).toHaveAttribute('aria-disabled', 'true');
        });
    });

    describe('Hidden Input for Forms', () => {
        it('should render hidden input with name', () => {
            render(
                <Select
                    options={mockOptions}
                    name="test-select"
                    defaultValue="1"
                    data-testid="select"
                />
            );
            const hiddenInput = screen.getByTestId('select-hidden-input');

            expect(hiddenInput).toHaveAttribute('type', 'hidden');
            expect(hiddenInput).toHaveAttribute('name', 'test-select');
            expect(hiddenInput).toHaveValue('1');
        });

        it('should serialize array values for multiple select', () => {
            render(
                <Select
                    options={mockOptions}
                    name="test-select"
                    multiple
                    defaultValue={['1', '2']}
                    data-testid="select"
                />
            );
            const hiddenInput = screen.getByTestId('select-hidden-input');

            expect(hiddenInput).toHaveValue(JSON.stringify(['1', '2']));
        });
    });

    describe('Hidden Options', () => {
        it('should not display hidden options', async () => {
            const user = userEvent.setup();
            const optionsWithHidden = [
                ...mockOptions,
                {label: 'Hidden Option', value: '5', hidden: true},
            ];

            render(<Select options={optionsWithHidden} data-testid="select"/>);
            await user.click(screen.getByTestId('select-control'));

            expect(screen.queryByTestId('select-option-5')).not.toBeInTheDocument();
        });
    });

    describe('Dropdown Positioning', () => {
        it('should apply correct dropdown alignment', async () => {
            const user = userEvent.setup();
            const {rerender} = render(
                <Select
                    options={mockOptions}
                    dropdownAlign="left"
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            let dropdown = screen.getByTestId('select-dropdown');
            expect(dropdown).toHaveStyle({left: '0'});

            rerender(
                <Select
                    options={mockOptions}
                    dropdownAlign="right"
                    data-testid="select"
                />
            );

            await user.click(screen.getByTestId('select-control'));
            dropdown = screen.getByTestId('select-dropdown');
            expect(dropdown).toHaveStyle({right: '0'});
        });
    });

    describe('Error State', () => {
        it('should apply error class', () => {
            render(<Select options={mockOptions} error data-testid="select"/>);
            expect(screen.getByTestId('select-control')).toHaveClass(/error/);
        });

        it('should apply error class when errorMessage is provided', () => {
            render(
                <Select
                    options={mockOptions}
                    errorMessage="Error occurred"
                    data-testid="select"
                />
            );
            expect(screen.getByTestId('select-control')).toHaveClass(/error/);
        });
    });
});