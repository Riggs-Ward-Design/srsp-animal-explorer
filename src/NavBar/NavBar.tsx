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
                style={{ justifyContent: 'left', opacity: props.onMoveUp ? 1 : 0 }}
                onClick={props.onMoveUp}
            >
                {`< ${props.upLabel?.replace('Learn About', '')}`}
            </div>

            <div style={{ display: 'flex', gap: '48px', height: '100%' }}>
                <div
                    className='nav-bar-button'
                    style={{ fontSize: '1.25rem', opacity: props.onMoveBack ? 1 : 0 }}
                    onClick={props.onMoveBack}
                >
                    {`< Back`}
                </div>
                <div
                    className='nav-bar-button'
                    style={{ fontSize: '1.25rem', opacity: props.onMoveNext ? 1 : 0 }}
                    onClick={props.onMoveNext}
                >
                    {'Next >'}
                </div>
            </div>

            <div
                className='nav-bar-button'
                style={{ justifyContent: 'right' }}
                onClick={props.onReset}
            >
                Reset
            </div>

        </div>
    );
};

export default NavBar;