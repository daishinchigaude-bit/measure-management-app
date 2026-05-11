interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <input
      type="text"
      placeholder="キーワード検索..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
    />
  )
}

export default SearchBar