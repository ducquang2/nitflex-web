
type SearchBarProps = {
  placeholder?: string;
  value: string,
  onSubmit: (value: string) => void
  onChange: (value: string) => void
}

const SearchBar = (props: SearchBarProps) => {
  const { placeholder = "Search", value, onChange, onSubmit } = props;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit((e.target as HTMLFormElement).query.value.toString().trim());
      }}
    >
      <label className="input input-bordered flex items-center gap-2 pr-0">
        <input
          name="query"
          type="search"
          className="grow"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value.toString().trim())}
        />
        <button type="submit" className="btn btn-ghost">
          <i className="icon-search" />
        </button>
      </label>
    </form>
  )
}

export default SearchBar;