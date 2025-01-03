import React from "react";

type SearchBarProps = {
  placeholder?: string;
  value: string,
  onSubmit: (value: string) => void
  onChange: (value: string) => void
  className?: string
}

const SearchBar = React.forwardRef<HTMLFormElement, SearchBarProps>((props, ref) => {
  const { placeholder = "Search", value, onChange, onSubmit, ...rest } = props;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit((e.target as HTMLFormElement).query.value.toString().trim());
      }}
      ref={ref}
      {...rest}
    >
      <label className="input input-bordered flex items-center gap-2 pr-0">
        <input
          name="query"
          type="search"
          className="grow"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value.toString())}
        />
        <button type="submit" className="btn btn-ghost">
          <i className="icon-search" />
        </button>
      </label>
    </form>
  )
})

export default SearchBar;