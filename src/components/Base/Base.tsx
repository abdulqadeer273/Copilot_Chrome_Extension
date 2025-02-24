import React from "react"
const Tab1 = React.lazy(() => import('../ChatSection/ChatSection'))
const Tab2 = React.lazy(() => import('../HistorySection/HistorySection'))
const Tab3 = React.lazy(() => import('../SupportSection/SupportSection'))
const Tab4 = React.lazy(() => import('../ProfileSection/ProfileSection'))

const components = {
    Tab1,
    Tab2,
    Tab3,
    Tab4,
}
interface ComponentProps {
    activeTab: 'Tab1' | 'Tab2' | 'Tab3' | 'Tab4';
    [key: string]: any;
}

function Component(props: ComponentProps) {
    const DynamicComponent = components[props.activeTab] as React.ComponentType<ComponentProps>
    if (!components[props.activeTab]) {
        return <p>Component is not defined: {props.activeTab}</p>
    }

    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <DynamicComponent {...props} />
        </React.Suspense>
    )
}

export { Component }