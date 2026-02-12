import './NavBar.css'

interface NavBarProps {
    upLabel?: string;
    onMoveUp?: () => void;
    onMoveBack?: () => void;
    onMoveNext?: () => void;
    onReset?: () => void;
}

const NavBar = (props: NavBarProps) => {

    return (
        <div className='nav-bar'>
            
            <div 
                className='nav-bar-button'
                onClick={props.onMoveUp}
                style={{
                    justifyContent: 'left',
                    opacity: props.onMoveUp ? 1 : 0
                }}
            >
                {`< ${props.upLabel?.replace('Learn About', '')}`}
            </div>

            <div style={{ display: 'flex', gap: '48px', height: '100%', fontSize: '1.25rem' }}>
                <div
                    className='nav-bar-button'
                    onClick={props.onMoveBack}
                    style={{
                        opacity: props.onMoveBack ? 1 : 0
                    }}
                >
                    {`< Back`}
                </div>
                <div
                    className='nav-bar-button'
                    onClick={props.onMoveNext}
                    style={{
                        opacity: props.onMoveNext ? 1 : 0
                    }}
                >
                    {'Next >'}
                </div>
            </div>

            <div
                className='nav-bar-button'
                onClick={props.onReset}
                style={{
                    justifyContent: 'right'
                }}
            >
                Reset
            </div>

        </div>
    );
};

export default NavBar;