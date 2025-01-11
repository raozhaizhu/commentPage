// ./src/components/Component1.jsx
import React, { useState } from 'react';

const Component1 = () => {
    const data = {
        currentUser: {
            image: {
                png: './images/avatars/image-juliusomo.png',
                webp: './images/avatars/image-juliusomo.webp',
            },
            username: 'juliusomo',
        },
        comments: [
            {
                id: 1,
                content:
                    "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
                createdAt: '1 month ago',
                score: 12,
                user: {
                    image: {
                        png: './images/avatars/image-amyrobson.png',
                        webp: './images/avatars/image-amyrobson.webp',
                    },
                    username: 'amyrobson',
                },
                replies: [],
            },
            {
                id: 2,
                content:
                    "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
                createdAt: '2 weeks ago',
                score: 5,
                user: {
                    image: {
                        png: './images/avatars/image-maxblagun.png',
                        webp: './images/avatars/image-maxblagun.webp',
                    },
                    username: 'maxblagun',
                },
                replies: [
                    {
                        id: 3,
                        content:
                            "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
                        createdAt: '1 week ago',
                        score: 4,
                        replyingTo: 'maxblagun',
                        user: {
                            image: {
                                png: './images/avatars/image-ramsesmiron.png',
                                webp: './images/avatars/image-ramsesmiron.webp',
                            },
                            username: 'ramsesmiron',
                        },
                    },
                    {
                        id: 4,
                        content:
                            "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
                        createdAt: '2 days ago',
                        score: 2,
                        replyingTo: 'ramsesmiron',
                        user: {
                            image: {
                                png: './images/avatars/image-juliusomo.png',
                                webp: './images/avatars/image-juliusomo.webp',
                            },
                            username: 'juliusomo',
                        },
                    },
                ],
            },
        ],
    };

    const [comments, setComments] = useState(data.comments);
    const [newComment, setNewComment] = useState(''); // 新的评论内容
    const [newReply, setNewReply] = useState(''); // 新的回复内容
    const [replyingTo, setReplyingTo] = useState([]); // 记录当前回复的评论
    const [newReplyReply, setNewReplyReply] = useState(''); // 新的回复的回复内容
    const [replyingToReply, setReplyingToReply] = useState(null);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const currentUser = data.currentUser;
    const [editingId, setEditingId] = useState(null); // 记录正在编辑的评论/回复ID
    const [editContent, setEditContent] = useState(''); // 存储编辑的内容
    const [userVotes, setUserVotes] = useState({}); // 格式: { commentId: 'up'/'down' }

    // 处理新评论
    const handleNewComment = () => {
        if (!newComment.trim()) return; // 防止提交空评论

        // 创建新的评论对象
        const newCommentObject = {
            id: comments.length + 1,
            content: newComment,
            createdAt: 'Just now',
            score: 0,
            user: currentUser,
            replies: [],
        };

        setComments([...comments, newCommentObject]); // 更新评论列表

        setNewComment(''); // 清空输入框
    };

    // 通用的处理回复函数
    const handleReply = (parentId, content, level) => {
        if (!content.trim()) return;

        setComments(
            comments.map((comment) => {
                // 如果是直接回复评论
                if (level === 'comment' && comment.id === parentId) {
                    return {
                        ...comment,
                        replies: [
                            ...comment.replies,
                            {
                                id: Date.now(),
                                content,
                                createdAt: 'Just now',
                                score: 0,
                                user: currentUser,
                                replyingTo: comment.user.username,
                            },
                        ],
                    };
                }

                // 如果是回复某条回复，需要先找到包含该回复的评论
                if (level === 'reply') {
                    // 检查这个评论的replies中是否包含我们要回复的那条回复
                    const replyExists = comment.replies.some((reply) => reply.id === parentId);

                    if (replyExists) {
                        return {
                            ...comment,
                            replies: [
                                ...comment.replies,
                                {
                                    id: Date.now(),
                                    content,
                                    createdAt: 'Just now',
                                    score: 0,
                                    user: currentUser,
                                    replyingTo: comment.replies.find((reply) => reply.id === parentId).user.username,
                                },
                            ],
                        };
                    }
                }

                return comment;
            })
        );

        // 清理状态
        setNewReply('');
        setNewReplyReply('');
        setReplyingTo([]);
        setReplyingToReply(null);
        setActiveCommentId(null);
    };

    const handleReplyClick = (commentId, replyId) => {
        console.log('Clicked reply for comment:', commentId, 'reply:', replyId);
        setActiveCommentId(commentId);
        setReplyingToReply(replyId);
    };

    // 添加删除处理函数
    const handleDelete = (commentId, replyId = null) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            setComments(
                comments
                    .map((comment) => {
                        if (replyId === null) {
                            // 删除主评论
                            return comment.id === commentId ? null : comment;
                        } else {
                            // 删除回复
                            if (comment.id === commentId) {
                                return {
                                    ...comment,
                                    replies: comment.replies.filter((reply) => reply.id !== replyId),
                                };
                            }
                            return comment;
                        }
                    })
                    .filter(Boolean)
            ); // 过滤掉 null 值
        }
    };

    // 添加编辑处理函数
    const handleEdit = (commentId, replyId = null, content) => {
        setEditingId(replyId || commentId);
        setEditContent(content);
    };

    // 添加保存编辑的函数
    const handleSaveEdit = (commentId, replyId = null) => {
        if (!editContent.trim()) return;

        setComments(
            comments.map((comment) => {
                if (replyId === null) {
                    // 编辑主评论
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            content: editContent,
                        };
                    }
                } else {
                    // 编辑回复
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: comment.replies.map((reply) =>
                                reply.id === replyId ? { ...reply, content: editContent } : reply
                            ),
                        };
                    }
                }
                return comment;
            })
        );

        // 清理编辑状态
        setEditingId(null);
        setEditContent('');
    };

    // 处理投票的函数
    const handleVote = (commentId, replyId = null, isUpvote) => {
        setComments(
            comments.map((comment) => {
                if (replyId === null) {
                    // 处理评论的投票
                    if (comment.id === commentId) {
                        // 如果已经投过相同的票，取消投票
                        if ((isUpvote && comment.vote === 1) || (!isUpvote && comment.vote === -1)) {
                            const { vote, ...rest } = comment; // 删除 vote 属性
                            return rest;
                        }
                        // 设置新的投票
                        return { ...comment, vote: isUpvote ? 1 : -1 };
                    }
                } else {
                    // 处理回复的投票
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: comment.replies.map((reply) => {
                                if (reply.id === replyId) {
                                    // 如果已经投过相同的票，取消投票
                                    if ((isUpvote && reply.vote === 1) || (!isUpvote && reply.vote === -1)) {
                                        const { vote, ...rest } = reply; // 删除 vote 属性
                                        return rest;
                                    }
                                    // 设置新的投票
                                    return { ...reply, vote: isUpvote ? 1 : -1 };
                                }
                                return reply;
                            }),
                        };
                    }
                }
                return comment;
            })
        );
    };

    return (
        <div className='wholepage min-h-screen bg-[#eae7fa] p-[1rem] flex flex-col gap-[1.5rem] justify-center items-center'>
            {comments.map((comment, index) => (
                <div
                    key={index}
                    className='discussBoxWrapper bg-[#eae7fa] w-[80%] flex flex-col gap-[1.5rem] items-center rounded-md'
                >
                    <div className='commentBoxWrapper w-full bg-[#fff] flex p-[1.5rem] gap-[1.5rem] items-center rounded-md'>
                        <div className='voteBox bg-[#eae7fa] py-[0.75rem] min-w-[3rem] flex flex-col justify-between items-center rounded-md'>
                            <button
                                className={`text-[#7373e3] text-[1.2rem] ${
                                    comment.vote === 1 ? 'text-[#5358b6] font-bold' : ''
                                }`}
                                onClick={() => handleVote(comment.id, null, true)}
                            >
                                +
                            </button>
                            <p className={`text-[#2222aa] py-[0.5rem]' ${comment.vote ? 'font-bold ' : ''} `}>
                                {comment.score + (comment.vote || 0)}
                            </p>
                            <button
                                className={`text-[#7373e3] text-[1.2rem] ${
                                    comment.vote === -1 ? 'text-[#5358b6] font-bold' : ''
                                }`}
                                onClick={() => handleVote(comment.id, null, false)}
                            >
                                -
                            </button>
                        </div>
                        <div className='self-start commentBox w-full bg-[#fff] flex flex-col justify-between items-start'>
                            <div className='commentHeader w-full flex gap-[1rem] items-center mb-[1rem]'>
                                <div className='commentAvatar'>
                                    <img
                                        src={comment.user.image.png}
                                        alt={comment.user.username}
                                        className='w-[2rem] h-[2rem]'
                                    />
                                </div>
                                <div className='commentName font-bold'>{comment.user.username}</div>
                                {comment.user.username === currentUser.username && (
                                    <div className='bg-[#5257be] text-white text-[0.75rem] py-[0.1rem] px-[0.5rem] rounded'>
                                        you
                                    </div>
                                )}

                                <div className='commentDate opacity-[0.5]'>{comment.createdAt}</div>

                                {comment.user.username === currentUser.username ? (
                                    <div
                                        className='ml-auto interactBtns flex gap-[1rem] items-center justify-center
                                text-[#2222aa]
                                '
                                    >
                                        <div
                                            className='deleteBtn flex items-center text-[#e75f61] cursor-pointer'
                                            onClick={() => handleDelete(comment.id)}
                                        >
                                            <i className='fa fa-trash mr-[0.5rem]'></i>
                                            <p>Delete</p>
                                        </div>
                                        <div
                                            className='editBtn flex items-center cursor-pointer'
                                            onClick={() => handleEdit(comment.id, null, comment.content)}
                                        >
                                            <i className='fa fa-edit mr-[0.5rem]'></i>
                                            <p>Edit</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className='ml-auto interactBtns flex gap-[1rem] items-center justify-center 
                                text-[#2222aa]
                                '
                                    >
                                        <div
                                            className='replyBtn flex items-center'
                                            role='button'
                                            onClick={() => setReplyingTo(comment.id)}
                                        >
                                            <i className='fa fa-reply mr-[0.5rem]'></i>
                                            <p>Reply</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='commentBody flex-grow opacity-[0.7]'>
                                {editingId === comment.id ? (
                                    <div className='edit-container'>
                                        <textarea
                                            className='w-full p-[0.5rem] border border-gray rounded'
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                        <button
                                            className='mt-[0.5rem] bg-[#5358b6] text-white py-[0.5rem] px-[1rem] rounded-md'
                                            onClick={() => handleSaveEdit(comment.id)}
                                        >
                                            UPDATE
                                        </button>
                                    </div>
                                ) : (
                                    comment.content
                                )}
                            </div>
                        </div>
                    </div>
                    {/* 仅当点击"Reply"后，显示回复框 */}
                    {replyingTo === comment.id && (
                        <div className='replyInputBox w-full bg-[#fff] p-[1rem] flex gap-[1rem]'>
                            <div className='currentUserAvatar'>
                                <img src={currentUser.image.png} className='w-[2rem] h-[2rem]' />
                            </div>
                            <div className='flex-grow border border-gray rounded'>
                                <textarea
                                    className='w-full p-[0.5rem]'
                                    placeholder='Add a reply...'
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                />
                            </div>

                            <button
                                className='self-start mt-[0.5rem] bg-[#5358b6] text-white py-[0.5rem] px-[1rem] rounded-md'
                                onClick={() => handleReply(comment.id, newReply, 'comment')}
                            >
                                Reply
                            </button>
                        </div>
                    )}
                    {/* ✅ 条件渲染：仅当存在 replies 时渲染回复列表 */}
                    {comment.replies.length > 0 && (
                        <div className='replyBox w-[95%] ml-auto flex flex-col gap-[1rem] border-l-2 border-l-[#b4b4c7]'>
                            {comment.replies.map((reply, replyIndex) => (
                                <div
                                    key={replyIndex}
                                    className='replyItemWrapper w-[95%] ml-auto flex gap-[1.5rem] bg-[#fff] p-[1.5rem] rounded-md'
                                >
                                    <div className='voteBox bg-[#eae7fa] py-[0.75rem] min-w-[3rem] flex flex-col justify-between items-center rounded-md'>
                                        <button
                                            className={`text-[#7373e3] text-[1.2rem] ${
                                                reply.vote === 1 ? 'text-[#5358b6] font-bold' : ''
                                            }`}
                                            onClick={() => handleVote(comment.id, reply.id, true)}
                                        >
                                            +
                                        </button>
                                        <p className={`text-[#2222aa] py-[0.5rem]' ${reply.vote ? 'font-bold ' : ''} `}>
                                            {reply.score + (reply.vote || 0)}
                                        </p>
                                        <button
                                            className={`text-[#7373e3] text-[1.2rem] ${
                                                reply.vote === -1 ? 'text-[#5358b6] font-bold' : ''
                                            }`}
                                            onClick={() => handleVote(comment.id, reply.id, false)}
                                        >
                                            -
                                        </button>
                                    </div>
                                    <div className='replyItem w-full bg-[#fff]'>
                                        <div className='replyHeader w-full flex gap-[1rem] items-center mb-[1rem]'>
                                            <div className='replyAvatar'>
                                                <img
                                                    src={reply.user.image.png}
                                                    alt={reply.user.username}
                                                    className='w-[2rem] h-[2rem]'
                                                />
                                            </div>
                                            <div className='replyName font-bold'>{reply.user.username}</div>
                                            {reply.user.username === currentUser.username && (
                                                <div className='bg-[#5257be] text-white text-[0.75rem] py-[0.1rem] px-[0.5rem] rounded'>
                                                    you
                                                </div>
                                            )}
                                            <div className='replyDate opacity-[0.5]'>{reply.createdAt}</div>
                                            {reply.user.username === currentUser.username ? (
                                                <div className='ml-auto interactBtns flex gap-[1rem] items-center justify-center text-[#2222aa]'>
                                                    <div
                                                        className='deleteBtn flex items-center text-[#e75f61] cursor-pointer'
                                                        onClick={() => handleDelete(comment.id, reply.id)}
                                                    >
                                                        <i className='fa fa-trash mr-[0.5rem]'></i>
                                                        <p>Delete</p>
                                                    </div>
                                                    <div
                                                        className='editBtn flex items-center cursor-pointer'
                                                        onClick={() => handleEdit(comment.id, reply.id, reply.content)}
                                                    >
                                                        <i className='fa fa-edit mr-[0.5rem]'></i>
                                                        <p>Edit</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='interactBtns flex gap-[1rem] items-center justify-center ml-auto text-[#2222aa]'>
                                                    <div
                                                        className='replyBtn flex items-center'
                                                        role='button'
                                                        onClick={() => handleReplyClick(comment.id, reply.id)}
                                                    >
                                                        <i className='fa fa-reply mr-[0.5rem]'></i>
                                                        <p>Reply</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className='replyBody opacity-[0.7]'>
                                            {editingId === reply.id ? (
                                                <div className='edit-container'>
                                                    <textarea
                                                        className='w-full p-[0.5rem] border border-gray rounded'
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                    />
                                                    <button
                                                        className='mt-[0.5rem] bg-[#5358b6] text-white py-[0.5rem] px-[1rem] rounded-md'
                                                        onClick={() => handleSaveEdit(comment.id, reply.id)}
                                                    >
                                                        UPDATE
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className='text-[#2222aa] font-bold mr-[0.5rem]'>
                                                        @{reply.replyingTo}
                                                    </span>
                                                    {reply.content}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {replyingToReply && activeCommentId === comment.id && (
                                <div className='replyInputBox w-[95%] ml-auto bg-[#fff] p-[1rem] flex gap-[1rem]'>
                                    <div className='currentUserAvatar'>
                                        <img src={currentUser.image.png} className='w-[2rem] h-[2rem]' />
                                    </div>
                                    <div className='flex-grow border border-gray rounded'>
                                        <textarea
                                            className='w-full p-[0.5rem]'
                                            placeholder='Add a reply...'
                                            value={newReplyReply}
                                            onChange={(e) => setNewReplyReply(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className='self-start mt-[0.5rem] bg-[#5358b6] text-white py-[0.5rem] px-[1rem] rounded-md'
                                        onClick={() => handleReply(replyingToReply, newReplyReply, 'reply')}
                                    >
                                        Reply
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            <div
                className='w-[80%] bg-[#fff] px-[1.5rem] py-[1rem] rounded-md
                flex gap-[1rem] items-strat justify-between
                '
            >
                <div className='currentUserAvatar'>
                    <img src={currentUser.image.png} className='w-[2rem] h-[2rem]' />
                </div>
                <div className='flex-grow border border-gray rounded'>
                    <textarea
                        className='px-[1rem] py-[0.5rem] '
                        placeholder='Add a comment...'
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </div>

                <a
                    className='self-start bg-[#5358b6] px-[1rem] py-[0.5rem] text-white  rounded-md'
                    role='button'
                    onClick={handleNewComment}
                >
                    SEND
                </a>
            </div>
        </div>
    );
};

export default Component1;
