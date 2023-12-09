import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { ChangeEvent, useRef } from "react";
import { BsSearch } from "react-icons/bs";

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (ref.current) onSearch(ref.current.value);
      }}
    >
      <InputGroup
        marginTop={10}
        paddingLeft={20}
        paddingRight={20}
        marginBottom={8}
      >
        <InputLeftElement marginLeft={20} children={<BsSearch />} />
        <Input
          ref={ref}
          borderRadius={20}
          placeholder="Search Posts ..."
          variant="outline"
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
