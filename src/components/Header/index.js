import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'
import {AiOutlineClose} from 'react-icons/ai'
import {GiHamburgerMenu} from 'react-icons/gi'
import {HiOutlineLogout} from 'react-icons/hi'
import {FaSearch} from 'react-icons/fa'
import Cookies from 'js-cookie'
import {FiSun} from 'react-icons/fi'
import {RiMoonFill} from 'react-icons/ri'

import ThemeContext from '../../context/ThemeContext'

import './index.css'

class Header extends Component {
  state = {isShowMobileMenu: false, isShowSearch: false}

  onClickHamBergerMenu = () => {
    this.setState(preState => ({isShowMobileMenu: !preState.isShowMobileMenu}))
  }

  onClickCloseButton = () => {
    this.setState({isShowMobileMenu: false})
  }

  onClickSearchTab = () => {
    this.setState(preState => ({isShowSearch: !preState.isShowSearch}))
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickSearchButton = () => {
    const {onClickSearch} = this.props
    onClickSearch()
  }

  onChangeInputSearch = event => {
    const {changeSearchInput} = this.props
    changeSearchInput(event.target.value)
  }

  onKeyChangeEnter = event => {
    const {onEnterSearchInput} = this.props
    if (event.key === 'Enter') {
      onEnterSearchInput()
    }
  }

  renderSearchInput = () => {
    const {searchInput} = this.props
    return (
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          value={searchInput}
          placeholder="Search Caption"
          onChange={this.onChangeInputSearch}
          onKeyDown={this.onKeyChangeEnter}
        />
        <button
          type="button"
          testid="searchIcon"
          className="search-btn"
          onClick={this.onClickSearchButton}
        >
          <FaSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    const {isShowMobileMenu, isShowSearch} = this.state
    const {searchInput} = this.props
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme, toggleTheme} = value

          const onClickToggle = () => {
            toggleTheme()
          }

          const bgColorClassName = isDarkTheme
            ? 'nav-bar-bg-dark'
            : 'nav-bar-bg-light'
          const navItemClassName = isDarkTheme
            ? 'list-text-dark-theme'
            : 'list-text-light-theme'

          const ThemeIcons = isDarkTheme ? (
            <FiSun size={15} color="#ffffff" />
          ) : (
            <RiMoonFill size={15} />
          )

          return (
            <nav className={`nav-header ${bgColorClassName}`}>
              <div className="nav-content">
                <div className="nav-bar-mobile-logo-container">
                  <Link to="/" className="nav-link">
                    <div className="logo-container">
                      <img
                        className="website-logo"
                        src="https://res.cloudinary.com/dahw90b2z/image/upload/v1648981581/Group_qtyxfl.png"
                        alt="website logo"
                      />
                      <h1 className={`nav-menu-item ${navItemClassName}`}>
                        Insta Share
                      </h1>
                    </div>
                  </Link>
                  <div className="theme-icon-and-menu-container">
                    <div className="nav-menu-item">
                      <button
                        type="button"
                        className="theme-btn"
                        onClick={onClickToggle}
                      >
                        {ThemeIcons}
                      </button>
                    </div>

                    <button
                      type="button"
                      className={`nav-mobile-btn ${navItemClassName}`}
                      onClick={this.onClickHamBergerMenu}
                      testid="hamburgerMenuIcon"
                    >
                      <GiHamburgerMenu size={15} />
                    </button>
                  </div>
                </div>
                {isShowMobileMenu && (
                  <div className="menu-mobile-container">
                    <ul className="mobile-menu-nav-item-container">
                      <li className="nav-menu-item">
                        <button
                          type="button"
                          className="mobile-menu-btn"
                          testid="searchIcon"
                          onClick={this.onClickSearchTab}
                        >
                          <FaSearch className="search-icon-mobile" />
                        </button>
                      </li>
                      <li className="nav-menu-item">
                        <Link to="/" className="nav-link">
                          <p className="mobile-menu-item"> Home</p>
                        </Link>
                      </li>
                      <li className="nav-menu-item">
                        <Link to="/my-profile" className="nav-link">
                          <p className="mobile-menu-item">Profile</p>
                        </Link>
                      </li>
                      <li className="nav-item-mobile">
                        <button
                          type="button"
                          className="mobile-menu-btn"
                          onClick={this.onClickLogout}
                        >
                          <HiOutlineLogout />
                        </button>
                      </li>
                      <li className="nav-item-mobile">
                        <button
                          type="button"
                          testid="closeIcon"
                          className="mobile-menu-btn"
                          onClick={this.onClickCloseButton}
                        >
                          <AiOutlineClose />
                        </button>
                      </li>
                    </ul>
                    <div className="nav-item-mobile">
                      {isShowSearch && (
                        <div className="search-input-container">
                          <input
                            type="search"
                            className="search-input"
                            value={searchInput}
                            placeholder="Search Caption"
                            onChange={this.onChangeInputSearch}
                            onKeyDown={this.onKeyChangeEnter}
                          />
                          <button
                            type="button"
                            testid="searchIcon"
                            className="search-btn"
                            onClick={this.onClickSearchButton}
                          >
                            <FaSearch className="search-icon" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="nav-bar-large-container">
                  <Link to="/" className="nav-link">
                    <div className="logo-container">
                      <img
                        className="website-logo"
                        src="https://res.cloudinary.com/dahw90b2z/image/upload/v1648981581/Group_qtyxfl.png"
                        alt="website logo"
                      />
                      <h1 className={`nav-menu-item ${navItemClassName}`}>
                        Insta Share
                      </h1>
                    </div>
                  </Link>
                  <ul className="nav-menu">
                    <li className="nav-menu-item">
                      {this.renderSearchInput()}
                    </li>
                    <li className="nav-menu-item">
                      <button
                        type="button"
                        className="theme-btn"
                        onClick={onClickToggle}
                      >
                        {' '}
                        {ThemeIcons}
                      </button>
                    </li>
                    <li className="nav-menu-item">
                      <Link to="/" className="nav-link">
                        <p className={`${navItemClassName}`}>Home</p>
                      </Link>
                    </li>

                    <li className="nav-menu-item">
                      <Link to="/my-profile" className="nav-link">
                        <p className={`${navItemClassName}`}>Profile</p>
                      </Link>
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="logout-desktop-btn"
                    onClick={this.onClickLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default withRouter(Header)
