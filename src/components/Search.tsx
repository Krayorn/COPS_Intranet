import { useState } from "react"

interface SearchOption {
    value: string;
    link: string;
}

interface SearchProps {
    options: SearchOption[];
}

export function Search({ options }: SearchProps) {
    const [search, setSearch] = useState("")
    const possibilities = search !== "" ? options.filter(option => option.value.toLowerCase().includes(search.toLowerCase())) : []
    
    return (
        <div className="relative">
            <form onSubmit={(e) => e.preventDefault()}>
                <input 
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-lg text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300" 
                    type="text" 
                    onChange={e => setSearch(e.target.value)} 
                    value={search} 
                    placeholder="Search for personnel, cases, or civilians..." 
                    autoComplete="off"
                />
            </form>
            
            {possibilities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-cyan-400/30 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                    {possibilities.map((possibility, index) => (
                        <a 
                            key={possibility.link} 
                            href={possibility.link} 
                            className={`block px-4 py-3 text-cyan-100 hover:bg-cyan-400/10 hover:text-cyan-300 transition-all duration-200 border-b border-cyan-400/10 last:border-b-0 ${
                                index === 0 ? 'rounded-t-lg' : ''
                            } ${index === possibilities.length - 1 ? 'rounded-b-lg' : ''}`}
                        >
                            {possibility.value}
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}