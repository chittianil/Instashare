import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import ThemeContext from '../../context/ThemeContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}
class MyProfile extends Component {
  state = {
    myProfile: {},
    postDetails: [],
    storyDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMyProfile()
  }

  getUpdatedData = eachItem => ({
    followerCount: eachItem.followers_count,
    followingCount: eachItem.following_count,
    id: eachItem.id,
    postCount: eachItem.posts_count,
    profilePicture: eachItem.profile_pic,
    userBio: eachItem.user_bio,
    userId: eachItem.user_id,
    userName: eachItem.user_name,
  })

  getUpdatedPostAndStory = data => ({
    id: data.id,
    image: data.image,
  })

  getMyProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProcess})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/insta-share/my-profile`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = this.getUpdatedData(fetchedData.profile)
      const updatedPost = fetchedData.profile.posts.map(eachData =>
        this.getUpdatedPostAndStory(eachData),
      )

      const updatedStories = fetchedData.profile.stories.map(eachData =>
        this.getUpdatedPostAndStory(eachData),
      )
      console.log(updatedData)
      console.log(updatedPost)
      console.log(updatedStories)

      this.setState({
        myProfile: updatedData,
        postDetails: updatedPost,
        storyDetails: updatedStories,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderMyProfileView = () => {
    const {myProfile, postDetails, storyDetails} = this.state
    const {
      followerCount,
      followingCount,

      postCount,
      profilePicture,
      userBio,
      userName,
      userId,
    } = myProfile
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const textColor = isDarkTheme
            ? 'list-text-dark-theme '
            : 'list-text-light-theme'

          return (
            <div className="user-Details-Container">
              <div className="user-Details-content">
                <div className="profile-container">
                  <img
                    className="profile-img"
                    src={profilePicture}
                    alt="my profile"
                  />

                  <div className="user-post-detail-container">
                    <h1 className={`profile-name ${textColor}`}>{userName}</h1>
                    <ul className="user-follower-container">
                      <li>
                        <p className={`post-count ${textColor}`}>
                          <span className={`count ${textColor}`}>
                            {postCount}{' '}
                          </span>
                          posts
                        </p>
                      </li>
                      <li>
                        <p className={`post-count ${textColor}`}>
                          <span className={`count ${textColor}`}>
                            {followerCount}{' '}
                          </span>
                          followers
                        </p>
                      </li>
                      <li>
                        <p className={`post-count ${textColor}`}>
                          {' '}
                          <span className={`count ${textColor}`}>
                            {followingCount}{' '}
                          </span>
                          following
                        </p>
                      </li>
                    </ul>
                    <p className={`post-count count ${textColor}`}>{userId}</p>
                    <p className={`post-count ${textColor}`}>{userBio}</p>
                  </div>
                </div>
                <div className="users-all-post">
                  <ul className="user-story-container">
                    {storyDetails.map(eachStory => (
                      <li key={eachStory.id} className="story-item">
                        <img
                          className="user-story"
                          src={eachStory.image}
                          alt="my story"
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="user-all-post-container">
                  <div className="users-all-post">
                    <BsGrid3X3 size={15} className={textColor} />
                    <h1 className={`post-count ${textColor}`}>Posts</h1>
                  </div>
                  {postDetails.length > 0 ? (
                    <ul className="all-post-container">
                      {postDetails.map(eachPost => (
                        <li className="all-post-img" key={eachPost.id}>
                          <img
                            className="posted-img"
                            src={eachPost.image}
                            alt="my post"
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="no-post-container">
                      <BiCamera className={`No-post-available ${textColor}`} />
                      <h1 className={`post-count ${textColor}`}>
                        No Posts Yet
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }

  onClickRetry = () => {
    this.getMyProfile()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dahw90b2z/image/upload/v1649208425/Icon_1_qfbohw.png"
        alt="failure view"
      />
      <p className="no-found-heading">Something went wrong. Please try again</p>
      <button
        type="button"
        className="home-page-btn"
        onClick={this.onClickRetry}
      >
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="Oval" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderMyProfileDetailView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMyProfileView()
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
            <>
              <Header />
              <div className={`${bgColorClassName}`}>
                {this.renderMyProfileDetailView()}
              </div>
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default MyProfile
