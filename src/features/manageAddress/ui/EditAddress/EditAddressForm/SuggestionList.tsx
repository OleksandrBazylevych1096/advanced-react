import type { AddressSearchResult } from "@/features/manageAddress/model/types/Address";

import styles from "./EditAddressForm.module.scss";

interface SuggestionsListProps {
  suggestions: AddressSearchResult[] | undefined;
  show: boolean;
  onSelect: (suggestion: AddressSearchResult) => void;
}

export const SuggestionsList = (props: SuggestionsListProps) => {
  const { suggestions, show, onSelect } = props;

  if (!show || !suggestions || suggestions.length === 0) return null;

  return (
    <div className={styles.suggestions}>
      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.lat}-${suggestion.lon}-${index}`}
          className={styles.suggestionItem}
          onClick={() => onSelect(suggestion)}
          tabIndex={0}
        >
          {suggestion.displayName}
        </div>
      ))}
    </div>
  );
};
