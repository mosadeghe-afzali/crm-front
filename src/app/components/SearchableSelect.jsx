import SearchableSelect from "react-select/async";

export default function AjaxSelect({
  placeholder = "انتخاب کنید...",
  fetchUrl,
  searchField = "full_name",
  onChange,
  value,
}) {

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/${fetchUrl}?${searchField}=${inputValue}`
      );

      const data = await res.json();

      return data.data.map((item) => ({
        value: item.id,
        label: item.full_name ?? item.name ?? item.title,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  return (
    <SearchableSelect
      cacheOptions
      loadOptions={loadOptions}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      noOptionsMessage={() => "موردی یافت نشد"}
      isClearable
    />
  );
}
