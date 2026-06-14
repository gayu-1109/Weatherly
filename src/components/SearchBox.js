import { useState } from "react";

export default function SearchBox({ onSearch }) {
    const [city, setCity] = useState("");

    return (
        <div className="search">
            <input
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={() => onSearch(city)}>Search</button>
        </div>
    );
}
