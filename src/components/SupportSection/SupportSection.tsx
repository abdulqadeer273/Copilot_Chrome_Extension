import { useState } from 'react'

const SupportSection = () => {
    const [tab] = useState("SupportSection");
    return (
        <div>{tab}</div>
    )
}

export default SupportSection