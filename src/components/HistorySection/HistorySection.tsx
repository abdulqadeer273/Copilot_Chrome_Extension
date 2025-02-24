import { useState } from "react"

const HistorySection = () => {
    const [tab] = useState("HistorySection")
    return (
        <div>{tab}</div>
    )
}

export default HistorySection