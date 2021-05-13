import $ from 'jquery'
import 'slick-carousel'
import axios from 'axios'
import { csrfToken } from 'rails-ujs'
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken()

document.addEventListener('DOMContentLoaded', () => {
  
  // 投稿slide機能
  $('.slider').slick( {
    dots: true,
  })
  
  // プロフィール画像変更
  $('.profile-image').on('click', () => {
    $('.profile-image-modal').fadeIn()
    $('.modal-delete').on('click', () => {
      $('.profile-image-modal').fadeOut()
    })
    $('#profile-modal-close').on('click', () => {
      $('.profile-image-modal').fadeOut()
    })
  })

  // $('.image-file-modal').on('change', () => {
  //   const id = $('.profile').data('id')
  //   axios.put(`/images/${id}`)
  //     .then((response) => {
        
  //     })
  // })

   // 投稿詳細＜プロフィールページ＞
  $('.profile-post').on('click', event => {
    const id = $(event.currentTarget).data('id')
    const postModal = $(`.post-modal${id}`)
    $(postModal).removeClass('hidden')
    $('.slider').slick('setPosition')
    $('.modal-delete').on('click', () => {
      $(postModal).addClass('hidden')
    })
  })

  // プロフィールページからのコメント機能(コメント一覧表示)
  $('.profile-post').on('click', event => {
    const id = $(event.currentTarget).data('id')
    const modalCommentContainer = $(`.modal-comment-container${id}`)
    axios.get(`/posts/${id}/comments`)
    .then((response) => {
      $(modalCommentContainer).html('')
      const comments = response.data
      comments.forEach(comment => {
        $(modalCommentContainer).append(
          `<div class="modal-comment-box">
            <div class="modal-comment-left">
              <a href="#"><img src=""></a>
            </div>
            <div class="modal-comment-right">
              <p class="comment-account">${comment.user.account}</p>
              <p class="modal-comment">${comment.content}</p>
            </div>
          </div>
        `)
      })
    })
    .catch((e) => {
      window.alert('error')
      console.log(e)
    })
  })

  // コメント機能
  $('.btn-comment-profile').on('click', event => {
    const id = $(event.currentTarget).data('id')
    const profileContent = $(`#profile_content${id}`)
    const content = $(profileContent).val()
    const modalCommentContainer = $(`.modal-comment-container${id}`)
    if (!content) {
      window.alert('コメントを入力して下さい')
    } else {
      axios.post(`/posts/${id}/comments`, {comment: {content: content}})
      .then((response) => {
        const comment = response.data
        $(modalCommentContainer).append(
          `<div class="modal-comment-box">
            <div class="modal-comment-left">
              <a href="#"><img src=""></a>
            </div>
            <div class="modal-comment-right">
              <p class="comment-account">${comment.user.account}</p>
              <p class="modal-comment">${comment.content}</p>
            </div>
          </div>
        `)
        $(`#profile_content${id}`).val('')
      })
      .catch((e) => {
        window.alert('error')
        console.log(e)
      })
    }
  })

  // フォロー機能
    // フォロー表示
  const id = $('.profile').data('id')
  axios.get(`/profiles/${id}/follows`)
    .then((response) => { 
      const hasFollowed = response.data.hasFollowed
      if (hasFollowed) {
        $('.btn-rm').removeClass('hidden')
      } else {
        $('.btn-follow').removeClass('hidden')
      }
    })
    .catch((e) => {
      window.alert('error')
      console.log(e)
    })
      
      // フォローcreate
  $('.btn-follow').on('click', event => {
    const id = $(event.currentTarget).data('id')
    axios.post(`/profiles/${id}/follows`)
      .then((response) => {
        if (response.data.status === 'ok') {
          const followersCount = response.data.followersCount
          $(`.btn-follow${id}`).addClass('hidden')
          $(`.btn-rm${id}`).removeClass('hidden')
          $('#follower-amount').text(followersCount)
        }
      })
      .catch((e) => {
        window.alert('error')
        console.log(e)
      })
  })
  
      // フォローdestroy
  $('.btn-rm').on('click', event => {
    const id = $(event.currentTarget).data('id')
    
    axios.post(`/profiles/${id}/nofollows`)
      .then((response) => {
        if (response.data.status === 'ok') {
          const followersCount = response.data.followersCount
          $(`.btn-rm${id}`).addClass('hidden')
          $(`.btn-follow${id}`).removeClass('hidden')
          $('#follower-amount').text(followersCount)
        }
      })
      .catch((e) => {
        window.alert('error')
        console.log(e)
      })
  })

  // フォロワー表示
  $('.modal-follower-show').on('click', () => {
    $('.modal-follower').removeClass('hidden')
    $('.modal-follower-delete').on('click', () => {
      $('.modal-follower').addClass('hidden')
    })

    // $('.follower-info').each(function (index, element) {
      
    //   const id = $(element).data('id')
    //   axios.get(`/profiles/${id}/follows`)
    //     .then((response) => {
    //       const hasFollowed = response.data.hasFollowed
    //       const modalNofollowBtn = $(`.modal-nofollow-btn${id}`)
    //       const modalFollowBtn = $(`.modal-follow-btn${id}`)
    //         if (hasFollowed) {
    //           $(modalNofollowBtn).removeClass('hidden')
    //         } else {
    //           $(modalFollowBtn).removeClass('hidden')
    //         }
    //     })
    // })
  })
  // フォロー表示
  $('.modal-following-show').on('click', () => {
    $('.modal-following').removeClass('hidden')
    $('.modal-following-delete').on('click', () => {
      $('.modal-following').addClass('hidden')
    })
  })

})