import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useStaticQuery, graphql } from 'gatsby';
import Container from 'react-bootstrap/Container';
import { Location } from '@reach/router';


const NavLink = (props) => {
    return (
        <div className="nav-item">
            { props.external ? (
                <a className="nav-link" href={props.to}>{props.label}</a>
            ) : (
                <Link className="nav-link" activeClassName="active" to={props.to}>{props.label}</Link>
            )}
        </div>
    )
};
const NavDropdownLink = (props) => {
    return (
        <React.Fragment>
        { props.external ? (
            <a className="dropdown-item" href={props.to}>{props.label}</a>
        ) : (
            <Link className="dropdown-item" to={props.to}>{props.label}</Link>
        )}
        </React.Fragment>
    )
};

const Header = () => {
    const data = useStaticQuery(graphql`
        query HeaderQuery {
            allMarkdownRemark(filter: {frontmatter: {templateKey: {in: ["horse", "feature"]}}}) {
                edges {
                    node {
                        frontmatter {
                            name
                        }
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `);

    let horsePages = getPagesByUrlPart('/pferde/');
    let featurePages = getPagesByUrlPart('/leistungen/');
    horsePages = sortPagesByNavOrder(horsesPages);
    featurePages = sortPagesByNavOrder(featurePages);

    return (
        <header role="banner">
            <Navbar bg="light" variant="dark" expand="md">
                <Container>
                    <Link className="navbar-brand" to="/" style={{ textTransform: 'unset' }}>Reittherapie Bachmaier</Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto pl-lg-5 pl-0">
                            <Location>
                                {({ location }) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink to="/" label="Home" />
                                            <NavDropdown title="Therapien" id="nav-dropdown" active={location.pathname.indexOf('/leistungen/') > -1}>
                                                {featurePages.map((item, index)=> {
                                                    return (
                                                        <NavDropdownLink to={item.node.fields.slug} label={item.node.frontmatter.name} key={index} />
                                                    );
                                                })}
                                            </NavDropdown>
                                            <NavLink to="/ueber-mich" label="Über mich" />
                                            <NavDropdown title="Pferde" id="nav-dropdown" active={location.pathname.indexOf('/pferde/') > -1}>
                                                {horsePages.map((item, index)=> {
                                                    return (
                                                        <NavDropdownLink to={item.node.fields.slug} label={item.node.frontmatter.name} key={index} />
                                                    );
                                                })}
                                            </NavDropdown>
                                        </React.Fragment>
                                    )
                                }}
                            </Location>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
};

function getPagesByUrlPart(pages, urlPart) {
    return pages.filter(item => item.node.fields.slug.indexOf(urlPart) > -1);
}
function sortPagesByNavOrder(pages) {
    pages.sort((page1, page2) => {
        let navOrderPage1 = page1.node.fields.navigationOrder;
        let navOrderPage2 = page2.node.fields.navigationOrder;
        if (navOrderPage1 <= navOrderPage2) {
            return -1;
        } else {
            return 1;
        }
    });
}

export default Header;