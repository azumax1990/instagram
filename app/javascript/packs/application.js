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

const handleHeartDisplay = (hasLiked) => {
  if (hasLiked) {
    $('.active-like').removeClass('hidden')
  } else {
    $('.like').removeClass('hidden')
  }
}


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
  const postId = $('#post-show').data('postId')
  axios.get(`/posts/${postId}/likes`)
  .then( (response) => {
    const hasLiked = response.data.hasLiked
    handleHeartDisplay(hasLiked)
  })

  $('.like').on('click', () => {
    axios.post(`/posts/${postId}/likes`)
    .then((response) => {
      if (response.data.status === 'ok') {
        $('.active-like').removeClass('hidden')
        $('.like').addClass('hidden')
      }
    })
    .catch((e) => {
      window.alert('error')
      console.log(e)
    })
  })

  $('.active-like').on('click', () => {
    axios.delete(`/posts/${postId}/likes`)
    .then((response) => {
      if (response.data.status === 'ok') {
        $('.active-like').addClass('hidden')
        $('.like').removeClass('hidden')
      }
    })
    .catch((e) => {
      window.alert('error')
      console.log(e)
    })
  })
})

