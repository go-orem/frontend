import { FC } from "react";
import IconSearch from "../icons/IconSearch";

interface SearchProps {}

const Search: FC<SearchProps> = () => {
  return (
    <div className="relative w-auto px-3 pb-3 pl-5.5 pr-5.5">
      <input
        type="search"
        name="search"
        aria-label="Cari atau chat"
        placeholder="Cari atau chat..."
        className="
          w-full
          rounded-full
          border
          border-gray-600
          bg-transparent
          pl-5
          pr-4
          py-2
          text-sm
          font-mono
          text-gray-300
          placeholder-gray-500
          focus:outline-none
          focus:ring-1
          focus:ring-[var(--primarycolor)]
        "
      />

      {/* Icon */}
      <div className="absolute w-10 h-10 -inset-y-0.5 right-5 flex items-center pointer-events-none text-gray-400">
        <IconSearch />
      </div>
    </div>
  );
};

export default Search;
