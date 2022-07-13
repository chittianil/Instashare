import {Component} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ThemeContext from '../../context/ThemeContext'

import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class UserStories extends Component {
  state = {
    userStories: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserStories()
  }

  getUserStories = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProcess})
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.users_stories.map(eachStory => ({
        storyUrl: eachStory.story_url,
        userId: eachStory.user_id,
        userName: eachStory.user_name,
      }))
      console.log(updatedData)
      this.setState({
        userStories: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container-story" testid="loader">
      <Loader type="Oval" color="#3b82f6" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getUserStories()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dahw90b2z/image/upload/v1649208425/Icon_1_qfbohw.png"
        alt="failure view"
      />
      <h1 className="no-found-heading">
        Something went wrong. Please try again
      </h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="home-page-btn"
        onClick={this.onClickRetry}
        testid="button"
      >
        Try again
      </button>
    </div>
  )

  renderStoryView = () => {
    const {userStories} = this.state
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const textColor = isDarkTheme
            ? 'list-text-dark-theme'
            : 'list-text-light-theme '
          return (
            <Slider {...settings}>
              {userStories.map(eachItem => {
                const {userName, storyUrl, userId} = eachItem
                return (
                  <ul className={`slick-item ${textColor}`} key={userId}>
                    <li className="slick">
                      <img
                        className="logo-image"
                        src={storyUrl}
                        alt="user story"
                      />
                      <h1 className={`name-text ${textColor}`}>{userName}</h1>
                    </li>
                  </ul>
                )
              })}
            </Slider>
          )
        }}
      </ThemeContext.Consumer>
    )
  }

  renderAllStory = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderStoryView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProcess:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColorClassName = isDarkTheme ? 'nav-bg-dark' : 'nav-bg-light'
          return (
            <div className={`main-container ${bgColorClassName}`}>
              <div className="slick-container">{this.renderAllStory()}</div>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default UserStories
