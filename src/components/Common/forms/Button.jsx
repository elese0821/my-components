export default function Button({ type, children, onClick, className }) {
    return (
        <button
            type={!type && "button"}
            className={`bg-green-500 py-2 px-4 rounded text-white block ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
