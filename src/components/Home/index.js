import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import InstaPost from '../InstaPost'
import UserStories from '../UserStories'

import ThemeContext from '../../context/ThemeContext'

import SearchPost from '../SearchPost'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class Home extends Component {
  state = {
    userSearchResultPosts: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
  }

  componentDidMount() {
    this.getSearchResults()
  }

  getSearchResults = async () => {
    this.setState({apiStatus: apiStatusConstants.inProcess})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
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
      const updatedData = fetchedData.posts.map(eachItem => ({
        caption: eachItem.post_details.caption,
        imageUrl: eachItem.post_details.image_url,
        postId: eachItem.post_id,
        profilePicture: eachItem.profile_pic,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
        createdAt: eachItem.created_at,
        likesCount: eachItem.likes_count,
        userComments: eachItem.comments,
      }))

      console.log(updatedData)
      this.setState({
        userSearchResultPosts: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickSearch = () => {
    this.getSearchResults()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  onEnterSearchInput = () => {
    this.getSearchResults()
  }

  renderSearchPostCardResultView = () => {
    const {userSearchResultPosts, searchInput} = this.state
    const shouldShowPostList = userSearchResultPosts.length > 0
    console.log(searchInput)
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const bgColorClassName = isDarkTheme ? 'nav-bg-dark' : 'nav-bg-light '

          return shouldShowPostList ? (
            <>
              <div className={`search-result-container ${bgColorClassName}`}>
                <div className="search-content">
                  <h1 className="search-result-heading">Search Results</h1>
                </div>
              </div>
              <ul className={`list-item-container ${bgColorClassName}`}>
                {userSearchResultPosts.map(eachPost => (
                  <SearchPost
                    key={eachPost.postId}
                    userPostDetails={eachPost}
                  />
                ))}
              </ul>
            </>
          ) : (
            <div className="no-post-view">
              <img
                src="https://res.cloudinary.com/dahw90b2z/image/upload/v1649202381/Group_1_jhn8xw.png"
                className="no-post-img"
                alt="search not Found"
              />
              <h1 className="no-post-heading">Search Not Found</h1>
              <p className="no-post-description">
                Try different keyword or search again
              </p>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }

  onClickRetry = () => {
    this.getSearchResults()
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

  renderAllSearchPost = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchPostCardResultView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProcess:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    console.log(searchInput)
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColorClassName = isDarkTheme ? 'nav-bg-dark' : 'nav-bg-light '
          return (
            <div className={`${bgColorClassName}`}>
              <Header
                searchInput={searchInput}
                onClickSearch={this.onClickSearch}
                changeSearchInput={this.changeSearchInput}
                onEnterSearchInput={this.onEnterSearchInput}
              />

              {searchInput !== '' ? (
                <>{this.renderAllSearchPost()}</>
              ) : (
                <>
                  <UserStories />
                  <InstaPost />
                </>
              )}
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default Home
