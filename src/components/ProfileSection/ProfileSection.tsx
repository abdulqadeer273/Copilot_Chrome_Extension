import { useState } from 'react'

const ProfileSection = () => {
    const [tab] = useState("ProfileSection");
    return (
        <div>{tab}</div>
    )
}

export default ProfileSection