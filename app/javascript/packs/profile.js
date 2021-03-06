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
    $('.close').on('click', () => {
      $('.btn-profile').addClass('hidden')
      $('.profile-image-modal').fadeOut()
    })
  })
  $('.image-file-modal').on('change', (e) => {
    if (e.target.files.length) {
      const reader = new FileReader;
      reader.onload = (e) => {
        $('.user-icon').attr('src', e.target.result);
        $('.btn-profile').removeClass('hidden')
        $('.btn-profile').on('click', () => {
          $('.profile-image-modal').fadeOut()
          $('.btn-profile').addClass('hidden')
        })
      };
      reader.readAsDataURL(e.target.files[0]);
      
      
    }
  })

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
              <a href="#"><img src="${comment.user.avatar_url}"></a>
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

  // フォロワー一覧表示
  $('.modal-follower-show').on('click', () => {
    $('.modal-follower').removeClass('hidden')
    $('.modal-follower-delete').on('click', () => {
      $('.modal-follower').addClass('hidden')
    })
  })

  $('.follower-info').each(function (index, element) {
    const id = $(element).data('id')
    axios.get(`/profiles/${id}/follows`)
      .then((response) => {
        const hasFollowed = response.data.hasFollowed
        const modalNofollowBtn = $(`.modal-nofollow-btn${id}`)
        const modalFollowBtn = $(`.modal-follow-btn${id}`)
          if (hasFollowed) {
            $(modalNofollowBtn).removeClass('hidden')
          } else {
            $(modalFollowBtn).removeClass('hidden')
          }
      })
  })

    // フォロワー一覧からのフォロー機能
  $('.modal-follow-btn').on('click', event => {
    const id = $(event.currentTarget).data('id')
    axios.post(`/profiles/${id}/follows`)
      .then((response) => {
        if ( response.data.status === 'ok' ) {
          const followersCount = response.data.followersCount
          $(`.modal-follow-btn${id}`).addClass('hidden')
          $(`.modal-nofollow-btn${id}`).removeClass('hidden')
          $('.following-amount').text(followersCount)
        }
      })
  })

    // フォロワー一覧からのフォロー削除
  $('.modal-nofollow-btn').on('click', event => {
    const id = $(event.currentTarget).data('id')
    axios.post(`/profiles/${id}/nofollows`)
      .then((response) => {
        if ( response.data.status === 'ok' ) {
          const followersCount = response.data.followersCount
          $(`.modal-follow-btn${id}`).removeClass('hidden')
          $(`.modal-nofollow-btn${id}`).addClass('hidden')
          $('.following-amount').text(followersCount)
        }
      })
  })


  
  // フォロー一覧表示
  $('.modal-following-show').on('click', () => {
    $('.modal-following').removeClass('hidden')
    $('.modal-following-delete').on('click', () => {
      $('.modal-following').addClass('hidden')
    })
  })

  $('.following-info').each(function (index, element) {
    const id = $(element).data('id')
    axios.get(`/profiles/${id}/follows`)
      .then((response) => {
        const hasFollowed = response.data.hasFollowed
        const modalNofollowBtn = $(`.modal-nofollowing-btn${id}`)
        const modalFollowBtn = $(`.modal-following-btn${id}`)
          if (hasFollowed) {
            $(modalNofollowBtn).removeClass('hidden')
          } else {
            $(modalFollowBtn).removeClass('hidden')
          }
      })
  })

    // フォロー一覧からのフォロー機能
  $('.modal-following-btn').on('click', event => {
    const id = $(event.currentTarget).data('id')
    axios.post(`/profiles/${id}/follows`)
      .then((response) => {
        if ( response.data.status === 'ok' ) {
          const followersCount = response.data.followersCount
          $(`.modal-following-btn${id}`).addClass('hidden')
          $(`.modal-nofollowing-btn${id}`).removeClass('hidden')
          $('.following-amount').text(followersCount)
        }
      })
  })
    // フォロー一覧からのフォロー削除
  $('.modal-nofollowing-btn').on('click', event => {
    const id = $(event.currentTarget).data('id')
    axios.post(`/profiles/${id}/nofollows`)
      .then((response) => {
        if ( response.data.status === 'ok' ) {
          const followersCount = response.data.followersCount
          $(`.modal-following-btn${id}`).removeClass('hidden')
          $(`.modal-nofollowing-btn${id}`).addClass('hidden')
          $('.following-amount').text(followersCount)
        }
      })
  })
})