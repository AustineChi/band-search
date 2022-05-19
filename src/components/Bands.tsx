import axios from "axios";
import { useEffect, useState } from "react";
import { debounce } from "../utils/debounce";
import Search from "./SearchInput";

const Bands = () => {
  const defaultList = ["A", "B", "C", "D", "E"];
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [listData, setListData] = useState(defaultList);

  const displayBands = listData.map((band: string) => (
    <li key={band}>{band}</li>
  ));

  async function handleSearch(searchTerm: string) {
    try {
      if (searchTerm) {
        setListData(defaultList);
        setSearchResults([]);
        const response = await axios(
          `https://itunes.apple.com/search?term=${searchTerm}`
        );
        const songNames: string[] = response.data.results.map(
          (song: any) => song.collectionName
        );
        const sortedSongNames: string[] = songNames.sort(
          (a: string, b: string) => a.localeCompare(b)
        );
        const bands: string[] = Array.from(new Set(sortedSongNames));
        const topBands: string[] = bands.slice(0, 5);
        setSearchResults(topBands);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const debouncedSearch = debounce(handleSearch, 1000);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let resultData = [
        ...searchResults,
        ...defaultList.slice(searchResults.length),
      ];
      let currentListData = [...listData];
      const firstItem: string = resultData[0];
      currentListData.shift();
      resultData.shift();
      setSearchResults([...resultData, firstItem]);
      setListData([...currentListData, firstItem]);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [listData, searchResults, defaultList]);

  return (
    <div>
      <Search handleSearch={debouncedSearch} />
      <ul>{displayBands}</ul>
    </div>
  );
};

export default Bands;
