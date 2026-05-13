interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 text-slate-800 shadow-sm transition focus-within:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
      <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <input
        type="text"
        placeholder="キーワード検索..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
    </div>
  )
}

export default SearchBar