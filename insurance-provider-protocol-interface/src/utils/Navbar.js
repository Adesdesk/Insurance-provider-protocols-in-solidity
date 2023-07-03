import React from 'react';
import {
    classnames,
    Container,
    Nav,
    NavItem,
    NavLink,
    Link,
} from 'tailwindcss/react';

const Navbar = () => {
    return (
        <Container>
            <Nav>
                <NavItem>
                    <NavLink to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink to="/insure-a-wallet">Insure Wallet</NavLink>
                </NavItem>
                {/* <NavItem>
                    <NavLink to="/insure-loan-collateral">Insure Collateral</NavLink>
                </NavItem> */}
                <NavItem>
                    <NavLink to="/admin-dashboard">Insure Collateral</NavLink>
                </NavItem>
            </Nav>
        </Container>
    );
};

export default Navbar;
