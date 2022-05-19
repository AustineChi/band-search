interface Props {
  handleSearch: (...args: any[]) => void;
}

function Search({ handleSearch }: Props) {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    handleSearch(e.target.value);
  return <input type="text" placeholder="Search Band" onChange={onChange} />;
}

export default Search;
