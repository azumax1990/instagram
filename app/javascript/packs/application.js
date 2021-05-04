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
        const activeLike = $(`.active-like${postId}`)
        const like       = $(`.like${postId}`)
        if (hasLiked) {
          $(activeLike).removeClass('hidden')
        } else {
          $(like).removeClass('hidden')
        }
      })
  })
  
  // いいねcreate
  $('.like').on('click', event => {
    const id = $(event.currentTarget).data('id')
    axios.post(`/posts/${id}/likes`)
      .then((response) => {
        if (response.data.status === 'ok') {
          const activeLike = $(`.active-like${id}`)
          const like       = $(`.like${id}`)
          $(activeLike).removeClass('hidden')
          $(like).addClass('hidden')
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
          const activeLike = $(`.active-like${id}`)
          const like       = $(`.like${id}`)
          $(activeLike).addClass('hidden')
          $(like).removeClass('hidden')
        }
      })
      .catch((e) => {
        window.alert('error')
        console.log(e)
      })
  })


  // コメント機能
    // コメント一覧表示
  const commentAppend = (comment) => {
    $(commentContainer).append(
      `<div class="comment-show">
        <p class="comment-account-name"></p>
        <p class="comment-content">${comment.content}</p>
      </div>`
    )
  }
  
  $('.post').each(function (index, element) {
    const postId = $(element).data('postId')
    axios.get(`/posts/${postId}/comments`)
    .then((response) => {
      const comments = response.data
      const commentContainer = $(`.comment${postId}`)
      comments.forEach((comment) => {
        $(commentContainer).append(
          `<div class="comment-show">
            <p class="comment-account-name"></p>
            <p class="comment-content">${comment.content}</p>
          </div>`
        )
      })
    })
  })
  

    // コメント投稿
  $('.btn-comment').on('click', () => {
    const content = $('#comment_content').val()
    if (!content) {
      $('#comment_content').val('コメントを入力してください')
    } else {
      axios.post(`/posts/${postId}/comments`, {comment: {content: content}})
        .then((response) => {
          const comment = response.data
          commentAppend(comment)
          $('#comment_content').val('')
        })
    }
  })
})