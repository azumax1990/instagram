// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.



require("@rails/ujs").start()

require("@rails/activestorage").start()
require("channels")


import $ from 'jquery'
import 'slick-carousel'
import axios from 'axios'
import { csrfToken } from 'rails-ujs'
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken()



// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)


// function
// const handleHeartDisplay = (hasLiked) => {
  
  
// }

document.addEventListener('DOMContentLoaded', () => {
  $('.profile-image').on('click', () => {
    $('.profile-image-modal').fadeIn()
    $('.profile-image-modal').on('click', () => {
      $('.profile-image-modal').fadeOut()
    })
    $('#profile-modal-close').on('click', () => {
      $('.profile-image-modal').fadeOut()
    })
  })

  $('.slider').slick( {
    dots: true,
  })

  // いいね機能
    // いいね表示
  $('.post').each(function (index, element) {
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

  // いいねdestroy
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


  // コメント機能
    // コメント一覧表示
  // const commentAppend = (comment) => {
  //   $(commentContainer).append(
  //     `<div class="comment-show">
  //       <p class="comment-account-name"></p>
  //       <p class="comment-content">${comment.content}</p>
  //     </div>`
  //   )
  // }
  
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
})