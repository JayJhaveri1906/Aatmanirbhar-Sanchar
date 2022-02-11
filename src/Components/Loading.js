import React from 'react';
import Loader from "react-loader-spinner";

class Loading extends React.PureComponent {
    render() {
        return (<Loader type="Puff" color="#00BFFF" //Type of loader
            height={100}
            width={100}
            timeout={3000}
            //3 secs
        />);
    }
}

export default Loading;
