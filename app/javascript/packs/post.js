import $ from 'jquery'
import 'slick-carousel'
import axios from 'axios'
import { csrfToken } from 'rails-ujs'
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken()

const commentModalShow = (id) => {
  $(`.post-modal${id}`).removeClass('hidden')
    $('.slider').slick('setPosition')
    $('.modal-delete').on('click', () => {
      $(`.post-modal${id}`).addClass('hidden')
    })
}

// const appendNewComment = (comment) => {
//   $(modalTopCommentContainer).append(
//     `<div class="modal-comment-box">
//       <div class="modal-comment-left">
//         <a href="#"><img src="${comment.user.avatar_url}"></a>
//       </div>
//       <div class="modal-comment-right">
//         <p class="comment-account">${comment.user.account}</p>
//         <p class="modal-comment">${comment.content}</p>
//       </div>
//     </div>
//   `)
// }

document.addEventListener('DOMContentLoaded', () => {

  // 投稿slide機能
  $('.slider').slick( {
    dots: true,
  })

  // いいね機能
    // いいね表示
  $('.post').each((index, element) => {
    const postId = $(element).data('postId')
    axios.get(`/posts/${postId}/likes`)
      .then( (response) => {
        const hasLiked = response.data.hasLiked
        const likeAmounts = response.data.likeCounts
        const activeLike = $(`.active-like${postId}`)
        const like       = $(`.like${postId}`)
        const likeCounts = $(`.like-counts${postId}`)
        if (hasLiked) {
          $(activeLike).removeClass('hidden')
        } else {
          $(like).removeClass('hidden')
        }
        if (likeAmounts > 0) {
          $(likeCounts).append(
            `<p>${likeAmounts}人がいいねしました！</p>
          `)
        }
      })
  })
    
    // いいねcreate
  $('.like').on('click', event => {
    const id = $(event.currentTarget).data('id')
    axios.post(`/posts/${id}/likes`)
      .then((response) => {
        if (response.data.status === 'ok') {
          const likeAmounts = response.data.likeCounts
          const activeLike = $(`.active-like${id}`)
          const like       = $(`.like${id}`)
          const likeCounts = $(`.like-counts${id}`)
          $(activeLike).removeClass('hidden')
          $(like).addClass('hidden')
          $(likeCounts).html('')
          $(likeCounts).append(
            `<p>${likeAmounts}人がいいねしました！</p>
          `)
        }
      })
      .catch((e) => {
        window.alert('error')
        console.log(e)
      })
  })
  
    //いいねdestroy
  $('.active-like').on('click', event => {
    const id = $(event.currentTarget).data('id')
    axios.delete(`/posts/${id}/likes`)
      .then((response) => {
        if (response.data.status === 'ok') {
          const likeAmounts = response.data.likeCounts
          const activeLike = $(`.active-like${id}`)
          const like       = $(`.like${id}`)
          const likeCounts = $(`.like-counts${id}`)
          $(activeLike).addClass('hidden')
          $(like).removeClass('hidden')
          $(likeCounts).html('')
          if (likeAmounts > 0) {
            $(likeCounts).append(
              `<p>${likeAmounts}人がいいねしました！</p>
            `)
          }
        }
      })
      .catch((e) => {
        window.alert('error')
        console.log(e)
      })
  })

    //コメント一覧表示
  $('.post').each(function (index, element) {
    const postId = $(element).data('postId')
    axios.get(`/posts/${postId}/comments`)
    .then((response) => {
      const comments = response.data
      const commentContainer = $(`.comment${postId}`)
      comments.forEach((comment) => { 
        $(commentContainer).append(
          `<div class="comment-show">
            <p class="comment-account-name">${comment.user.account}</p>
            <p class="comment-content">${comment.content}</p>
          </div>`)
      })
    })
  })
  

    // コメント投稿
  $('.btn-comment').on('click', event => {
    const id = $(event.currentTarget).data('id')
    const commentContent = $(`#comment_content${id}`)
    const content = $(commentContent).val()
    if (!content) {
      window.alert('コメントを入力してください')
    } else {
      axios.post(`/posts/${id}/comments`, {comment: {content: content}})
        .then((response) => {
          const comment = response.data
          const commentContainer = $(`.comment${id}`)
          $(commentContainer).append(
            `<div class="comment-show">
              <p class="comment-account-name">${comment.user.account}</p>
              <p class="comment-content">${comment.content}</p>
            </div>`
          )
          $(commentContent).val('')
        })
    }
  })

  // トップページ(モーダル)からのコメント機能
    // コメント一覧欄表示
  $('.post-comment').on('click', event => {
    const id = $(event.currentTarget).data('id')
    commentModalShow(id)

    axios.get(`/posts/${id}/comments`)
    .then((response) => {
      const comments = response.data
      const modalTopCommentContainer = $(`.modal-top-comment-container${id}`)
      $(modalTopCommentContainer).html('')
      comments.forEach(comment => {
        $(modalTopCommentContainer).append(
          `<div class="modal-comment-box">
            <div class="modal-comment-left">
              <a href="/profile/${comment.user.id}"><img src="${comment.user.avatar_url}"></a>
            </div>
            <div class="modal-comment-right">
              <p class="comment-account">${comment.user.account}</p>
              <p class="modal-comment">${comment.content}</p>
            </div>
          </div>
        `)
      })
    })
  })

  $('.comment-title').on('click', event => {
    const id = $(event.currentTarget).data('id')
    commentModalShow(id)

    axios.get(`/posts/${id}/comments`)
    .then((response) => {
      const comments = response.data
      const modalTopCommentContainer = $(`.modal-top-comment-container${id}`)
      $(modalTopCommentContainer).html('')
      comments.forEach(comment => {
        $(modalTopCommentContainer).append(
          `<div class="modal-comment-box">
            <div class="modal-comment-left">
              <a href="#"><img src="${comment.user.avatar_url}"></a>
            </div>
            <div class="modal-comment-right">
              <p class="comment-account">${comment.user.account}</p>
              <p class="modal-comment">${comment.content}</p>
            </div>
          </div>
        `)
      })

    })
  })

    // コメント投稿機能
  $('.btn-top-comment').on('click', event => {
    const id = $(event.currentTarget).data('id')
    const topContent = $(`#top_content${id}`)
    const content = $(topContent).val()
    const modalTopCommentContainer = $(`.modal-top-comment-container${id}`)
    if (!content) {
      window.alert('コメントを入力して下さい')
      
    } else {
      axios.post(`/posts/${id}/comments`, {comment: {content: content}})
      .then((response) => {
        const comment = response.data
        $(modalTopCommentContainer).append(
          `<div class="modal-comment-box">
            <div class="modal-comment-left">
              <a href="#"><img src="${comment.user.avatar_url}"></a>
            </div>
            <div class="modal-comment-right">
              <p class="comment-account">${comment.user.account}</p>
              <p class="modal-comment">${comment.content}</p>
            </div>
          </div>
        `)
        $(`#top_content${id}`).val('')
      })
    }
  })

})