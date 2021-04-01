import 'regenerator-runtime/runtime';
import React, { useState, useContext, useEffect } from 'react';
import { appStore, onAppMount } from './state/app';
import { Wallet } from './components/Wallet';
import { Contract } from './components/Contract';
import { Keys } from './components/Keys';
import { Gallery } from './components/Gallery';
import { login, logout, } from './utils';
import './global.css';
import logowhite from './assets/logo-white.svg';
import { Layout, Button, Typography, Avatar, Carousel, Tooltip, Popover } from 'antd';
import 'antd/dist/antd.dark.css';
import { HighlightOutlined, SmileOutlined, SmileFilled, UserOutlined } from '@ant-design/icons';

import getConfig from './config';
import { configConsumerProps } from 'antd/lib/config-provider';

const content = (
    <div>
        <p> <Gallery /> </p>
    </div>
);

const contentStyle = {
    height: '200px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

const { networkId } = getConfig(process.env.NODE_ENV || 'development');
const { Paragraph } = Typography;
const { Header, Footer, Content } = Layout;

export default function App() {

    // use React Hooks to store greeting in component state
    const [greeting, setGreeting] = React.useState();

    // when the user has not yet interacted with the form, disable the button
    const [buttonDisabled, setButtonDisabled] = React.useState(true);

    // after submitting the form, we want to show Notification
    const [showNotification, setShowNotification] = React.useState(false);

    // The useEffect hook can be used to fire side-effects during render
    // Learn more: https://reactjs.org/docs/hooks-intro.html
    React.useEffect(
        () => {
            // in this case, we only care to query the contract when signed in
            if (window.walletConnection.isSignedIn()) {

                // window.contract is set by initContract in index.js
                window.contract.getGreeting({ accountId: window.accountId })
                    .then(greetingFromContract => {
                        setGreeting(greetingFromContract);
                    });
            }
        },

        // The second argument to useEffect tells React when to re-run the effect
        // Use an empty array to specify "only run on first render"
        // This works because signing into NEAR Wallet reloads the page
        []
    );

    // if not signed in, return early with sign-in prompt
    if (!window.walletConnection.isSignedIn()) {
        return (
            <main>
                <h2>Welcome to the Figment Learn Intermediate NEAR Pathway!</h2>
                <p>
                    By default,<br /> this create-near-app project runs in development mode.<br />
                    It connects to <b><a href='https://wallet.testnet.near.org' alt='wallet.testnet.near.org'>wallet.testnet.near.org</a></b>.
                    This works just like the main network ("mainnet") wallet, but the NEAR Tokens on testnet aren't
                    convertible to other currencies – they're just for testing!
                </p>
                <p align='center' style={{ fontSize: 'small', background: 'rgba(0,1,1,15)', borderStyle: 'solid', borderRadius: '5px', borderWidth: '2px', padding: '4px', }}>
                    To make use of this app running on the NEAR blockchain, you need to sign in!<br /> You can create a <a href="https://docs.near.org/docs/develop/basics/create-account">NEAR testnet account</a>, if you do not already have one.
                </p>
                <p style={{ textAlign: 'center', marginTop: '1.5em', marginBottom: '1.5em', }}>
                    <button onClick={login}>Sign in</button>
                </p>
                <p style={{ fontSize: 'small', background: 'rgba(0,1,1,15)', borderStyle: 'solid', borderRadius: '5px', borderWidth: '2px', padding: '4px', }}>
                    It is important to note that if you use this project from a gitpod, you will not need to configure your local development environment in any way to make use of this create-near-app based template.<br />
                    You are, of course, free to clone the repository and work on it locally - however this may require you <br />to perform additional configuration on your system.<br /><br />
                    The documentation on the GitHub repository should be sufficient to get you going, and there are additional links to offsite documentation there as well. Enjoy, and happy hacking!<br /><br />
                     - the Learn Team @ <a href="https://figment.io">Figment</a>
                </p>
            </main>
        );
    }

    return (
        // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
        <>
            <Layout>
                <Header style={{ background: 'rgba(0,0,0,25)', borderRadius: '4px', borderColor: 'rgb(255,255,0)', borderWidth: '2px' }}>
                    <label style={{ fontSize: 'medium', background: 'rgba(0,1,1,15)', borderStyle: 'solid', borderRadius: '5px', borderWidth: '1px', padding: '16px', verticalAlign: 'middle', width: 'justify', textAlign: 'justify' }}>
                        <Popover content={content} title="Account Balance">
                            <Avatar size={48} icon={<UserOutlined />} /> <label htmlFor="greeting" style={{ color: 'var(--secondary)', borderBottom: '0px solid var(--secondary)' }}> {greeting} </label> {window.accountId}
                        </Popover>
                    </label>
                    <Button type='primary' style={{ float: 'right', borderStyle: 'outset', borderWidth: '2px', fontSize: 'small', marginTop: '1.5em', marginBottom: '1.5em', textTransform: 'uppercase' }} onClick={logout}>
                        Sign Out
                    </Button>
                </Header>
                <Layout>
                    <Content>
                        <main>
                            <Carousel autoplay>
                                <div>
                                    <h3 style={contentStyle}><img src={logowhite} size={30} style={{ width: '40px', }} /><p>dope</p></h3>
                                </div>
                                <div>
                                    <h3 style={contentStyle}><img src={logowhite} size={30} style={{ width: '40px', }} /></h3>
                                </div>
                                <div>
                                    <h3 style={contentStyle}><img src={logowhite} size={30} style={{ width: '40px', }} /></h3>
                                </div>
                                <div>
                                    <h3 style={contentStyle}><img src={logowhite} size={30} style={{ width: '40px', }} /></h3>
                                </div>
                            </Carousel>

                        </main>

                        {showNotification && <Notification />}

                    </Content>

                </Layout>

                <Footer>
                    <hr />
                    <a target="_blank" rel="noreferrer" href="https://docs.near.org/docs/roles/developer/contracts/intro">smart contract</a>
                </Footer>

            </Layout>

        </>
    );
}

// this component gets rendered by App after the form is submitted
function Notification() {
    const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
    return (
        <aside>
            <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
                {window.accountId}
            </a>
            {' '/* React trims whitespace around tags; insert literal space character when needed */}
            called method: 'setGreeting' in contract:
            {' '}
            <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
                {window.contract.contractId}
            </a>
            <footer>
                <div>✔ Succeeded</div>
                <div>Just now</div>
            </footer>
        </aside>
    );
}
