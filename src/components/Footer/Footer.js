import React, { Component } from 'react';
import Translate   from 'react-translate-component';

import NavLink from '../NavLink/index';

import '../../localization/en/footer';
import '../../localization/ru/footer';

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="container-fluid">
                    <NavLink to="/Blog" className="text-muted mr-3">
                        <Translate content='footer.blog'>Blog</Translate>
                    </NavLink>
                    <NavLink to="/Documentations" className="text-muted mr-3">
                        <Translate content='footer.documentations'>Documentations</Translate>
                    </NavLink>
                    <NavLink to="/Tutorials" className="text-muted">
                        <Translate content='footer.tutorials'>Tutorials</Translate>
                    </NavLink>
                </div>
            </footer>
        );
    }
}

export default Footer;
