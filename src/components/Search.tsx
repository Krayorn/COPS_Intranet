import { useState } from "react"

export function Search({ options }) {
    const [search, setSearch] = useState("")
    const possibilities = search !== "" ? options.filter(option => option.value.toLowerCase().includes(search.toLowerCase())) : []
    
    return (
        <form>
            <input className="text-black" type="text" onChange={e => setSearch(e.target.value)} value={search} placeholder="John Doe" autoComplete="off"></input>
            {
                possibilities.length > 0 && <div className="flex flex-col bg-white text-black" >
                    {possibilities.map(possibility => {
                        return <a key={possibility.link} href={possibility.link} className="mt-2 cursor-pointer" >{possibility.value}</a>
                    })}
                </div>
            }
        </form>
    )
}