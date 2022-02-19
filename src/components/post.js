import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faArrowRotateBack, faCamera, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import CommentsSection from "./snippet/comments-section";
import axios from "axios";
import Cookies from "js-cookie";
import PostTop from "./snippet/postTop";
const PostComponent = (props) => {
    const post = props.post
    const [showComments, setCommentsShow] = useState()
    const [postFile, setPostFile] = useState(post.media && post.media.length > 0 ? post.media[0] : null)
    const [reacted, setReacted] = useState(post.reacted)
    const [reacts_count, setReactsCount] = useState(post.reacts > 0 ? post.reacts : null)
    const [comments_count, setCommentsCount] = useState(post.comments > 0 ? post.comments : null)

    const postReact = () => {
        console.log("clickered")
        const formData = new FormData()
        formData.append('snippetID', post.id)
        formData.append('_snippet', 1)
        formData.append('_react', 2)
        axios.post('http://192.168.1.9:5000/snippet/react/', formData, {
            headers: {
                Authorization: `Bearer ${Cookies.get('access')}`
            }
        }).then((res) => {
            if (res.status == 200) {
                setReacted(res.data.react)
                setReactsCount(res.data.counts != 0 ? res.data.counts : null)
            }
        })
    }

    return <div>

        {post.post ? <PostTop post={post.post} /> : null}

        <div className={`flex rounded-md flex-col bg-gray-800 text-white p-3 justify-center ${post.post ? `rounded-t-none` : null}`}>
            <div className="flex flex-row">
                <div className="flex-row flex">
                    <div>
                        <img src={`http://192.168.1.9:5000${post.author.avatar}`} alt="" className="rounded-full w-12 h-12" />
                    </div>
                    <div className="flex flex-col">
                        <div className="ml-2">
                            <h3 className="font-bold">
                                <a href={`/profile/${post.author.id}`}>{post.author.name}</a>
                            </h3>
                        </div>
                        <div className="ml-2">
                            <small>
                                <Moment fromNow>{post.date}</Moment>
                            </small>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex justify-end items-start">
                    <button className="text-white hover:text-gray-500">...</button>
                </div>
            </div>
            <br />
            <div>
                <p>{post.content}</p>
            </div>
            {postFile || post.media.length > 0 ? <div className="flex-col flex min-w-full">
                <br></br>
                <div>
                    {postFile && ["jpg", "jpeg", "png", "webp", "gif"].some(ext => postFile.toLowerCase().endsWith(ext)) ? <img alt="" src={`http://192.168.1.9:5000${postFile}`} className="w-full h-96 rounded-md object-fill" /> : postFile && ["wembm", "mp4", "mov", "mkv"].some(ext => postFile.toLowerCase().endsWith(ext))  ? <video src={`http://192.168.1.9:5000${postFile}`} alt=""></video> : null}
                </div><br></br>
                <div className="flex justify-center">
                    {post.media.map((file, key) => {
                        return <div key={key} className="flex justify-center px-2">
                            <button disabled={file === postFile} onClick={(e) => { setPostFile(file) }} className={`w-2 h-2 rounded-full ${file === postFile ? "bg-white" : "bg-gray-600 hover:bg-gray-500"}`}></button>
                        </div>
                    })}
                </div>
            </div> : null}
            <br></br>
            <div className="flex-col flex min-w-full">
                <div className="flex p-1 rounded-md min-w-full bg-gray-600 justify-around mt-1">
                    <div className="w-full flex items-center justify-center">
                        <button onClick={postReact} className="flex min-h-full justify-center items-center min-w-full hover:bg-gray-500 rounded-md"><br></br><br></br>
                            <FontAwesomeIcon className={`${reacted ? "text-red-500" : null}`} icon={faHeart}></FontAwesomeIcon> <small className="ml-2">{reacts_count ? reacts_count : null}</small></button>
                    </div>
                    <div className="w-full min-h-full flex  items-center justify-center">
                        <button onClick={() => { setCommentsShow(true) }} disabled={showComments ? !showComments : false} className="flex justify-center items-center min-w-full min-h-full hover:bg-gray-500 rounded-md">
                            <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                            <small className="ml-2 hidden sm:block">{post.comments ? post.comments : null}</small></button>
                    </div>
                    <div className="w-full min-h-full flex items-center justify-center">
                        <button onClick={(e) => {
                            props.setPostToShare(post)
                        }} className="flex min-h-full justify-center items-center min-w-full hover:bg-gray-500 rounded-md">
                            <FontAwesomeIcon icon={faArrowRotateBack}></FontAwesomeIcon>
                            <small className="ml-2 hidden sm:block">{post.shares ? post.shares : null}</small></button>
                    </div>
                </div>
            </div>
            {showComments ? <CommentsSection setCommentsCount={setCommentsCount} postID={post.id} /> : null}
        </div>
        <br></br>
    </div>
}

export default PostComponent