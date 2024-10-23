import { ThreeCircles } from 'react-loader-spinner'

export const Loader = () => {
    const divStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '300px',
    }
    return (
        <div style={divStyle}>
            <ThreeCircles
            visible={true}
            height="100"
            width="100"
            color='blue'
            ariaLabel='three-circles-loading'
            ></ThreeCircles>
        </div>
    )
}