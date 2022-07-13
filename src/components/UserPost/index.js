import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import {BsHeart} from 'react-icons/bs'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'
import ThemeContext from '../../context/ThemeContext'

import './index.css'

class UserPost extends Component {
  state = {
    isLiked: false,
    likedStatus: false,
    counter: 0,
    commentShow: false,
    commentInput: '',
    commentList: [],
  }

  renderPostLikeStatus = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {userPostDetails} = this.props
    const {postId} = userPostDetails

    const {likedStatus} = this.state
    console.log(likedStatus)

    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify({like_status: likedStatus}),
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedPostId = await response.json()
      console.log(fetchedPostId)
    }
  }

  onclickLikeIncrement = () => {
    this.setState({isLiked: true})
    this.setState(preState => ({counter: preState.counter + 1}))
    this.setState({likedStatus: true}, this.renderPostLikeStatus)
  }

  onClickLikeDecrement = () => {
    this.setState({isLiked: false})
    this.setState(preState => ({counter: preState.counter - 1}))
    this.setState({likedStatus: false}, this.renderPostLikeStatus)
  }

  onCommentToggle = () => {
    this.setState(preState => ({commentShow: !preState.commentShow}))
  }

  onChangeCommentInput = event => {
    this.setState({commentInput: event.target.value})
  }

  onAddComment = event => {
    event.preventDefault()
    const {commentInput} = this.state

    const newComment = {
      id: uuidv4(),
      comment: commentInput,
    }

    this.setState(preState => ({
      commentList: [...preState.commentList, newComment],

      commentInput: '',
    }))
  }

  render() {
    const {userPostDetails} = this.props
    const {
      profilePicture,
      userId,
      userName,
      createdAt,
      likesCount,
      userComments,

      imageUrl,
      caption,
    } = userPostDetails

    const {
      isLiked,
      likedStatus,
      commentShow,
      commentList,
      commentInput,
    } = this.state
    console.log(likedStatus)
    console.log(commentInput)
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const textColor = isDarkTheme
            ? 'list-text-dark-theme'
            : 'list-text-light-theme'

          return (
            <li className="user-Post-Container" testid="postCard">
              <div className="user-Post-content">
                <div className="user-profile-container">
                  <img
                    className="user-profile-img"
                    src={profilePicture}
                    alt="post author profile"
                  />
                  <Link to={`/users/${userId}`} className="nav-link">
                    {' '}
                    <h1 className={`user-name ${textColor}`}>{userName}</h1>
                  </Link>
                </div>
                <img src={imageUrl} alt="post" className="post-img" />
                <div className="post-detail-and-share-detail-container">
                  <div className="reaction-container">
                    {isLiked ? (
                      <button
                        type="button"
                        className={`like-icon-btn ${textColor}`}
                        testid="unLikeIcon"
                        onClick={this.onClickLikeDecrement}
                      >
                        <FcLike size={15} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`like-icon-btn ${textColor}`}
                        testid="likeIcon"
                        onClick={this.onclickLikeIncrement}
                      >
                        <BsHeart size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      className={`like-icon-btn ${textColor}`}
                      onClick={this.onCommentToggle}
                    >
                      <FaRegComment />
                    </button>

                    <BiShareAlt className={`like-icon-btn ${textColor}`} />
                  </div>
                  <p className={`post-description ${textColor}`}>
                    {isLiked ? likesCount + 1 : likesCount} likes
                  </p>

                  <p className={`post-description ${textColor}`}>{caption}</p>

                  {commentShow && (
                    <form
                      className="form-comment-container"
                      onSubmit={this.onAddComment}
                    >
                      <textarea
                        value={commentInput}
                        placeholder="Your Comment"
                        onChange={this.onChangeCommentInput}
                        className={`input-comment ${textColor}`}
                        rows="1"
                      />
                      <button
                        className={`add-button ${textColor}`}
                        type="submit"
                      >
                        Comment
                      </button>
                    </form>
                  )}

                  <div className="post-details">
                    <ul className="comment-item">
                      {commentList.map(eachComment => (
                        <li key={eachComment.id} className="comment-container">
                          <p className={`post-description ${textColor}`}>
                            {eachComment.comment}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <ul className="comment-item">
                      {userComments.map(eachItem => (
                        <li
                          key={eachItem.user_id}
                          className="comment-container"
                        >
                          <p className={`post-description ${textColor}`}>
                            {' '}
                            <span className={`user-commented ${textColor}`}>
                              {eachItem.user_name}
                            </span>{' '}
                            {eachItem.comment}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <p className={`post-description ${textColor}`}>
                      {createdAt}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default UserPost
