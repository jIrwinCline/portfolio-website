import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from "gatsby"
import { HelmetDatoCms } from 'gatsby-source-datocms'
import Sidebar from './sidebar'
import '../styles/index.sass'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';




class TemplateWrapper extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      showComponent: false,
    }
    this._onButtonClick = this._onButtonClick.bind(this);
  }

  _onButtonClick() {
    if (!this.state.showComponent){
      this.setState({
        showComponent: true,
      });
    } else {
      this.setState({
        showComponent: false,
      });
    }
  }

  render() {
    return (
    <StaticQuery query={graphql`
      query LayoutQuery
      {
        datoCmsSite {
          globalSeo {
            siteName
          }
          faviconMetaTags {
            ...GatsbyDatoCmsFaviconMetaTags
          }
        }
        datoCmsHome {
          seoMetaTags {
            ...GatsbyDatoCmsSeoMetaTags
          }
          introTextNode {
            childMarkdownRemark {
              html
            }
          }
          copyright
        }
        allDatoCmsSocialProfile(sort: { fields: [position], order: ASC }) {
          edges {
            node {
              profileType
              url
            }
          }
        }
      }
    `}
    render={data => (
      <div className="container">
        <HelmetDatoCms
          favicon={data.datoCmsSite.faviconMetaTags}
          seo={data.datoCmsHome.seoMetaTags}
        />
        <div className="container__sidebar">
          <div className="sidebar">
            <h6 className="sidebar__title">
              <Link to="/">{data.datoCmsSite.globalSeo.siteName}</Link>
            </h6>
            <div
              className="sidebar__intro"
              dangerouslySetInnerHTML={{
                __html: data.datoCmsHome.introTextNode.childMarkdownRemark.html,
              }}
            />
            <ul className="sidebar__menu">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
            <p className="sidebar__social">
              {data.allDatoCmsSocialProfile.edges.map(({ node: profile }) => (
                <a
                  key={profile.profileType}
                  href={profile.url}
                  target="blank"
                  className={`social social--${profile.profileType.toLowerCase()}`}
                > </a>
              ))}
            </p>
            <div className="sidebar__copyright">{data.datoCmsHome.copyright}</div>
          </div>
        </div>
        <div onClick={this._onButtonClick} className="container__body">
          <div className="container__mobile-header">
            <div className="mobile-header">
              <div className="mobile-header__menu">
                <a to="#" data-js="toggleSidebar" />
                
              </div>
              <div className="mobile-header__logo">
              
                <Link to="/">{data.datoCmsSite.globalSeo.siteName}</Link>
              </div>
            </div>
          </div>
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            transitionAppear={true}
            >
          {this.state.showComponent ? (
              <div className='sidebar__total'>
                <Sidebar />
              </div>
          ) : null}
          </ReactCSSTransitionGroup>
          {this.props.children}
        </div>
      </div>
      )}
    />
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.object,
}

export default TemplateWrapper
