import classes from "./WidgetComments.module.css";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function WidgetComments() {
  const AccsesToken = useSelector((state) => state.authToken.accessToken);
  const memberId = useParams().memberId;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [isWriter, setIsWriter] = useState(false);

  const [nowPage, setNowPage] = useState(1);
  const itemsIncludePage = 3;

  useEffect(() => {
    const loggedInUserId = sessionStorage.getItem("memberId");
    setIsMe(
      loggedInUserId === memberId ||
        comments.some((comment) => comment.writerNickName === loggedInUserId)
      // memberId === +sessionStorage.getItem("memberId") ? true : false
    );
    setIsWriter(
      comments.some((comment) => comment.writerNickName === loggedInUserId)
    );
    getComments(memberId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, AccsesToken]);

  const getComments = async (memberId) => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/mypage/cheermsg/${memberId}`,
        {
          params: { memberId },
          headers: {
            Authorization: AccsesToken,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        setComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const CreateComment = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/mypage/cheermsg`,
        {
          memberId,
          content: newComment,
        },
        {
          headers: { Authorization: AccsesToken },
        }
      )
      .then((response) => {
        // console.log(response);
        getComments(memberId);
        setNewComment("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SaveEditedComment = () => {
    EditComment(editedCommentId, editedComment);
    setIsEdit(false);
    setEditedComment("");
  };

  const EditComment = () => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/mypage/cheermsg`,
        {
          cheerMessageId: editedCommentId,
          memberId,
          content: editedComment,
        },
        {
          headers: { Authorization: AccsesToken },
        }
      )
      .then((response) => {
        // console.log(response);
        getComments(memberId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteAlert = (messageId) => {
    let confirmed = false;

    Swal.fire({
      icon: "question",
      title: "댓글을 삭제합니다.",
      text: "댓글을 정말 삭제하시겠습니까?",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
    }).then((response) => {
      if (response.isConfirmed) {
        confirmed = true;
        deleteComment(messageId);
      }
    });
  };

  const deleteComment = (messageId) => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/mypage/cheermsg/${messageId}`,
        { headers: { Authorization: AccsesToken } }
      )
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "댓글이 삭제되었습니다.",
            text: "",
            confirmButtonText: "확인",
          });
        }
        // console.log(response);
        getComments(memberId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const indexOfLastItem = nowPage * itemsIncludePage;
  const indexOfFirstItem = indexOfLastItem - itemsIncludePage;

  const startIndex = Math.max(indexOfFirstItem, 0);
  const endIndex = Math.min(indexOfLastItem, comments.length);

  const nowComments =
    comments.length === 0 ? [] : comments.slice(startIndex, endIndex);
  // const nowComments =
  //   comments[0] === undefined ? comments.slice(startIndex, endIndex) : [];

  const paginate = (pageNumber) => {
    setNowPage(pageNumber);
  };

  return (
    <div className={classes.WidgetComments}>
      <div>
        <p className={classes.WidgetCommentsTitle}>
          응원의 메세지를 남겨주세요!
        </p>
        <div className={classes.CommentSection}>
          {comments.length > itemsIncludePage && (
            <div>
              <button
                className={classes.editButtonStyle}
                onClick={() => paginate(nowPage - 1)}
                disabled={nowPage === 1}
              >
                <img src="../../images/Widget/before.png" alt="before" />
              </button>
            </div>
          )}
          {nowComments.length === 0 && <p>댓글이 없습니다.</p>}
          {nowComments.length > 0 &&
            nowComments.map((comment) => (
              <div key={comment.messageId}>
                {isEdit && editedCommentId === comment.messageId ? (
                  <div>
                    <input
                      className={classes.editinputstyle}
                      type="text"
                      value={editedComment}
                      onChange={(event) => {
                        setEditedComment(event.target.value);
                        setEditedCommentId(comment.messageId);
                      }}
                    />
                    <button onClick={() => SaveEditedComment()}>저장</button>
                    <button onClick={() => setIsEdit(false)}>취소</button>
                  </div>
                ) : (
                  <div className={classes.commentPostIt}>
                    <p>{comment.content}</p>
                    {comment.writerNickName}
                    {comment.createdDate}
                    {/* {isMe && isWriter && ( */}
                    {isMe && (
                      <button
                        className={classes.editButtonStyle}
                        onClick={() => {
                          setIsEdit(comment.messageId);
                          setEditedComment(comment.content);
                          setEditedCommentId(comment.messageId);
                        }}
                      >
                        <img src="../../images/Widget/edit.png" alt="edit" />
                      </button>
                    )}
                    {/* {isMe && isWriter && ( */}
                    {isMe && (
                      <button
                        className={classes.editButtonStyle}
                        // onClick={() => DeleteComment(comment.messageId)}
                        onClick={() => deleteAlert(comment.messageId)}
                      >
                        <img src="../../images/Widget/clear.png" alt="clear" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          {comments.length > itemsIncludePage && (
            <div>
              <button
                className={classes.editButtonStyle}
                onClick={() => paginate(nowPage + 1)}
                disabled={
                  nowComments.length < itemsIncludePage ||
                  nowComments.length === 0
                }
              >
                <img src="../../images/Widget/next.png" alt="next" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={classes.widgetInputStyle}>
        <input
          className={classes.inputstyle}
          type="text"
          value={newComment}
          placeholder="응원의 댓글을 남겨주세요!"
          onChange={(event) => setNewComment(event.target.value)}
        />
        <button className={classes.inputBtn} onClick={CreateComment}>
          댓글 작성하기
        </button>
      </div>
    </div>
  );
}

export default WidgetComments;
