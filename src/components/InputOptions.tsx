import { Search } from '@styled-icons/fa-solid/Search'
import { SortAmountDown } from '@styled-icons/fa-solid/SortAmountDown'
import { SortAmountUp } from '@styled-icons/fa-solid/SortAmountUp'
import { Filter } from '@styled-icons/fa-solid/Filter'
import { Dropdown } from '@opentripplanner/building-blocks'

const EffectDropdown = () => {
    return (
        <select className="effect-dropdown">
            <option value="">All Effects</option>
            <option value="delay">Delay</option>
            <option value="detour">Detour</option>
            <option value="suspension">Suspension</option>
        </select>
    );
};

const InputOptions = ({
    searchTerm,
    setSearchTerm
}: { 
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}) => {

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    return (
        <div className="input-options">
            <div className="route-search">
                <Search className="search-icon" />
                <input
                    className="route-search-input"
                    id="route-search-input"
                    onChange={handleSearchChange}
                    placeholder="Search by route ID or name"
                    type="text"
                    value={searchTerm}
                />
            </div>
            <EffectDropdown />
        </div>
    );
};

export default InputOptions;