import { Search } from '@styled-icons/fa-solid/Search'
import { SortAmountDown } from '@styled-icons/fa-solid/SortAmountDown'
import { SortAmountUp } from '@styled-icons/fa-solid/SortAmountUp'
import { Filter } from '@styled-icons/fa-solid/Filter'
import { Dropdown } from '@opentripplanner/building-blocks'

import type { Effect } from './types'

const EffectDropdown = ({
    selectedEffect, 
    setSelectedEffect,
    effects,
    EffectIcon
}: { 
    selectedEffect: string; 
    setSelectedEffect: (effect: string) => void 
    effects: Effect[] | undefined;
    EffectIcon: React.ComponentType<{ effect: string }> | undefined;
}) => {

    const handleEffectChange = (effect: string) => {
        setSelectedEffect(effect);
    }

    return (
        <Dropdown 
            className="effect-dropdown"
            id="effect-dropdown"
            label="Filter alerts by effect"
            listLabel="Alert effects"
            text={
                <span className="filter-options__effect-text">
                    <Filter className="filter-icon"/>
                    {selectedEffect || "All Effects"}
                </span>
            }
        >
            <li>
                <button
                    type="button"
                    className={`filter-options__effect-option${!selectedEffect ? ' filter-options__effect-option--selected' : ''}`}
                    onClick={() => handleEffectChange('')}
                >
                    <span>All effects</span>
                </button>
            </li>
            {effects?.map((effect) => (
                <li key={effect.name}>
                    <button
                        type="button"
                        className={`filter-options__effect-option${selectedEffect === effect.name ? ' filter-options__effect-option--selected' : ''}`}
                        onClick={() => handleEffectChange(effect.name)}
                    >
                        {EffectIcon ? (
                            <span className="filter-options__effect-icon filter-options__effect-icon--menu">
                                <EffectIcon effect={effect.name} />
                            </span>
                        ) : null}
                        <span>{effect.name}</span>
                    </button>
                </li>
            ))}
        </Dropdown>
    );
};

const InputOptions = ({
    effects,
    EffectIcon,
    searchTerm,
    setSearchTerm,
    selectedEffect,
    setSelectedEffect,
    showExpiredAlerts,
    showActiveAlerts,
    setShowExpiredAlerts,
    setShowActiveAlerts
}: { 
    effects: Effect[] | undefined;
    EffectIcon: React.ComponentType<{ effect: string }> | undefined;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedEffect: string;
    setSelectedEffect: (effect: string) => void;
    showExpiredAlerts: boolean;
    showActiveAlerts: boolean;
    setShowExpiredAlerts: (show: boolean) => void;
    setShowActiveAlerts: (show: boolean) => void;
}) => {

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    return (
        <div className="input-options">
            <div className="option-row">
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
                <EffectDropdown
                    selectedEffect={selectedEffect}
                    setSelectedEffect={setSelectedEffect}
                    effects={effects}
                    EffectIcon={EffectIcon}
                />
            </div>
            <div className="option-row ">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={showActiveAlerts}
                        onChange={() => setShowActiveAlerts(!showActiveAlerts)}
                    />
                    Non-expired alerts
                </label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={showExpiredAlerts}
                        onChange={() => setShowExpiredAlerts(!showExpiredAlerts)}
                    />
                    Expired alerts
                </label>
            </div>
        </div>
    );
};

export default InputOptions;