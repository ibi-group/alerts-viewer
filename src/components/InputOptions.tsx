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