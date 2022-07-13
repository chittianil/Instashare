import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'
import UserPost from '../UserPost'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class InstaPost extends Component {
  state = {
    userPosts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPost()
  }

  getPost = async () => {
    this.setState({apiStatus: apiStatusConstants.inProcess})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/insta-share/posts`
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
        userPosts: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderPostView = () => {
    const {userPosts} = this.state

    return (
      <>
        <ul className="list-item-container">
          {userPosts.map(eachPost => (
            <UserPost key={eachPost.postId} userPostDetails={eachPost} />
          ))}
        </ul>
      </>
    )
  }

  onClickRetry = () => {
    this.getPost()
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

  renderAllPost = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPostView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProcess:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderAllPost()}</>
  }
}

export default InstaPost
