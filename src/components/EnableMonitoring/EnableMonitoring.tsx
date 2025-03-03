interface EnableMonitoringProps {
    isToggled: boolean;
    setIsToggled: (value: boolean) => void;
}

const EnableMonitoring: React.FC<EnableMonitoringProps> = ({ isToggled, setIsToggled }) => {

    const toggleSwitch = () => {
        setIsToggled(!isToggled);
    };

    return (
        <div
            onClick={toggleSwitch}
            style={{
                display: 'inline-block',
                position: 'relative',
                width: '40px',
                height: '20px',
                backgroundColor: isToggled ? '#4CAF50' : '#ccc',
                borderRadius: '34px',
                transition: 'background-color 0.3s',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    height: '15px',
                    width: '15px',
                    left: isToggled ? '22px' : '4px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)',
                }}
            />
        </div>
    );
};

export default EnableMonitoring;