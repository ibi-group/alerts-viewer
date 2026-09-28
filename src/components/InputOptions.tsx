import {useState } from "react";

const InputOptions = ({ filter }: { filter: (searchTerm: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        filter(event.target.value);
    }

    return (
        <div className="input-options">
            <label htmlFor="route-search">Search:</label>
            <input 
                id="route-search" 
                onChange={handleSearchChange} 
                placeholder="Enter search term" 
                type="text" 
                value={searchTerm} 
            />
        </div>
    );
};

export default InputOptions;