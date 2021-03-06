import React from 'react';
import Fetcher from "./utilities/fetcher.jsx"
import NavBootstrap from "./layouts/nav-bootstrap.jsx"
import Footer from "./layouts/footer.jsx"
import {browserHistory} from 'react-router';
import {connect} from "react-redux";
import {setUid, setUser, dismissAlert} from "./utilities/actions"
import { store } from "../store"

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {backgroundColor: '#000000'};
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){
        let self = this;
        let options = null;
        store.subscribe(function(){
            let storeState = store.getState();
            if (storeState.options) {
                self.setState({backgroundColor: storeState.options.background_color ? storeState.options.background_color.value : '#ffffff'});
            }
            if(!options && storeState.options){
                options = store.getState().options;
                document.getElementById('servicebot-loader').classList.add('move-out');
            }
        })
    }

    handleLogout() {
        let that = this;

        Fetcher("/api/v1/auth/session/clear").then(function(result){
            that.setState({uid: null});
            localStorage.removeItem("permissions");
            store.dispatch(setUid(null));
            store.dispatch(dismissAlert([]));
            browserHistory.push('/');
        }).then(function () {
            store.dispatch(setUser(null));
        })
    }

    render () {
        let self = this;
        return(
                <div className="app-container" style={{backgroundColor: this.state.backgroundColor}}>
                    <NavBootstrap handleLogout={this.handleLogout} uid={this.state.uid}/>
                    {self.props.children}
                    <Footer/>
                </div>
        );
    }
}

export default App;
