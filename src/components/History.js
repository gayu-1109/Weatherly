export default function History({ data, onSelect, onDelete }) {
    return (
        <ul className="history-list">
            <br /><br />
            {data.map(city => (
                <li key={city}>
                    <span onClick={() => onSelect(city)}>{city}</span>

                    {/* apply the CSS class */}
                    <button
                        className="delete-btn"
                        onClick={() => onDelete(city)}
                    >
                        ✕
                    </button>
                </li>
            ))}
        </ul>
    );
}
